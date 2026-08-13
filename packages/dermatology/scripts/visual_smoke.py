from pathlib import Path
from urllib.request import urlopen
import json

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:6006"
OUTPUT_DIRECTORY = Path(".artifacts/dermatology")
OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)


def load_story_ids() -> dict[str, str]:
    with urlopen(f"{BASE_URL}/index.json") as response:
        entries = json.load(response)["entries"]
    return {
        f'{entry["title"]}/{entry["name"]}': story_id
        for story_id, entry in entries.items()
        if entry["type"] == "story"
    }


def open_story(page, story_id: str) -> None:
    page.goto(f"{BASE_URL}/iframe.html?id={story_id}&viewMode=story")
    page.wait_for_load_state("networkidle")
    page.locator("#storybook-root").wait_for(state="visible")


def assert_no_horizontal_overflow(page, label: str) -> None:
    overflow = page.evaluate(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth"
    )
    if overflow:
        raise AssertionError(f"Horizontal overflow: {label}")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    story_ids = load_story_ids()
    required = {
        "Dermatology/Clinical workbenches/Body Lesion Map Nominal": "body-map",
        "Dermatology/Clinical workbenches/Dermoscopic Comparison Viewer Nominal": "dermoscopy",
        "Dermatology/Clinical workbenches/Integrated Synthetic Episode": "integrated",
    }
    missing = [name for name in required if name not in story_ids]
    if missing:
        raise AssertionError(f"Missing dermatology stories: {missing}")

    errors: list[str] = []
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on(
        "console",
        lambda message: errors.append(message.text) if message.type == "error" else None,
    )

    for name, filename in required.items():
        open_story(page, story_ids[name])
        assert_no_horizontal_overflow(page, f"desktop/{name}")
        page.screenshot(path=OUTPUT_DIRECTORY / f"{filename}-desktop.png", full_page=True)

    mobile_names = {
        "Dermatology/Clinical workbenches/Body Lesion Map Nominal": "body-map-mobile.png",
        "Dermatology/Clinical workbenches/Dermoscopic Comparison Viewer Nominal": "dermoscopy-mobile.png",
        "Dermatology/Clinical workbenches/Dermatology Vigilance Board Critical": "vigilance-mobile.png",
    }
    page.set_viewport_size({"width": 390, "height": 844})
    for name, filename in mobile_names.items():
        open_story(page, story_ids[name])
        assert_no_horizontal_overflow(page, f"mobile/{name}")
        page.screenshot(path=OUTPUT_DIRECTORY / filename, full_page=True)

    if errors:
        raise AssertionError("Browser errors:\n" + "\n".join(errors))

    print(f"Validated {len(required)} desktop and {len(mobile_names)} mobile renderings")
    for path in sorted(OUTPUT_DIRECTORY.glob("*.png")):
        print(f"- {path}")
    browser.close()
