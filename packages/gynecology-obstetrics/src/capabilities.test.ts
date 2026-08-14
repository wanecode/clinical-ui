import { describe, expect, it } from "vitest";
import {
  GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP,
  gynecologyObstetricsModuleForCapability,
} from "./capabilities";

describe("gynecology and obstetrics capability contract", () => {
  it("maps all 40 governed capabilities", () => {
    expect(Object.keys(GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP)).toHaveLength(40);
    for (const [capabilityId, module] of Object.entries(GYNECOLOGY_OBSTETRICS_CAPABILITY_MAP)) {
      expect(gynecologyObstetricsModuleForCapability(capabilityId)).toBe(module);
    }
  });

  it("falls back to the cockpit for an unknown host capability", () => {
    expect(gynecologyObstetricsModuleForCapability("GO-999")).toBe("cockpit");
  });
});
