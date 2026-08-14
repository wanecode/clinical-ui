import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { AmbulatoryBloodPressureChart } from "./diagnostics";
import { syntheticBloodPressureReadings } from "./fixtures";

const meta = {
  title: "Cardiology/AmbulatoryBloodPressureChart",
  component: AmbulatoryBloodPressureChart,
  tags: ["autodocs", "test"],
  args: { readings: syntheticBloodPressureReadings, origin: "imported", dataMode: "synthetic" },
} satisfies Meta<typeof AmbulatoryBloodPressureChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ImportedNominal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: /Pressions ambulatoires/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Tableau" }));
    await expect(
      canvas.getByRole("table", { name: "Mesures de pression ambulatoire" }),
    ).toBeVisible();
  },
};
export const DeviceUnavailable: Story = { args: { deviceAvailable: false } };
export const SignalAbsent: Story = { args: { readings: [] } };
