import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import type {PromptRequest} from "./engine/request";
import {generateAnimationSpec} from "./generation";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const prompt = process.argv.slice(2).join(" ").trim();

  if (!prompt) {
    console.error('Please provide a prompt. Example: npm run generate -- "A gold bell for a vertical reel"');
    process.exit(1);
  }

  const request: PromptRequest = {prompt};
  const spec = await generateAnimationSpec(request);

  const requestModule = `import type {PromptRequest} from "../engine/request";\n\nexport const GENERATED_REQUEST: PromptRequest = ${JSON.stringify(request, null, 2)};\n`;
  const specModule = `import type {AnimationSpec} from "../engine/types";\n\nexport const GENERATED_SPEC: AnimationSpec = ${JSON.stringify(spec, null, 2)};\n`;

  fs.writeFileSync(path.resolve(currentDir, "./data/generated-request.ts"), requestModule);
  fs.writeFileSync(path.resolve(currentDir, "./data/generated-spec.ts"), specModule);

  console.log("Generated spec written to src/data/generated-request.ts and src/data/generated-spec.ts");
  console.log(
    `Validated output: ${spec.id} | ${spec.canvas.width}x${spec.canvas.height} | ${spec.duration}s | ${spec.elements.length} element(s)`,
  );
};

main().catch((error) => {
  console.error("Failed to generate animation spec:", error);
  process.exit(1);
});
