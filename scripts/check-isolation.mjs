import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = realpathSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
);
const ignoredDirectories = new Set([
  ".artifacts",
  ".git",
  ".pnpm-store",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
  "test-results",
]);
const sourceExtensions = new Set([".js", ".mjs", ".ts", ".tsx"]);
const failures = [];
let inspectedSources = 0;
let inspectedManifests = 0;

function isInsideWorkspace(candidate) {
  const relative = path.relative(workspaceRoot, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(absolutePath);
      continue;
    }
    if (!entry.isFile()) continue;

    if (entry.name === "package.json") {
      inspectedManifests += 1;
      const manifest = JSON.parse(readFileSync(absolutePath, "utf8"));
      for (const field of [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies",
      ]) {
        for (const dependency of Object.keys(manifest[field] ?? {})) {
          if (dependency.startsWith("@ecomed/")) {
            failures.push(`${path.relative(workspaceRoot, absolutePath)} depends on ${dependency}`);
          }
        }
      }
    }

    if (!sourceExtensions.has(path.extname(entry.name))) continue;
    inspectedSources += 1;
    const source = readFileSync(absolutePath, "utf8");
    const importPattern = /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g;
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      if (!specifier?.startsWith(".")) continue;
      const resolved = path.resolve(path.dirname(absolutePath), specifier);
      if (!isInsideWorkspace(resolved)) {
        failures.push(
          `${path.relative(workspaceRoot, absolutePath)} imports outside Clinical UI: ${specifier}`,
        );
      }
    }
  }
}

visit(workspaceRoot);

const repositoryRoot = realpathSync(
  execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: workspaceRoot,
    encoding: "utf8",
  }).trim(),
);

if (repositoryRoot !== workspaceRoot) {
  let baseRef;
  try {
    baseRef = execFileSync("git", ["merge-base", "main", "HEAD"], {
      cwd: repositoryRoot,
      encoding: "utf8",
    }).trim();
  } catch {
    baseRef = undefined;
  }

  const gitCommands = [
    ...(baseRef ? [["diff", "--name-only", baseRef, "--"]] : []),
    ["diff", "--name-only", "--"],
    ["diff", "--cached", "--name-only", "--"],
    ["ls-files", "--others", "--exclude-standard"],
  ];
  const changedPaths = new Set(
    gitCommands.flatMap((args) =>
      execFileSync("git", args, { cwd: repositoryRoot, encoding: "utf8" })
        .split("\n")
        .filter(Boolean),
    ),
  );

  for (const changedPath of changedPaths) {
    if (!changedPath.startsWith("clinical-ui/")) {
      failures.push(`Git change escapes clinical-ui/: ${changedPath}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Clinical UI isolation check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Clinical UI isolation verified (${inspectedSources} source files, ${inspectedManifests} manifests).`,
);
