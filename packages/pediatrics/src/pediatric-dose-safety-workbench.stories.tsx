import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticDoseCalculation } from "./fixtures";
import "./styles.css";
import type { DoseCalculation } from "./types";
import { PediatricDoseSafetyWorkbench } from "./workbenches";

const incompleteCalculation = {
  medication: syntheticDoseCalculation.medication,
  status: "incomplete",
  missingInputs: ["Poids récent", "Concentration"],
  origin: syntheticDoseCalculation.origin,
  clinicalStatus: "unknown",
  sourceReference: syntheticDoseCalculation.sourceReference,
} satisfies DoseCalculation;

const meta = {
  title: "Pediatrics/PediatricDoseSafetyWorkbench",
  component: PediatricDoseSafetyWorkbench,
  tags: ["autodocs", "test"],
  args: { calculation: syntheticDoseCalculation, dataMode: "synthetic" },
} satisfies Meta<typeof PediatricDoseSafetyWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {};
export const PoidsAbsent: Story = {
  args: { calculation: incompleteCalculation },
};
export const Interdit: Story = { args: { state: "forbidden" } };
