import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticMiddleEar, syntheticPediatricMiddleEar } from "./fixtures";
import { MiddleEarWorkbench } from "./middle-ear-workbench";

const meta = {
  title: "ORL/01 Audition/MiddleEarWorkbench",
  component: MiddleEarWorkbench,
  tags: ["autodocs", "test"],
  args: { data: syntheticMiddleEar },
  parameters: {
    docs: {
      description: {
        component:
          "Tympanogrammes et réflexes avec qualité d’acquisition, appareil source et séries incomplètes explicites.",
      },
    },
  },
} satisfies Meta<typeof MiddleEarWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LimitedSeries: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole("button", { name: "Gauche · X" });
    await userEvent.click(left);
    await expect(left).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("heading", { name: "Tympanogramme · gauche" })).toBeVisible();
  },
};

export const Partial: Story = { args: { state: "partial" } };
export const PediatricAcquisition: Story = { args: { data: syntheticPediatricMiddleEar } };
export const ErrorState: Story = { args: { state: "error" } };
