import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticSleep } from "./fixtures";
import { SleepWorkbench } from "./specialty-workbenches";

const meta = {
  title: "ORL/06 Sommeil/SleepWorkbench",
  component: SleepWorkbench,
  tags: ["autodocs", "test"],
  args: { data: syntheticSleep, dataMode: "synthetic" },
} satisfies Meta<typeof SleepWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImportedPartialStudy: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const details = canvas.getByRole("button", { name: "Voir les signaux" });
    await userEvent.click(details);
    await expect(canvas.getByRole("heading", { name: "Complétude des signaux" })).toBeVisible();
    await expect(canvas.getByText("Position corporelle")).toBeVisible();
  },
};

export const Partial: Story = { args: { state: "partial" } };

export const EmbeddedClinical: Story = {
  args: { dataMode: "clinical", presentation: "embedded" },
};
