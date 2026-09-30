"""HDC Real-Device Collector (arch.md §3.1).

Orchestrates capture of real HarmonyOS device state via HDC:
1. Window hierarchy & focus: `hidumper -s WindowManagerService -a '-a'`
2. Layout tree & style: `hidumper -s DeviceStatusService -a '-i'` (`pageInfo.json`)
3. Display screenshot: `snapshot_display` (`screenshot.jpeg`)
4. Interactivity flags: `uitest dumpLayout` (`dump.json`)

Output files in the target capture directory:
- `pageInfo.json`
- `screenshot.jpeg`
- `dump.json`
- `window_info.txt`
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import time
from pathlib import Path

#: Well-known standard paths for HDC toolchains on macOS / Linux
HDC_CANDIDATES = (
    "/Applications/DevEco-Studio.app/Contents/sdk/default/openharmony/toolchains/hdc",
    "/Users/ohci/tools/ohos-command-line-tools/sdk/default/openharmony/toolchains/hdc",
    os.path.expanduser("~/tools/ohos-command-line-tools/sdk/default/openharmony/toolchains/hdc"),
    os.path.expanduser("~/tools/command-line-tools/sdk/default/openharmony/toolchains/hdc"),
    os.path.expanduser("~/Library/Huawei/Sdk/openharmony/toolchains/hdc"),
)

DEVICE_PAGE_INFO_PATH = "/data/service/el1/public/msdp/pageInfo.json"
DEVICE_TMP_DIR = "/data/local/tmp"


def find_hdc_binary(custom_path: str | Path | None = None) -> str:
    """Find the path to the hdc executable."""
    if custom_path:
        p = Path(custom_path)
        if p.is_file() and os.access(p, os.X_OK):
            return str(p)
        raise FileNotFoundError(f"Specified hdc binary not found or not executable: {custom_path}")

    # Check PATH
    found = shutil.which("hdc")
    if found:
        return found

    for candidate in HDC_CANDIDATES:
        p = Path(candidate)
        if p.is_file() and os.access(p, os.X_OK):
            return str(p)

    raise FileNotFoundError("hdc executable not found in PATH or standard candidate directories")


class HdcClient:
    """Wrapper around hdc CLI invocations."""

    def __init__(
        self,
        hdc_path: str | None = None,
        target: str | None = None,
        server: str | None = "127.0.0.1:8710",
    ) -> None:
        self.hdc_path = find_hdc_binary(hdc_path)
        self.server = server
        self.target = target or self._autodetect_target()

    def _base_cmd(self) -> list[str]:
        cmd = [self.hdc_path]
        if self.server:
            cmd.extend(["-s", self.server])
        if self.target:
            cmd.extend(["-t", self.target])
        return cmd

    def run(self, *args: str, timeout: float = 15.0) -> subprocess.CompletedProcess[str]:
        full_cmd = self._base_cmd() + list(args)
        return subprocess.run(full_cmd, capture_output=True, text=True, timeout=timeout, check=True)

    def shell(self, command: str, timeout: float = 15.0) -> str:
        res = self.run("shell", command, timeout=timeout)
        return res.stdout

    def _autodetect_target(self) -> str | None:
        cmd = [self.hdc_path]
        if self.server:
            cmd.extend(["-s", self.server])
        cmd.extend(["list", "targets"])
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=5.0, check=False)
            lines = [line.strip() for line in res.stdout.strip().splitlines() if line.strip()]
            valid = [l for l in lines if l != "[Empty]" and not l.startswith("[Fail]")]
            if len(valid) == 1:
                return valid[0]
            if len(valid) > 1:
                return valid[0]  # default to first if multiple
        except (subprocess.SubprocessError, OSError):
            pass
        return None

    def start_ability(self, bundle: str, ability: str) -> None:
        self.shell(f"aa start -b {bundle} -a {ability}")

    def recv_file(self, remote_path: str, local_path: str | Path) -> None:
        local_path = Path(local_path)
        local_path.parent.mkdir(parents=True, exist_ok=True)
        self.run("file", "recv", remote_path, str(local_path))


def collect_snapshot(
    client: HdcClient,
    out_dir: str | Path,
    *,
    bundle: str | None = None,
    ability: str | None = None,
    clean_device_tmp: bool = True,
) -> dict[str, Path]:
    """Capture full snapshot (window info, pageInfo, screenshot, uitest layout).

    Returns a dict mapping artifact name to local Path.
    """
    out_path = Path(out_dir)
    out_path.mkdir(parents=True, exist_ok=True)

    if bundle and ability:
        client.start_ability(bundle, ability)
        time.sleep(1.0)

    # 1. WindowManagerService info
    window_info_txt = out_path / "window_info.txt"
    win_out = client.shell("hidumper -s WindowManagerService -a '-a'")
    window_info_txt.write_text(win_out, encoding="utf-8")

    # 2. Page info (DeviceStatusService)
    client.shell("hidumper -s DeviceStatusService -a '-i'")
    page_info_json = out_path / "pageInfo.json"
    client.recv_file(DEVICE_PAGE_INFO_PATH, page_info_json)

    # 3. Screen display snapshot
    dev_shot_path = f"{DEVICE_TMP_DIR}/_gym_shot_{int(time.time())}.jpeg"
    client.shell(f"snapshot_display -f {dev_shot_path}")
    screenshot_jpeg = out_path / "screenshot.jpeg"
    client.recv_file(dev_shot_path, screenshot_jpeg)

    # 4. uitest dumpLayout
    dev_dump_path = f"{DEVICE_TMP_DIR}/_gym_dump_{int(time.time())}.json"
    dump_json = out_path / "dump.json"
    try:
        client.shell(f"uitest dumpLayout -p {dev_dump_path}")
        client.recv_file(dev_dump_path, dump_json)
    except (subprocess.SubprocessError, OSError) as e:
        # uitest may not be supported on all builds; allow optional
        print(f"Warning: uitest dumpLayout failed: {e}")

    # Cleanup device temporary files
    if clean_device_tmp:
        try:
            client.shell(f"rm -f {dev_shot_path} {dev_dump_path}")
        except (subprocess.SubprocessError, OSError):
            pass

    return {
        "window_info": window_info_txt,
        "page_info": page_info_json,
        "screenshot": screenshot_jpeg,
        "dump": dump_json,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="HarmonyOS real-device collector")
    parser.add_argument("-o", "--out", required=True, help="Output directory to save capture files")
    parser.add_argument("-b", "--bundle", help="Bundle name (e.g. com.huawei.hmos.vmall)")
    parser.add_argument("-a", "--ability", help="Ability name (e.g. EntranceAbility)")
    parser.add_argument("-t", "--target", help="Device target connect key")
    parser.add_argument("-s", "--server", default="127.0.0.1:8710", help="HDC server address/port")
    parser.add_argument("--hdc-path", help="Path to hdc executable")
    args = parser.parse_args()

    client = HdcClient(hdc_path=args.hdc_path, target=args.target, server=args.server)
    print(f"Connected to HDC target: {client.target} via {client.hdc_path}")
    artifacts = collect_snapshot(client, args.out, bundle=args.bundle, ability=args.ability)
    print(f"Collection complete. Artifacts saved to: {args.out}")
    for k, v in artifacts.items():
        if v.exists():
            print(f"  - {k}: {v} ({v.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
