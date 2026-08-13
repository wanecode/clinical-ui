import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EcgWorkbench } from "./diagnostics";
import { syntheticEcgStudy } from "./fixtures";

const meta = {
  title: "Cardiology/EcgWorkbench",
  component: EcgWorkbench,
  tags: ["autodocs", "test"],
  args: { study: syntheticEcgStudy, onValidate: fn() },
} satisfies Meta<typeof EcgWorkbench>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ImportedPreliminary: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: /Tracé ECG synthétique/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Tableau" }));
    await expect(
      canvas.getByRole("table", { name: "Échantillons du signal ECG synthétique" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Valider humainement" }));
    await expect(args.onValidate).toHaveBeenCalledOnce();
  },
};
export const ValidatedNominal: Story = {
  args: { study: { ...syntheticEcgStudy, origin: "observed", reportStatus: "validated" } },
};
export const SignalAbsent: Story = { args: { availability: "signal-absent" } };
export const DeviceUnavailable: Story = { args: { availability: "device-unavailable" } };
export const FailureState: Story = { args: { state: "error" } };
