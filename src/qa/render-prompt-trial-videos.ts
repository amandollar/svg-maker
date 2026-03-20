import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {execSync} from "node:child_process";
import type {AnimationSpec} from "../engine/types";
import type {PromptRequest} from "../engine/request";
import {generateAnimationSpec} from "../generation";
import {generateWithLocalHeuristics} from "../generation/local";
import {promptTrialSuite} from "./prompt-trial-suite";

const outputDir = path.resolve(process.cwd(), "out/prompt-trial-videos");
const generatedRequestPath = path.resolve(process.cwd(), "src/data/generated-request.ts");
const generatedSpecPath = path.resolve(process.cwd(), "src/data/generated-spec.ts");

const writeGeneratedModules = (request: PromptRequest, spec: AnimationSpec) => {
  const requestModule = `import type {PromptRequest} from "../engine/request";\n\nexport const GENERATED_REQUEST: PromptRequest = ${JSON.stringify(request, null, 2)};\n`;
  const specModule = `import type {AnimationSpec} from "../engine/types";\n\nexport const GENERATED_SPEC: AnimationSpec = ${JSON.stringify(spec, null, 2)};\n`;

  fs.writeFileSync(generatedRequestPath, requestModule);
  fs.writeFileSync(generatedSpecPath, specModule);
};

const main = async () => {
  const requestedIds = new Set(process.argv.slice(2).map((value) => value.trim()).filter(Boolean));
  const useOpenAI = process.env.QA_USE_OPENAI === "1";
  const entries = promptTrialSuite.filter((entry) => requestedIds.size === 0 || requestedIds.has(entry.id));

  if (entries.length === 0) {
    console.error("No prompt trials matched the requested ids.");
    process.exit(1);
  }

  fs.mkdirSync(outputDir, {recursive: true});

  for (const entry of entries) {
    const request: PromptRequest = {prompt: entry.prompt};
    const spec = useOpenAI ? await generateAnimationSpec(request) : await generateWithLocalHeuristics(request);
    writeGeneratedModules(request, spec);

    const promptDir = path.join(outputDir, entry.id);
    fs.mkdirSync(promptDir, {recursive: true});

    const outFile = path.join(promptDir, `${entry.id}.mp4`);
    execSync(`npx remotion render src/index.ts generated-prompt "${outFile}" --codec=h264 --audio-codec=aac`, {stdio: "inherit"});
    console.log(`[prompt-trial-video] ${entry.id} -> ${outFile}`);
  }

  console.log(`Prompt trial videos written to ${outputDir}`);
};

main().catch((error) => {
  console.error("Failed to render prompt trial videos:", error);
  process.exit(1);
});
