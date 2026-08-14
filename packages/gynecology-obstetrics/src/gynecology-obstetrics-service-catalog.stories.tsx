import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticServiceItems } from "./fixtures";
import "./styles.css";
import { GynecologyObstetricsServiceCatalog } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/GynecologyObstetricsServiceCatalog",
  component: GynecologyObstetricsServiceCatalog,
  tags: ["autodocs", "test"],
  args: { items: syntheticServiceItems, dataMode: "synthetic" },
} satisfies Meta<typeof GynecologyObstetricsServiceCatalog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const CatalogueVide: Story = { args: { items: [], state: "empty" } };
