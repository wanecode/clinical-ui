import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { DentalImagingContext } from "./dental-imaging-context";
import { syntheticDentalImages } from "./fixtures";

const meta = {
  title: "Odontology/DentalImagingContext",
  component: DentalImagingContext,
  tags: ["autodocs", "test"],
  args: { images: syntheticDentalImages, dataMode: "synthetic" },
  parameters: {
    docs: {
      description: {
        component:
          "Contexte d'imagerie sur surface neutre, avec modalité, région et provenance toujours associées à l'aperçu synthétique.",
      },
    },
  },
} satisfies Meta<typeof DentalImagingContext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultimodalContext: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cbct = canvas.getByRole("button", { name: /Coupe CBCT 36/ });
    await userEvent.click(cbct);
    await expect(cbct).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("img", { name: /CBCT entièrement synthétique/ })).toBeVisible();
  },
};

export const EmbeddedClinical: Story = { args: { dataMode: "clinical", presentation: "embedded" } };

export const AcquisitionError: Story = { args: { state: "error" } };
