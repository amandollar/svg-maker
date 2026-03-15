import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {generateAnimationSpec} from "../generation";
import {regressionPromptSuite} from "./prompt-suite";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(currentDir, "../../artifacts/regression-specs");

const writeSpecModule = (id: string, payload: string) => {
  fs.mkdirSync(outputDir, {recursive: true});
  fs.writeFileSync(path.join(outputDir, `${id}.json`), payload);
};

const main = async () => {
  for (const entry of regressionPromptSuite) {
    const spec = await generateAnimationSpec({prompt: entry.prompt});
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
