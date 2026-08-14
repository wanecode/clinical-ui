import { spawn } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import process from "node:process";

const packageNames = [
  "theme",
  "core",
  "fhir",
  "testing",
  "ophthalmology",
  "ent",
  "odontology",
  "dermatology",
  "cardiology",
  "pediatrics",
  "gynecology-obstetrics",
];
const styledPackageNames = [
  "theme",
  "core",
  "ophthalmology",
  "ent",
  "odontology",
  "dermatology",
  "cardiology",
  "pediatrics",
  "gynecology-obstetrics",
];
const releaseArgument = process.argv.slice(2).find((argument) => argument !== "--");
const releaseDirectory = resolve(releaseArgument ?? "");

if (!releaseArgument) {
  throw new Error("Usage: node scripts/smoke-release.mjs <release-directory>");
}

const archives = (await readdir(releaseDirectory))
  .filter((file) => file.endsWith(".tgz"))
  .map((file) => resolve(releaseDirectory, file))
  .sort();

if (archives.length !== packageNames.length) {
  throw new Error(`Expected ${packageNames.length} archives, found ${archives.length}.`);
}

for (const packageName of packageNames) {
  if (!archives.some((archive) => basename(archive).startsWith(`clinical-ui-${packageName}-`))) {
    throw new Error(`Missing archive for @clinical-ui/${packageName}.`);
  }
}

const consumerDirectory = await mkdtemp(join(tmpdir(), "clinical-ui-consumer-"));
const runCommand = (command, args) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: consumerDirectory,
      stdio: "inherit",
      shell: false,
    });
    child.once("error", rejectPromise);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`${command} exited with status ${code ?? signal}.`));
      }
    });
  });

try {
  await writeFile(
    join(consumerDirectory, "package.json"),
    `${JSON.stringify({ name: "clinical-ui-release-smoke", private: true, type: "module" }, null, 2)}\n`,
  );
  await runCommand("npm", [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "react@19.2.8",
    "react-dom@19.2.8",
    ...archives,
  ]);
  await writeFile(
    join(consumerDirectory, "smoke.mjs"),
    `
      import { access } from "node:fs/promises";
      import { fileURLToPath } from "node:url";

      const packageNames = ${JSON.stringify(packageNames)};
      const styledPackageNames = ${JSON.stringify(styledPackageNames)};

      for (const packageName of packageNames) {
        const imported = await import(\`@clinical-ui/\${packageName}\`);
        if (Object.keys(imported).length === 0) {
          throw new Error(\`@clinical-ui/\${packageName} has no runtime exports.\`);
        }
        process.stdout.write(
          \`consumer-import @clinical-ui/\${packageName} \${Object.keys(imported).length}\\n\`,
        );
      }

      for (const packageName of styledPackageNames) {
        const styleUrl = import.meta.resolve(\`@clinical-ui/\${packageName}/styles.css\`);
        await access(fileURLToPath(styleUrl));
        process.stdout.write(\`consumer-style @clinical-ui/\${packageName}/styles.css\\n\`);
      }
    `,
  );
  await runCommand("node", ["smoke.mjs"]);
} finally {
  await rm(consumerDirectory, { recursive: true, force: true });
}
