from __future__ import annotations

import subprocess
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from collector.hdc_collector import HdcClient, collect_snapshot, find_hdc_binary


def test_find_hdc_binary_custom():
    with patch("pathlib.Path.is_file", return_value=True), patch("os.access", return_value=True):
        res = find_hdc_binary("/custom/path/to/hdc")
        assert res == "/custom/path/to/hdc"


def test_find_hdc_binary_not_found():
    with (
        patch("pathlib.Path.is_file", return_value=False),
        patch("shutil.which", return_value=None),
        pytest.raises(FileNotFoundError),
    ):
        find_hdc_binary()


def test_hdc_client_autodetect():
    fake_targets = "018014257R000686\n"
    with (
        patch("collector.hdc_collector.find_hdc_binary", return_value="/fake/hdc"),
        patch("subprocess.run") as mock_run,
    ):
        mock_run.return_value = subprocess.CompletedProcess(
            args=["/fake/hdc", "list", "targets"],
            returncode=0,
            stdout=fake_targets,
        )
        client = HdcClient(hdc_path="/fake/hdc")
        assert client.target == "018014257R000686"


def test_collect_snapshot_mock(tmp_path: Path):
    mock_client = MagicMock(spec=HdcClient)
    mock_client.shell.return_value = "fake shell output"

    artifacts = collect_snapshot(
        mock_client,
        tmp_path,
        bundle="com.huawei.hmos.vmall",
        ability="EntranceAbility",
    )

    mock_client.start_ability.assert_called_once_with("com.huawei.hmos.vmall", "EntranceAbility")
    assert "window_info" in artifacts
    assert "page_info" in artifacts
    assert "screenshot" in artifacts
    assert "dump" in artifacts
    assert artifacts["window_info"].exists()
