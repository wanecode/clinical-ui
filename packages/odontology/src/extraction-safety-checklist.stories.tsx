import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ExtractionSafetyChecklist } from "./extraction-safety-checklist";
import { syntheticExtractionSafetyItems } from "./fixtures";

const meta = {
  title: "Odontology/ExtractionSafetyChecklist",
  component: ExtractionSafetyChecklist,
  tags: ["autodocs", "test"],
  args: { tooth: "36", items: syntheticExtractionSafetyItems },
  parameters: {
    docs: {
      description: {
        component:
          "Checklist préopératoire interactive : les contrôles critiques non documentés empêchent la validation.",
      },
    },
  },
} satisfies Meta<typeof ExtractionSafetyChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IncompleteCriticalGate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const consent = canvas.getByRole("checkbox", { name: /Consentement éclairé obtenu/ });
    const hemostasis = canvas.getByRole("checkbox", { name: /Plan d'hémostase prêt/ });
    const action = canvas.getByRole("button", { name: "Valider la sécurité préopératoire" });
    await expect(action).toBeDisabled();
    await userEvent.click(consent);
    await userEvent.click(hemostasis);
    await expect(action).toBeEnabled();
    await expect(canvas.getByText("Checklist complète")).toBeVisible();
  },
};

export const Complete: Story = {
  args: { items: syntheticExtractionSafetyItems.map((item) => ({ ...item, checked: true })) },
};

export const Forbidden: Story = { args: { state: "forbidden" } };
