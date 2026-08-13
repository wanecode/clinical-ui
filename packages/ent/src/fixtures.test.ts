import { describe, expect, it } from "vitest";
import { isSyntheticEntResource, syntheticEntBundle, syntheticEntFhirResources } from "./fixtures";

describe("FHIR R5 ENT fixtures", () => {
  it("marks every resource as synthetic in both id and meta.tag", () => {
    expect(syntheticEntFhirResources.length).toBeGreaterThanOrEqual(10);
    for (const resource of syntheticEntFhirResources) {
      expect(isSyntheticEntResource(resource), `${resource.resourceType}/${resource.id}`).toBe(
        true,
      );
    }
  });

  it("collects only native resource shapes in a collection Bundle", () => {
    expect(syntheticEntBundle.resourceType).toBe("Bundle");
    expect(syntheticEntBundle.type).toBe("collection");
    expect(syntheticEntBundle.entry).toHaveLength(syntheticEntFhirResources.length);
    expect(new Set(syntheticEntBundle.entry.map(({ resource }) => resource.resourceType))).toEqual(
      new Set([
        "Patient",
        "Device",
        "Observation",
        "QuestionnaireResponse",
        "DocumentReference",
        "Specimen",
        "Procedure",
        "DiagnosticReport",
        "Provenance",
      ]),
    );
  });

  it("never uses a production-looking absolute URL", () => {
    for (const entry of syntheticEntBundle.entry) {
      expect(entry.fullUrl).toContain("example.invalid");
    }
  });
});
