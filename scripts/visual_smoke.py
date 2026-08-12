from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:6006"
SCREENSHOT_DIR = Path(".artifacts/visual-smoke")
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    browser_errors: list[str] = []
    page.on("pageerror", lambda error: browser_errors.append(str(error)))
    page.on(
        "console",
        lambda message: browser_errors.append(message.text)
        if message.type == "error"
        else None,
    )

    index_response = page.request.get(f"{BASE_URL}/index.json")
    if not index_response.ok:
        raise AssertionError(
            f"Storybook index request failed: {index_response.status} {index_response.status_text}"
        )
    entries = index_response.json()["entries"]
    story_ids = {
        entry["title"] + "/" + entry["name"]: story_id
        for story_id, entry in entries.items()
        if entry["type"] == "story"
    }

    required_stories = {
        "Foundations/Theme contract/Six Theme Matrix": "theme-contract.png",
        "Core/ClinicalContextHeader/Validated": "clinical-context.png",
        "FHIR/FHIR-native context/Patient Report And Provenance": "fhir-native.png",
    }

    for story_name, screenshot_name in required_stories.items():
        story_id = story_ids.get(story_name)
        if story_id is None:
            raise AssertionError(f"Missing Storybook story: {story_name}")
        page.goto(f"{BASE_URL}/iframe.html?id={story_id}&viewMode=story")
        page.wait_for_load_state("networkidle")
        page.locator("#storybook-root").wait_for(state="visible")
        has_horizontal_overflow = page.evaluate(
            "document.documentElement.scrollWidth > document.documentElement.clientWidth"
        )
        if has_horizontal_overflow:
            raise AssertionError(f"Horizontal overflow in {story_name}")
        page.screenshot(path=str(SCREENSHOT_DIR / screenshot_name), full_page=True)

    mobile_stories = {
        "Core/ClinicalContextHeader/Constrained": "clinical-context-mobile.png",
        "FHIR/FHIR-native context/Patient Report And Provenance": "fhir-native-mobile.png",
    }
    page.set_viewport_size({"width": 390, "height": 844})
    for story_name, screenshot_name in mobile_stories.items():
        story_id = story_ids.get(story_name)
        if story_id is None:
            raise AssertionError(f"Missing Storybook story: {story_name}")
        page.goto(f"{BASE_URL}/iframe.html?id={story_id}&viewMode=story")
        page.wait_for_load_state("networkidle")
        has_horizontal_overflow = page.evaluate(
            "document.documentElement.scrollWidth > document.documentElement.clientWidth"
        )
        if has_horizontal_overflow:
            raise AssertionError(f"Horizontal overflow in mobile story {story_name}")
        page.screenshot(path=str(SCREENSHOT_DIR / screenshot_name), full_page=True)

    page.set_viewport_size({"width": 1440, "height": 1000})
    context_story = story_ids["Core/ClinicalContextHeader/Validated"]
    page.goto(f"{BASE_URL}/iframe.html?id={context_story}&viewMode=story")
    page.wait_for_load_state("networkidle")
    trigger = page.get_by_role("button", name="Comprendre le statut clinique")
    trigger.hover()
    page.get_by_role("tooltip").wait_for(state="visible")

    if browser_errors:
        raise AssertionError("Browser errors:\n" + "\n".join(browser_errors))

    print(
        f"Validated {len(required_stories)} desktop stories, "
        f"{len(mobile_stories)} mobile stories and tooltip interaction"
    )
    print("Story IDs:")
    for story_name in required_stories:
        print(f"- {story_ids[story_name]} ({story_name})")
    browser.close()
