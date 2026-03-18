import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import type {PromptRequest} from "../engine/request";
import {generateAnimationSpec} from "../generation";
import {getPhase1PromptBlock} from "./load";

const main = async () => {
  const arg = (process.argv[2] ?? "").trim();
  if (!arg) {
    console.error('Please provide a Phase 1 prompt number. Example: npm.cmd run phase1:generate -- 001');
    process.exit(1);
  }

  const block = getPhase1PromptBlock(arg);
  const request: PromptRequest = {prompt: block.text};
  const spec = await generateAnimationSpec(request);

  const requestModule = `import type {PromptRequest} from "../engine/request";\n\nexport const GENERATED_REQUEST: PromptRequest = ${JSON.stringify(request, null, 2)};\n`;
  const specModule = `import type {AnimationSpec} from "../engine/types";\n\nexport const GENERATED_SPEC: AnimationSpec = ${JSON.stringify(spec, null, 2)};\n`;

  fs.writeFileSync(path.resolve(process.cwd(), "src/data/generated-request.ts"), requestModule);
  fs.writeFileSync(path.resolve(process.cwd(), "src/data/generated-spec.ts"), specModule);

  console.log(`Phase 1 prompt ${block.number}: ${block.title}`);
  console.log("Generated spec written to src/data/generated-request.ts and src/data/generated-spec.ts");
  console.log(
    `Validated output: ${spec.id} | ${spec.canvas.width}x${spec.canvas.height} | ${spec.duration}s | ${spec.elements.length} element(s)`,
  );
};

main().catch((error) => {
  console.error("Failed to generate Phase 1 animation spec:", error);
  process.exit(1);
});
