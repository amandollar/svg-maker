import "dotenv/config";
import OpenAI from "openai";
import {zodTextFormat} from "openai/helpers/zod";
import type {PromptRequest} from "../engine/request";
import type {AnimationSpec} from "../engine/types";
import {aiAnimationSpecSchema} from "./output-schema";
import {SVG_PARSER_SYSTEM_PROMPT} from "./system-prompt";
import {formatValidationError, validateGeneratedSpec} from "./validation";

const getClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
};

const getModel = () => process.env.OPENAI_MODEL_PARSE || "gpt-4o";
const MAX_PARSE_ATTEMPTS = 3;

const buildUserPrompt = (request: PromptRequest) => {
  return [
    `Prompt: ${request.prompt}`,
    request.canvasFormat ? `Canvas format: ${request.canvasFormat}` : undefined,
    request.templateId ? `Preferred template: ${request.templateId}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
};

const buildRepairInput = (
  request: PromptRequest,
  previousError: string,
  attemptNumber: number,
) => {
  return [
    buildUserPrompt(request),
    `Previous attempt failed validation.`,
    `Attempt: ${attemptNumber}`,
    `Validation error: ${previousError}`,
    `Return a corrected AnimationSpec JSON object that strictly satisfies the schema.`,
  ].join("\n");
};

const requestParsedSpec = async (
  client: OpenAI,
  request: PromptRequest,
  input: string,
) => {
  const response = await client.responses.parse({
    model: getModel(),
    instructions: SVG_PARSER_SYSTEM_PROMPT,
    input,
    text: {
      format: zodTextFormat(aiAnimationSpecSchema, "animation_spec"),
    },
  });

  const parsed = response.output_parsed;

  if (!parsed) {
    throw new Error("OpenAI response did not contain parsed AnimationSpec output.");
  }

  return parsed;
};

export const parsePromptWithOpenAI = async (
  request: PromptRequest,
): Promise<AnimationSpec> => {
  const client = getClient();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_PARSE_ATTEMPTS; attempt += 1) {
    const input =
      attempt === 1
        ? buildUserPrompt(request)
        : buildRepairInput(request, formatValidationError(lastError), attempt);

    try {
      const parsed = await requestParsedSpec(client, request, input);
      return validateGeneratedSpec(parsed, request);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `OpenAI parser failed after ${MAX_PARSE_ATTEMPTS} attempts: ${formatValidationError(lastError)}`,
  );
};
