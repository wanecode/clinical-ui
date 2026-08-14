import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticVigilanceItems } from "./fixtures";
import "./styles.css";
import { GynecologyObstetricsCockpit } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/GynecologyObstetricsCockpit",
  component: GynecologyObstetricsCockpit,
  tags: ["autodocs", "test"],
  args: { items: syntheticVigilanceItems, dataMode: "synthetic" },
} satisfies Meta<typeof GynecologyObstetricsCockpit>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const Vide: Story = { args: { items: [], state: "empty" } };
export const Interdit: Story = { args: { state: "forbidden" } };
