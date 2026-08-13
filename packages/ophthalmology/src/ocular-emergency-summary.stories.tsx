import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { syntheticEmergencyData } from "./fixtures";
import { OcularEmergencySummary } from "./ocular-emergency-summary";

const meta = {
  title: "Ophthalmology/OcularEmergencySummary",
  component: OcularEmergencySummary,
  tags: ["autodocs", "test"],
  args: { data: syntheticEmergencyData, onDisposition: fn(), dataMode: "synthetic" },
  parameters: {
    docs: {
      description: {
        component:
          "Résumé critique pour baisse brutale, douleur, trauma, orientation et filet de sécurité.",
      },
    },
  },
} satisfies Meta<typeof OcularEmergencySummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Critique: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/signes critiques/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Confirmer l’orientation" }));
    await expect(args.onDisposition).toHaveBeenCalledWith(syntheticEmergencyData.disposition);
  },
};

export const TriageInteractif: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: /Plaie transfixiante/ }));
    await expect(canvas.getByText("1 signe critique")).toBeVisible();
  },
};

export const SansDrapeauRouge: Story = {
  args: {
    data: {
      ...syntheticEmergencyData,
      painScore: 2,
      findings: syntheticEmergencyData.findings.map((finding) => ({ ...finding, present: false })),
      disposition: "Consultation programmée après réévaluation",
    },
  },
};

export const CompactMobile: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };

export const EmbarqueAvecTriagePartiel: Story = {
  args: {
    presentation: "embedded",
    dataMode: "clinical",
    readOnly: true,
    state: "partial",
    data: {
      triageLevel: "Urgent",
      disposition: "Orientation documentée dans le dossier",
      findings: [],
      immediateActions: [],
      source: "FHIR Observation/triage-ocular-1",
    },
  },
};
