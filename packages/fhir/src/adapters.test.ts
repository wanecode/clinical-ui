import { describe, expect, it } from "vitest";
import {
  ageAtDate,
  clinicalStatusFromDiagnosticReport,
  patientSummaryFromFhir,
  provenanceSummaryFromFhir,
} from "./adapters";
import type { Patient, Provenance } from "./types";

const patient: Patient = {
  resourceType: "Patient",
  id: "patient-synthetic-001",
  identifier: [
    { system: "https://example.invalid/mrn/secondary", value: "SECONDARY" },
    { use: "official", system: "https://example.invalid/mrn", value: "SYN-2608-0042" },
  ],
  name: [{ use: "official", family: "DIOP", given: ["Mariam"] }],
  gender: "female",
  birthDate: "1984-02-17",
};

describe("FHIR R5 adapters", () => {
  it("creates a deterministic patient view model", () => {
    expect(patientSummaryFromFhir(patient, { asOf: "2026-08-12T10:15:00Z" })).toEqual({
      id: "patient-synthetic-001",
      label: "Mariam DIOP",
      mrn: "SYN-2608-0042",
      birthDate: "1984-02-17",
      ageLabel: "42 ans",
      sexLabel: "Femme",
    });
  });

  it("handles birthdays without timezone drift", () => {
    expect(ageAtDate("2000-08-13", "2026-08-12T23:59:59Z")).toBe(25);
    expect(ageAtDate("2000-08-12", "2026-08-12T00:00:00Z")).toBe(26);
  });

  it("maps report workflow states to clinical presentation states", () => {
    expect(clinicalStatusFromDiagnosticReport("final")).toBe("validated");
    expect(clinicalStatusFromDiagnosticReport("preliminary")).toBe("preliminary");
    expect(clinicalStatusFromDiagnosticReport("corrected")).toBe("amended");
    expect(clinicalStatusFromDiagnosticReport("entered-in-error")).toBe("warning");
  });

  it("never infers target validation from a Provenance timestamp", () => {
    const provenance: Provenance = {
      resourceType: "Provenance",
      target: [{ reference: "DiagnosticReport/synthetic" }],
      recorded: "2026-08-12T10:15:00Z",
      agent: [{ who: { display: "Synthetic author" } }],
    };

    expect(provenanceSummaryFromFhir(provenance).status).toBe("unknown");
    expect(provenanceSummaryFromFhir(provenance, { status: "preliminary" }).status).toBe(
      "preliminary",
    );
  });
});
