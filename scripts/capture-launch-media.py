#!/usr/bin/env python3
"""Capture the canonical ophthalmology launch demo from public Storybook."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path

from playwright.sync_api import Page, sync_playwright


STORY_ID = "ophthalmology-clinicalworkspace--dossier-longitudinal"


def story_url(base_url: str, palette: str, mode: str) -> str:
    return (
        f"{base_url.rstrip('/')}/iframe.html?id={STORY_ID}"
        f"&viewMode=story&globals=palette:{palette};mode:{mode}"
    )


def wait_for_workspace(page: Page) -> None:
    page.wait_for_load_state("networkidle")
    page.get_by_role("tab", name="Synthèse bilatérale").wait_for()
    page.wait_for_timeout(1_000)


def capture(base_url: str, output_directory: Path) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg is None:
        raise RuntimeError("ffmpeg is required to generate the animated launch asset")

    output_directory.mkdir(parents=True, exist_ok=True)
    poster_path = output_directory / "ophthalmology-workspace-poster.png"
    animation_path = output_directory / "ophthalmology-workspace-demo.gif"

    with tempfile.TemporaryDirectory(prefix="clinical-ui-launch-") as temporary_directory:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                record_video_dir=temporary_directory,
                record_video_size={"width": 1280, "height": 800},
            )
            page = context.new_page()

            page.goto(story_url(base_url, "clinical", "light"))
            wait_for_workspace(page)
            page.screenshot(path=str(poster_path), full_page=False)
            page.wait_for_timeout(3_000)

            page.get_by_role("tab", name="Glaucome").click()
            page.wait_for_timeout(4_000)
            page.get_by_role("tab", name="Rétine").click()
            page.wait_for_timeout(4_000)

            page.goto(story_url(base_url, "ocean", "dark"))
            wait_for_workspace(page)
            page.wait_for_timeout(3_000)
            page.get_by_role("tab", name="Urgence").click()
            page.wait_for_timeout(4_000)
            page.get_by_role("tab", name="Synthèse bilatérale").click()
            page.wait_for_timeout(4_000)

            video = page.video
            context.close()
            browser.close()
            if video is None:
                raise RuntimeError("Playwright did not produce a launch video")
            video_path = Path(video.path())

        filter_graph = (
            "fps=5,scale=960:-2:flags=lanczos,"
            "split[frames][palette_source];"
            "[palette_source]palettegen=max_colors=96:stats_mode=diff[palette];"
            "[frames][palette]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle"
        )
        subprocess.run(
            [
                ffmpeg,
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(video_path),
                "-filter_complex",
                filter_graph,
                "-loop",
                "0",
                str(animation_path),
            ],
            check=True,
        )

    print(f"launch-poster {poster_path}")
    print(f"launch-animation {animation_path}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Capture the canonical Clinical UI ophthalmology launch media."
    )
    parser.add_argument(
        "--base-url",
        default="https://wanecode.github.io/clinical-ui/",
        help="Storybook base URL (defaults to the public deployment).",
    )
    parser.add_argument(
        "--output-directory",
        type=Path,
        default=Path("docs/assets"),
        help="Directory for the poster and animated GIF.",
    )
    arguments = parser.parse_args()
    capture(arguments.base_url, arguments.output_directory)


if __name__ == "__main__":
    main()
