import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProvenanceSummary } from "./provenance-summary";

const meta = {
  title: "Core/ProvenanceSummary",
  component: ProvenanceSummary,
  tags: ["autodocs", "test"],
  args: {
    provenance: {
      resourceReference: "DiagnosticReport/report-synthetic-oph-001",
      status: "validated",
      recordedAt: "2026-08-12T10:19:42Z",
      author: "Dr A. Fall",
      method: "Validation médicale",
      device: "OCT synthétique / SN-SYN-042",
      source: "FHIR R5",
      version: "7",
      digest: "sha256:8ca12d…f04e",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Rend la provenance consultable sans exposer la structure brute de la ressource FHIR.",
      },
    },
  },
} satisfies Meta<typeof ProvenanceSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {};

export const Incomplete: Story = {
  args: {
    provenance: {
      resourceReference: "Observation/observation-synthetic-001",
      status: "preliminary",
      recordedAt: "2026-08-12T10:15:00Z",
    },
  },
};

export const DeviceSourced: Story = {
  args: {
    provenance: {
      resourceReference: "Observation/observation-synthetic-device-001",
      status: "validated",
      recordedAt: "2026-08-12T10:15:00Z",
      device: "Tonomètre synthétique / SN-SYN-109",
      source: "Import DICOM SR",
      version: "2",
    },
  },
};
