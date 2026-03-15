import {z} from "zod";
import {
  animationPropertySchema,
  easingNameSchema,
  elementLayerSchema,
  shapeTypeSchema,
} from "../engine/types";

const hexColorSchema = z.string().regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
  message: "Expected a hex color like #FF2D55 or #FFF",
});

export const aiKeyframeSchema = z.object({
  start: z.number(),
  end: z.number(),
  property: animationPropertySchema,
  from: z.number(),
  to: z.number(),
  easing: easingNameSchema,
});

export const aiAnimatedElementSchema = z.object({
  id: z.string(),
  type: shapeTypeSchema,
  layer: elementLayerSchema.nullable(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  viewBoxWidth: z.number().nullable(),
  viewBoxHeight: z.number().nullable(),
  fill: hexColorSchema.nullable(),
  stroke: hexColorSchema.nullable(),
  strokeWidth: z.number().nullable(),
  opacity: z.number().nullable(),
  offsetX: z.number().nullable(),
  offsetY: z.number().nullable(),
  glowColor: hexColorSchema.nullable(),
  glowStrength: z.number().nullable(),
  shadowColor: hexColorSchema.nullable(),
  shadowBlur: z.number().nullable(),
  trail: z.boolean().nullable(),
  flash: z.boolean().nullable(),
  ripple: z.boolean().nullable(),
  animations: z.array(aiKeyframeSchema),
});

export const aiAnimationSpecSchema = z.object({
  id: z.string(),
  title: z.string(),
  duration: z.number(),
  fps: z.number(),
  loop: z.boolean(),
  canvas: z.object({
    width: z.number(),
    height: z.number(),
    background: hexColorSchema,
  }),
  elements: z.array(aiAnimatedElementSchema),
});

export type AIAnimationSpec = z.infer<typeof aiAnimationSpecSchema>;
