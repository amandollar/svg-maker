import "dotenv/config";
import OpenAI from "openai";
import {zodTextFormat} from "openai/helpers/zod";
import type {PromptRequest} from "../engine/request";
import type {MotionSpec} from "./schema";
import {motionSpecSchema} from "./schema";
import {MOTION_SPEC_SYSTEM_PROMPT} from "../ai/motion-spec-system-prompt";

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
};

const getModel = () => process.env.OPENAI_MODEL_MOTION_SPEC || "gpt-4o";
const MAX_ATTEMPTS = 2;
const isDebug = () => process.env.OPENAI_DEBUG === "1";

const buildInput = (request: PromptRequest, base: MotionSpec) => {
  return [
    `Prompt: ${request.prompt}`,
    "",
    "Base MotionSpec (refine timing/canvas/style; you may change template only if the prompt clearly indicates it):",
    JSON.stringify(base, null, 2),
  ].join("\n");
};

export const refineMotionSpecWithOpenAI = async (
  request: PromptRequest,
  base: MotionSpec,
): Promise<MotionSpec> => {
  // Gate behind an explicit env flag so we don't accidentally introduce API dependence.
  if (process.env.OPENAI_ENABLE_MOTION_SPEC !== "1") {
    if (isDebug()) {
      console.log("[openai:motion-spec] skipped (OPENAI_ENABLE_MOTION_SPEC != 1)");
    }
    return base;
  }

  const client = getClient();
  if (!client) {
    if (isDebug()) {
      console.log("[openai:motion-spec] skipped (OPENAI_API_KEY missing/empty)");
    }
    return base;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      if (isDebug()) {
        console.log(
          `[openai:motion-spec] calling model=${getModel()} attempt=${attempt} allowTemplate=${
            process.env.OPENAI_MOTION_SPEC_ALLOW_TEMPLATE === "1" ? "1" : "0"
          }`,
        );
      }
      const response = await client.responses.parse({
        model: getModel(),
        instructions: MOTION_SPEC_SYSTEM_PROMPT,
        input: buildInput(request, base),
        text: {
          format: zodTextFormat(motionSpecSchema, "motion_spec"),
        },
      });

      const parsed = response.output_parsed;
      if (!parsed) {
        throw new Error("OpenAI response did not contain parsed MotionSpec output.");
      }

      if (isDebug()) {
        const rid = (response as unknown as {id?: string}).id;
        console.log("[openai:motion-spec] response id:", rid ?? "(unknown)");
        console.log("[openai:motion-spec] parsed:", {
          template: parsed.template,
          canvas: parsed.canvas,
          timing: parsed.timing,
          style: parsed.style,
          notes: parsed.notes,
        });
      }

      // Optional guard: some teams prefer keeping template routing fully deterministic.
      // For this project, allowing template changes makes prompts feel more "natural-language driven".
      if (process.env.OPENAI_MOTION_SPEC_ALLOW_TEMPLATE !== "1" && parsed.template !== base.template) {
        if (isDebug()) {
          console.log(
            `[openai:motion-spec] template override blocked: parsed=${parsed.template} base=${base.template}`,
          );
        }
        return {
          ...parsed,
          template: base.template,
          notes: `${parsed.notes} | template-forced`,
        };
      }

      return parsed;
    } catch (error) {
      lastError = error;
      if (isDebug()) {
        console.log("[openai:motion-spec] attempt failed:", (error as Error)?.message ?? String(error));
      }
    }
  }

  // Fail soft: keep base spec if refinement fails.
  if (isDebug()) {
    console.log("[openai:motion-spec] refine failed; falling back to base MotionSpec");
  }
  return {
    ...base,
    notes: `${base.notes} | refine-failed`,
  };
};
