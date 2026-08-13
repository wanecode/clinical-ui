import { describe, expect, it } from "vitest";
import {
  isSyntheticCardiologyResource,
  syntheticCardiologyResources,
  syntheticIncompleteRiskScore,
  syntheticMedicationRequests,
  syntheticRiskAssessment,
  syntheticRiskScore,
} from "./fixtures";

describe("cardiology FHIR R5 fixtures", () => {
  it("marks every resource as explicitly synthetic", () => {
    expect(syntheticCardiologyResources.length).toBeGreaterThan(10);
    for (const resource of syntheticCardiologyResources) {
      expect(
        isSyntheticCardiologyResource(resource),
        `${resource.resourceType}/${resource.id}`,
      ).toBe(true);
      expect(resource.id).toContain("synthetic");
    }
  });

  it("traces the versioned SCORE2 result to its FHIR basis", () => {
    expect(syntheticRiskAssessment.method.coding?.[0]?.version).toBe("2026.2");
    expect(syntheticRiskScore.version).toBe("2026.2");
    expect(syntheticRiskAssessment.basis).toHaveLength(3);
    expect(syntheticRiskScore.inputs.every((input) => input.sourceReference)).toBe(true);
  });

  it("keeps incomplete scores explicitly uncalculated", () => {
    expect(syntheticIncompleteRiskScore.status).toBe("not-calculated");
    expect(syntheticIncompleteRiskScore.value).toBeUndefined();
    expect(syntheticIncompleteRiskScore.missingInputs).not.toHaveLength(0);
  });

  it("uses the R5 CodeableReference shape for requested medications", () => {
    for (const request of syntheticMedicationRequests) {
      expect(request.medication).toHaveProperty("concept");
      expect(request.medication).not.toHaveProperty("text");
    }
  });
});
