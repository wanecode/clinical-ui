import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Clinical UI · FHIR R5",
    brandUrl: "https://wanecode.github.io/clinical-ui/",
    colorPrimary: "#176b73",
    colorSecondary: "#287f88",
    appBg: "#f4f7f6",
    appContentBg: "#ffffff",
    appBorderColor: "#d9e1df",
    appBorderRadius: 8,
    fontBase: '"Source Sans 3 Variable", sans-serif',
    fontCode: '"IBM Plex Mono Variable", monospace',
  }),
});
