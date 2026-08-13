import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CLINICAL_DATA_TOKENS,
  CLINICAL_FOUNDATION_TOKENS,
  CLINICAL_INTERACTION_TOKENS,
  CLINICAL_SEMANTIC_FAMILIES,
  CLINICAL_SURFACE_TOKENS,
  CLINICAL_UI_MODES,
  CLINICAL_UI_PALETTES,
  CLINICAL_UI_REQUIRED_TOKENS,
  CLINICAL_UI_THEME_CONTRACT_VERSION,
  CLINICAL_VIEWER_TOKENS,
  SHADCN_COLOR_TOKENS,
} from "./index";

const stylesheet = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

describe("Clinical UI host theme contract", () => {
  it("pins the compatibility snapshot and the six supported theme combinations", () => {
    expect(CLINICAL_UI_THEME_CONTRACT_VERSION).toBe("2026-08-13");
    expect(CLINICAL_UI_MODES).toEqual(["light", "dark"]);
    expect(CLINICAL_UI_PALETTES).toEqual(["clinical", "ocean", "sage"]);
  });

  it("defines every shadcn/tweakcn color token", () => {
    for (const token of SHADCN_COLOR_TOKENS) {
      expect(stylesheet, `missing --${token}`).toContain(`--${token}:`);
    }
  });

  it("defines clinical semantics with text and border companions", () => {
    for (const token of CLINICAL_SEMANTIC_FAMILIES) {
      expect(stylesheet, `missing --${token}`).toContain(`--${token}:`);
      expect(stylesheet, `missing --${token}-foreground`).toContain(`--${token}-foreground:`);
      expect(stylesheet, `missing --${token}-border`).toContain(`--${token}-border:`);
    }
  });

  it("keeps a complete neutral viewer token family", () => {
    for (const token of CLINICAL_VIEWER_TOKENS) {
      expect(stylesheet, `missing --${token}`).toContain(`--${token}:`);
    }
  });

  it("publishes a complete, duplicate-free host token contract", () => {
    expect(new Set(CLINICAL_UI_REQUIRED_TOKENS).size).toBe(CLINICAL_UI_REQUIRED_TOKENS.length);

    for (const token of [
      ...CLINICAL_FOUNDATION_TOKENS,
      ...CLINICAL_SURFACE_TOKENS,
      ...CLINICAL_DATA_TOKENS,
      ...CLINICAL_INTERACTION_TOKENS,
    ]) {
      expect(stylesheet, `missing --${token}`).toContain(`--${token}:`);
    }
  });

  it("contains explicit selectors for every non-default palette and dark mode", () => {
    expect(stylesheet).toContain('[data-clinical-mode="dark"]');
    expect(stylesheet).toContain('[data-palette="ocean"]');
    expect(stylesheet).toContain('[data-palette="sage"]');
    expect(stylesheet).toContain('[data-clinical-mode="dark"][data-palette="ocean"]');
    expect(stylesheet).toContain('[data-clinical-mode="dark"][data-palette="sage"]');
  });
});
