import "dotenv/config";
import type {PromptRequest} from "./engine/request";
import {generateAnimationSpec} from "./generation";

const main = async () => {
  const prompt = process.argv.slice(2).join(" ").trim();

  if (!prompt) {
    console.error('Please provide a prompt. Example: npm.cmd run generate:json -- "A pulsing heart"');
    process.exit(1);
  }

  const request: PromptRequest = {prompt};
  const spec = await generateAnimationSpec(request);

  // Print JSON to stdout so this can be piped/redirected easily.
  process.stdout.write(`${JSON.stringify(spec, null, 2)}\n`);
};

main().catch((error) => {
  console.error("Failed to generate animation spec JSON:", error);
  process.exit(1);
});

