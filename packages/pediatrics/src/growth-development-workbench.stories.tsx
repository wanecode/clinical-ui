import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { syntheticDevelopmentWindows, syntheticGrowthSeries } from "./fixtures";
import "./styles.css";
import { GrowthDevelopmentWorkbench } from "./workbenches";

const meta = {
  title: "Pediatrics/GrowthDevelopmentWorkbench",
  component: GrowthDevelopmentWorkbench,
  tags: ["autodocs", "test"],
  args: {
    series: syntheticGrowthSeries,
    windows: syntheticDevelopmentWindows,
    dataMode: "synthetic",
  },
} satisfies Meta<typeof GrowthDevelopmentWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("img", { name: /Poids pour l’âge/ }),
    ).toBeVisible();
  },
};
export const SansMesure: Story = { args: { series: [], windows: [], state: "empty" } };
export const EchecSource: Story = { args: { state: "error" } };
