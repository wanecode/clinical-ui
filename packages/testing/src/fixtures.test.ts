import { describe, expect, it } from "vitest";
import { isSyntheticFixture, syntheticResources } from "./fixtures";

describe("synthetic FHIR fixtures", () => {
  it("marks every exported resource as synthetic", () => {
    expect(syntheticResources).not.toHaveLength(0);
    for (const resource of syntheticResources) {
      expect(isSyntheticFixture(resource), `${resource.resourceType}/${resource.id}`).toBe(true);
    }
  });

  it("uses identifiers that cannot be mistaken for production records", () => {
    for (const resource of syntheticResources) {
      expect(resource.id).toContain("synthetic");
    }
  });
});
