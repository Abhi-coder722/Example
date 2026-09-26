from __future__ import annotations

import argparse
import os
import subprocess
import sys
import zipfile
from pathlib import Path

from fraud_guard.config import DATASET_NAME, DATA_DIR, RAW_DATA_PATH


def credentials_available() -> bool:
    return bool(os.getenv("KAGGLE_USERNAME") and os.getenv("KAGGLE_KEY")) or (Path.home() / ".kaggle" / "kaggle.json").exists()


def download_dataset(skip_if_exists: bool) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if skip_if_exists and RAW_DATA_PATH.exists():
        print(f"Dataset already exists at {RAW_DATA_PATH}")
        return

    if not credentials_available():
        raise RuntimeError(
            "Kaggle credentials not found. Set KAGGLE_USERNAME and KAGGLE_KEY, or place kaggle.json in ~/.kaggle/."
        )

    command = [
        sys.executable,
        "-m",
        "kaggle",
        "datasets",
        "download",
        "-d",
        DATASET_NAME,
        "-p",
        str(DATA_DIR),
    ]
    subprocess.run(command, check=True)

    archive_path = DATA_DIR / "creditcardfraud.zip"
    if not archive_path.exists():
        archives = list(DATA_DIR.glob("*.zip"))
        if not archives:
            raise FileNotFoundError("Kaggle download finished but no zip archive was found.")
        archive_path = archives[0]

    with zipfile.ZipFile(archive_path) as archive:
        archive.extractall(DATA_DIR)

    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(f"Expected {RAW_DATA_PATH} after extraction.")

    print(f"Downloaded and extracted {RAW_DATA_PATH}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download Kaggle mlg-ulb/creditcardfraud dataset.")
    parser.add_argument("--skip-if-exists", action="store_true", help="Do nothing when data/creditcard.csv exists.")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    download_dataset(skip_if_exists=args.skip_if_exists)
