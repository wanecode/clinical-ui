import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ImplantedDeviceTimeline } from "./care";
import { syntheticDeviceTimeline } from "./fixtures";

const meta = {
  title: "Cardiology/ImplantedDeviceTimeline",
  component: ImplantedDeviceTimeline,
  tags: ["autodocs", "test"],
  args: {
    events: syntheticDeviceTimeline,
    dataMode: "synthetic",
    deviceLabel: "DAI bicaméral synthétique",
    serialNumber: "SYN-DAI-042",
  },
} satisfies Meta<typeof ImplantedDeviceTimeline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FollowUp: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Implantation DAI bicaméral")).toBeVisible();
    await expect(canvas.getByText("Projeté")).toBeVisible();
  },
};
export const DeviceUnavailable: Story = { args: { deviceAvailable: false } };
export const FailureState: Story = { args: { state: "error" } };
