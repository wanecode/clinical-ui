import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { syntheticIncompleteRiskScore, syntheticRiskScore } from "./fixtures";
import { RiskScoreWorkbench } from "./overview";

const meta = {
  title: "Cardiology/RiskScoreWorkbench",
  component: RiskScoreWorkbench,
  tags: ["autodocs", "test"],
  args: { score: syntheticRiskScore, dataMode: "synthetic" },
} satisfies Meta<typeof RiskScoreWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Calculated: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("SCORE2 · modèle 2026.2 · horizon 10 ans")).toBeVisible();
    await expect(canvas.getByRole("table")).toBeVisible();
  },
};
export const IncompleteNotCalculated: Story = { args: { score: syntheticIncompleteRiskScore } };
export const Forbidden: Story = { args: { state: "forbidden" } };
