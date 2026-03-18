import type {PromptRequest} from "../engine/request";
import type {ShapeType} from "../engine/types";
import {
  normalizePrompt,
  parseAccentColor,
  parseBackgroundColor,
  parseCanvasFormat,
  parseDuration,
  inferMotionProfile,
  parseLoop,
} from "../ai/prompt-helpers";
import {routePromptToType} from "../ai/prompt-router";
import type {MotionSpec, TemplateType} from "./schema";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const canvasDims = (format: MotionSpec["canvas"]["format"]) => {
  if (format === "portrait") return {width: 1080, height: 1920};
  if (format === "landscape") return {width: 1920, height: 1080};
  return {width: 1080, height: 1080};
};

export const generateBaseMotionSpec = (request: PromptRequest): MotionSpec => {
  const prompt = request.prompt.trim();
  const routed = routePromptToType(request);

  const format = request.canvasFormat ?? parseCanvasFormat(prompt);
  const dims = canvasDims(format);
  const background = parseBackgroundColor(prompt) ?? "#111111";
  const parsedAccent = parseAccentColor(prompt);
  // Avoid accidentally treating the background as the accent just because a hex is present.
  const accent =
    parsedAccent && parsedAccent.toLowerCase() === background.toLowerCase()
      ? null
      : parsedAccent ?? null;

  const duration = clamp(parseDuration(prompt) ?? 2.5, 1.2, 6);
  const loop = parseLoop(prompt);
  const motion = inferMotionProfile(prompt);

  // Ensure title is stable + readable.
  const title = prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt;

  // For determinism we do not allow the base generator to change the template.
  const template: TemplateType = routed.type as TemplateType;

  return {
    version: 1,
    template,
    title,
    prompt,
    expandedPrompt: prompt,
    canvas: {
      format,
      width: dims.width,
      height: dims.height,
      background,
    },
    timing: {
      duration,
      fps: 30,
      loop,
    },
    style: {
      accent,
      motion,
    },
    notes: "base-motion-spec(local)",
  };
};
