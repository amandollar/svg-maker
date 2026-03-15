import {ZodError} from "zod";
import {animationSpecSchema, type AnimationSpec} from "../engine/types";
import {normalizeGeneratedSpec} from "./normalize-spec";
import type {PromptRequest} from "../engine/request";

const stripNulls = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripNulls);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== null)
        .map(([key, entryValue]) => [key, stripNulls(entryValue)]),
    );
  }

  return value;
};

export const validateGeneratedSpec = (
  candidate: unknown,
  request: PromptRequest,
): AnimationSpec => {
  const normalized = normalizeGeneratedSpec(stripNulls(candidate), request);
  return animationSpecSchema.parse(normalized);
};

export const formatValidationError = (error: unknown): string => {
  if (error instanceof ZodError) {
    return JSON.stringify(error.issues, null, 2);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};
