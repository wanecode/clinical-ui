import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { AudiogramWorkbench } from "./audiogram-workbench";
import { syntheticAudiogram } from "./fixtures";

const meta = {
  title: "ORL/01 Audition/AudiogramWorkbench",
  component: AudiogramWorkbench,
  tags: ["autodocs", "test"],
  args: { data: syntheticAudiogram },
  parameters: {
    docs: {
      description: {
        component:
          "Audiogramme point par point, conventions droite/gauche redondantes, masquage, non-réponse, PTA gouvernée et table textuelle équivalente.",
      },
    },
  },
} satisfies Meta<typeof AudiogramWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Preliminary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Afficher la tendance" });
    await userEvent.click(toggle);
    await expect(canvas.getByRole("button", { name: "Masquer la tendance" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(canvas.getByText("PTA dérivée — aide à la lecture")).toBeVisible();
  },
};

export const Signed: Story = {
  args: { data: { ...syntheticAudiogram, status: "signed" } },
};

export const NotCalculable: Story = {
  args: { state: "not-calculable" },
};
