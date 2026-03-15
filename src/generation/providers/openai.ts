import type {PromptRequest} from "../../engine/request";
import type {AnimationSpec} from "../../engine/types";
import {parsePromptWithOpenAI} from "../../ai/parsePromptWithOpenAI";

export const generateWithOpenAI = async (
  request: PromptRequest,
): Promise<AnimationSpec> => {
  return parsePromptWithOpenAI(request);
};
