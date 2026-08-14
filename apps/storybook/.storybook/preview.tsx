import "@fontsource-variable/source-sans-3";
import "@fontsource/ibm-plex-mono";
import "../../../packages/theme/src/styles.css";
import "../../../packages/core/src/styles.css";
import "../../../packages/ophthalmology/src/styles.css";
import "../../../packages/ent/src/styles.css";
import "../../../packages/odontology/src/styles.css";
import "../../../packages/dermatology/src/styles.css";
import "../../../packages/cardiology/src/styles.css";
import "../../../packages/pediatrics/src/styles.css";
import "../../../packages/gynecology-obstetrics/src/styles.css";
import { ClinicalThemeScope } from "@clinical-ui/theme";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  tags: ["autodocs", "test"],
  globalTypes: {
    palette: {
      description: "Clinical UI palette",
      defaultValue: "clinical",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "clinical", title: "Clinique" },
          { value: "ocean", title: "Océan" },
          { value: "sage", title: "Sauge" },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Color mode",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Clair" },
          { value: "dark", title: "Sombre" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ClinicalThemeScope
        fillViewport
        mode={context.globals.mode}
        palette={context.globals.palette}
      >
        <div style={{ minHeight: "100vh", padding: "clamp(1rem, 2vw, 2rem)" }}>
          <Story />
        </div>
      </ClinicalThemeScope>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
    },
    options: {
      storySort: {
        order: [
          "Foundations",
          "Core",
          "FHIR",
          "Ophthalmology",
          "ORL",
          "Odontology",
          "Dermatology",
          "Cardiology",
          "Pediatrics",
          "Gynecology Obstetrics",
          "Workbenches",
        ],
      },
    },
  },
};

export default preview;
