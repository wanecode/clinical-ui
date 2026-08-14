import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticServiceItems } from "./fixtures";
import "./styles.css";
import { PediatricServiceCatalog } from "./workbenches";

const meta = {
  title: "Pediatrics/PediatricServiceCatalog",
  component: PediatricServiceCatalog,
  tags: ["autodocs", "test"],
  args: { items: syntheticServiceItems, dataMode: "synthetic" },
} satisfies Meta<typeof PediatricServiceCatalog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {};
export const CatalogueVide: Story = { args: { items: [], state: "empty" } };
