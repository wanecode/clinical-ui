import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { syntheticIncompleteRiskScore, syntheticRiskScore, syntheticSummaryData } from "./fixtures";
import { CardiovascularSummary } from "./overview";

const meta = {
  title: "Cardiology/CardiovascularSummary",
  component: CardiovascularSummary,
  tags: ["autodocs", "test"],
  args: {
    data: syntheticSummaryData,
    riskScore: syntheticRiskScore,
    patientLabel: "Awa Ndiaye — synthétique",
    decisionOwner: "Dr Synthèse",
    onReviewDecision: fn(),
  },
} satisfies Meta<typeof CardiovascularSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("6,3 % à 10 ans")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Ouvrir la revue" }));
    await expect(args.onReviewDecision).toHaveBeenCalledOnce();
  },
};

export const DonneesManquantes: Story = { args: { riskScore: syntheticIncompleteRiskScore } };
export const Loading: Story = { args: { state: "loading" } };
export const FailureState: Story = { args: { state: "error" } };
