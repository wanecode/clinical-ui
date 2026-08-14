import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticTransitionItems } from "./fixtures";
import "./styles.css";
import { TransitionReadinessWorkbench } from "./workbenches";

const meta = {
  title: "Pediatrics/TransitionReadinessWorkbench",
  component: TransitionReadinessWorkbench,
  tags: ["autodocs", "test"],
  args: { items: syntheticTransitionItems, targetAge: "16–18 ans", dataMode: "synthetic" },
} satisfies Meta<typeof TransitionReadinessWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {};
export const SansEvaluation: Story = { args: { items: [], targetAge: null, state: "empty" } };
