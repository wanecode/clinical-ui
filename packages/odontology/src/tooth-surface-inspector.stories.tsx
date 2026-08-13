import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticTeeth } from "./fixtures";
import { ToothSurfaceInspector } from "./tooth-surface-inspector";

const tooth16 = syntheticTeeth.find((tooth) => tooth.fdi === "16");
if (!tooth16) throw new Error("The synthetic FDI 16 fixture is required by this story.");

const meta = {
  title: "Odontology/ToothSurfaceInspector",
  component: ToothSurfaceInspector,
  tags: ["autodocs", "test"],
  args: { tooth: tooth16, selectedSurface: "occlusal" },
  parameters: {
    docs: {
      description: {
        component:
          "Topologie des cinq faces d'une dent et tableau équivalent, sans dépendance à la couleur ou au survol.",
      },
    },
  },
} satisfies Meta<typeof ToothSurfaceInspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SurfaceSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const distal = canvas.getByRole("button", { name: /Distale/ });
    await userEvent.click(distal);
    await expect(distal).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("heading", { name: "Distale" })).toBeVisible();
  },
};

export const Empty: Story = { args: { state: "empty" } };
