import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CardiologyVigilanceBoard } from "./care";
import { syntheticVigilanceItems } from "./fixtures";

const meta = {
  title: "Cardiology/CardiologyVigilanceBoard",
  component: CardiologyVigilanceBoard,
  tags: ["autodocs", "test"],
  args: { items: syntheticVigilanceItems, onAcknowledge: fn(), dataMode: "synthetic" },
} satisfies Meta<typeof CardiologyVigilanceBoard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CriticalWithOwner: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Prendre en compte" });
    await userEvent.click(button);
    await expect(canvas.getAllByText("Décision tracée")).toHaveLength(2);
    await expect(args.onAcknowledge).toHaveBeenCalledWith("interaction");
  },
};
export const ResolvedNominal: Story = {
  args: {
    items: syntheticVigilanceItems.map((item) => ({ ...item, status: "resolved" as const })),
  },
};
export const Empty: Story = { args: { state: "empty" } };
export const Forbidden: Story = { args: { state: "forbidden" } };
