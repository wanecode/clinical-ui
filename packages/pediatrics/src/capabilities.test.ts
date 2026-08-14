import { describe, expect, it } from "vitest";
import { PEDIATRICS_CAPABILITY_MAP, pediatricsModuleForCapability } from "./capabilities";

describe("pediatrics capability contract", () => {
  it("maps all 40 governed capabilities", () => {
    expect(Object.keys(PEDIATRICS_CAPABILITY_MAP)).toHaveLength(40);
    for (const [capabilityId, module] of Object.entries(PEDIATRICS_CAPABILITY_MAP)) {
      expect(pediatricsModuleForCapability(capabilityId)).toBe(module);
    }
  });

  it("falls back to the cockpit for an unknown host capability", () => {
    expect(pediatricsModuleForCapability("PE-999")).toBe("cockpit");
  });
});
