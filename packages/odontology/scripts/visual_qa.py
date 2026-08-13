"""Headless rendered QA for the odontology Storybook stories."""

from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:6006/iframe.html"
OUTPUT = Path("/tmp/odontology-visual-qa")

CASES = [
    {
        "name": "odontogram-light-clinical",
        "story": "odontology-longitudinalodontogram--permanent-dentition",
        "globals": "mode:light;palette:clinical",
        "viewport": {"width": 1440, "height": 1000},
    },
    {
        "name": "periodontal-dark-sage",
        "story": "odontology-periodontalchart--six-site-chart",
        "globals": "mode:dark;palette:sage",
        "viewport": {"width": 1280, "height": 900},
    },
    {
        "name": "imaging-dark-ocean",
        "story": "odontology-dentalimagingcontext--multimodal-context",
        "globals": "mode:dark;palette:ocean",
        "viewport": {"width": 1280, "height": 900},
    },
    {
        "name": "odontogram-mobile",
        "story": "odontology-longitudinalodontogram--mobile-horizontal-scroll",
        "globals": "mode:light;palette:sage",
        "viewport": {"width": 390, "height": 844},
        "mobile": True,
    },
]


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    findings: list[str] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for case in CASES:
            page = browser.new_page(viewport=case["viewport"])
            console_errors: list[str] = []
            page.on(
                "console",
                lambda message: console_errors.append(message.text)
                if message.type == "error"
                else None,
            )
            page.goto(
                f"{BASE_URL}?id={case['story']}&viewMode=story&globals={case['globals']}",
                wait_until="networkidle",
            )
            try:
                page.locator(".od-panel").wait_for(state="visible", timeout=10_000)
            except PlaywrightTimeoutError:
                body_text = page.locator("body").inner_text().strip()
                findings.append(
                    f"{case['name']}: story did not render; title={page.title()!r}; "
                    f"body={body_text[:600]!r}; console={console_errors!r}"
                )
                page.screenshot(path=str(OUTPUT / f"{case['name']}-render-error.png"), full_page=True)
                page.close()
                continue
            body_overflow = page.evaluate(
                "document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
            )
            if body_overflow:
                findings.append(f"{case['name']}: document-level horizontal overflow")
            if console_errors:
                findings.extend(f"{case['name']}: console error: {error}" for error in console_errors)
            if case.get("mobile"):
                scroll_metrics = page.locator(".od-arches").evaluate(
                    "node => ({ scrollWidth: node.scrollWidth, clientWidth: node.clientWidth })"
                )
                if scroll_metrics["scrollWidth"] <= scroll_metrics["clientWidth"]:
                    findings.append(f"{case['name']}: odontogram does not expose horizontal scroll")
                if not page.locator(".od-scroll-hint").is_visible():
                    findings.append(f"{case['name']}: mobile scroll hint is not visible")
            page.screenshot(path=str(OUTPUT / f"{case['name']}.png"), full_page=True)
            page.close()
        browser.close()

    if findings:
        raise SystemExit("\n".join(findings))
    print(f"Visual QA passed for {len(CASES)} rendered cases. Screenshots: {OUTPUT}")


if __name__ == "__main__":
    main()
