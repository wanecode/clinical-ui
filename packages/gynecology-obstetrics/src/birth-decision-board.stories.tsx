import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticBirthDecision } from "./fixtures";
import "./styles.css";
import { BirthDecisionBoard } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/BirthDecisionBoard",
  component: BirthDecisionBoard,
  tags: ["autodocs", "test"],
  args: { decision: syntheticBirthDecision, dataMode: "synthetic" },
} satisfies Meta<typeof BirthDecisionBoard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const BarriereBloquee: Story = {
  args: {
    decision: {
      ...syntheticBirthDecision,
      readiness: syntheticBirthDecision.readiness.map((item) =>
        item.id === "theatre" ? { ...item, status: "blocked" } : item,
      ),
    },
  },
};
export const Interdit: Story = { args: { state: "forbidden" } };
