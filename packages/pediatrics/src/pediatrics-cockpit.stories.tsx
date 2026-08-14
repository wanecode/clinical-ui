import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { syntheticVigilanceItems } from "./fixtures";
import "./styles.css";
import { PediatricsCockpit } from "./workbenches";

const meta = {
  title: "Pediatrics/PediatricsCockpit",
  component: PediatricsCockpit,
  tags: ["autodocs", "test"],
  args: { items: syntheticVigilanceItems, dataMode: "synthetic" },
} satisfies Meta<typeof PediatricsCockpit>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText("Décrochage pondéral")).toBeVisible();
  },
};
export const Vide: Story = { args: { items: [], state: "empty" } };
export const Interdit: Story = { args: { state: "forbidden" } };
