import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { syntheticDentalPrescription } from "./fixtures";
import { SafeDentalPrescription } from "./safe-dental-prescription";

const meta = {
  title: "Odontology/SafeDentalPrescription",
  component: SafeDentalPrescription,
  tags: ["autodocs", "test"],
  args: { prescription: syntheticDentalPrescription },
  parameters: {
    docs: {
      description: {
        component:
          "Lecture sûre d'une MedicationRequest R5 synthétique : dose maximale, allergies, interactions et garde pédiatrique restent visibles.",
      },
    },
  },
} satisfies Meta<typeof SafeDentalPrescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdultDraft: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Contrôles de sécurité satisfaits")).toBeVisible();
    await expect(canvas.getByText("1 500 mg / jour")).toBeVisible();
  },
};

export const PediatricWeightMissing: Story = {
  args: {
    prescription: {
      ...syntheticDentalPrescription,
      id: "prescription-synthetic-pediatric-001",
      medication: "Amoxicilline · dose pondérale",
      dose: "À calculer",
      maximumDailyDose: "À confirmer",
      pediatric: true,
      status: "blocked",
      resourceRef: "MedicationRequest/medicationrequest-synthetic-pediatric-001",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Prescription bloquée")).toBeVisible();
    await expect(canvas.getByText("Poids pédiatrique documenté")).toBeVisible();
    await expect(canvas.getByText("Action requise")).toBeVisible();
  },
};

export const Forbidden: Story = { args: { state: "forbidden" } };
