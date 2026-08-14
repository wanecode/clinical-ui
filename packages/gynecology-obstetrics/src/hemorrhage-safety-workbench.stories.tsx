import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticHemorrhageItems } from "./fixtures";
import "./styles.css";
import { HemorrhageSafetyWorkbench } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/HemorrhageSafetyWorkbench",
  component: HemorrhageSafetyWorkbench,
  tags: ["autodocs", "test"],
  args: { items: syntheticHemorrhageItems, quantifiedLoss: null, dataMode: "synthetic" },
} satisfies Meta<typeof HemorrhageSafetyWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Preparation: Story = {};
export const ReponseDeclenchee: Story = {
  args: {
    items: syntheticHemorrhageItems.map((item) =>
      item.kind === "response" ? { ...item, status: "triggered" } : item,
    ),
    quantifiedLoss: "Valeur en cours de validation",
  },
};
export const DonneesIndisponibles: Story = { args: { state: "error" } };
