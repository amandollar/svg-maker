import "dotenv/config";
import type {PromptRequest} from "./engine/request";
import {generateBaseMotionSpec} from "./motion-spec/generate";
import {refineMotionSpecWithOpenAI} from "./motion-spec/refine-with-openai";

const main = async () => {
  const prompt = process.argv.slice(2).join(" ").trim();

  if (!prompt) {
    console.error('Please provide a prompt. Example: npm.cmd run generate:motion -- "Rocket launch, 4.5s"');
    process.exit(1);
  }

  const request: PromptRequest = {prompt};
  const base = generateBaseMotionSpec(request);
  const refined = await refineMotionSpecWithOpenAI(request, base);

  process.stdout.write(`${JSON.stringify(refined, null, 2)}\n`);
};

main().catch((error) => {
  console.error("Failed to generate MotionSpec JSON:", error);
  process.exit(1);
});

