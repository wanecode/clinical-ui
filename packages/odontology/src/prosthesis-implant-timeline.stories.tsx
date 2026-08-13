import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticProsthesisTimeline } from "./fixtures";
import { ProsthesisImplantTimeline } from "./prosthesis-implant-timeline";

const meta = {
  title: "Odontology/ProsthesisImplantTimeline",
  component: ProsthesisImplantTimeline,
  tags: ["autodocs", "test"],
  args: { tooth: "36", events: syntheticProsthesisTimeline },
  parameters: {
    docs: {
      description: {
        component:
          "Chronologie prothétique et implantaire distinguant étapes validées, reportées et projetées.",
      },
    },
  },
} satisfies Meta<typeof ProsthesisImplantTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImplantPathway: Story = {};
export const NoHistory: Story = { args: { events: [], state: "empty" } };
