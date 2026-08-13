import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CataractSurgeryPlanner } from "./cataract-surgery-planner";
import { syntheticCataractPlan } from "./fixtures";

const meta = {
  title: "Ophthalmology/CataractSurgeryPlanner",
  component: CataractSurgeryPlanner,
  tags: ["autodocs", "test"],
  args: { plan: syntheticCataractPlan },
  parameters: {
    docs: {
      description: {
        component:
          "Biométrie, planification d’implant, procédure, cycle documentaire et audit réfractif.",
      },
    },
  },
} satisfies Meta<typeof CataractSurgeryPlanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Planification: Story = {};

export const InteractionPlanification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", { name: /Monofocale torique/ }));
    await expect(canvas.getByRole("radio", { name: /Monofocale torique/ })).toBeChecked();
    const power = canvas.getByRole("spinbutton", { name: /Puissance planifiée/ });
    await userEvent.clear(power);
    await userEvent.type(power, "22");
    await expect(power).toHaveValue(22);
    await userEvent.click(canvas.getByRole("radio", { name: /Monofocale asphérique/ }));
    await userEvent.clear(power);
    await userEvent.type(power, "21.5");
  },
};

export const CycleFinal: Story = {
  args: {
    plan: {
      ...syntheticCataractPlan,
      procedureStatus: "validated",
      documents: syntheticCataractPlan.documents.map((document) => ({
        ...document,
        status: document.label === "Consentement" ? ("signed" as const) : ("complete" as const),
      })),
      audit: [
        { label: "Réfraction cible", target: "−0,25 D", observed: "−0,50 D" },
        { label: "AV sans correction", target: "≥ 8/10", observed: "9/10" },
      ],
    },
  },
};

export const DocumentManquant: Story = { args: { state: "partial" } };
