import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { syntheticAgeContext, syntheticNorms, syntheticWeights } from "./fixtures";
import "./styles.css";
import { PediatricContextWorkbench } from "./workbenches";

const meta = {
  title: "Pediatrics/PediatricContextWorkbench",
  component: PediatricContextWorkbench,
  tags: ["autodocs", "test"],
  args: {
    age: syntheticAgeContext,
    weights: syntheticWeights,
    norms: syntheticNorms,
    dataMode: "synthetic",
  },
} satisfies Meta<typeof PediatricContextWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("7 mois")).toBeVisible();
  },
};
export const DonneesPartielles: Story = { args: { age: null, weights: [], norms: [] } };
export const Chargement: Story = { args: { state: "loading" } };
