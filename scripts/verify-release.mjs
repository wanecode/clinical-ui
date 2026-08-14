import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const repositoryRoot = resolve(import.meta.dirname, "..");
const repositoryUrl = "git+https://github.com/wanecode/clinical-ui.git";
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

const readManifest = async (path) =>
  JSON.parse(await readFile(resolve(repositoryRoot, path), "utf8"));

const rootManifest = await readManifest("package.json");
const expectedVersion = process.argv[2] ?? rootManifest.version;

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(expectedVersion)) {
  throw new Error(`Invalid release version: ${expectedVersion}`);
}

if (!rootManifest.private) {
  throw new Error("The workspace root must stay private.");
}

if (rootManifest.version !== expectedVersion) {
  throw new Error(`Workspace version ${rootManifest.version} does not match ${expectedVersion}.`);
}

for (const packageName of packageNames) {
  const packageDirectory = resolve(repositoryRoot, "packages", packageName);
  const manifest = await readManifest(`packages/${packageName}/package.json`);
  const expectedName = `@clinical-ui/${packageName}`;

  if (manifest.name !== expectedName) {
    throw new Error(`${packageName}: expected package name ${expectedName}.`);
  }
  if (manifest.version !== expectedVersion) {
    throw new Error(
      `${manifest.name}: version ${manifest.version} does not match ${expectedVersion}.`,
    );
  }
  if (manifest.private !== false) {
    throw new Error(`${manifest.name}: package must be explicitly public.`);
  }
  if (manifest.license !== "Apache-2.0") {
    throw new Error(`${manifest.name}: expected Apache-2.0 license.`);
  }
  if (manifest.repository?.url !== repositoryUrl) {
    throw new Error(`${manifest.name}: repository URL does not match the public source.`);
  }
  if (manifest.publishConfig?.access !== "public" || manifest.publishConfig?.provenance !== true) {
    throw new Error(`${manifest.name}: public provenance publishing is required.`);
  }

  for (const [dependency, range] of Object.entries(manifest.dependencies ?? {})) {
    if (dependency.startsWith("@clinical-ui/") && range !== "workspace:*") {
      throw new Error(`${manifest.name}: internal dependency ${dependency} must use workspace:*`);
    }
  }

  for (const exportedTarget of Object.values(manifest.exports ?? {})) {
    const targets =
      typeof exportedTarget === "string" ? [exportedTarget] : Object.values(exportedTarget);
    for (const target of targets) {
      await access(resolve(packageDirectory, target));
    }
  }

  process.stdout.write(`release-ready ${manifest.name}@${manifest.version}\n`);
}
