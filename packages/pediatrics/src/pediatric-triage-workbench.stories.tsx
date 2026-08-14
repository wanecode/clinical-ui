import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticDisposition, syntheticRedFlags, syntheticTriageObservations } from "./fixtures";
import "./styles.css";
import { PediatricTriageWorkbench } from "./workbenches";

const meta = {
  title: "Pediatrics/PediatricTriageWorkbench",
  component: PediatricTriageWorkbench,
  tags: ["autodocs", "test"],
  args: {
    observations: syntheticTriageObservations,
    redFlags: syntheticRedFlags,
    disposition: syntheticDisposition,
    dataMode: "synthetic",
  },
} satisfies Meta<typeof PediatricTriageWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {};
export const SansDisposition: Story = { args: { disposition: null } };
export const DonneesIndisponibles: Story = { args: { state: "error" } };
