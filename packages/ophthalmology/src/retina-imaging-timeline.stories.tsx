import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { syntheticRetinaCareEvents, syntheticRetinaImages } from "./fixtures";
import { RetinaImagingTimeline } from "./retina-imaging-timeline";

const retinaImageAssets = {
  "oct-2026-od": new URL("./assets/oct-od-current-synthetic.png", import.meta.url).href,
  "oct-2026-og": new URL("./assets/oct-og-current-low-signal-synthetic.png", import.meta.url).href,
  "oct-2025-od": new URL("./assets/oct-od-prior-synthetic.png", import.meta.url).href,
} as const;

const storyRetinaImages = syntheticRetinaImages.map((image) => {
  const imageUrl = retinaImageAssets[image.id as keyof typeof retinaImageAssets];
  return imageUrl
    ? {
        ...image,
        imageUrl,
        imageAlt:
          image.id === "oct-2026-og"
            ? `OCT synthétique ${image.eye} du ${image.date}, signal réduit et artéfact de mouvement simulé`
            : `OCT synthétique ${image.eye} du ${image.date}, coupe maculaire simulée`,
      }
    : image;
});

const meta = {
  title: "Ophthalmology/RetinaImagingTimeline",
  component: RetinaImagingTimeline,
  tags: ["autodocs", "test"],
  args: {
    images: storyRetinaImages,
    careEvents: syntheticRetinaCareEvents,
    dataMode: "synthetic",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Comparateur OCT/fundus synthétique avec qualité, indisponibilité et provenance toujours visibles.",
      },
    },
  },
} satisfies Meta<typeof RetinaImagingTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Comparaison: Story = {};

export const NavigationClavierEtTable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const options = canvas.getAllByRole("option");
    const firstOption = options.at(0);
    if (!firstOption) throw new Error("Premier examen d’imagerie introuvable");
    firstOption.focus();
    await userEvent.keyboard("{ArrowRight}");
    const secondOption = options.at(1);
    if (!secondOption) throw new Error("Deuxième examen d’imagerie introuvable");
    await expect(secondOption).toHaveAttribute("aria-selected", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Afficher la liste accessible" }));
    await expect(
      canvas.getByRole("table", { name: "Inventaire d’imagerie synthétique" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Masquer la liste accessible" }));
    secondOption.focus();
    await userEvent.keyboard("{Home}");
    await expect(firstOption).toHaveAttribute("aria-selected", "true");
  },
};

export const QualiteInsuffisante: Story = { args: { initialImageId: "oct-2026-og" } };
export const Indisponible: Story = { args: { initialImageId: "fundus-2025-og" } };
export const ProvenancePartielle: Story = {
  args: {
    state: "partial",
    images: storyRetinaImages.map((image, index) =>
      index === 0 ? { ...image, source: "Source non résolue" } : image,
    ),
  },
};

export const EmbarqueSansApercuTransmis: Story = {
  args: {
    presentation: "embedded",
    dataMode: "clinical",
    state: "partial",
    images: syntheticRetinaImages,
  },
};
