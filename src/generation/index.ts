import type {PromptRequest} from "../engine/request";
import type {AnimationSpec} from "../engine/types";
import {generateWithOpenAI} from "./providers/openai";

export const generateAnimationSpec = async (
  request: PromptRequest,
): Promise<AnimationSpec> => {
  return generateWithOpenAI(request);
};
