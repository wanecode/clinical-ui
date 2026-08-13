import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { EndodonticWorkbench } from "./endodontic-workbench";
import { syntheticEndodonticCanals } from "./fixtures";

const meta = {
  title: "Odontology/EndodonticWorkbench",
  component: EndodonticWorkbench,
  tags: ["autodocs", "test"],
  args: { tooth: "16", canals: syntheticEndodonticCanals },
  parameters: {
    docs: {
      description: {
        component:
          "Mesures canalaires éditables séparant explicitement longueurs observées et valeurs projetées.",
      },
    },
  },
} satisfies Meta<typeof EndodonticWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CanalMeasurements: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Longueur observée MV1");
    await userEvent.clear(input);
    await userEvent.type(input, "19.4");
    await expect(input).toHaveValue(19.4);
    await expect(canvas.getAllByText("Projeté", { selector: ".od-evidence" })[0]).toBeVisible();
  },
};

export const Loading: Story = { args: { state: "loading" } };
