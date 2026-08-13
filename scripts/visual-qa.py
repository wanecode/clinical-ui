#!/usr/bin/env python3
"""Deterministic visual QA sweep for the Clinical UI Storybook.

The script audits every executable story at the supported viewports in the
default theme, then captures a representative cross-domain matrix for all six
palette/mode combinations. Generated evidence lives under .artifacts/ and is
intentionally excluded from Git.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from collections import Counter
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any
from urllib.request import urlopen

from playwright.sync_api import Page, TimeoutError as PlaywrightTimeoutError, sync_playwright


PALETTES = ("clinical", "ocean", "sage")
MODES = ("light", "dark")
VIEWPORTS = {
    "desktop": {"width": 1440, "height": 1000},
    "tablet": {"width": 1024, "height": 768},
    "mobile": {"width": 390, "height": 844},
}
SENTINEL_IDS = (
    "foundations-theme-contract--six-theme-matrix",
    "core-clinicalcontextheader--long-identity",
    "fhir-fhir-native-context--patient-report-and-provenance",
    "ophthalmology-clinicalworkspace--dossier-longitudinal",
    "orl-01-audition-audiogramworkbench--preliminary",
    "odontology-longitudinalodontogram--permanent-dentition",
    "dermatology-clinical-workbenches--integrated-synthetic-episode",
    "cardiology-ecgworkbench--imported-preliminary",
)


@dataclass
class AuditResult:
    story_id: str
    title: str
    story_name: str
    viewport: str
    palette: str
    mode: str
    phase: str
    duration_ms: int
    body_text_length: int = 0
    document_width: int = 0
    viewport_width: int = 0
    document_height: int = 0
    media_count: int = 0
    interactive_count: int = 0
    errors: list[str] | None = None
    warnings: list[str] | None = None
    screenshot: str | None = None

    def __post_init__(self) -> None:
        self.errors = self.errors or []
        self.warnings = self.warnings or []


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:6006")
    parser.add_argument("--output", default=".artifacts/visual-qa")
    parser.add_argument(
        "--sentinels-only",
        action="store_true",
        help="Skip the full 178-story responsive sweep.",
    )
    parser.add_argument(
        "--no-screenshots",
        action="store_true",
        help="Run structural checks without writing sentinel screenshots.",
    )
    return parser.parse_args()


def load_index(base_url: str) -> dict[str, Any]:
    with urlopen(f"{base_url.rstrip('/')}/index.json", timeout=10) as response:
        return json.load(response)


def story_url(base_url: str, story_id: str, palette: str, mode: str) -> str:
    return (
        f"{base_url.rstrip('/')}/iframe.html?id={story_id}"
        f"&viewMode=story&globals=mode:{mode};palette:{palette}"
    )


def safe_segment(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]+", "-", value).strip("-")


def audit_story(
    page: Page,
    base_url: str,
    entry: dict[str, Any],
    viewport_name: str,
    palette: str,
    mode: str,
    phase: str,
    output: Path,
    capture: bool,
) -> AuditResult:
    started = time.monotonic()
    console_errors: list[str] = []
    page_errors: list[str] = []
    request_failures: list[str] = []

    def on_console(message: Any) -> None:
        if message.type == "error":
            console_errors.append(message.text)

    def on_page_error(error: Any) -> None:
        page_errors.append(str(error))

    def on_request_failed(request: Any) -> None:
        failure = request.failure
        request_failures.append(f"{request.url}: {failure or 'request failed'}")

    page.on("console", on_console)
    page.on("pageerror", on_page_error)
    page.on("requestfailed", on_request_failed)

    errors: list[str] = []
    warnings: list[str] = []
    metrics: dict[str, Any] = {}
    screenshot_path: Path | None = None

    try:
        response = page.goto(
            story_url(base_url, entry["id"], palette, mode),
            wait_until="networkidle",
            timeout=15_000,
        )
        if response is not None and not response.ok:
            errors.append(f"HTTP {response.status}")
        page.locator(".clinical-ui-theme--viewport").wait_for(state="visible", timeout=8_000)
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(80)
        metrics = page.evaluate(
            """() => {
              const root = document.querySelector('.clinical-ui-theme--viewport');
              const html = document.documentElement;
              const body = document.body;
              const visible = (element) => {
                const rect = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                return rect.width > 0 && rect.height > 0 &&
                  style.visibility !== 'hidden' && style.display !== 'none';
              };
              return {
                actualMode: root?.dataset.clinicalMode ?? null,
                actualPalette: root?.dataset.palette ?? null,
                bodyTextLength: body.innerText.trim().length,
                documentWidth: Math.max(html.scrollWidth, body.scrollWidth),
                viewportWidth: html.clientWidth,
                documentHeight: Math.max(html.scrollHeight, body.scrollHeight),
                mediaCount: [...document.querySelectorAll('img, svg, canvas')].filter(visible).length,
                interactiveCount: [...document.querySelectorAll('button, a, input, select, textarea, [tabindex]')].filter(visible).length,
                rootBackground: root ? getComputedStyle(root).backgroundColor : null,
                rootForeground: root ? getComputedStyle(root).color : null,
              };
            }"""
        )
        if metrics["actualMode"] != mode:
            errors.append(f"mode attendu={mode}, obtenu={metrics['actualMode']}")
        if metrics["actualPalette"] != palette:
            errors.append(f"palette attendue={palette}, obtenue={metrics['actualPalette']}")
        overflow = metrics["documentWidth"] - metrics["viewportWidth"]
        if overflow > 2:
            errors.append(f"débordement horizontal document: {overflow}px")
        if metrics["bodyTextLength"] == 0 and metrics["mediaCount"] == 0:
            errors.append("rendu vide")
        if metrics["documentHeight"] > 20_000:
            warnings.append(f"hauteur de page inhabituelle: {metrics['documentHeight']}px")
        if metrics["rootBackground"] in (None, "rgba(0, 0, 0, 0)"):
            warnings.append("fond racine transparent ou absent")

        if capture:
            screenshot_path = (
                output
                / "screenshots"
                / viewport_name
                / f"{mode}-{palette}"
                / f"{safe_segment(entry['id'])}.png"
            )
            screenshot_path.parent.mkdir(parents=True, exist_ok=True)
            page.screenshot(path=str(screenshot_path), full_page=True, animations="disabled")
    except PlaywrightTimeoutError as error:
        errors.append(f"timeout Playwright: {error}")
    except Exception as error:  # noqa: BLE001 - every story must be reported
        errors.append(f"exception d’audit: {error}")
    finally:
        page.remove_listener("console", on_console)
        page.remove_listener("pageerror", on_page_error)
        page.remove_listener("requestfailed", on_request_failed)

    errors.extend(f"console: {message}" for message in console_errors)
    errors.extend(f"page: {message}" for message in page_errors)
    errors.extend(f"réseau: {message}" for message in request_failures)

    return AuditResult(
        story_id=entry["id"],
        title=entry.get("title", ""),
        story_name=entry.get("name", ""),
        viewport=viewport_name,
        palette=palette,
        mode=mode,
        phase=phase,
        duration_ms=round((time.monotonic() - started) * 1000),
        body_text_length=int(metrics.get("bodyTextLength", 0)),
        document_width=int(metrics.get("documentWidth", 0)),
        viewport_width=int(metrics.get("viewportWidth", 0)),
        document_height=int(metrics.get("documentHeight", 0)),
        media_count=int(metrics.get("mediaCount", 0)),
        interactive_count=int(metrics.get("interactiveCount", 0)),
        errors=errors,
        warnings=warnings,
        screenshot=str(screenshot_path) if screenshot_path else None,
    )


def write_report(output: Path, results: list[AuditResult], elapsed: float) -> None:
    failures = [result for result in results if result.errors]
    warnings = [result for result in results if result.warnings]
    domains = Counter(result.title.split("/")[0] for result in results)
    payload = {
        "summary": {
            "checks": len(results),
            "failures": len(failures),
            "warnings": len(warnings),
            "elapsed_seconds": round(elapsed, 2),
            "domains": dict(sorted(domains.items())),
        },
        "results": [asdict(result) for result in results],
    }
    output.mkdir(parents=True, exist_ok=True)
    (output / "report.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    lines = [
        "# Clinical UI visual QA",
        "",
        f"- Checks: {len(results)}",
        f"- Failures: {len(failures)}",
        f"- Warnings: {len(warnings)}",
        f"- Duration: {elapsed:.2f}s",
        "",
        "## Coverage",
        "",
    ]
    lines.extend(f"- {domain}: {count}" for domain, count in sorted(domains.items()))
    lines.extend(["", "## Failures", ""])
    if failures:
        for result in failures:
            lines.append(
                f"- `{result.story_id}` · {result.viewport} · {result.mode}/{result.palette}: "
                + "; ".join(result.errors or [])
            )
    else:
        lines.append("No failures.")
    lines.extend(["", "## Warnings", ""])
    if warnings:
        for result in warnings:
            lines.append(
                f"- `{result.story_id}` · {result.viewport} · {result.mode}/{result.palette}: "
                + "; ".join(result.warnings or [])
            )
    else:
        lines.append("No warnings.")
    (output / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def run() -> int:
    args = parse_args()
    base_url = args.base_url.rstrip("/")
    output = Path(args.output)
    index = load_index(base_url)
    entries = {
        story_id: {**entry, "id": story_id}
        for story_id, entry in index["entries"].items()
        if entry.get("type") == "story"
    }
    missing_sentinels = [story_id for story_id in SENTINEL_IDS if story_id not in entries]
    if missing_sentinels:
        raise SystemExit(f"Stories sentinelles absentes: {', '.join(missing_sentinels)}")

    results: list[AuditResult] = []
    started = time.monotonic()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        if not args.sentinels_only:
            for viewport_name, viewport in VIEWPORTS.items():
                page = browser.new_page(viewport=viewport, device_scale_factor=1)
                for position, entry in enumerate(entries.values(), start=1):
                    results.append(
                        audit_story(
                            page,
                            base_url,
                            entry,
                            viewport_name,
                            "clinical",
                            "light",
                            "responsive-full",
                            output,
                            False,
                        )
                    )
                    if position % 25 == 0:
                        print(
                            f"responsive {viewport_name}: {position}/{len(entries)}",
                            flush=True,
                        )
                page.close()

        for viewport_name, viewport in VIEWPORTS.items():
            page = browser.new_page(viewport=viewport, device_scale_factor=1)
            for mode in MODES:
                for palette in PALETTES:
                    for story_id in SENTINEL_IDS:
                        results.append(
                            audit_story(
                                page,
                                base_url,
                                entries[story_id],
                                viewport_name,
                                palette,
                                mode,
                                "theme-sentinels",
                                output,
                                not args.no_screenshots,
                            )
                        )
                    print(
                        f"sentinelles {viewport_name}: {mode}/{palette}",
                        flush=True,
                    )
            page.close()
        browser.close()

    elapsed = time.monotonic() - started
    write_report(output, results, elapsed)
    failures = sum(bool(result.errors) for result in results)
    warnings = sum(bool(result.warnings) for result in results)
    print(
        f"QA terminée: {len(results)} contrôles, {failures} échecs, "
        f"{warnings} avertissements, {elapsed:.2f}s",
        flush=True,
    )
    print(f"Rapport: {output / 'report.md'}", flush=True)
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(run())
