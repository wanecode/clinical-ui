import type { Meta, StoryObj } from "@storybook/react-vite";
import { syntheticPregnancyEpisode } from "./fixtures";
import "./styles.css";
import { PregnancyEpisodeContext } from "./workbenches";

const meta = {
  title: "Gynecology Obstetrics/PregnancyEpisodeContext",
  component: PregnancyEpisodeContext,
  tags: ["autodocs", "test"],
  args: { episode: syntheticPregnancyEpisode, dataMode: "synthetic" },
} satisfies Meta<typeof PregnancyEpisodeContext>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Nominal: Story = {};
export const DatationAbsente: Story = { args: { episode: null } };
export const Chargement: Story = { args: { state: "loading" } };
