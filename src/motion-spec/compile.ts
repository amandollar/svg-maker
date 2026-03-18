import type {PromptRequest} from "../engine/request";
import type {AnimationSpec, AnimatedElement} from "../engine/types";
import {animationSpecSchema} from "../engine/types";
import {normalizeGeneratedSpec} from "../ai/normalize-spec";
import {parsePrimaryFillColor, parsePrimaryStrokeColor} from "../ai/prompt-helpers";
import type {MotionSpec} from "./schema";

const decoratePromptWithMotionProfile = (prompt: string, motion: MotionSpec["style"]["motion"]) => {
  // Feed MotionSpec's motion intent back into the deterministic compiler without changing schemas everywhere.
  // This string is only used internally for hint extraction and variant picking.
  return `${prompt}\nMotion: ${motion}`;
};

const applyAccent = (
  element: AnimatedElement,
  accent: string | null,
  requestPrompt: string,
): AnimatedElement => {
  if (!accent) return element;

  // Lock is a multi-state animation with explicit colors in Phase 1; don't apply a generic accent.
  if (element.type === "lock" || element.type === "lockbody" || element.type === "lockshackle" || element.type === "lockkeyhole") {
    return element;
  }

  // Secondary effects should inherit the accent for legibility (e.g. headphones sound waves).
  if (element.type === "wave") {
    return {
      ...element,
      stroke: accent,
      glowColor: element.glowColor ?? accent,
      glowStrength: element.glowStrength ?? 0.55,
    };
  }

  // If the prompt already specifies an explicit fill/stroke for this element, do not override it.
  // Phase 1 prompts are the source of truth for colors; MotionSpec accent is an optional hint.
  const explicitFill = parsePrimaryFillColor(requestPrompt, element.type);
  const explicitStroke = parsePrimaryStrokeColor(requestPrompt, element.type);

  // Conservative mapping: only touch obvious primary colors.
  if (element.type === "heart" || element.type === "star") {
    return explicitFill ? element : {...element, fill: accent};
  }

  if (
    element.type === "checkmark" ||
    element.type === "bell" ||
    element.type === "arrow" ||
    element.type === "wifi" ||
    element.type === "cart" ||
    element.type === "search" ||
    element.type === "coffee" ||
    element.type === "home" ||
    element.type === "gear" ||
    element.type === "plane" ||
    element.type === "mic" ||
    element.type === "download" ||
    element.type === "calendar" ||
    element.type === "trend" ||
    element.type === "wallet" ||
    element.type === "phone" ||
    element.type === "headphones" ||
    element.type === "laptop" ||
    element.type === "camera" ||
    element.type === "barchart" ||
    element.type === "trophy" ||
    element.type === "pie"
  ) {
    return explicitStroke ? element : {...element, stroke: accent};
  }

  if (element.type === "pin") {
    return explicitFill ? element : {...element, fill: accent};
  }

  return element;
};

export const compileMotionSpecToAnimationSpec = (
  spec: MotionSpec,
  request: PromptRequest,
): AnimationSpec => {
  const promptForCompile = decoratePromptWithMotionProfile(request.prompt, spec.style.motion);

  // Use existing normalization logic (it handles default choreography + effects),
  // then override with MotionSpec's explicit choices.
  const base = normalizeGeneratedSpec(undefined, {
    // Parse visuals/motion hints from the original user prompt (Phase 1 is the source of truth).
    // `expandedPrompt` is useful later when we add explicit style fields to MotionSpec, but today it may drop
    // key color lines (e.g. "Heart fill: #FF2D55") and cause wrong colors.
    prompt: promptForCompile,
    // Prefer an explicit user override (rare), otherwise honor MotionSpec's template choice.
    templateId: request.templateId ?? spec.template,
    canvasFormat: spec.canvas.format,
  });

  const merged: AnimationSpec = {
    ...base,
    title: spec.title || base.title,
    duration: spec.timing.duration,
    fps: spec.timing.fps,
    loop: spec.timing.loop,
    canvas: {
      ...base.canvas,
      width: spec.canvas.width,
      height: spec.canvas.height,
      background: spec.canvas.background,
    },
    elements: base.elements.map((el) => applyAccent(el, spec.style.accent, request.prompt)),
  };

  return animationSpecSchema.parse(merged);
};
