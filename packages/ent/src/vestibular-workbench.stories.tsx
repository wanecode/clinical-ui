import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticVestibularFindings } from "./fixtures";
import { VestibularWorkbench } from "./specialty-workbenches";

const meta = {
  title: "ORL/03 Équilibre/VestibularWorkbench",
  component: VestibularWorkbench,
  tags: ["autodocs", "test"],
  args: { findings: syntheticVestibularFindings },
} satisfies Meta<typeof VestibularWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ObservedAndImported: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const vng = canvas.getByRole("button", { name: /VNG/ });
    await userEvent.click(vng);
    await expect(vng).toHaveAttribute("aria-current", "true");
    await expect(canvas.getByText("Compte rendu externe disponible")).toBeVisible();
  },
};

export const Loading: Story = { args: { state: "loading" } };
