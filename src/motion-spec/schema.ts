import {z} from "zod";
import type {ShapeType} from "../engine/types";

const hexColorSchema = z.string().regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
  message: "Expected a hex color like #FF2D55 or #FFF",
});

export const canvasFormatSchema = z.enum(["square", "portrait", "landscape"]);
export const motionProfileSchema = z.enum([
  "snappy",
  "smooth",
  "bouncy",
  "premium",
  "minimal",
]);

// MotionSpec is meant to select a high-level template/icon/scene, not low-level effects.
// Keep this list stable and conservative even as engine ShapeTypes expand.
export const templateTypeSchema = z.enum([
  "heart",
  "checkmark",
  "bell",
  "arrow",
  "star",
  "pin",
  "play",
  "wifi",
  "lock",
  "cart",
  "search",
  "coffee",
  "home",
  "battery",
  "avatar",
  "gear",
  "plane",
  "mic",
  "download",
  "calendar",
  "barchart",
  "trend",
  "wallet",
  "trophy",
  "pie",
  "phone",
  "headphones",
  "laptop",
  "camera",
  "burger",
  "rocket",
  "plant",
  "truck",
  "doctor",
  "solar",
  "notifstack",
  "globe",
  "desk",
  "rupee",
  "certificate",
  "text",
]);

// MotionSpec is a semantic intermediate representation:
// Prompt -> MotionSpec -> (deterministic compiler) -> AnimationSpec.
// Keep it small and rigid so we can validate + iterate safely.
export const motionSpecSchema = z.object({
  version: z.literal(1),
  template: templateTypeSchema,
  title: z.string(),
  prompt: z.string(),
  expandedPrompt: z.string(),
  canvas: z.object({
    format: canvasFormatSchema,
    width: z.number().positive(),
    height: z.number().positive(),
    background: hexColorSchema,
  }),
  timing: z.object({
    duration: z.number().positive(),
    fps: z.number().positive(),
    loop: z.boolean(),
  }),
  style: z.object({
    accent: hexColorSchema.nullable(),
    motion: motionProfileSchema,
  }),
  notes: z.string(),
});

export type MotionSpec = z.infer<typeof motionSpecSchema>;
export type CanvasFormat = z.infer<typeof canvasFormatSchema>;
export type TemplateType = z.infer<typeof templateTypeSchema> & ShapeType;
