import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticVoiceSwallowingFindings } from "./fixtures";
import { VoiceSwallowingWorkbench } from "./specialty-workbenches";

const meta = {
  title: "ORL/04 Voix et déglutition/VoiceSwallowingWorkbench",
  component: VoiceSwallowingWorkbench,
  tags: ["autodocs", "test"],
  args: { findings: syntheticVoiceSwallowingFindings },
} satisfies Meta<typeof VoiceSwallowingWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VoicePreliminary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const swallowing = canvas.getByRole("button", { name: "Déglutition" });
    await userEvent.click(swallowing);
    await expect(swallowing).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("heading", { name: "Mesures de déglutition" })).toBeVisible();
  },
};

export const Empty: Story = { args: { state: "empty" } };
