# AGENTS.md

## What this repo is

HarmonyOSGym: a data-synthesis pipeline for GUI-agent training on HarmonyOS. It converts real-device ArkUI page dumps into virtual apps, mass-injects data variants, and cleans the results into a unified `cue_data.json` protocol.

- `docs/arch.md` (Chinese) is the authoritative design spec — read it before writing code. Its §7 tree is labeled `tiangong_gym/` (old project name; this repo is harmonyosgym).
- Python + Pydantic toolchain in `src/` (`schema/`, `collector/`, `cleaner/`, `synthesizer/`, `verifier/`); renderer is no-build vanilla JS.
- **Progress: M1–M4 all implemented and tested (73 pytest, ruff clean). M3 = `cleaner/gym_cleaner.py` (Playwright DOM scrape → cue_data) + `verifier/` (metrics + diff_engine gates). M4 = `synthesizer/injector.py` (slot templatization → dataset variants → batch collection). Not built yet: list-item replication (增减列表项) and cue schema `functions`/`group` auto-annotation.**
- Real-device closed loop (vmall home) passes ALL verifier gates at 100% (component match / IoU / text / actions). `TabContent` parity rule: empty (inactive) tab panels are excluded on BOTH sides — renderer hides them, device_cleaner skips them.

## Data direction (do not get backwards)

- `pageInfo.json` (real-device layout tree) is the **input** for generating virtual apps.
- `cue_data.json` is the **final output**, consumed by downstream VLM / GUI-agent training. Never reverse-engineer a virtual app from `cue_data.json`.
- Strategy: Path B (generic runtime renderer) is phase 1; codegen (Path A) comes later.

## Real-device data quirks (verified against `reference/data/`)

- `pageInfo.json`: the `pageInfo` field is a **JSON string** — parse it a second time with `json.loads` before use. Tree nodes use `$ID` / `$type` / `$rect` / `$attrs` / `$children`; numeric values are strings. `$rect` is `"[x1, y1],[x2, y2]"` corners in physical pixels (samples: 1320×2848, `$resolution` 3.375).
- hidumper writes to `/data/service/el1/public/msdp/pageInfo.json` on-device (stdout only prints headers); `-u` (arkuiTree) is unreliable. `hidumper ... -a '-n'` prints the foreground bundle name.
- Virtualized lists preload **off-screen nodes with huge negative/overflow rects** (e.g. x=-33710); `device_cleaner` drops non-viewport-intersecting components (cue = visible default state), while the Input Spec keeps the full tree.
- `reference/data/cue_data.json` is the **legacy format**: misspelled `conponments` key and bbox starting at bottom-left. New output must use `components` and a clockwise bbox starting at top-left: `[x_tl, y_tl, x_tr, y_tr, x_br, y_br, x_bl, y_bl]` (arch.md §4.3). Action vocabulary: `click`, `long_press`, `scroll`, `type`.
- `reference/data/vmall/` is a verified real capture of the Huawei Store home page (pageInfo + screenshot.jpeg + uitest.json). Its uitest dump **confirmed** the `collector/uitest.py` format assumptions (attributes/children, `"[x,y][x2,y2]"` bounds, string-or-bool flags); nodes carry `bundleName`/`visible`, used to filter system windows (status bar, SuperHub float).
- `docs/data` is **not a directory** — it is the raw JPEG device screenshot (1320×2848) with no file extension; it is the XHS Auto-Cropper's source image.

## `reference/` is gitignored, local-only

- `reference/mobilegym/` — the React mobile-simulator + benchmark project this toolchain feeds into. It has its own strict `AGENTS.md`; read it before touching mobilegym code or emitting apps for its runtime. Data injection mirrors its `data/defaults.json` replacement pattern.
- `reference/data/` — real-device captures: XHS detail page (root files) and `vmall/` (Huawei Store home).
- Fresh clones will contain neither.

## Toolchain commands

