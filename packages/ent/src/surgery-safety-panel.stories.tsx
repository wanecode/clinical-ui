import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticSafetyChecklist } from "./fixtures";
import { EntSurgerySafetyPanel } from "./surgery-safety-panel";

const meta = {
  title: "ORL/08 Chirurgie/EntSurgerySafetyPanel",
  component: EntSurgerySafetyPanel,
  tags: ["autodocs", "test"],
  args: { items: syntheticSafetyChecklist, dataMode: "synthetic" },
} satisfies Meta<typeof EntSurgerySafetyPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PendingWithAcknowledgement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const acknowledge = canvas.getByRole("button", { name: "Acquitter la vigilance" });
    await userEvent.click(acknowledge);
    await expect(canvas.getByText("Lecture acquittée")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Annuler l’acquittement" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

export const Acknowledged: Story = { args: { initialVigilanceAcknowledged: true } };
export const Loading: Story = { args: { state: "loading" } };

export const EmbeddedClinical: Story = {
  args: { dataMode: "clinical", presentation: "embedded" },
};
