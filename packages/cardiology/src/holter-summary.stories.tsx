import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { HolterSummary } from "./diagnostics";
import { syntheticHolterEvents } from "./fixtures";

const meta = {
  title: "Cardiology/HolterSummary",
  component: HolterSummary,
  tags: ["autodocs", "test"],
  args: { events: syntheticHolterEvents },
} satisfies Meta<typeof HolterSummary>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CriticalEvent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Critique")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Tableau" }));
    await expect(canvas.getByRole("table", { name: "Événements Holter détectés" })).toBeVisible();
  },
};
export const Nominal: Story = {
  args: { events: syntheticHolterEvents.filter((event) => event.severity !== "critical") },
};
export const SignalAbsent: Story = { args: { signalAvailable: false } };
export const Loading: Story = { args: { state: "loading" } };
