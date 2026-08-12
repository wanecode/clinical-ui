import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CLINICAL_SEMANTIC_FAMILIES,
  CLINICAL_UI_MODES,
  CLINICAL_UI_PALETTES,
  CLINICAL_VIEWER_TOKENS,
  ECOMED_THEME_CONTRACT_SNAPSHOT,
  SHADCN_COLOR_TOKENS,
} from "./index";

const stylesheet = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

describe("ecoMed24-compatible theme contract", () => {
  it("pins the compatibility snapshot and the six supported theme combinations", () => {
    expect(ECOMED_THEME_CONTRACT_SNAPSHOT).toBe("2026-08-12");
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

  it("contains explicit selectors for every non-default palette and dark mode", () => {
    expect(stylesheet).toContain('[data-clinical-mode="dark"]');
    expect(stylesheet).toContain('[data-palette="ocean"]');
    expect(stylesheet).toContain('[data-palette="sage"]');
    expect(stylesheet).toContain('[data-clinical-mode="dark"][data-palette="ocean"]');
    expect(stylesheet).toContain('[data-clinical-mode="dark"][data-palette="sage"]');
  });
});
