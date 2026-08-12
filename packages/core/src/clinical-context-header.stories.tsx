import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ClinicalContextHeader } from "./clinical-context-header";

const meta = {
  title: "Core/ClinicalContextHeader",
  component: ClinicalContextHeader,
  tags: ["autodocs", "test"],
  args: {
    patient: {
      id: "patient-synthetic-001",
      label: "Mariam Diop",
      mrn: "SYN-2608-0042",
      birthDate: "1984-02-17",
      ageLabel: "42 ans",
      sexLabel: "Femme",
    },
    encounter: {
      id: "encounter-synthetic-001",
      effectiveAt: "12 août 2026 · 10:15",
      service: "Consultation",
      practitioner: "Dr A. Fall",
    },
    sourceLabel: "Données synthétiques",
    status: "validated",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Conserve l’identité, le statut et l’épisode de soins visibles au-dessus de tout module spécialisé.",
      },
    },
  },
} satisfies Meta<typeof ClinicalContextHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Validated: Story = {};

export const Preliminary: Story = {
  args: { status: "preliminary" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Comprendre le statut clinique" });
    await userEvent.hover(trigger);
    await expect(await within(document.body).findByRole("tooltip")).toBeVisible();
  },
};

export const Critical: Story = { args: { status: "critical" } };

export const LongIdentity: Story = {
  args: {
    patient: {
      id: "patient-synthetic-long",
      label: "Nom clinique synthétique volontairement très long pour vérifier la robustesse",
      mrn: "SYN-LONG-000000000042",
      birthDate: "1958-11-03",
      ageLabel: "67 ans",
      sexLabel: "Non renseigné",
    },
  },
};

export const Constrained: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
