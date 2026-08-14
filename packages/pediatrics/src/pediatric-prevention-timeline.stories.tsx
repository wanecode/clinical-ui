import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticPreventionItems } from "./fixtures";
import "./styles.css";
import { PediatricPreventionTimeline } from "./workbenches";

const meta = {
  title: "Pediatrics/PediatricPreventionTimeline",
  component: PediatricPreventionTimeline,
  tags: ["autodocs", "test"],
  args: { items: syntheticPreventionItems, dataMode: "synthetic" },
} satisfies Meta<typeof PediatricPreventionTimeline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {};
export const ResultatIndisponible: Story = {
  args: { items: syntheticPreventionItems.filter((item) => item.status === "unavailable") },
};
export const Chargement: Story = { args: { state: "loading" } };
