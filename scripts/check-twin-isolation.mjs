#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");
const TWIN_APP_FILE = path.join(APP_DIR, "twin", "page.tsx");
const TWIN_COMPONENTS_DIR = path.join(ROOT, "src", "components", "versions", "twin");

const errors = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function readImports(file) {
  const src = fs.readFileSync(file, "utf8");
  const imports = [];
  const re = /from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) imports.push(m[1]);
  return imports;
}

function rel(p) {
  return path.relative(ROOT, p);
}

function checkTwinFilesOnlyUseTwinUiAndSections(file) {
  const imports = readImports(file);
  for (const i of imports) {
    if (i.startsWith("@/components/ui/") || i.startsWith("@/components/sections/")) {
      errors.push(`${rel(file)} imports shared component layer: ${i}`);
    }
    if (i.startsWith("@/components/versions/") && !i.startsWith("@/components/versions/twin/")) {
      errors.push(`${rel(file)} imports another version namespace: ${i}`);
    }
  }
}

function checkNonTwinPagesDoNotImportTwin(file) {
  const imports = readImports(file);
  for (const i of imports) {
    if (i.startsWith("@/components/versions/twin/")) {
      errors.push(`${rel(file)} imports twin namespace: ${i}`);
    }
  }
}

function main() {
  if (!fs.existsSync(TWIN_APP_FILE) || !fs.existsSync(TWIN_COMPONENTS_DIR)) {
    console.log("Twin route/components not present; skipping twin isolation check.");
    process.exit(0);
  }

  const twinFiles = [TWIN_APP_FILE, ...walk(TWIN_COMPONENTS_DIR)];
  for (const file of twinFiles) checkTwinFilesOnlyUseTwinUiAndSections(file);

  const appPageFiles = walk(APP_DIR).filter((f) => f.endsWith("page.tsx"));
  for (const pageFile of appPageFiles) {
    if (pageFile === TWIN_APP_FILE) continue;
    checkNonTwinPagesDoNotImportTwin(pageFile);
  }

  if (errors.length) {
    console.error("Twin isolation check failed:");
    for (const e of errors) console.error(`- ${e}`);
    process.exit(1);
  }

  console.log("Twin isolation check passed.");
}

main();
