import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticTrajectoryEvents } from "./fixtures";
import "./styles.css";
import { PediatricChronicCareTrajectory } from "./workbenches";

const meta = {
  title: "Pediatrics/PediatricChronicCareTrajectory",
  component: PediatricChronicCareTrajectory,
  tags: ["autodocs", "test"],
  args: { events: syntheticTrajectoryEvents, dataMode: "synthetic" },
} satisfies Meta<typeof PediatricChronicCareTrajectory>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {};
export const TrajectoireVide: Story = { args: { events: [], state: "empty" } };
