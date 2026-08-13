import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticTreatmentPhases } from "./fixtures";
import { PhasedTreatmentPlan } from "./phased-treatment-plan";

const meta = {
  title: "Odontology/PhasedTreatmentPlan",
  component: PhasedTreatmentPlan,
  tags: ["autodocs", "test"],
  args: { phases: syntheticTreatmentPhases, consent: "required" },
  parameters: {
    docs: {
      description: {
        component:
          "Plan phasé avec dépendances, statuts réalisé/annulé/reporté, provenance et garde de consentement.",
      },
    },
  },
} satisfies Meta<typeof PhasedTreatmentPlan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConsentRequired: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const statusSelectors = canvas.getAllByLabelText("Mettre à jour le statut");
    const secondStatus = statusSelectors.at(1);
    if (!secondStatus) throw new Error("The second synthetic treatment session is required.");
    await userEvent.selectOptions(secondStatus, "completed");
    await expect(secondStatus).toHaveValue("completed");
    await expect(canvas.getByText("Consentement requis")).toBeVisible();
  },
};

export const ConsentObtained: Story = { args: { consent: "obtained" } };
export const EmptyPlan: Story = { args: { phases: [], state: "empty" } };
