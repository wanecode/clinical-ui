import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticActorContexts } from "./fixtures";
import "./styles.css";
import { ChildFamilyContextWorkbench } from "./workbenches";

const meta = {
  title: "Pediatrics/ChildFamilyContextWorkbench",
  component: ChildFamilyContextWorkbench,
  tags: ["autodocs", "test"],
  args: { actors: syntheticActorContexts, dataMode: "synthetic" },
} satisfies Meta<typeof ChildFamilyContextWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Nominal: Story = {};
export const AccesRestreint: Story = {
  args: { actors: syntheticActorContexts.filter((actor) => actor.sharingStatus === "restricted") },
};
export const Interdit: Story = { args: { state: "forbidden" } };
