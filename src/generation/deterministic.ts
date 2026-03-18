import type {PromptRequest} from "../engine/request";
import type {AnimationSpec, ShapeType} from "../engine/types";
import {generateBaseMotionSpec} from "../motion-spec/generate";
import {refineMotionSpecWithOpenAI} from "../motion-spec/refine-with-openai";
import {compileMotionSpecToAnimationSpec} from "../motion-spec/compile";

export const isDeterministicTemplateType = (type: ShapeType) => {
  return (
    type === "rocket" ||
    type === "plant" ||
    type === "truck" ||
    type === "doctor" ||
    type === "solar" ||
    type === "notifstack" ||
    type === "globe" ||
    type === "desk" ||
    type === "rupee" ||
    type === "certificate"
  );
};

export const generateDeterministicAnimationSpec = async (
  request: PromptRequest,
): Promise<AnimationSpec> => {
  const baseMotion = generateBaseMotionSpec(request);
  const refined = await refineMotionSpecWithOpenAI(request, baseMotion);
  return compileMotionSpecToAnimationSpec(refined, request);
};

