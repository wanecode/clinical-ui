import { describe, expect, it } from "vitest";
import * as fixtures from "./fixtures";

describe("pediatrics fixtures", () => {
  it("keeps every fixture explicitly synthetic", () => {
    const serialized = JSON.stringify(fixtures).toLowerCase();
    expect(serialized).toContain("synthetic");
    expect(serialized).not.toContain("patient/real");
  });

  it("does not silently complete missing clinical inputs", () => {
    expect(fixtures.syntheticDoseCalculation.missingInputs).toEqual([]);
    expect(fixtures.syntheticPreventionItems.some((item) => item.status === "unavailable")).toBe(
      true,
    );
    expect(fixtures.syntheticTransitionItems.some((item) => item.status === "missing")).toBe(true);
  });
});
