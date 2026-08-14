import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const config: StorybookConfig = {
  stories: ["../../../packages/*/src/**/*.stories.tsx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    defaultName: "Documentation",
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@clinical-ui/theme": path.join(root, "packages/theme/src/index.tsx"),
        "@clinical-ui/core": path.join(root, "packages/core/src/index.ts"),
        "@clinical-ui/fhir": path.join(root, "packages/fhir/src/index.ts"),
        "@clinical-ui/testing": path.join(root, "packages/testing/src/index.ts"),
        "@clinical-ui/ophthalmology": path.join(root, "packages/ophthalmology/src/index.ts"),
        "@clinical-ui/ent": path.join(root, "packages/ent/src/index.ts"),
        "@clinical-ui/odontology": path.join(root, "packages/odontology/src/index.ts"),
        "@clinical-ui/dermatology": path.join(root, "packages/dermatology/src/index.ts"),
        "@clinical-ui/cardiology": path.join(root, "packages/cardiology/src/index.ts"),
        "@clinical-ui/pediatrics": path.join(root, "packages/pediatrics/src/index.ts"),
        "@clinical-ui/gynecology-obstetrics": path.join(
          root,
          "packages/gynecology-obstetrics/src/index.ts",
        ),
      },
    };
    return config;
  },
};

export default config;
