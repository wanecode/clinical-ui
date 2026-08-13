import { describe, expect, it } from "vitest";
import {
  isSyntheticOdontologyResource,
  syntheticDentalImages,
  syntheticOdontologyFhirBundle,
  syntheticOdontologyResources,
} from "./fixtures";

describe("odontology FHIR R5 fixtures", () => {
  it("marks the bundle and every contained resource as synthetic", () => {
    expect(isSyntheticOdontologyResource(syntheticOdontologyFhirBundle)).toBe(true);
    expect(syntheticOdontologyResources.length).toBeGreaterThan(8);
    for (const resource of syntheticOdontologyResources) {
      expect(
        isSyntheticOdontologyResource(resource),
        `${resource.resourceType}/${resource.id}`,
      ).toBe(true);
    }
  });

  it("uses native R5 resource types for the clinical pathway", () => {
    expect(new Set(syntheticOdontologyResources.map((resource) => resource.resourceType))).toEqual(
      new Set([
        "Condition",
        "Observation",
        "CarePlan",
        "Task",
        "ImagingStudy",
        "Consent",
        "DocumentReference",
        "MedicationRequest",
      ]),
    );
  });

  it("never exposes an unmarked imaging preview", () => {
    for (const image of syntheticDentalImages) {
      expect(image.synthetic).toBe(true);
      expect(image.id).toContain("synthetic");
      expect(image.resourceRef).toContain("synthetic");
    }
  });
});
