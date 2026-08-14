import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CardiologyReportLifecycle } from "./care";
import { syntheticReportLifecycle } from "./fixtures";

const meta = {
  title: "Cardiology/CardiologyReportLifecycle",
  component: CardiologyReportLifecycle,
  tags: ["autodocs", "test"],
  args: { items: syntheticReportLifecycle, dataMode: "synthetic" },
} satisfies Meta<typeof CardiologyReportLifecycle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PreliminaryAmendedSigned: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Préliminaire")).toBeVisible();
    await expect(canvas.getByText("Amendé")).toBeVisible();
    await expect(canvas.getByText("Signé")).toBeVisible();
  },
};
export const PreliminaryOnly: Story = { args: { items: syntheticReportLifecycle.slice(0, 1) } };
export const FailureState: Story = { args: { state: "error" } };
