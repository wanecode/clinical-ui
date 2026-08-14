import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticPostpartumItems } from "./fixtures";
import "./styles.css";
import { PostpartumWorkbench } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/PostpartumWorkbench",
  component: PostpartumWorkbench,
  tags: ["autodocs", "test"],
  args: { items: syntheticPostpartumItems, dataMode: "synthetic" },
} satisfies Meta<typeof PostpartumWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const SuiviPartiel: Story = {
  args: {
    items: syntheticPostpartumItems.filter(
      (item) => item.status === "follow-up" || item.status === "unavailable",
    ),
  },
};
export const Interdit: Story = { args: { state: "forbidden" } };
