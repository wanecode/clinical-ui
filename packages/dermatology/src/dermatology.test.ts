import { describe, expect, it } from "vitest";
import {
  DERMATOLOGY_UI_CONTRACT,
  isSyntheticDermatologyResource,
  lesionId,
  lesionPlacement,
  observationOrigin,
  syntheticDermatologyResources,
  syntheticDermoscopyDocuments,
  syntheticImageConsent,
  syntheticLesionMeasurements,
  syntheticLesions,
  syntheticPigmentedAssessment,
  syntheticProcedures,
  syntheticTreatments,
  syntheticVigilanceIssues,
  syntheticWoundTrajectory,
} from "./index";

describe("@clinical-ui/dermatology FHIR R5 contract", () => {
  it("pins the specialty PlanDefinition and FHIR version", () => {
    expect(DERMATOLOGY_UI_CONTRACT).toMatchObject({
      fhirVersion: "R5",
      planDefinition: "clinical-specialty-dermatology-2026-1",
      version: "2026.1",
      syntheticFixturesOnly: true,
    });
  });

  it("marks every fixture explicitly synthetic and uses synthetic identifiers", () => {
    expect(syntheticDermatologyResources.length).toBeGreaterThan(30);
    for (const resource of syntheticDermatologyResources) {
      expect(
        isSyntheticDermatologyResource(resource),
        `${resource.resourceType}/${resource.id}`,
      ).toBe(true);
      expect(resource.id, `${resource.resourceType} without an id`).toContain("synthetic");
    }
  });

  it("uses only native R5 resource types for exported fixtures", () => {
    const allowed = new Set([
      "BodyStructure",
      "Consent",
      "DetectedIssue",
      "DocumentReference",
      "MedicationRequest",
      "Observation",
      "Procedure",
    ]);
    for (const resource of syntheticDermatologyResources) {
      expect(allowed.has(resource.resourceType), resource.resourceType).toBe(true);
    }
  });

  it("keeps stable lesion identity, coded location and body-map coordinates", () => {
    for (const lesion of syntheticLesions) {
      expect(lesionId(lesion)).toMatch(/^LES-/);
      expect(lesion.patient.reference).toContain("Patient/");
      expect(lesion.includedStructure[0]?.structure.coding?.[0]?.code).toBeTruthy();
      const placement = lesionPlacement(lesion);
      expect(placement.x).toBeGreaterThanOrEqual(0);
      expect(placement.x).toBeLessThanOrEqual(1);
      expect(placement.y).toBeGreaterThanOrEqual(0);
      expect(placement.y).toBeLessThanOrEqual(1);
    }
  });

  it("links dermoscopy, measurements and ABCDE assessment to the same lesion", () => {
    const target = `BodyStructure/${syntheticLesions[0]?.id}`;
    expect(syntheticLesionMeasurements.every((item) => item.focus?.[0]?.reference === target)).toBe(
      true,
    );
    expect(
      syntheticDermoscopyDocuments.every(
        (item) => item.bodySite?.[0]?.reference?.reference === target,
      ),
    ).toBe(true);
    expect(syntheticPigmentedAssessment.focus?.[0]?.reference).toBe(target);
    expect(syntheticImageConsent.status).toBe("active");
    expect(syntheticImageConsent.decision).toBe("permit");
  });

  it("uses R5 CodeableReference fields instead of legacy choice elements", () => {
    for (const treatment of syntheticTreatments) {
      expect(treatment.medication.concept ?? treatment.medication.reference).toBeTruthy();
      expect(treatment).not.toHaveProperty("medicationCodeableConcept");
      expect(treatment).not.toHaveProperty("medicationReference");
    }
    for (const document of syntheticDermoscopyDocuments) {
      expect(document.bodySite?.[0]?.reference?.reference).toContain("BodyStructure/");
      expect(document.context).toBeUndefined();
    }
  });

  it("distinguishes observed, imported, derived and projected evidence", () => {
    const origins = new Set([
      ...syntheticLesionMeasurements.map(observationOrigin),
      ...syntheticWoundTrajectory.map(observationOrigin),
    ]);
    expect(origins).toEqual(new Set(["observed", "imported", "derived", "projected"]));
  });

  it("preserves preliminary, amended and critical clinical states", () => {
    expect(syntheticLesionMeasurements.some((item) => item.status === "preliminary")).toBe(true);
    expect(syntheticLesionMeasurements.some((item) => item.status === "amended")).toBe(true);
    expect(
      syntheticProcedures.some((procedure) =>
        procedure.extension?.some(
          (extension) =>
            extension.url.endsWith("/report-status") && extension.valueCode === "amended",
        ),
      ),
    ).toBe(true);
    expect(syntheticVigilanceIssues.some((issue) => issue.severity === "high")).toBe(true);
  });
});
