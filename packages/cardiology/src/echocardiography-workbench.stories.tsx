import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { EchocardiographyWorkbench } from "./diagnostics";
import { syntheticEchoMeasures } from "./fixtures";

const meta = {
  title: "Cardiology/EchocardiographyWorkbench",
  component: EchocardiographyWorkbench,
  tags: ["autodocs", "test"],
  args: { measures: syntheticEchoMeasures, reportStatus: "amended", dataMode: "synthetic" },
} satisfies Meta<typeof EchocardiographyWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Amended: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("Corrigé")).toHaveLength(2);
    await expect(canvas.getByRole("table")).toBeVisible();
  },
};
export const ValidatedNominal: Story = {
  args: {
    reportStatus: "validated",
    conclusion: "Mesures synthétiques relues et validées par le cardiologue lecteur.",
  },
};
export const Preliminary: Story = {
  args: {
    reportStatus: "preliminary",
    conclusion: "Conclusion préliminaire synthétique, à confirmer.",
  },
};
export const Empty: Story = { args: { state: "empty" } };
