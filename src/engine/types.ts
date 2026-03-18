import {z} from "zod";

const hexColorSchema = z.string().regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
  message: "Expected a hex color like #FF2D55 or #FFF",
});

export const animationPropertySchema = z.enum([
  "scale",
  "opacity",
  "translateX",
  "translateY",
  "rotate",
  "draw",
]);

export const easingNameSchema = z.enum([
  "linear",
  "easeIn",
  "easeOut",
  "easeInOut",
  "snapUp",
  "spring",
  "elastic",
]);

export const keyframeSchema = z
  .object({
    start: z.number().min(0),
    end: z.number().gt(0),
    property: animationPropertySchema,
    from: z.number(),
    to: z.number(),
    easing: easingNameSchema.default("linear"),
  })
  .refine((value) => value.end > value.start, {
    message: "Keyframe end must be greater than start",
    path: ["end"],
  });

export const shapeTypeSchema = z.enum([
  "heart",
  "checkmark",
  "bell",
  "arrow",
  "star",
  "pin",
  "play",
  "wifi",
  "lock",
  "lockbody",
  "lockshackle",
  "lockkeyhole",
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
  "steam",
  "wave",
  "text",
  "ring",
  "glow",
  "spark",
  "shadow",
]);

export const elementLayerSchema = z.enum(["background", "main", "foreground"]);

export const animatedElementSchema = z.object({
  id: z.string().min(1),
  type: shapeTypeSchema,
  layer: elementLayerSchema.optional(),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  // If provided, the renderer will use this for the nested SVG viewBox instead of 0 0 100 100.
  // This is useful for "scene" elements that need a non-square coordinate system (e.g. 160x90 for 16:9).
  viewBoxWidth: z.number().positive().optional(),
  viewBoxHeight: z.number().positive().optional(),
  fill: hexColorSchema.optional(),
  stroke: hexColorSchema.optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  offsetX: z.number().optional(),
  offsetY: z.number().optional(),
  glowColor: hexColorSchema.optional(),
  glowStrength: z.number().min(0).optional(),
  shadowColor: hexColorSchema.optional(),
  shadowBlur: z.number().min(0).optional(),
  trail: z.boolean().optional(),
  flash: z.boolean().optional(),
  ripple: z.boolean().optional(),
  // Simple text label (used for Phase 1 overlays like "REC").
  text: z.string().min(1).optional(),
  // Font size in the element's local 0..100 viewBox units (not pixels).
  fontSize: z.number().positive().optional(),
  fontWeight: z.number().positive().optional(),
  animations: z.array(keyframeSchema).default([]),
});

export const animationSpecSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    duration: z.number().positive(),
    fps: z.number().positive().default(30),
    loop: z.boolean().default(false),
    canvas: z.object({
      width: z.number().positive(),
      height: z.number().positive(),
      background: hexColorSchema,
    }),
    elements: z.array(animatedElementSchema).min(1),
  })
  .refine((value) => value.duration <= 12, {
    message: "Duration must stay within the supported range",
    path: ["duration"],
  });

export type AnimationProperty = z.infer<typeof animationPropertySchema>;
export type EasingName = z.infer<typeof easingNameSchema>;
export type AnimationKeyframe = z.infer<typeof keyframeSchema>;
export type ShapeType = z.infer<typeof shapeTypeSchema>;
export type ElementLayer = z.infer<typeof elementLayerSchema>;
export type AnimatedElement = z.infer<typeof animatedElementSchema>;
export type AnimationSpec = z.infer<typeof animationSpecSchema>;

export const defineAnimationSpec = (spec: AnimationSpec): AnimationSpec =>
  animationSpecSchema.parse(spec);
