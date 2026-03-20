import fs from "node:fs";
import path from "node:path";
import {execSync} from "node:child_process";
import {getPhase1Prompts} from "./load";

const outDir = path.resolve(process.cwd(), "out/phase1");
fs.mkdirSync(outDir, {recursive: true});

// Make sure dist files exist. If you run this via npm script, the build step should already have run.
// But this gives a helpful error if not.
const distEntry = path.resolve(process.cwd(), "dist/phase1/generate.js");
if (!fs.existsSync(distEntry)) {
  console.error("Expected build output not found. Run `npm run build:node` first.");
  process.exit(1);
}

const prompts = Array.from(getPhase1Prompts().keys()).sort();

for (const promptNumber of prompts) {
  console.log(`\n=== Rendering prompt ${promptNumber} ===`);

  // Generate spec for this prompt
  execSync(`node dist/phase1/generate.js ${promptNumber}`, {stdio: "inherit"});

  // Render the generated spec using Remotion.
  const outFile = path.join(outDir, `phase1-${promptNumber}.mp4`);

  // IMPORTANT: This command can take time depending on the prompt duration and machine speed.
  execSync(
    `npx remotion render src/index.ts generated-prompt ${outFile}`,
    {stdio: "inherit"},
  );
}

console.log(`\n✅ Finished rendering all Phase 1 prompts. Files are in: ${outDir}`);
