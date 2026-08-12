import { ClinicalContextHeader, ProvenanceSummary } from "@clinical-ui/core";
import {
  SYNTHETIC_NOW,
  syntheticPatientSummary,
  syntheticProvenanceSummary,
  syntheticReportStatus,
} from "@clinical-ui/testing";
import type { Meta, StoryObj } from "@storybook/react-vite";

function FhirNativeContext() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <ClinicalContextHeader
        patient={syntheticPatientSummary}
        encounter={{
          id: "encounter-synthetic-001",
          effectiveAt: SYNTHETIC_NOW,
          service: "Consultation synthétique",
          practitioner: "Dr A. Fall",
        }}
        sourceLabel="FHIR R5 · synthétique"
        status={syntheticReportStatus}
      />
      <ProvenanceSummary provenance={syntheticProvenanceSummary} />
    </div>
  );
}

const meta = {
  title: "FHIR/FHIR-native context",
  component: FhirNativeContext,
  tags: ["autodocs", "test"],
  parameters: {
    docs: {
      description: {
        component:
          "Preuve de la chaîne complète : fixtures FHIR R5 synthétiques → adaptateurs déterministes → composants React purs.",
      },
    },
  },
} satisfies Meta<typeof FhirNativeContext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PatientReportAndProvenance: Story = {};
