import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PrescriptionSafetyBoard } from "./care";
import { syntheticPrescriptionItems } from "./fixtures";

const meta = {
  title: "Cardiology/PrescriptionSafetyBoard",
  component: PrescriptionSafetyBoard,
  tags: ["autodocs", "test"],
  args: { items: syntheticPrescriptionItems, owner: "Dr Synthèse", onConfirm: fn() },
} satisfies Meta<typeof PrescriptionSafetyBoard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SafetyReview: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Confirmer après revue" }));
    await expect(canvas.getByText("Confirmation humaine enregistrée")).toBeVisible();
    await expect(args.onConfirm).toHaveBeenCalledWith("apixaban");
  },
};
export const ConfirmedNominal: Story = {
  args: { items: syntheticPrescriptionItems.filter((item) => item.status === "confirmed") },
};
export const Loading: Story = { args: { state: "loading" } };
export const Forbidden: Story = { args: { state: "forbidden" } };
