import type {PromptRequest} from "../engine/request";
import type {AnimationSpec} from "../engine/types";
import {validateGeneratedSpec} from "../ai/validation";

export const generateWithLocalHeuristics = async (
  request: PromptRequest,
): Promise<AnimationSpec> => {
  // Deterministic: normalize-spec builds a stable AnimationSpec from the prompt + router.
  return validateGeneratedSpec(undefined, request);
};

