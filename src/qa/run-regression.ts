import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {generateAnimationSpec} from "../generation";
import {generateWithLocalHeuristics} from "../generation/local";
import {regressionPromptSuite} from "./prompt-suite";

const outputDir = path.resolve(process.cwd(), "artifacts/regression-specs");

const writeSpecModule = (id: string, payload: string) => {
  fs.mkdirSync(outputDir, {recursive: true});
  fs.writeFileSync(path.join(outputDir, `${id}.json`), payload);
};

const main = async () => {
  // Default QA behavior is deterministic and offline (no OpenAI calls).
  // If you want to QA the OpenAI parser, run with QA_USE_OPENAI=1.
  const useOpenAI = process.env.QA_USE_OPENAI === "1";

  for (const entry of regressionPromptSuite) {
    const spec = useOpenAI
      ? await generateAnimationSpec({prompt: entry.prompt})
      : await generateWithLocalHeuristics({prompt: entry.prompt});
    writeSpecModule(entry.id, JSON.stringify(spec, null, 2));
    console.log(
      `[${entry.category}] ${entry.id}: ${spec.canvas.width}x${spec.canvas.height} | ${spec.duration}s | ${spec.elements.length} element(s)`,
    );
  }

  console.log(`Regression specs written to ${outputDir}`);
};

main().catch((error) => {
  console.error("Failed to run regression suite:", error);
  process.exit(1);
});
