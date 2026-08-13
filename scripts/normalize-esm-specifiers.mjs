import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import process from "node:process";

const outputDirectory = resolve(process.cwd(), process.argv[2] ?? "dist");
const relativeSpecifier = /((?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["'])(\.\.?\/[^"'?#]+)(["'])/g;

const files = [];
const collectFiles = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(path);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts")) {
      files.push(path);
    }
  }
};

await collectFiles(outputDirectory);

let replacements = 0;
for (const file of files) {
  const source = await readFile(file, "utf8");
  const normalized = source.replace(relativeSpecifier, (match, prefix, specifier, suffix) => {
    if (extname(specifier)) {
      return match;
    }
    replacements += 1;
    return `${prefix}${specifier}.js${suffix}`;
  });

  if (normalized !== source) {
    await writeFile(file, normalized);
  }
}

process.stdout.write(
  `normalized ${replacements} ESM specifier${replacements === 1 ? "" : "s"} in ${outputDirectory}\n`,
);
