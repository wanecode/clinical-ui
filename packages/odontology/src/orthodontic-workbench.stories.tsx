import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticOrthodonticTimeline } from "./fixtures";
import { OrthodonticWorkbench } from "./orthodontic-workbench";

const meta = {
  title: "Odontology/OrthodonticWorkbench",
  component: OrthodonticWorkbench,
  tags: ["autodocs", "test"],
  args: { events: syntheticOrthodonticTimeline, currentStep: 4, totalSteps: 12 },
  parameters: {
    docs: {
      description: {
        component:
          "Suivi orthodontique avec mesures, comparaison initiale/actuelle/projetée et jalons traçables.",
      },
    },
  },
} satisfies Meta<typeof OrthodonticWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveTreatment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const projected = canvas.getByRole("button", { name: "Projeté" });
    await userEvent.click(projected);
    await expect(projected).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByLabelText("Schéma projected")).toBeVisible();
  },
};

export const Forbidden: Story = { args: { state: "forbidden" } };
