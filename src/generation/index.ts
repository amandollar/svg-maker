import type {PromptRequest} from "../engine/request";
import type {AnimationSpec} from "../engine/types";
import {generateDeterministicAnimationSpec} from "./deterministic";

export const generateAnimationSpec = async (
  request: PromptRequest,
): Promise<AnimationSpec> => {
  // Single production pipeline:
  // Prompt -> (optional OpenAI MotionSpec refinement) -> deterministic compiler -> AnimationSpec.
  // This keeps outputs stable while still letting prompts drive style/layout/motion via MotionSpec.
  return generateDeterministicAnimationSpec(request);
};
