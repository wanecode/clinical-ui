import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const workspaceDirectory = path.dirname(fileURLToPath(import.meta.url));
const storybookDirectory = path.join(workspaceDirectory, "apps/storybook");
const storybookConfigDirectory = path.join(workspaceDirectory, "apps/storybook/.storybook");

const themeProjects = [
  { mode: "light", palette: "clinical" },
  { mode: "light", palette: "ocean" },
  { mode: "light", palette: "sage" },
  { mode: "dark", palette: "clinical" },
  { mode: "dark", palette: "ocean" },
  { mode: "dark", palette: "sage" },
] as const;

export default defineConfig({
  test: {
    projects: themeProjects.map(({ mode, palette }) => ({
      extends: true,
      root: storybookDirectory,
      plugins: [
        storybookTest({
          configDir: storybookConfigDirectory,
          initialGlobals: { mode, palette },
        }),
      ],
      test: {
        name: `storybook-${mode}-${palette}`,
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{ browser: "chromium" }],
        },
      },
    })),
  },
});
