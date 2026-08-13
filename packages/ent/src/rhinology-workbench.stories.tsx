import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticRhinology } from "./fixtures";
import { RhinologyWorkbench } from "./specialty-workbenches";

const meta = {
  title: "ORL/05 Rhinologie/RhinologyWorkbench",
  component: RhinologyWorkbench,
  tags: ["autodocs", "test"],
  args: { data: syntheticRhinology },
} satisfies Meta<typeof RhinologyWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RedFlagReview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const acknowledge = canvas.getByRole("button", { name: "Acquitter la lecture" });
    await userEvent.click(acknowledge);
    await expect(canvas.getByText("Vigilance acquittée")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Annuler l’acquittement" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const ErrorState: Story = { args: { state: "error" } };