- Env: `uv` + Python ≥3.10, deps in `pyproject.toml` (pydantic v2, Pillow; dev: pytest, ruff, playwright). Packages import as `schema.*` / `collector.*` / `cleaner.*` (package root is `src/`).
- Tests: `uv run pytest` (synthetic fixtures + real-data smoke tests that skip without `reference/`; browser tests skip without chromium — `uv run playwright install chromium`). Lint: `uv run ruff check src tests`.
- Real-device capture: `uv run python -m collector.hdc_collector -o reference/data/<app> -b <bundle> -a <ability>` → `window_info.txt` + `pageInfo.json` + `screenshot.jpeg` + `dump.json` (note: `dump.json` here vs `uitest.json` in the manual vmall capture — pass the right name to `-u` flags). hdc auto-detected from PATH or `~/tools/ohos-command-line-tools/...`.
- Pipeline (outputs to `out/`, gitignored):
  - `uv run python -m collector.cropper <pageInfo.json> <screenshot> -o out` → `assets/images/<id>.png` + `assets_map.json`
  - `uv run python -m cleaner.device_cleaner <pageInfo.json> -u <uitest.json> -o out/cue_data.json`
  - `uv run python -m cleaner.spec_converter <pageInfo.json> -s <screenshot> -o out/input_spec.json`
- Cleaner emits visible on-screen `Text`/`Image` nodes only (plus interactive nodes when a uitest dump is given).
- M3 verify loop (device cue vs gym cue, arch.md §6 gates):
  - `uv run python -m cleaner.gym_cleaner harmonyos-apps/<app> -o out/gym_cue.json [--screenshot out/shot.png]` (serves the bundle headlessly, scrapes the DOM)
  - `uv run python -m verifier.diff_engine out/cue_data.json out/gym_cue.json --report out/report.json` → exits non-zero on gate failure
- M4 injection loop:
  - `uv run python -m synthesizer.injector harmonyos-apps/<app> --template out/dataset.template.json` (slot skeleton)
  - `uv run python -m synthesizer.injector harmonyos-apps/<app> --dataset dataset.json -o harmonyos-apps --collect out/synthetic` → `<app>__vNNN` variant bundles + batch-cleaned synthetic cue files (image paths resolve relative to the dataset file)

## `harmonyos-apps/` — generated virtual app bundles (M2, done)

- `uv run python -m synthesizer.packager <pageInfo.json> -s <screenshot> -o harmonyos-apps` writes one self-contained bundle per app: `app.json`, `spec.json`, `index.html` + `renderer.js`/`renderer.css`, `assets/images/<id>.png`. Bundles exist for `com.xingin.xhs_hos` and `com.huawei.hmos.vmall`.
- Root `harmonyos-apps/index.html` is a **launcher** (phone mockups + iframes): serve `harmonyos-apps/` itself (`python -m http.server`), not a bundle dir, to use it. `file://` fetch of spec.json fails — always serve over HTTP.
- Renderer (`renderSpec(spec, mount)` pure function, physical-px stage, fontSize fp × resolution → px, #AARRGGBB → #RRGGBBAA): nodes are positioned **relative to their parent rect** (scroll containers have their own coordinate space), empty `TabContent` nodes are hidden, and crops whose rect strictly encloses ≥2 Text/Image nodes are skipped by the cropper to avoid ghost duplication. DOM contract for the Gym cleaner: `[data-component-id]`, `[data-node-type]`, `window.__SPEC_RENDERED__`.
- Browser tests: `uv run pytest tests/test_renderer_integration.py`.

## Acceptance gates

- Renderer correctness is judged by the Verifier (`verifier/diff_engine.py`, arch.md §6), virtual app vs real device in default state: component match ≥ 95%, geometry IoU ≥ 0.85, text match ≥ 98%, action coverage 100%. The vmall home closed loop currently passes all four at 100%.
- The vmall uitest dump (`reference/data/vmall/uitest.json`) is the reference sample for interactive-flag work; `collector/uitest.py` is validated against it.
