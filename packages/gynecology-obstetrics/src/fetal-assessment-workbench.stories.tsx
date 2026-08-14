import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticFetalMeasures } from "./fixtures";
import "./styles.css";
import { FetalAssessmentWorkbench } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/FetalAssessmentWorkbench",
  component: FetalAssessmentWorkbench,
  tags: ["autodocs", "test"],
  args: { measures: syntheticFetalMeasures, dataMode: "synthetic" },
} satisfies Meta<typeof FetalAssessmentWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const StructureNonVisualisee: Story = {
  args: {
    measures: syntheticFetalMeasures.filter((measure) => measure.interpretation === "unknown"),
  },
};
export const Vide: Story = { args: { measures: [], state: "empty" } };
