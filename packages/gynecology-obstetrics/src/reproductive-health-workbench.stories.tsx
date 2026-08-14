import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticReproductiveEvents } from "./fixtures";
import "./styles.css";
import { ReproductiveHealthWorkbench } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/ReproductiveHealthWorkbench",
  component: ReproductiveHealthWorkbench,
  tags: ["autodocs", "test"],
  args: { events: syntheticReproductiveEvents, dataMode: "synthetic" },
} satisfies Meta<typeof ReproductiveHealthWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const Restreint: Story = {
  args: {
    events: syntheticReproductiveEvents.filter((event) => event.visibility === "restricted"),
  },
};
export const Interdit: Story = { args: { state: "forbidden" } };
