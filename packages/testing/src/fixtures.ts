import type {
  Device,
  DiagnosticReport,
  FhirMeta,
  FhirResource,
  Patient,
  Provenance,
} from "@clinical-ui/fhir";
import {
  clinicalStatusFromDiagnosticReport,
  patientSummaryFromFhir,
  provenanceSummaryFromFhir,
} from "@clinical-ui/fhir";

export const SYNTHETIC_NOW = "2026-08-12T10:15:00Z";
export const SYNTHETIC_TAG_SYSTEM = "https://clinical-ui.dev/fhir/CodeSystem/fixture-kind";

const syntheticMeta: FhirMeta = {
  lastUpdated: SYNTHETIC_NOW,
  tag: [{ system: SYNTHETIC_TAG_SYSTEM, code: "synthetic", display: "Donnée synthétique" }],
};

export const syntheticPatient = {
  resourceType: "Patient",
  id: "patient-synthetic-001",
  meta: syntheticMeta,
  identifier: [
    {
      use: "official",
      system: "https://example.invalid/fhir/NamingSystem/medical-record-number",
      value: "SYN-2608-0042",
    },
  ],
  name: [{ use: "usual", family: "Diop", given: ["Mariam"], text: "Mariam Diop" }],
  gender: "female",
  birthDate: "1984-02-17",
} satisfies Patient;

export const syntheticDiagnosticReport = {
  resourceType: "DiagnosticReport",
  id: "report-synthetic-001",
  meta: { ...syntheticMeta, versionId: "7" },
  status: "preliminary",
  code: {
    coding: [
      {
        system: "https://clinical-ui.dev/fhir/CodeSystem/synthetic-report-kind",
        code: "clinical-observation",
        display: "Compte rendu clinique synthétique",
      },
    ],
  },
  subject: { reference: "Patient/patient-synthetic-001", display: "Mariam Diop" },
  effectiveDateTime: SYNTHETIC_NOW,
  issued: "2026-08-12T10:18:00Z",
  performer: [{ reference: "Practitioner/practitioner-synthetic-001", display: "Dr A. Fall" }],
  conclusion: "Exemple entièrement synthétique destiné à la démonstration de Clinical UI.",
} satisfies DiagnosticReport;

export const syntheticDevice = {
  resourceType: "Device",
  id: "device-synthetic-001",
  meta: syntheticMeta,
  displayName: "Dispositif clinique synthétique",
  manufacturer: "Clinical UI Fixtures",
  serialNumber: "SN-SYN-042",
} satisfies Device;

export const syntheticProvenance = {
  resourceType: "Provenance",
  id: "provenance-synthetic-001",
  meta: { ...syntheticMeta, versionId: "7" },
  target: [
    {
      reference: "DiagnosticReport/report-synthetic-001",
      display: "Compte rendu clinique synthétique",
    },
  ],
  occurredDateTime: SYNTHETIC_NOW,
  recorded: "2026-08-12T10:19:42Z",
  activity: { text: "Validation médicale" },
  agent: [
    {
      type: { text: "Auteur" },
      who: { reference: "Practitioner/practitioner-synthetic-001", display: "Dr A. Fall" },
    },
  ],
  entity: [
    {
      role: "source",
      what: {
        reference: "Device/device-synthetic-001",
        display: "Dispositif clinique synthétique",
      },
    },
  ],
} satisfies Provenance;

export const syntheticPatientSummary = patientSummaryFromFhir(syntheticPatient, {
  asOf: SYNTHETIC_NOW,
});

export const syntheticReportStatus = clinicalStatusFromDiagnosticReport(
  syntheticDiagnosticReport.status,
);

export const syntheticProvenanceSummary = provenanceSummaryFromFhir(syntheticProvenance, {
  deviceReference: "Device/device-synthetic-001",
  digest: "sha256:8ca12d…f04e",
  status: syntheticReportStatus,
  resolveDisplay: (reference) => {
    if (reference === "Device/device-synthetic-001") {
      return `${syntheticDevice.displayName} / ${syntheticDevice.serialNumber}`;
    }
    return undefined;
  },
});

export function isSyntheticFixture(resource: FhirResource) {
  return (
    resource.meta?.tag?.some(
      (coding) => coding.system === SYNTHETIC_TAG_SYSTEM && coding.code === "synthetic",
    ) ?? false
  );
}

export const syntheticResources: FhirResource[] = [
  syntheticPatient,
  syntheticDiagnosticReport,
  syntheticDevice,
  syntheticProvenance,
];
