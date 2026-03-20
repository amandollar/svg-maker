import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {execSync} from "node:child_process";
import type {AnimationSpec} from "../engine/types";
import type {PromptRequest} from "../engine/request";
import {generateAnimationSpec} from "../generation";
import {generateWithLocalHeuristics} from "../generation/local";
import {regressionPromptSuite} from "./prompt-suite";

const outputDir = path.resolve(process.cwd(), "out/scene-qa");
const generatedRequestPath = path.resolve(process.cwd(), "src/data/generated-request.ts");
const generatedSpecPath = path.resolve(process.cwd(), "src/data/generated-spec.ts");

const writeGeneratedModules = (request: PromptRequest, spec: AnimationSpec) => {
  const requestModule = `import type {PromptRequest} from "../engine/request";\n\nexport const GENERATED_REQUEST: PromptRequest = ${JSON.stringify(request, null, 2)};\n`;
  const specModule = `import type {AnimationSpec} from "../engine/types";\n\nexport const GENERATED_SPEC: AnimationSpec = ${JSON.stringify(spec, null, 2)};\n`;

  fs.writeFileSync(generatedRequestPath, requestModule);
  fs.writeFileSync(generatedSpecPath, specModule);
};

const getFrames = (spec: AnimationSpec) => {
  const durationInFrames = Math.max(1, Math.round(spec.duration * spec.fps));
  const candidates = [
    Math.max(0, Math.round(durationInFrames * 0.15)),
    Math.max(0, Math.round(durationInFrames * 0.5)),
    Math.max(0, durationInFrames - 2),
  ];

  return Array.from(new Set(candidates)).sort((a, b) => a - b);
};

const main = async () => {
  const requestedIds = new Set(process.argv.slice(2).map((value) => value.trim()).filter(Boolean));
  const useOpenAI = process.env.QA_USE_OPENAI === "1";
  const entries = regressionPromptSuite.filter((entry) => entry.category === "scene" && (requestedIds.size === 0 || requestedIds.has(entry.id)));

  if (entries.length === 0) {
    console.error("No scene regression prompts matched the requested ids.");
    process.exit(1);
  }

  fs.mkdirSync(outputDir, {recursive: true});

  for (const entry of entries) {
    const request: PromptRequest = {prompt: entry.prompt};
    const spec = useOpenAI ? await generateAnimationSpec(request) : await generateWithLocalHeuristics(request);
    writeGeneratedModules(request, spec);

    const promptDir = path.join(outputDir, entry.id);
    fs.mkdirSync(promptDir, {recursive: true});

    for (const frame of getFrames(spec)) {
      const outFile = path.join(promptDir, `${entry.id}-f${String(frame).padStart(3, "0")}.png`);
      execSync(`npx remotion still src/index.ts generated-prompt "${outFile}" --frame=${frame}`, {stdio: "inherit"});
      console.log(`[scene-qa] ${entry.id} frame ${frame} -> ${outFile}`);
    }
  }

  console.log(`Scene preview stills written to ${outputDir}`);
};

main().catch((error) => {
  console.error("Failed to render scene previews:", error);
  process.exit(1);
});
