import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CardiacTrajectory } from "./care";
import { syntheticTrajectoryEvents } from "./fixtures";

const meta = {
  title: "Cardiology/CardiacTrajectory",
  component: CardiacTrajectory,
  tags: ["autodocs", "test"],
  args: { events: syntheticTrajectoryEvents, dataMode: "synthetic" },
} satisfies Meta<typeof CardiacTrajectory>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Longitudinal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("img", { name: /Trajectoire cardiologique multiligne/ }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Tableau" }));
    await expect(
      canvas.getByRole("table", { name: "Chronologie cardiologique synthétique" }),
    ).toBeVisible();
  },
};
export const Empty: Story = { args: { state: "empty" } };
export const Forbidden: Story = { args: { state: "forbidden" } };
