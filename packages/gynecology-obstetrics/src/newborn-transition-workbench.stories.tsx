import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticNewbornItems } from "./fixtures";
import "./styles.css";
import { NewbornTransitionWorkbench } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/NewbornTransitionWorkbench",
  component: NewbornTransitionWorkbench,
  tags: ["autodocs", "test"],
  args: { items: syntheticNewbornItems, dataMode: "synthetic" },
} satisfies Meta<typeof NewbornTransitionWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const IdentiteAbsente: Story = { args: { items: [], state: "empty" } };
