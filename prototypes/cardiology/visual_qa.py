from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:6006"
SCREENSHOT_DIR = Path(".artifacts/cardiology-visual-qa")
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    browser_errors: list[str] = []
    page.on("pageerror", lambda error: browser_errors.append(str(error)))
    page.on(
        "console",
        lambda message: browser_errors.append(message.text) if message.type == "error" else None,
    )

    index_response = page.request.get(f"{BASE_URL}/index.json")
    if not index_response.ok:
        raise AssertionError(f"Storybook index failed: {index_response.status}")
    entries = index_response.json()["entries"]
    story_ids = {
        entry["title"] + "/" + entry["name"]: story_id
        for story_id, entry in entries.items()
        if entry["type"] == "story"
    }

    desktop_stories = {
        "Cardiology/CardiovascularSummary/Nominal": ("summary-light.png", ""),
        "Cardiology/EcgWorkbench/Imported Preliminary": ("ecg-ocean-dark.png", "&globals=mode:dark;palette:ocean"),
        "Cardiology/CardiacTrajectory/Longitudinal": ("trajectory-sage.png", "&globals=mode:light;palette:sage"),
        "Cardiology/CardiologyVigilanceBoard/Critical With Owner": ("vigilance-dark.png", "&globals=mode:dark;palette:clinical"),
    }

    for story_name, (screenshot_name, globals_query) in desktop_stories.items():
        story_id = story_ids.get(story_name)
        if story_id is None:
            raise AssertionError(f"Missing Storybook story: {story_name}")
        page.goto(f"{BASE_URL}/iframe.html?id={story_id}&viewMode=story{globals_query}")
        page.wait_for_load_state("networkidle")
        page.locator("#storybook-root").wait_for(state="visible")
        if story_name in {
            "Cardiology/EcgWorkbench/Imported Preliminary",
            "Cardiology/CardiacTrajectory/Longitudinal",
        }:
            page.get_by_role("button", name="Courbe").click()
        if page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"):
            raise AssertionError(f"Horizontal page overflow in {story_name}")
        page.screenshot(path=str(SCREENSHOT_DIR / screenshot_name), full_page=True)

    page.set_viewport_size({"width": 390, "height": 844})
    mobile_stories = {
        "Cardiology/CardiovascularSummary/Donnees Manquantes": "summary-mobile.png",
        "Cardiology/AmbulatoryBloodPressureChart/Imported Nominal": "mapa-mobile.png",
    }
    for story_name, screenshot_name in mobile_stories.items():
        story_id = story_ids.get(story_name)
        if story_id is None:
            raise AssertionError(f"Missing Storybook story: {story_name}")
        page.goto(f"{BASE_URL}/iframe.html?id={story_id}&viewMode=story")
        page.wait_for_load_state("networkidle")
        if story_name == "Cardiology/AmbulatoryBloodPressureChart/Imported Nominal":
            page.get_by_role("button", name="Courbe").click()
        if page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth"):
            raise AssertionError(f"Horizontal mobile page overflow in {story_name}")
        page.screenshot(path=str(SCREENSHOT_DIR / screenshot_name), full_page=True)

    if browser_errors:
        raise AssertionError("Browser errors:\n" + "\n".join(browser_errors))

    print(f"Captured {len(desktop_stories)} desktop and {len(mobile_stories)} mobile cardiology stories")
    browser.close()
