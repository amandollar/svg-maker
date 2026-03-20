import {
  animationSpecSchema,
  type AnimatedElement,
  type AnimationKeyframe,
  type AnimationSpec,
  type ShapeType,
} from "../engine/types";
import type {CanvasFormat, PromptRequest} from "../engine/request";
import {
  extractMotionHints,
  extractStyleHints,
  includesAny,
  normalizePrompt,
  parseAccentColor,
  parseBackgroundColor,
  parseCanvasFormat,
  parseDuration,
  parseGlowColor,
  parseLoop,
  parsePrimaryFillColor,
  parsePrimaryStrokeColor,
  type MotionHints,
  type StyleHints,
} from "./prompt-helpers";
import {routePromptToType} from "./prompt-router";
import {buildObjectSceneSpec, shouldBuildObjectScene} from "./object-scene-spec";
import {buildTextAnimationSpec} from "./text-template-spec";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "generated-animation";

// Note: routing moved to `routePromptToType()` (scored intent + templateId override) for stability.

const shouldForceCenter = (prompt: string) => {
  const normalized = normalizePrompt(prompt);
  return (
    normalized.includes("centered") ||
    normalized.includes("centred") ||
    normalized.includes("in the center") ||
    normalized.includes("in the centre") ||
    normalized.includes("middle of the frame")
  );
};

const hasExplicitCanvasFormat = (prompt: string) => {
  const normalized = normalizePrompt(prompt);
  return includesAny(normalized, [
    "vertical",
    "portrait",
    "reel",
    "story",
    "9:16",
    "landscape",
    "wide",
    "youtube",
    "16:9",
    "horizontal",
    "square",
    "1:1",
  ]);
};

const getCanvas = (format: CanvasFormat, background: string) => {
  if (format === "portrait") {
    return {width: 1080, height: 1920, background};
  }

  if (format === "landscape") {
    return {width: 1920, height: 1080, background};
  }

  return {width: 1080, height: 1080, background};
};

const getSceneViewBox = (type: ShapeType): {width: number; height: number} | null => {
  // Scenes are authored in fixed coordinate systems (see each *Scene.tsx file).
  // Keep these stable across canvas formats to avoid distortion/cropping.
  if (type === "notifstack") {
    return {width: 90, height: 160};
  }

  if (
    type === "rocket" ||
    type === "plant" ||
    type === "truck" ||
    type === "doctor" ||
    type === "solar" ||
    type === "globe" ||
    type === "desk" ||
    type === "certificate"
  ) {
    return {width: 160, height: 90};
  }

  return null;
};

const normalizeViewBoxForType = (element: AnimatedElement): AnimatedElement => {
  // All icon components in this repo are authored in a 0..100 coordinate system.
  // Scene components are authored in a fixed, non-100 viewBox (see getSceneViewBox()).
  //
  // The model sometimes returns a `viewBoxWidth/Height` from other icon sets (e.g. Heroicons 24/32),
  // which causes hard clipping (the "quarter heart" bug). We strictly normalize it here.
  const vb = getSceneViewBox(element.type);
  if (!vb) {
    return {
      ...element,
      viewBoxWidth: undefined,
      viewBoxHeight: undefined,
    };
  }

  return {
    ...element,
    viewBoxWidth: vb.width,
    viewBoxHeight: vb.height,
  };
};

const getDefaultSize = (type: ShapeType, format: CanvasFormat) => {
  if (type === "rocket") {
    // Rocket is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "plant") {
    // Plant is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "truck") {
    // Truck is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "doctor") {
    // Doctor is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "solar") {
    // Solar is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "notifstack") {
    // Notification stack is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "globe") {
    // Globe network is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "desk") {
    // Person-at-desk is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "rupee") {
    // Icon badge: keep it reasonably sized and centered.
    return format === "landscape" ? 420 : format === "portrait" ? 420 : 420;
  }

  if (type === "certificate") {
    // Certificate is a full scene: we fill the frame via width/height overrides later.
    return 100;
  }

  if (type === "arrow") {
    return format === "portrait" ? 120 : 110;
  }

  if (type === "play") {
    return format === "landscape" ? 200 : 180;
  }

  if (type === "wifi") {
    return format === "landscape" ? 220 : 200;
  }

  if (type === "lock") {
    return format === "landscape" ? 210 : 190;
  }

  if (type === "cart") {
    return format === "landscape" ? 240 : 210;
  }

  if (type === "search") {
    return format === "landscape" ? 200 : 180;
  }

  if (type === "coffee") {
    return format === "landscape" ? 220 : 200;
  }

  if (type === "home") {
    return format === "landscape" ? 220 : 200;
  }

  if (type === "battery") {
    return format === "landscape" ? 260 : 230;
  }

  if (type === "avatar") {
    return format === "landscape" ? 220 : 200;
  }

  if (type === "gear") {
    return format === "landscape" ? 220 : 200;
  }

  if (type === "plane") {
    return format === "landscape" ? 230 : 210;
  }

  if (type === "mic") {
    return format === "landscape" ? 220 : 200;
  }

  if (type === "download") {
    return format === "landscape" ? 230 : 210;
  }

  if (type === "calendar") {
    return format === "landscape" ? 230 : 210;
  }

  if (type === "barchart") {
    return format === "landscape" ? 260 : 230;
  }

  if (type === "trend") {
    return format === "landscape" ? 260 : 230;
  }

  if (type === "wallet") {
    return format === "landscape" ? 260 : 230;
  }

  if (type === "trophy") {
    return format === "landscape" ? 240 : 220;
  }

  if (type === "pie") {
    return format === "landscape" ? 240 : 220;
  }

  if (type === "phone") {
    return format === "landscape" ? 240 : 220;
  }

  if (type === "headphones") {
    return format === "landscape" ? 260 : 230;
  }

  if (type === "laptop") {
    return format === "landscape" ? 300 : 260;
  }

  if (type === "camera") {
    return format === "landscape" ? 280 : 250;
  }

  if (type === "burger") {
    return format === "landscape" ? 280 : 270;
  }

  if (type === "star") {
    return format === "landscape" ? 160 : 150;
  }

  if (type === "pin") {
    return format === "landscape" ? 140 : 130;
  }

  if (type === "checkmark") {
    return format === "landscape" ? 200 : 180;
  }

  if (type === "bell") {
    return format === "portrait" ? 130 : 150;
  }

  return format === "landscape" ? 180 : 160;
};

const getStyleAdjustedAccent = (
  type: ShapeType,
  accent: string | undefined,
  styles: StyleHints,
) => {
  if (accent) {
    return accent;
  }

  if (styles.premium) {
    if (type === "star" || type === "bell") {
      return "#FBBF24";
    }

    if (type === "heart") {
      return "#F472B6";
    }
  }

  if (styles.soft) {
    if (type === "heart") {
      return "#F9A8D4";
    }

    if (type === "checkmark") {
      return "#6EE7B7";
    }
  }

  if (styles.bold) {
    if (type === "heart") {
      return "#E11D48";
    }

    if (type === "checkmark") {
      return "#2563EB";
    }
  }

  if (styles.neon) {
    if (type === "bell") {
      return "#FACC15";
    }

    if (type === "star") {
      return "#FDE047";
    }
  }

  return undefined;
};

const getStyleAdjustedGlowStrength = (
  baseStrength: number | undefined,
  styles: StyleHints,
) => {
  if (!baseStrength) {
    return baseStrength;
  }

  if (styles.neon || styles.bold) {
    return baseStrength * 1.25;
  }

  if (styles.soft || styles.minimal) {
    return baseStrength * 0.8;
  }

  return baseStrength;
};

const hashString = (value: string) => {
  // FNV-1a 32-bit (stable across runtimes)
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const pickMotionVariant = (
  type: ShapeType,
  prompt: string,
  hints: MotionHints,
  styles: StyleHints,
  variantCount: number,
) => {
  if (variantCount <= 1) return 0;

  const normalized = normalizePrompt(prompt);

  // Explicit motion profiles win.
  if (normalized.includes("motion: bouncy") || normalized.includes(" bouncy")) {
    return 1 % variantCount;
  }
  if (normalized.includes("motion: snappy") || normalized.includes(" snappy")) {
    return 1 % variantCount;
  }
  if (normalized.includes("motion: smooth") || normalized.includes(" smooth")) {
    return 0;
  }
  if (normalized.includes("motion: minimal") || normalized.includes(" minimal")) {
    return 0;
  }
  if (normalized.includes("motion: premium") || normalized.includes(" premium")) {
    return 1 % variantCount;
  }

  // Strong prompt cues should win over hashing.
  if (styles.neon || normalized.includes("neon") || normalized.includes("glow")) {
    return 1 % variantCount;
  }

  if (
    styles.soft ||
    styles.minimal ||
    hints.subtle ||
    normalized.includes("soft") ||
    normalized.includes("minimal")
  ) {
    return 0;
  }

  // Otherwise, choose a stable variant by hashing the prompt + type.
  return hashString(`${type}::${normalized}`) % variantCount;
};

const getDefaultAnimations = (
  type: ShapeType,
  duration: number,
  hints: MotionHints,
  styles: StyleHints,
  prompt: string,
) => {
  const variantCount =
    type === "heart" || type === "checkmark" || type === "bell" || type === "wifi" ? 2 : 1;
  const variant = pickMotionVariant(type, prompt, hints, styles, variantCount);

  if (type === "arrow") {
    const lift = hints.subtle ? -12 : -18;
    return [
      {start: 0, end: Math.min(0.35, duration * 0.22), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: Math.min(0.35, duration * 0.22), end: Math.min(0.9, duration * 0.6), property: "translateY", from: 12, to: lift, easing: "easeInOut"},
      {start: Math.min(1.0, duration * 0.7), end: Math.min(1.3, duration * 0.85), property: "opacity", from: 1, to: 0, easing: "easeIn"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "play") {
    return [
      {start: 0, end: Math.min(0.35, duration * 0.22), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.55, duration * 0.35), property: "scale", from: 0.72, to: 1.06, easing: "spring"},
      {start: Math.min(0.55, duration * 0.35), end: Math.min(0.9, duration * 0.55), property: "scale", from: 1.06, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.8, duration * 0.5), property: "draw", from: 0, to: 1, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "search") {
    return [
      {start: 0, end: Math.min(0.35, duration * 0.22), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.95, duration * 0.6), end: Math.min(1.2, duration * 0.75), property: "scale", from: 1, to: 1.06, easing: "spring"},
      {start: Math.min(1.2, duration * 0.75), end: Math.min(1.5, duration * 0.9), property: "scale", from: 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "wifi") {
    if (variant === 1) {
      // "Signal pulse" variant: draw in, then a subtle breathing beat (more premium UI feel).
      const drawEnd = Math.min(0.9, duration * 0.58);
      const pulse1Start = Math.min(drawEnd + 0.08, duration * 0.52);
      const pulse1Mid = Math.min(pulse1Start + 0.22, duration * 0.72);
      const pulse1End = Math.min(pulse1Mid + 0.28, duration * 0.9);
      return [
        {start: 0, end: Math.min(0.28, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
        {start: 0, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},
        {start: pulse1Start, end: pulse1Mid, property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.055, easing: "easeInOut"},
        {start: pulse1Mid, end: pulse1End, property: "scale", from: hints.subtle ? 1.03 : 1.055, to: 1, easing: "easeInOut"},
      ] satisfies AnimationKeyframe[];
    }

    return [
      {start: 0, end: Math.min(0.35, duration * 0.22), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(1.05, duration * 0.65), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(1.05, duration * 0.65), end: Math.min(1.35, duration * 0.85), property: "scale", from: 1, to: hints.subtle ? 1.04 : 1.08, easing: "spring"},
      {start: Math.min(1.35, duration * 0.85), end: Math.min(1.7, duration * 0.98), property: "scale", from: hints.subtle ? 1.04 : 1.08, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "lock") {
    return [
      {start: 0, end: Math.min(0.3, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.95, duration * 0.6), end: Math.min(1.25, duration * 0.78), property: "scale", from: 1, to: hints.subtle ? 1.04 : 1.08, easing: "spring"},
      {start: Math.min(1.25, duration * 0.78), end: Math.min(1.55, duration * 0.95), property: "scale", from: hints.subtle ? 1.04 : 1.08, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "cart") {
    return [
      {start: 0, end: Math.min(0.3, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(1.05, duration * 0.65), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(1.05, duration * 0.65), end: Math.min(1.35, duration * 0.82), property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.07, easing: "spring"},
      {start: Math.min(1.35, duration * 0.82), end: Math.min(1.65, duration * 0.98), property: "scale", from: hints.subtle ? 1.03 : 1.07, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "coffee") {
    return [
      {start: 0, end: Math.min(0.35, duration * 0.22), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: 0.35, end: Math.min(1.4, duration * 0.85), property: "translateY", from: 6, to: -6, easing: "easeInOut"},
      {start: Math.min(1.4, duration * 0.85), end: Math.min(1.9, duration * 1.05), property: "translateY", from: -6, to: 0, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "home") {
    return [
      {start: 0, end: Math.min(0.3, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.95, duration * 0.6), end: Math.min(1.25, duration * 0.78), property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.06, easing: "spring"},
      {start: Math.min(1.25, duration * 0.78), end: Math.min(1.55, duration * 0.95), property: "scale", from: hints.subtle ? 1.03 : 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "battery") {
    return [
      {start: 0, end: Math.min(0.3, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.95, duration * 0.6), end: Math.min(1.3, duration * 0.82), property: "scale", from: 1, to: hints.subtle ? 1.02 : 1.05, easing: "easeInOut"},
      {start: Math.min(1.3, duration * 0.82), end: Math.min(1.7, duration * 0.98), property: "scale", from: hints.subtle ? 1.02 : 1.05, to: 1, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "avatar") {
    return [
      {start: 0, end: Math.min(0.35, duration * 0.22), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(1.05, duration * 0.65), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(1.05, duration * 0.65), end: Math.min(1.35, duration * 0.82), property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.06, easing: "spring"},
      {start: Math.min(1.35, duration * 0.82), end: Math.min(1.65, duration * 0.98), property: "scale", from: hints.subtle ? 1.03 : 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "gear") {
    return [
      {start: 0, end: Math.min(0.3, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: 0.2, end: Math.max(0.8, duration), property: "rotate", from: 0, to: 360, easing: "linear"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "plane") {
    return [
      {start: 0, end: Math.min(0.25, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.75, duration * 0.5), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.75, duration * 0.5), end: Math.min(1.4, duration * 0.9), property: "translateX", from: -12, to: 22, easing: "easeInOut"},
      {start: Math.min(0.75, duration * 0.5), end: Math.min(1.4, duration * 0.9), property: "translateY", from: 8, to: -18, easing: "easeInOut"},
      {start: Math.min(0.75, duration * 0.5), end: Math.min(1.4, duration * 0.9), property: "rotate", from: -6, to: 8, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "download") {
    const drawEnd = Math.min(0.85, duration * 0.55);
    const dropStart = Math.min(0.35, duration * 0.22);
    const dropImpact = Math.min(dropStart + 0.55, duration * 0.72);
    const settleEnd = Math.min(dropImpact + 0.35, duration * 0.9);
    const pulseStart = Math.min(settleEnd + 0.12, duration * 0.72);
    const pulseMid = Math.min(pulseStart + 0.18, duration - 0.25);
    const pulseEnd = Math.min(pulseMid + 0.22, duration);

    return [
      // Appear + outline draw.
      {start: 0, end: Math.min(0.22, duration * 0.14), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},

      // Drop the icon down a bit to imply the arrow "lands" into the tray.
      {start: dropStart, end: dropImpact, property: "translateY", from: -18, to: 12, easing: "easeIn"},
      {start: dropImpact, end: Math.min(dropImpact + 0.18, settleEnd), property: "translateY", from: 12, to: -6, easing: "spring"},
      {start: Math.min(dropImpact + 0.18, settleEnd), end: settleEnd, property: "translateY", from: -6, to: 0, easing: "easeOut"},

      // Tiny impact squash, then recover.
      {start: Math.max(0, dropImpact - 0.05), end: Math.min(dropImpact + 0.16, settleEnd), property: "scale", from: 1, to: 0.94, easing: "spring"},
      {start: Math.min(dropImpact + 0.16, settleEnd), end: settleEnd, property: "scale", from: 0.94, to: 1, easing: "easeOut"},

      // Confirmation pulse.
      {start: pulseStart, end: pulseMid, property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.05, easing: "easeInOut"},
      {start: pulseMid, end: pulseEnd, property: "scale", from: hints.subtle ? 1.03 : 1.05, to: 1, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "calendar") {
    return [
      {start: 0, end: Math.min(0.3, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.9, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.9, duration * 0.6), end: Math.min(1.2, duration * 0.75), property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.06, easing: "spring"},
      {start: Math.min(1.2, duration * 0.75), end: Math.min(1.5, duration * 0.92), property: "scale", from: hints.subtle ? 1.03 : 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "mic") {
    const drawEnd = Math.min(0.85, duration * 0.52);
    const settlePeak = Math.min(drawEnd + 0.25, duration * 0.72);
    const settleEnd = Math.min(settlePeak + 0.25, duration * 0.92);
    const peak = hints.energetic ? 1.1 : 1.07;

    // A "rise + draw + settle" beat feels more like a recording UI than the generic pulse.
    return [
      {start: 0, end: Math.min(0.22, duration * 0.14), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.55, duration * 0.32), property: "translateY", from: 18, to: 0, easing: "easeOut"},
      {start: 0, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: drawEnd, end: settlePeak, property: "scale", from: 1, to: peak, easing: "spring"},
      {start: settlePeak, end: settleEnd, property: "scale", from: peak, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "barchart") {
    const drawEnd = Math.min(2.2, duration * 0.72);
    const bounceEnd = Math.min(drawEnd + 0.45, duration * 0.88);
    return [
      {start: 0, end: Math.min(0.38, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: 0.08, end: Math.min(drawEnd, duration * 0.55), property: "translateY", from: 10, to: 0, easing: "spring"},
      {start: 0.08, end: Math.min(drawEnd, duration * 0.45), property: "translateX", from: -4, to: 0, easing: "spring"},
      {start: 0.06, end: Math.min(drawEnd, duration * 0.5), property: "rotate", from: -1.2, to: 0, easing: "easeOut"},
      {start: Math.max(0, drawEnd - 0.05), end: bounceEnd, property: "scale", from: 1, to: 1.06, easing: "spring"},
      {start: bounceEnd, end: Math.min(bounceEnd + 0.25, duration), property: "scale", from: 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "trend") {
    const peak = hints.energetic ? 1.1 : 1.07;
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.55), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.95, duration * 0.55), end: Math.min(1.2, duration * 0.7), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(1.2, duration * 0.7), end: Math.min(1.45, duration * 0.85), property: "scale", from: peak, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "wallet") {
    const peak = hints.energetic ? 1.1 : 1.07;
    const drawEnd = Math.min(0.95, duration * 0.56);
    const openStart = Math.min(drawEnd - 0.08, duration * 0.5);
    const openEnd = Math.min(drawEnd + 0.28, duration * 0.74);
    const settleEnd = Math.min(openEnd + 0.28, duration * 0.92);
    const microPulseStart = Math.min(settleEnd + 0.15, duration * 0.72);
    const microPulseMid = Math.min(microPulseStart + 0.18, duration - 0.25);
    const microPulseEnd = Math.min(microPulseMid + 0.22, duration);
    return [
      {start: 0, end: Math.min(0.24, duration * 0.14), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      // A tiny slide-in makes it feel like a UI object entering, not just drawing in place.
      {start: 0, end: Math.min(0.55, duration * 0.28), property: "translateY", from: 10, to: 0, easing: "easeOut"},
      // Outline draw.
      {start: 0, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},
      // "Open" beat: slight tilt + pop.
      {start: openStart, end: openEnd, property: "rotate", from: -3.2, to: 0, easing: "spring"},
      {start: drawEnd, end: openEnd, property: "scale", from: 1, to: peak, easing: "spring"},
      {start: openEnd, end: settleEnd, property: "scale", from: peak, to: 1, easing: "easeOut"},
      // Optional micro beat so looped 2.5-3s wallets don't feel static.
      {start: microPulseStart, end: microPulseMid, property: "scale", from: 1, to: hints.subtle ? 1.02 : 1.035, easing: "easeInOut"},
      {start: microPulseMid, end: microPulseEnd, property: "scale", from: hints.subtle ? 1.02 : 1.035, to: 1, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "trophy") {
    const peak = hints.energetic ? 1.15 : 1.1;
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.8, duration * 0.5), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.8, duration * 0.5), end: Math.min(1.05, duration * 0.62), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(1.05, duration * 0.62), end: Math.min(1.35, duration * 0.8), property: "scale", from: peak, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "pie") {
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(1.0, duration * 0.58), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(1.0, duration * 0.58), end: Math.min(1.3, duration * 0.76), property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.06, easing: "spring"},
      {start: Math.min(1.3, duration * 0.76), end: Math.min(1.55, duration * 0.92), property: "scale", from: hints.subtle ? 1.03 : 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "phone") {
    return [
      {start: 0, end: Math.min(0.18, duration * 0.12), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.58), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.2, duration * 0.14), end: Math.min(0.95, duration * 0.58), property: "translateY", from: 10, to: 0, easing: "easeOut"},
      {start: Math.min(0.95, duration * 0.58), end: Math.min(1.25, duration * 0.74), property: "scale", from: 1, to: 1.06, easing: "spring"},
      {start: Math.min(1.25, duration * 0.74), end: Math.min(1.5, duration * 0.9), property: "scale", from: 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "headphones") {
    const peak = hints.energetic ? 1.1 : 1.06;
    const drawEnd = Math.min(0.95, duration * 0.55);
    const settleStart = Math.min(drawEnd, duration * 0.55);
    const settlePeak = Math.min(settleStart + 0.25, duration * 0.72);
    const settleEnd = Math.min(settlePeak + 0.25, duration * 0.9);
    const pulseStart = Math.min(settleEnd + 0.1, duration * 0.55 + 0.9);
    const pulseMid = Math.min(pulseStart + Math.max(0.25, duration * 0.12), duration - 0.3);
    const pulseEnd = Math.min(pulseMid + Math.max(0.25, duration * 0.12), duration);
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: settleStart, end: settlePeak, property: "scale", from: 1, to: peak, easing: "spring"},
      {start: settlePeak, end: settleEnd, property: "scale", from: peak, to: 1, easing: "easeOut"},
      // A second "music pulse" beat to make it feel less generic (works nicely for looped 3–4s specs).
      {start: pulseStart, end: pulseMid, property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.05, easing: "easeInOut"},
      {start: pulseMid, end: pulseEnd, property: "scale", from: hints.subtle ? 1.03 : 1.05, to: 1, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "laptop") {
    const peak = hints.energetic ? 1.08 : 1.05;
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(1.05, duration * 0.62), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.2, duration * 0.14), end: Math.min(0.6, duration * 0.35), property: "rotate", from: -6, to: 0, easing: "easeOut"},
      {start: Math.min(1.05, duration * 0.62), end: Math.min(1.25, duration * 0.74), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(1.25, duration * 0.74), end: Math.min(1.5, duration * 0.9), property: "scale", from: peak, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "camera") {
    const peak = hints.energetic ? 1.12 : 1.07;
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.9, duration * 0.55), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.9, duration * 0.55), end: Math.min(1.1, duration * 0.68), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(1.1, duration * 0.68), end: Math.min(1.35, duration * 0.85), property: "scale", from: peak, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "burger") {
    const peak = hints.energetic ? 1.08 : 1.05;
    return [
      {start: 0, end: Math.min(0.25, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.5, duration * 0.28), property: "translateY", from: 26, to: 0, easing: "spring"},
      {start: Math.min(0.5, duration * 0.28), end: Math.min(0.8, duration * 0.45), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(0.8, duration * 0.45), end: Math.min(1.05, duration * 0.6), property: "scale", from: peak, to: 1, easing: "easeOut"},
      {start: Math.min(1.05, duration * 0.6), end: Math.min(1.35, duration * 0.74), property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.06, easing: "spring"},
      {start: Math.min(1.35, duration * 0.74), end: Math.min(1.65, duration * 0.88), property: "scale", from: hints.subtle ? 1.03 : 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "star") {
    const peak = hints.burst || hints.energetic ? 1.28 : 1.2;
    return [
      {start: 0, end: Math.min(0.3, duration * 0.2), property: "scale", from: 0.6, to: 1, easing: "easeOut"},
      {start: Math.min(0.3, duration * 0.2), end: Math.min(0.55, duration * 0.35), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(0.55, duration * 0.35), end: Math.min(0.9, duration * 0.55), property: "scale", from: peak, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "pin") {
    const dropHeight = hints.drop || hints.energetic ? -140 : -120;
    const impactScale = hints.subtle ? 0.94 : 0.9;
    const dropEnd = Math.min(0.32, duration * 0.2);
    const bounceUpEnd = Math.min(dropEnd + 0.18, duration * 0.38);
    const settleEnd = Math.min(dropEnd + 0.44, duration * 0.62);
    return [
      {start: 0, end: dropEnd, property: "translateY", from: dropHeight, to: 0, easing: "easeIn"},
      {start: dropEnd, end: bounceUpEnd, property: "translateY", from: 0, to: hints.subtle ? -12 : -18, easing: "spring"},
      {start: bounceUpEnd, end: settleEnd, property: "translateY", from: hints.subtle ? -12 : -18, to: 0, easing: "easeOut"},
      {start: Math.max(0, dropEnd - 0.03), end: Math.min(dropEnd + 0.14, duration * 0.34), property: "scale", from: 1, to: impactScale, easing: "spring"},
      {start: Math.min(dropEnd + 0.14, duration * 0.34), end: Math.min(dropEnd + 0.34, duration * 0.52), property: "scale", from: impactScale, to: hints.subtle ? 1.04 : 1.06, easing: "spring"},
      {start: Math.min(dropEnd + 0.34, duration * 0.52), end: Math.min(dropEnd + 0.52, duration * 0.78), property: "scale", from: hints.subtle ? 1.04 : 1.06, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "checkmark") {
    const fadeEnd = Math.min(0.35, duration * 0.22);
    const drawStart = Math.min(0.14, duration * 0.09);
    const drawEnd = variant === 1 ? Math.min(0.7, duration * 0.48) : Math.min(0.85, duration * 0.55);
    const bouncePeak = hints.bounce || hints.energetic ? 1.16 : 1.12;
    const flashStart = Math.min(drawEnd + 0.02, duration * 0.7);
    const flashEnd = Math.min(drawEnd + 0.22, duration * 0.86);

    if (variant === 1) {
      // Snappier "confirmation" variant (draw fast, then a more obvious pop).
      const popPeak = hints.energetic ? 1.2 : 1.16;
      const popEnd = Math.min(drawEnd + 0.28, duration * 0.74);
      const settleEnd = Math.min(popEnd + 0.25, duration * 0.92);
      return [
        {start: 0, end: fadeEnd, property: "opacity", from: 0, to: 1, easing: "easeOut"},
        {start: 0, end: Math.min(drawEnd, duration * 0.46), property: "translateY", from: 6, to: 0, easing: "easeOut"},
        {start: drawStart, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},
        {start: drawEnd, end: popEnd, property: "scale", from: 1, to: popPeak, easing: "spring"},
        {start: popEnd, end: settleEnd, property: "scale", from: popPeak, to: 1, easing: "easeOut"},
        {start: flashStart, end: flashEnd, property: "opacity", from: 1, to: 1, easing: "linear"},
      ] satisfies AnimationKeyframe[];
    }

    return [
      {start: 0, end: fadeEnd, property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: drawStart, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: drawEnd, end: Math.min(drawEnd + 0.22, duration * 0.72), property: "scale", from: 1, to: bouncePeak, easing: "spring"},
      {start: Math.min(drawEnd + 0.22, duration * 0.72), end: Math.min(drawEnd + 0.4, duration * 0.9), property: "scale", from: bouncePeak, to: 1, easing: "easeOut"},
      {start: flashStart, end: flashEnd, property: "opacity", from: 1, to: 1, easing: "linear"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "bell") {
    const base = hints.subtle ? 16 : 22;
    const settleTime = Math.min(duration * 0.78, Math.max(0.95, duration * 0.6));
    const endTime = Math.min(duration * 0.92, duration - 0.02);

    // Damped swing: large -> medium -> small -> settle.
    if (variant === 1) {
      // "Notification ding" variant: tiny drop + snap rotate + settle (reads more like UI).
      const impact = Math.min(0.28, duration * 0.18);
      const bounceUp = Math.min(impact + 0.18, duration * 0.34);
      const settle = Math.min(impact + 0.52, duration * 0.78);
      const r = hints.subtle ? 10 : 14;
      return [
        {start: 0, end: Math.min(0.18, duration * 0.12), property: "opacity", from: 0, to: 1, easing: "easeOut"},
        {start: 0, end: impact, property: "translateY", from: -14, to: 0, easing: "easeIn"},
        {start: impact, end: bounceUp, property: "translateY", from: 0, to: -8, easing: "spring"},
        {start: bounceUp, end: settle, property: "translateY", from: -8, to: 0, easing: "easeOut"},
        {start: Math.max(0, impact - 0.05), end: Math.min(impact + 0.18, settle), property: "rotate", from: 0, to: -r, easing: "spring"},
        {start: Math.min(impact + 0.18, settle), end: Math.min(impact + 0.42, settle), property: "rotate", from: -r, to: r * 0.55, easing: "spring"},
        {start: Math.min(impact + 0.42, settle), end: endTime, property: "rotate", from: r * 0.55, to: 0, easing: "easeOut"},
      ] satisfies AnimationKeyframe[];
    }

    return [
      {start: 0, end: Math.min(0.08, duration * 0.06), property: "rotate", from: 0, to: base, easing: "easeIn"},
      {start: Math.min(0.08, duration * 0.06), end: Math.min(0.2, duration * 0.14), property: "rotate", from: base, to: -base * 1.1, easing: "spring"},
      {start: Math.min(0.2, duration * 0.14), end: Math.min(0.34, duration * 0.24), property: "rotate", from: -base * 1.1, to: base * 0.75, easing: "spring"},
      {start: Math.min(0.34, duration * 0.24), end: Math.min(0.48, duration * 0.34), property: "rotate", from: base * 0.75, to: -base * 0.5, easing: "spring"},
      {start: Math.min(0.48, duration * 0.34), end: settleTime, property: "rotate", from: -base * 0.5, to: base * 0.22, easing: "spring"},
      {start: settleTime, end: endTime, property: "rotate", from: base * 0.22, to: 0, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "heart") {
    // Heart is a core template; give it 2 motion languages so it doesn't always feel the same.
    const glowPeak = hints.glow ? (hints.subtle ? 1.18 : 1.26) : hints.subtle ? 1.16 : 1.22;
    if (variant === 1) {
      // "Double beat" (like iOS-style notification heart): quick beat + softer second beat.
      const a0 = Math.min(0.12, duration * 0.08);
      const a1 = Math.min(0.28, duration * 0.18);
      const a2 = Math.min(0.46, duration * 0.28);
      const a3 = Math.min(0.82, duration * 0.5);
      const a4 = Math.min(1.12, duration * 0.68);
      return [
        {start: 0, end: Math.min(0.2, duration * 0.12), property: "opacity", from: 0, to: 1, easing: "easeOut"},
        {start: 0, end: a0, property: "scale", from: 0.92, to: glowPeak, easing: "snapUp"},
        {start: a0, end: a1, property: "scale", from: glowPeak, to: 0.96, easing: "spring"},
        {start: a1, end: a2, property: "scale", from: 0.96, to: 1.0, easing: "easeOut"},
        {start: a2, end: a3, property: "scale", from: 1.0, to: hints.subtle ? 1.06 : 1.1, easing: "easeInOut"},
        {start: a3, end: a4, property: "scale", from: hints.subtle ? 1.06 : 1.1, to: 1.0, easing: "easeInOut"},
      ] satisfies AnimationKeyframe[];
    }

    // Default "single pulse" (kept calmer so the double-beat feels clearly different).
    const upEnd = Math.min(0.18, duration * 0.12);
    const downEnd = Math.min(0.4, duration * 0.26);
    const settleEnd = Math.min(0.7, duration * 0.44);
    return [
      {start: 0, end: Math.min(0.2, duration * 0.12), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: upEnd, property: "scale", from: 0.9, to: hints.subtle ? 1.16 : 1.22, easing: "snapUp"},
      {start: upEnd, end: downEnd, property: "scale", from: hints.subtle ? 1.16 : 1.22, to: 0.95, easing: "spring"},
      {start: downEnd, end: settleEnd, property: "scale", from: 0.95, to: 1, easing: "easeOut"},
      {start: Math.min(0.9, duration * 0.55), end: Math.min(1.45, duration * 0.82), property: "scale", from: 1, to: hints.subtle ? 1.03 : 1.05, easing: "easeInOut"},
      {start: Math.min(1.45, duration * 0.82), end: Math.min(2.0, duration * 0.98), property: "scale", from: hints.subtle ? 1.03 : 1.05, to: 1, easing: "easeInOut"},
    ] satisfies AnimationKeyframe[];
  }

  const pulsePeak = hints.subtle ? 1.24 : 1.35;
  const overshoot = hints.subtle ? 0.94 : 0.9;
  const settlePeak = hints.glow ? 1.05 : 1.04;
  return [
    {start: 0, end: Math.min(0.1, duration * 0.08), property: "scale", from: 1, to: pulsePeak, easing: "snapUp"},
    {start: Math.min(0.1, duration * 0.08), end: Math.min(0.3, duration * 0.18), property: "scale", from: pulsePeak, to: overshoot, easing: "spring"},
    {start: Math.min(0.3, duration * 0.18), end: Math.min(0.55, duration * 0.28), property: "scale", from: overshoot, to: 1, easing: "easeOut"},
    {start: Math.min(0.8, duration * 0.5), end: Math.min(1.4, duration * 0.7), property: "scale", from: 1, to: settlePeak, easing: "easeInOut"},
    {start: Math.min(1.4, duration * 0.7), end: Math.min(2, duration * 0.9), property: "scale", from: settlePeak, to: 1, easing: "easeInOut"},
  ] satisfies AnimationKeyframe[];
};

const getOpticalOffsets = (type: ShapeType) => {
  if (type === "heart") {
    return {offsetX: -4, offsetY: -8};
  }

  if (type === "pin") {
    return {offsetX: 0, offsetY: -6};
  }

  return {offsetX: 0, offsetY: 0};
};

const inferDefaultLayerForType = (type: ShapeType) => {
  if (type === "spark" || type === "steam") {
    return "foreground" as const;
  }

  if (type === "ring" || type === "glow" || type === "shadow") {
    return "background" as const;
  }

  return "main" as const;
};

const ensureLayer = (element: AnimatedElement): AnimatedElement => {
  if (element.layer) {
    return element;
  }

  return {
    ...element,
    layer: inferDefaultLayerForType(element.type),
  };
};

const isAllowedEffectForPromptType = (promptType: ShapeType, effectType: ShapeType) => {
  if (!["ring", "glow", "spark", "shadow", "steam", "wave"].includes(effectType)) {
    return false;
  }

  if (promptType === "burger") {
    return effectType === "shadow" || effectType === "steam";
  }

  if (promptType === "star") {
    return effectType === "spark" || effectType === "glow" || effectType === "ring" || effectType === "shadow";
  }

  if (promptType === "pin") {
    return effectType === "shadow" || effectType === "ring";
  }

  if (promptType === "heart") {
    return effectType === "glow" || effectType === "ring";
  }

  if (promptType === "checkmark") {
    return effectType === "ring";
  }

  if (promptType === "headphones" || promptType === "mic") {
    return effectType === "wave" || effectType === "ring" || effectType === "glow" || effectType === "shadow";
  }

  // Default: allow subtle ring/glow/shadow; never allow sparks unless star.
  return effectType === "ring" || effectType === "glow" || effectType === "shadow";
};

const buildSecondaryElements = (
  type: ShapeType,
  primary: AnimatedElement,
  accent: string | undefined,
  hints: MotionHints,
  styles: StyleHints,
  canvas: {width: number; height: number},
  explicitGlowColor?: string,
): AnimatedElement[] => {
  if (
    type === "rocket" ||
    type === "plant" ||
    type === "truck" ||
    type === "doctor" ||
    type === "solar" ||
    type === "notifstack" ||
    type === "globe" ||
    type === "desk" ||
    type === "certificate"
  ) {
    return [];
  }

  if (type === "bell" && (hints.glow || hints.swing || hints.energetic)) {
    const ghostBase = hints.subtle ? 10 : 14;
    const ghostAnimations: AnimationKeyframe[] = [
      {start: 0, end: 0.22, property: "opacity", from: hints.glow ? 0.18 : 0.14, to: 0.06, easing: "easeOut"},
      {start: 0.22, end: 0.75, property: "opacity", from: 0.06, to: 0.02, easing: "easeOut"},
      {start: 0, end: 0.08, property: "rotate", from: 0, to: ghostBase, easing: "easeIn"},
      {start: 0.08, end: 0.2, property: "rotate", from: ghostBase, to: -ghostBase * 1.05, easing: "spring"},
      {start: 0.2, end: 0.34, property: "rotate", from: -ghostBase * 1.05, to: ghostBase * 0.7, easing: "spring"},
      {start: 0.34, end: 0.52, property: "rotate", from: ghostBase * 0.7, to: 0, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-ghost`,
        type: "bell",
        layer: "background" as const,
        x: primary.x - primary.width * 0.03,
        y: primary.y,
        width: primary.width,
        height: primary.height,
        stroke: primary.stroke ?? accent ?? "#FACC15",
        strokeWidth: primary.strokeWidth ?? 6,
        opacity: hints.glow ? 0.18 : 0.12,
        animations: ghostAnimations,
      },
      ...(hints.glow
        ? [
            {
              id: `${primary.id}-glow`,
              type: "glow" as const,
              layer: "background" as const,
              x: primary.x - primary.width * 0.08,
              y: primary.y - primary.height * 0.08,
              width: primary.width * 1.16,
              height: primary.height * 1.16,
              fill: primary.stroke ?? accent ?? "#FACC15",
              opacity: 0.12,
              animations: [
                {start: 0, end: 0.3, property: "scale", from: 0.95, to: 1.1, easing: "easeOut"},
                {start: 0, end: 0.3, property: "opacity", from: 0.14, to: 0.04, easing: "easeOut"},
              ] satisfies AnimationKeyframe[],
            },
          ]
        : []),
    ];
  }

  if (type === "arrow") {
    const stackedArrowAnimationsA: AnimationKeyframe[] = [
      {start: 0, end: 0.45, property: "opacity", from: 0.12, to: 0.28, easing: "easeOut"},
      {start: 0.45, end: 1.0, property: "opacity", from: 0.28, to: 0, easing: "easeIn"},
      {start: 0, end: 1.0, property: "translateY", from: 18, to: -12, easing: "easeInOut"},
    ];

    const stackedArrowAnimationsB: AnimationKeyframe[] = [
      {start: 0.12, end: 0.55, property: "opacity", from: 0.1, to: 0.24, easing: "easeOut"},
      {start: 0.55, end: 1.1, property: "opacity", from: 0.24, to: 0, easing: "easeIn"},
      {start: 0.12, end: 1.1, property: "translateY", from: 20, to: -10, easing: "easeInOut"},
    ];

    return [
      {
        id: `${primary.id}-stack-1`,
        type: "arrow",
        layer: "background" as const,
        x: primary.x,
        y: primary.y + primary.height * 0.34,
        width: primary.width,
        height: primary.height,
        stroke: primary.stroke ?? accent ?? "#FFFFFF",
        strokeWidth: primary.strokeWidth ?? 8,
        opacity: 0.18,
        animations: stackedArrowAnimationsA,
      },
      {
        id: `${primary.id}-stack-2`,
        type: "arrow",
        layer: "background" as const,
        x: primary.x,
        y: primary.y + primary.height * 0.68,
        width: primary.width,
        height: primary.height,
        stroke: primary.stroke ?? accent ?? "#FFFFFF",
        strokeWidth: primary.strokeWidth ?? 8,
        opacity: 0.1,
        animations: stackedArrowAnimationsB,
      },
    ];
  }

    if (type === "heart" && hints.glow) {
    const hitTime = (() => {
      const hitCandidates = (primary.animations ?? [])
        .filter((kf) => kf.property === "scale" && kf.to > 1 && kf.start >= 0)
        .map((kf) => kf.end)
        .filter((value) => Number.isFinite(value) && value > 0);

      return hitCandidates.length ? Math.min(...hitCandidates) : 0.1;
    })();

    const glowStart = Math.max(0, hitTime - 0.08);
    const glowPeak = hitTime + 0.04;
    const fadeOut = hitTime + (hints.subtle ? 0.55 : 0.65);

    const animations: AnimationKeyframe[] = [
      {start: glowStart, end: glowPeak, property: "scale", from: 0.88, to: 1.18, easing: "easeOut"},
      {start: glowStart, end: glowPeak, property: "opacity", from: 0.02, to: hints.subtle ? 0.14 : 0.22, easing: "easeOut"},
      {start: glowPeak, end: fadeOut, property: "opacity", from: hints.subtle ? 0.14 : 0.22, to: 0.04, easing: "easeOut"},
    ];
      return [
        {
          id: `${primary.id}-glow`,
          type: "glow",
          layer: "background" as const,
          x: primary.x - primary.width * 0.08,
          y: primary.y - primary.height * 0.08,
          width: primary.width * 1.16,
          height: primary.height * 1.16,
          fill: explicitGlowColor ?? accent ?? (typeof primary.fill === "string" ? primary.fill : undefined) ?? "#FF2D55",
          opacity: hints.subtle ? 0.14 : 0.22,
          animations,
        },
      ];
    }

  if (type === "heart" && (styles.bold || styles.premium)) {
    const ringOpacity = styles.bold ? 0.16 : 0.12;
    const ringScaleTo = styles.bold ? 1.26 : 1.2;
    const animations: AnimationKeyframe[] = [
      {start: 0, end: 0.2, property: "scale", from: 0.92, to: ringScaleTo, easing: "easeOut"},
      {start: 0, end: 0.55, property: "opacity", from: ringOpacity, to: 0, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-ring`,
        type: "ring",
        layer: "background" as const,
        x: primary.x,
        y: primary.y,
        width: primary.width,
        height: primary.height,
        stroke: accent ?? "#E11D48",
        strokeWidth: styles.bold ? 3 : 2,
        opacity: ringOpacity,
        animations,
      },
    ];
  }

  if (type === "checkmark") {
    const ringFromOpacity = styles.minimal ? 0.08 : 0.18;
    const ringToOpacity = styles.minimal ? 0.18 : 0.32;
    const animations: AnimationKeyframe[] = [
      {start: 0, end: 0.48, property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: 0, end: 0.22, property: "opacity", from: 0, to: ringToOpacity, easing: "easeOut"},
      {start: 0.22, end: 0.85, property: "opacity", from: ringToOpacity, to: ringFromOpacity, easing: "easeInOut"},
    ];
    return [
      {
        id: `${primary.id}-ring`,
        type: "ring",
        layer: "background" as const,
        x: primary.x,
        y: primary.y,
        width: primary.width,
        height: primary.height,
        stroke: primary.stroke ?? accent ?? "#22C55E",
        strokeWidth: styles.minimal ? 3 : 4,
        opacity: ringFromOpacity,
        animations,
      },
    ];
  }

  if (type === "play") {
    const ringColor = primary.stroke ?? primary.fill ?? accent ?? "#FFFFFF";
    const animations: AnimationKeyframe[] = [
      {start: 0, end: 0.25, property: "scale", from: 0.92, to: 1.18, easing: "easeOut"},
      {start: 0, end: 0.6, property: "opacity", from: styles.minimal ? 0.08 : 0.14, to: 0, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-ring`,
        type: "ring",
        layer: "background" as const,
        x: primary.x,
        y: primary.y,
        width: primary.width,
        height: primary.height,
        stroke: ringColor,
        strokeWidth: 3,
        opacity: styles.minimal ? 0.08 : 0.14,
        animations,
      },
    ];
  }

  if (type === "wifi") {
    const glowColor = primary.stroke ?? accent ?? "#FFFFFF";
    const animations: AnimationKeyframe[] = [
      {start: 0, end: 0.35, property: "scale", from: 0.95, to: 1.12, easing: "easeOut"},
      {start: 0, end: 0.7, property: "opacity", from: styles.minimal ? 0.06 : 0.12, to: 0.02, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-glow`,
        type: "glow",
        layer: "background" as const,
        x: primary.x - primary.width * 0.12,
        y: primary.y - primary.height * 0.12,
        width: primary.width * 1.24,
        height: primary.height * 1.24,
        fill: glowColor,
        opacity: styles.minimal ? 0.06 : 0.12,
        animations,
      },
    ];
  }

  if (type === "coffee" || type === "battery" || type === "gear") {
    const glowColor = primary.stroke ?? primary.fill ?? accent ?? "#FFFFFF";
    const animations: AnimationKeyframe[] = [
      {start: 0, end: 0.35, property: "scale", from: 0.95, to: 1.12, easing: "easeOut"},
      {start: 0, end: 0.8, property: "opacity", from: styles.minimal ? 0.05 : 0.1, to: 0.02, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-glow`,
        type: "glow",
        layer: "background" as const,
        x: primary.x - primary.width * 0.12,
        y: primary.y - primary.height * 0.12,
        width: primary.width * 1.24,
        height: primary.height * 1.24,
        fill: glowColor,
        opacity: styles.minimal ? 0.05 : 0.1,
        animations,
      },
    ];
  }

  if (type === "headphones") {
    const color = primary.stroke ?? accent ?? "#A78BFA";
    const baseOpacity = styles.minimal ? 0.06 : 0.14;

    // Secondary elements don't get the spec duration passed in; approximate from the primary's timeline.
    const approxDuration = Math.max(
      2.2,
      ...(primary.animations ?? [])
        .map((kf) => kf.end)
        .filter((v) => Number.isFinite(v) && v > 0),
    );

    const drawDone = (() => {
      const candidates = (primary.animations ?? [])
        .filter((kf) => kf.property === "draw" && kf.to >= 1)
        .map((kf) => kf.end)
        .filter((value) => Number.isFinite(value) && value > 0);
      return candidates.length ? Math.min(...candidates) : 1.1;
    })();

    // Two bursts per loop makes it feel like "music", not a single generic reveal.
    const burst1 = Math.min(drawDone + 0.05, Math.max(0.6, drawDone + 0.05));
    const burst2 = Math.min(
      burst1 + Math.max(0.9, approxDuration * 0.32),
      Math.max(burst1 + 0.75, approxDuration - 1.05),
    );

    const makeBurst = (
      start: number,
      intensity: number,
      scaleTo: number,
    ): AnimationKeyframe[] => {
      const drawEnd = Math.min(start + 0.42, approxDuration - 0.1);
      const fadeEnd = Math.min(start + 1.12, approxDuration);
      const peakOpacity = baseOpacity * intensity;
      return [
        {start, end: drawEnd, property: "draw", from: 0, to: 1, easing: "easeOut"},
        {start, end: drawEnd, property: "opacity", from: 0, to: peakOpacity, easing: "easeOut"},
        {start: drawEnd, end: fadeEnd, property: "opacity", from: peakOpacity, to: 0, easing: "easeOut"},
        {start, end: fadeEnd, property: "scale", from: 0.9, to: scaleTo, easing: "easeOut"},
      ];
    };

    const innerBase = [
      ...makeBurst(burst1, styles.bold ? 1.15 : 1.0, styles.bold ? 1.22 : 1.18),
      ...makeBurst(burst2, styles.bold ? 1.0 : 0.92, styles.bold ? 1.2 : 1.16),
    ];

    const outerBase = [
      ...makeBurst(burst1 + 0.08, styles.bold ? 0.9 : 0.8, styles.bold ? 1.3 : 1.26),
      ...makeBurst(burst2 + 0.08, styles.bold ? 0.8 : 0.72, styles.bold ? 1.28 : 1.24),
    ];

    const innerW = primary.width * 0.92;
    const innerH = primary.height * 0.92;
    const outerW = primary.width * 1.08;
    const outerH = primary.height * 1.08;

    return [
      {
        id: `${primary.id}-wave-left-inner`,
        type: "wave",
        layer: "background" as const,
        x: primary.x - primary.width * 0.34,
        y: primary.y + primary.height * 0.02,
        width: innerW,
        height: innerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 1),
        glowColor: color,
        glowStrength: styles.neon ? 0.75 : 0.58,
        opacity: 0,
        animations: innerBase,
      },
      {
        id: `${primary.id}-wave-right-inner`,
        type: "wave",
        layer: "background" as const,
        x: primary.x + primary.width * 0.34,
        y: primary.y + primary.height * 0.02,
        width: innerW,
        height: innerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 1),
        glowColor: color,
        glowStrength: styles.neon ? 0.75 : 0.58,
        opacity: 0,
        animations: innerBase.map((kf) =>
          // Slight stereo stagger.
          kf.start >= burst1 ? {...kf, start: kf.start + 0.03, end: kf.end + 0.03} : kf,
        ),
      },
      {
        id: `${primary.id}-wave-left-outer`,
        type: "wave",
        layer: "background" as const,
        x: primary.x - primary.width * 0.44,
        y: primary.y - primary.height * 0.02,
        width: outerW,
        height: outerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 2),
        glowColor: color,
        glowStrength: styles.neon ? 0.85 : 0.66,
        opacity: 0,
        animations: outerBase,
      },
      {
        id: `${primary.id}-wave-right-outer`,
        type: "wave",
        layer: "background" as const,
        x: primary.x + primary.width * 0.44,
        y: primary.y - primary.height * 0.02,
        width: outerW,
        height: outerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 2),
        glowColor: color,
        glowStrength: styles.neon ? 0.85 : 0.66,
        opacity: 0,
        animations: outerBase.map((kf) =>
          kf.start >= burst1 ? {...kf, start: kf.start + 0.03, end: kf.end + 0.03} : kf,
        ),
      },
    ];
  }

  if (type === "mic") {
    const color = accent ?? primary.stroke ?? "#EF4444";
    const baseOpacity = styles.minimal ? 0.06 : 0.16;

    // Place mic waves around the mic body.
    const innerW = primary.width * 0.9;
    const innerH = primary.height * 0.9;
    const outerW = primary.width * 1.05;
    const outerH = primary.height * 1.05;

    // Phase 1 timing: waves loop from ~0.7s onward.
    const start = 0.7;
    const cycle = 0.6;
    const stagger = 0.3;

    const waveCycle = (t0: number, intensity: number, scaleTo: number): AnimationKeyframe[] => {
      const t1 = Math.min(t0 + cycle, 3.0);
      const peak = baseOpacity * intensity;
      return [
        {start: t0, end: Math.min(t0 + 0.06, t1), property: "opacity", from: 0, to: peak, easing: "easeOut"},
        {start: Math.min(t0 + 0.06, t1), end: t1, property: "opacity", from: peak, to: 0, easing: "easeOut"},
        {start: t0, end: t1, property: "scale", from: 1, to: scaleTo, easing: "easeOut"},
      ];
    };

    const repeat = (offset: number, intensity: number, scaleTo: number) => {
      const animations: AnimationKeyframe[] = [];
      for (let t = start + offset; t < 3.01; t += cycle) {
        animations.push(...waveCycle(t, intensity, scaleTo));
      }
      return animations;
    };

    const innerAnims = repeat(0, 1.0, 1.4);
    const outerAnims = repeat(stagger, 0.8, 1.55);

    // REC indicator in top-right (Phase 1: ~920x160 on 1080x1920).
    const dotSize = 20;
    const dotX = Math.round(canvas.width * 0.85);
    const dotY = Math.round(canvas.height * 0.083);

    const recAppearStart = 0.4;
    const recAppearEnd = 0.7;

    const dotAnimations: AnimationKeyframe[] = [
      {start: recAppearStart, end: recAppearEnd, property: "opacity", from: 0, to: 1, easing: "spring"},
      {start: recAppearStart, end: recAppearEnd, property: "scale", from: 0.2, to: 1, easing: "spring"},
      // Pulse every 0.8s starting at 0.7s.
      {start: 0.7, end: 0.9, property: "scale", from: 1, to: 1.3, easing: "easeInOut"},
      {start: 0.9, end: 1.1, property: "scale", from: 1.3, to: 1, easing: "easeInOut"},
      {start: 1.5, end: 1.7, property: "scale", from: 1, to: 1.3, easing: "easeInOut"},
      {start: 1.7, end: 1.9, property: "scale", from: 1.3, to: 1, easing: "easeInOut"},
      {start: 2.3, end: 2.5, property: "scale", from: 1, to: 1.3, easing: "easeInOut"},
      {start: 2.5, end: 2.7, property: "scale", from: 1.3, to: 1, easing: "easeInOut"},
    ];

    const recTextAnimations: AnimationKeyframe[] = [
      {start: recAppearStart, end: recAppearEnd, property: "opacity", from: 0, to: 1, easing: "easeOut"},
    ];

    return [
      // Waves: inner
      {
        id: `${primary.id}-wave-left-inner`,
        type: "wave",
        layer: "background" as const,
        x: primary.x - primary.width * 0.38,
        y: primary.y + primary.height * 0.12,
        width: innerW,
        height: innerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 2),
        glowColor: color,
        glowStrength: styles.neon ? 0.8 : 0.65,
        opacity: 0,
        animations: innerAnims,
      },
      {
        id: `${primary.id}-wave-right-inner`,
        type: "wave",
        layer: "background" as const,
        x: primary.x + primary.width * 0.38,
        y: primary.y + primary.height * 0.12,
        width: innerW,
        height: innerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 2),
        glowColor: color,
        glowStrength: styles.neon ? 0.8 : 0.65,
        opacity: 0,
        animations: innerAnims.map((kf) => ({...kf, start: kf.start + 0.02, end: kf.end + 0.02})),
      },
      // Waves: outer
      {
        id: `${primary.id}-wave-left-outer`,
        type: "wave",
        layer: "background" as const,
        x: primary.x - primary.width * 0.5,
        y: primary.y + primary.height * 0.08,
        width: outerW,
        height: outerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 3),
        glowColor: color,
        glowStrength: styles.neon ? 0.9 : 0.72,
        opacity: 0,
        animations: outerAnims,
      },
      {
        id: `${primary.id}-wave-right-outer`,
        type: "wave",
        layer: "background" as const,
        x: primary.x + primary.width * 0.5,
        y: primary.y + primary.height * 0.08,
        width: outerW,
        height: outerH,
        stroke: color,
        strokeWidth: Math.max(3, (primary.strokeWidth ?? 6) - 3),
        glowColor: color,
        glowStrength: styles.neon ? 0.9 : 0.72,
        opacity: 0,
        animations: outerAnims.map((kf) => ({...kf, start: kf.start + 0.02, end: kf.end + 0.02})),
      },
      // REC dot + label
      {
        id: `${primary.id}-rec-dot`,
        type: "glow",
        layer: "foreground" as const,
        x: dotX - dotSize / 2,
        y: dotY - dotSize / 2,
        width: dotSize,
        height: dotSize,
        fill: color,
        glowColor: color,
        glowStrength: 0.85,
        opacity: 0,
        animations: dotAnimations,
      },
      {
        id: `${primary.id}-rec-text`,
        type: "text",
        layer: "foreground" as const,
        x: dotX + 18,
        y: dotY - 14,
        width: 70,
        height: 28,
        fill: color,
        text: "REC",
        fontSize: 72,
        fontWeight: 800,
        opacity: 0,
        animations: recTextAnimations,
      },
    ];
  }

  if (
    type === "lock" ||
    type === "cart" ||
    type === "search" ||
    type === "home" ||
    type === "avatar" ||
    type === "plane" ||
    type === "download" ||
    type === "calendar" ||
    type === "trend" ||
    type === "wallet" ||
    type === "trophy" ||
    type === "pie" ||
    type === "laptop" ||
    type === "camera"
  ) {
    const ringColor = primary.stroke ?? accent ?? "#FFFFFF";
    const animations: AnimationKeyframe[] = [
      {start: 0.05, end: 0.3, property: "scale", from: 0.9, to: styles.bold ? 1.22 : 1.18, easing: "easeOut"},
      {start: 0.05, end: 0.7, property: "opacity", from: styles.minimal ? 0.06 : 0.12, to: 0, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-ring`,
        type: "ring",
        layer: "background" as const,
        x: primary.x,
        y: primary.y,
        width: primary.width,
        height: primary.height,
        stroke: ringColor,
        strokeWidth: 2,
        opacity: styles.minimal ? 0.06 : 0.12,
        animations,
      },
    ];
  }

  if (type === "phone") {
    const drawDone = (() => {
      const candidates = (primary.animations ?? [])
        .filter((kf) => kf.property === "draw" && kf.to >= 1)
        .map((kf) => kf.end)
        .filter((value) => Number.isFinite(value) && value > 0);
      return candidates.length ? Math.min(...candidates) : 0.95;
    })();

    const glowStart = Math.min(drawDone + 0.04, 1.2);
    const glowPeak = Math.min(glowStart + 0.18, glowStart + 0.28);
    const glowEnd = Math.min(glowStart + 0.85, glowStart + 1.2);
    const glowColor = primary.stroke ?? accent ?? "#FFFFFF";
    const baseOpacity = styles.minimal ? 0.06 : 0.11;

    const animations: AnimationKeyframe[] = [
      {start: glowStart, end: glowPeak, property: "scale", from: 0.88, to: 1.22, easing: "easeOut"},
      {start: glowStart, end: glowPeak, property: "opacity", from: 0, to: baseOpacity, easing: "easeOut"},
      {start: glowPeak, end: glowEnd, property: "opacity", from: baseOpacity, to: 0, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-screen-glow`,
        type: "glow",
        layer: "background" as const,
        x: primary.x - primary.width * 0.08,
        y: primary.y - primary.height * 0.06,
        width: primary.width * 1.16,
        height: primary.height * 1.12,
        fill: glowColor,
        glowColor,
        glowStrength: styles.minimal ? 0.3 : 0.55,
        opacity: baseOpacity,
        animations,
      },
    ];
  }

  if (type === "barchart") {
    const ringColor = primary.stroke ?? accent ?? "#FFFFFF";

    const drawDone = (() => {
      const candidates = (primary.animations ?? [])
        .filter((kf) => kf.property === "draw" && kf.to >= 1)
        .map((kf) => kf.end)
        .filter((value) => Number.isFinite(value) && value > 0);
      return candidates.length ? Math.min(...candidates) : 1.6;
    })();

    const ringAnimations: AnimationKeyframe[] = [
      {start: 0.05, end: 0.3, property: "scale", from: 0.9, to: styles.bold ? 1.22 : 1.18, easing: "easeOut"},
      {start: 0.05, end: 0.7, property: "opacity", from: styles.minimal ? 0.06 : 0.12, to: 0, easing: "easeOut"},
    ];

    const highlightStart = Math.min(drawDone + 0.06, 2.6);
    const highlightPeak = Math.min(highlightStart + 0.2, highlightStart + 0.32);
    const highlightEnd = Math.min(highlightStart + 0.95, highlightStart + 1.35);
    const highlightOpacity = styles.minimal ? 0.08 : 0.14;

    const highlightAnimations: AnimationKeyframe[] = [
      {start: highlightStart, end: highlightPeak, property: "scale", from: 0.65, to: 1.35, easing: "easeOut"},
      {start: highlightStart, end: highlightPeak, property: "opacity", from: 0, to: highlightOpacity, easing: "easeOut"},
      {start: highlightPeak, end: highlightEnd, property: "opacity", from: highlightOpacity, to: 0, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-ring`,
        type: "ring",
        layer: "background" as const,
        x: primary.x,
        y: primary.y,
        width: primary.width,
        height: primary.height,
        stroke: ringColor,
        strokeWidth: 2,
        opacity: styles.minimal ? 0.06 : 0.12,
        animations: ringAnimations,
      },
      {
        id: `${primary.id}-highlight`,
        type: "glow",
        layer: "background" as const,
        // Roughly align to the tallest (accent) bar in the BarChart viewBox.
        x: primary.x + primary.width * 0.58,
        y: primary.y + primary.height * 0.26,
        width: primary.width * 0.46,
        height: primary.height * 0.46,
        fill: "#6366F1",
        glowColor: "#6366F1",
        glowStrength: styles.minimal ? 0.25 : 0.45,
        opacity: highlightOpacity,
        animations: highlightAnimations,
      },
    ];
  }

  if (type === "pin") {
    const impactTime = (() => {
      const candidates = (primary.animations ?? [])
        .filter((kf) => kf.property === "translateY" && kf.to === 0 && kf.from < 0)
        .map((kf) => kf.end)
        .filter((value) => Number.isFinite(value) && value > 0);

      return candidates.length ? Math.min(...candidates) : 0.32;
    })();

    const shadowAnimations: AnimationKeyframe[] = [
      {start: 0, end: impactTime, property: "scale", from: 0.35, to: 1, easing: "easeOut"},
      {start: 0, end: impactTime, property: "opacity", from: 0.02, to: 0.18, easing: "easeOut"},
      {start: impactTime, end: impactTime + 0.45, property: "opacity", from: 0.18, to: 0.12, easing: "easeOut"},
    ];

    return [
      {
        id: `${primary.id}-shadow`,
        type: "shadow",
        layer: "background" as const,
        x: primary.x + primary.width * 0.12,
        y: primary.y + primary.height * 0.74,
        width: primary.width * 0.76,
        height: primary.height * 0.28,
        fill: "#000000",
        opacity: 0.16,
        animations: shadowAnimations,
      },
      ...(hints.drop || hints.energetic
        ? (() => {
            const rippleAnimations: AnimationKeyframe[] = [
              {start: impactTime, end: impactTime + 0.65, property: "scale", from: 0.7, to: 1.45, easing: "easeOut"},
              {start: impactTime, end: impactTime + 0.65, property: "opacity", from: styles.minimal ? 0.18 : 0.28, to: 0, easing: "easeOut"},
            ];

            return [
            {
              id: `${primary.id}-ripple`,
              type: "ring" as const,
              layer: "background" as const,
              x: primary.x + primary.width * 0.16,
              y: primary.y + primary.height * 0.7,
              width: primary.width * 0.68,
              height: primary.height * 0.3,
              stroke: accent ?? "#EF4444",
              strokeWidth: 2,
              opacity: 0.22,
              animations: rippleAnimations,
            },
            ];
          })()
        : []),
    ];
  }

  if (type === "star" && (hints.burst || hints.glow)) {
    const peakTime = (() => {
      const peakCandidates = (primary.animations ?? [])
        .filter((kf) => kf.property === "scale" && kf.to > 1 && kf.end > 0)
        .map((kf) => kf.end)
        .filter((value) => Number.isFinite(value) && value > 0);

      // For stars, the "pop" peak is typically the second scale keyframe end.
      return peakCandidates.length ? peakCandidates[Math.min(1, peakCandidates.length - 1)] : 0.55;
    })();

    const sparkStart = Math.max(0, peakTime - 0.12);
    const sparkEnd = peakTime + (hints.burst ? 0.35 : 0.28);
    const sparkOpacity = styles.minimal ? 0.14 : 0.18;

    const animations: AnimationKeyframe[] = [
      {start: sparkStart, end: peakTime + 0.08, property: "scale", from: 0.72, to: 1.22, easing: "easeOut"},
      {start: sparkStart, end: peakTime + 0.08, property: "opacity", from: sparkOpacity, to: sparkOpacity, easing: "linear"},
      {start: peakTime + 0.08, end: sparkEnd, property: "opacity", from: sparkOpacity, to: 0, easing: "easeOut"},
    ];
    return [
      {
        id: `${primary.id}-spark`,
        type: "spark",
        layer: "foreground" as const,
        x: primary.x - primary.width * 0.06,
        y: primary.y - primary.height * 0.06,
        width: primary.width * 1.12,
        height: primary.height * 1.12,
        stroke: accent ?? "#FBBF24",
        strokeWidth: 4,
        opacity: 0.18,
        animations,
      },
    ];
  }

  if (type === "burger") {
    const impactTime = (() => {
      const candidates = (primary.animations ?? [])
        .filter((kf) => kf.property === "translateY" && kf.to === 0)
        .map((kf) => kf.end)
        .filter((value) => Number.isFinite(value) && value > 0);

      return candidates.length ? Math.min(...candidates) : 0.5;
    })();

    const steamStart = Math.min(impactTime + 0.9, 1.9);
    const steamDrawEnd = Math.min(steamStart + 0.45, impactTime + 1.3);
    const steamHoldEnd = Math.min(steamStart + 1.0, impactTime + 1.7);
    const steamEnd = Math.min(steamStart + 1.8, Math.max(steamHoldEnd + 0.4, 3.3));

    const shadowAnimations: AnimationKeyframe[] = [
      {start: 0, end: impactTime, property: "scale", from: 0.5, to: 1, easing: "easeOut"},
      {start: 0, end: impactTime, property: "opacity", from: 0.02, to: styles.minimal ? 0.08 : 0.14, easing: "easeOut"},
      {start: impactTime, end: impactTime + 0.6, property: "opacity", from: styles.minimal ? 0.08 : 0.14, to: styles.minimal ? 0.06 : 0.12, easing: "easeOut"},
    ];

    const steamAnimations: AnimationKeyframe[] = [
      {start: steamStart, end: steamDrawEnd, property: "draw", from: 0, to: 1, easing: "easeOut"},
      {start: steamStart, end: steamDrawEnd, property: "opacity", from: 0, to: 0.55, easing: "easeOut"},
      {start: steamDrawEnd, end: steamEnd, property: "opacity", from: 0.55, to: 0, easing: "easeOut"},
      {start: steamStart, end: steamHoldEnd, property: "translateX", from: -4, to: 4, easing: "easeInOut"},
      {start: steamHoldEnd, end: steamEnd, property: "translateX", from: 4, to: -2, easing: "easeInOut"},
      {start: steamStart, end: steamEnd, property: "translateY", from: 6, to: -10, easing: "easeInOut"},
    ];

    return [
      {
        id: `${primary.id}-shadow`,
        type: "shadow",
        layer: "background" as const,
        x: primary.x + primary.width * 0.1,
        y: primary.y + primary.height * 0.72,
        width: primary.width * 0.8,
        height: primary.height * 0.24,
        fill: "#000000",
        opacity: styles.minimal ? 0.08 : 0.14,
        animations: shadowAnimations,
      },
      {
        id: `${primary.id}-steam`,
        type: "steam",
        layer: "foreground" as const,
        x: primary.x + primary.width * 0.3,
        y: primary.y - primary.height * 0.12,
        width: primary.width * 0.4,
        height: primary.height * 0.4,
        stroke: "#D4D4D8",
        strokeWidth: 4,
        opacity: 0,
        animations: steamAnimations,
      },
    ];
  }

  return [];
};

const normalizeElementForType = (
  element: AnimatedElement,
  promptType: ShapeType,
  promptAccent: string | undefined,
  format: CanvasFormat,
  hints: MotionHints,
): AnimatedElement => {
  const effectiveType = element.type ?? promptType;
  const defaultSize = getDefaultSize(effectiveType, format);
  const normalizedWidth = Math.max(element.width || defaultSize, defaultSize);
  const normalizedHeight = Math.max(element.height || defaultSize, defaultSize);
  const {offsetX, offsetY} = getOpticalOffsets(effectiveType);
  const layer = element.layer ?? inferDefaultLayerForType(effectiveType);

  if (effectiveType === "checkmark") {
    return normalizeViewBoxForType({
      ...element,
      type: "checkmark",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#22C55E",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 10,
      opacity: element.opacity ?? 1,
      flash: element.flash ?? true,
      offsetX,
      offsetY,
    });
  }

  if (effectiveType === "bell") {
    return normalizeViewBoxForType({
      ...element,
      type: "bell",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FACC15",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      trail: element.trail ?? (hints.swing || hints.energetic),
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FACC15") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.8 : undefined),
      offsetX,
      offsetY,
    });
  }

  if (effectiveType === "arrow") {
    return normalizeViewBoxForType({
      ...element,
      type: "arrow",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 8,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    });
  }

  if (effectiveType === "play") {
    return normalizeViewBoxForType({
      ...element,
      type: "play",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: element.fill ?? promptAccent ?? "#FFFFFF",
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.55 : undefined),
      offsetX,
      offsetY,
    });
  }

  if (effectiveType === "search") {
    return {
      ...element,
      type: "search",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "wifi") {
    return {
      ...element,
      type: "wifi",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "lock") {
    return {
      ...element,
      type: "lock",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "cart") {
    return {
      ...element,
      type: "cart",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "coffee") {
    return {
      ...element,
      type: "coffee",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "home") {
    return {
      ...element,
      type: "home",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "battery") {
    return {
      ...element,
      type: "battery",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: element.fill ?? promptAccent,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "avatar") {
    return {
      ...element,
      type: "avatar",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "gear") {
    return {
      ...element,
      type: "gear",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "plane") {
    return {
      ...element,
      type: "plane",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "mic") {
    return {
      ...element,
      type: "mic",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "download") {
    return {
      ...element,
      type: "download",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "calendar") {
    return {
      ...element,
      type: "calendar",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "barchart") {
    return {
      ...element,
      type: "barchart",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: element.fill ?? promptAccent ?? "#3B82F6",
      stroke: element.stroke ?? "#334155",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 4,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.fill ?? promptAccent ?? "#6366F1") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.55 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "trend") {
    return {
      ...element,
      type: "trend",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#22C55E",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#22C55E") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.55 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "wallet") {
    return {
      ...element,
      type: "wallet",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "trophy") {
    return {
      ...element,
      type: "trophy",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: element.fill ?? promptAccent,
      stroke: element.stroke ?? promptAccent ?? "#FBBF24",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FBBF24") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.65 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "pie") {
    return {
      ...element,
      type: "pie",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: element.fill ?? promptAccent ?? "#3B82F6",
      stroke: element.stroke ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.fill ?? promptAccent ?? "#3B82F6") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "phone") {
    return {
      ...element,
      type: "phone",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "headphones") {
    return {
      ...element,
      type: "headphones",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "laptop") {
    return {
      ...element,
      type: "laptop",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "camera") {
    return {
      ...element,
      type: "camera",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: element.stroke ?? promptAccent ?? "#FFFFFF",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 6,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? (hints.glow ? (element.stroke ?? promptAccent ?? "#FFFFFF") : undefined),
      glowStrength: element.glowStrength ?? (hints.glow ? 0.45 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "burger") {
    return normalizeViewBoxForType({
      ...element,
      type: "burger",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: undefined,
      stroke: undefined,
      strokeWidth: undefined,
      opacity: element.opacity ?? 1,
      offsetX,
      offsetY,
    });
  }

  if (effectiveType === "star") {
    return {
      ...element,
      type: "star",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: element.fill ?? promptAccent ?? "#FBBF24",
      stroke: undefined,
      strokeWidth: undefined,
      opacity: element.opacity ?? 1,
      glowColor: element.glowColor ?? ((hints.burst || hints.glow) ? (element.fill ?? promptAccent ?? "#FBBF24") : undefined),
      glowStrength: element.glowStrength ?? ((hints.burst || hints.glow) ? 0.7 : undefined),
      offsetX,
      offsetY,
    };
  }

  if (effectiveType === "pin") {
    return {
      ...element,
      type: "pin",
      layer,
      width: normalizedWidth,
      height: normalizedHeight,
      fill: element.fill ?? promptAccent ?? "#EF4444",
      stroke: element.stroke ?? "#B91C1C",
      strokeWidth:
        typeof element.strokeWidth === "number" && element.strokeWidth > 0
          ? element.strokeWidth
          : 4,
      opacity: element.opacity ?? 1,
      shadowColor: element.shadowColor ?? "#000000",
      shadowBlur: element.shadowBlur ?? 16,
      ripple: element.ripple ?? (hints.drop || hints.energetic),
      offsetX,
      offsetY,
    };
  }

  return normalizeViewBoxForType({
    ...element,
    type: "heart",
    layer,
    width: normalizedWidth,
    height: normalizedHeight,
    fill: element.fill ?? promptAccent ?? "#FF2D55",
    stroke: undefined,
    strokeWidth: undefined,
    opacity: element.opacity ?? 0.92,
    glowColor: element.glowColor ?? (hints.glow ? (element.fill ?? promptAccent ?? "#FF2D55") : undefined),
    glowStrength: element.glowStrength ?? (hints.glow ? (hints.subtle ? 0.45 : 0.75) : undefined),
    offsetX,
    offsetY,
  });
};

const stripViewBoxForNonScene = (element: AnimatedElement): AnimatedElement => {
  // Only scene elements use non-100x100 coordinates. For icons, always use the renderer default (0 0 100 100).
  const keep =
    element.type === "rocket" ||
    element.type === "plant" ||
    element.type === "truck" ||
    element.type === "doctor" ||
    element.type === "solar" ||
    element.type === "notifstack" ||
    element.type === "globe" ||
    element.type === "desk" ||
    element.type === "certificate";

  if (keep) return element;

  return {
    ...element,
    viewBoxWidth: undefined,
    viewBoxHeight: undefined,
  };
};

const normalizeTemplateElement = (
  element: AnimatedElement,
  promptAccent: string | undefined,
  format: CanvasFormat,
  hints: MotionHints,
): AnimatedElement => {
  const withLayer = ensureLayer(element);
  if (
    withLayer.type === "text" ||
    withLayer.type === "panel" ||
    withLayer.type === "glow" ||
    withLayer.type === "ring" ||
    withLayer.type === "spark" ||
    withLayer.type === "shadow" ||
    withLayer.type === "steam" ||
    withLayer.type === "wave"
  ) {
    return normalizeViewBoxForType(withLayer);
  }

  if (getSceneViewBox(withLayer.type)) {
    const {offsetX, offsetY} = getOpticalOffsets(withLayer.type);
    return normalizeViewBoxForType({
      ...withLayer,
      offsetX,
      offsetY,
    });
  }

  return normalizeViewBoxForType(normalizeElementForType(withLayer, withLayer.type, promptAccent, format, hints));
};

export const normalizeGeneratedSpec = (
  candidate: unknown,
  request: PromptRequest,
): AnimationSpec => {
  const prompt = request.prompt.trim();
  const format = request.canvasFormat ?? parseCanvasFormat(prompt);
  const background = parseBackgroundColor(prompt) ?? "#111111";
  const styles = extractStyleHints(prompt);
  const parsedAccent = parseAccentColor(prompt);
  const duration = Math.max(1.2, Math.min(parseDuration(prompt) ?? 2.5, 6));
  const loop = parseLoop(prompt);
  const hints = extractMotionHints(prompt);
  const canvas = getCanvas(format, background);
  const {type} = routePromptToType(request);
  if (type === "text") {
    const textSpec = buildTextAnimationSpec(request);
    return animationSpecSchema.parse({
      ...textSpec,
      elements: textSpec.elements.map((element) =>
        normalizeTemplateElement(element, parseAccentColor(request.prompt), format, hints),
      ),
    });
  }
  if (shouldBuildObjectScene(request, type)) {
    const sceneSpec = buildObjectSceneSpec(request, type);
    return animationSpecSchema.parse({
      ...sceneSpec,
      elements: sceneSpec.elements.map((element) =>
        normalizeTemplateElement(element, parseAccentColor(request.prompt), format, hints),
      ),
    });
  }
  const accent = getStyleAdjustedAccent(type, parsedAccent, styles) ?? parsedAccent;
  const size = getDefaultSize(type, format);
  const isScene =
    type === "rocket" ||
    type === "plant" ||
    type === "truck" ||
    type === "doctor" ||
    type === "solar" ||
    type === "notifstack" ||
    type === "globe" ||
    type === "desk" ||
    type === "certificate";
  const sceneViewBox = isScene ? getSceneViewBox(type) : null;
  const centeredX = isScene ? 0 : (canvas.width - size) / 2;
  const centeredY = isScene
    ? 0
    : format === "portrait" && type === "bell"
      ? Math.round(canvas.height * 0.44)
      : format === "portrait" && type === "mic"
        ? Math.round(canvas.height * 0.46 - size / 2)
      : format === "portrait" && type === "arrow"
        ? Math.round(canvas.height * 0.76)
        : (canvas.height - size) / 2;
  const {offsetX, offsetY} = getOpticalOffsets(type);
  const forceCenter = shouldForceCenter(prompt);
  const forceFormatCanvas = Boolean(request.canvasFormat) || hasExplicitCanvasFormat(prompt);
  const defaultStroke =
    accent ??
    (type === "bell"
      ? "#FACC15"
      : type === "arrow" ||
          type === "play" ||
          type === "wifi" ||
          type === "lock" ||
          type === "cart" ||
          type === "search" ||
          type === "coffee" ||
          type === "home" ||
          type === "battery" ||
          type === "avatar" ||
          type === "gear" ||
          type === "plane" ||
          type === "mic" ||
          type === "download" ||
          type === "calendar" ||
          type === "wallet" ||
          type === "phone" ||
          type === "headphones" ||
          type === "laptop" ||
          type === "camera"
        ? "#FFFFFF"
        : type === "barchart"
          ? "#334155"
          : type === "trend"
            ? "#22C55E"
            : type === "trophy"
              ? "#FBBF24"
        : type === "pin"
          ? "#B91C1C"
          : "#22C55E");
  const defaultStrokeWidth =
    type === "bell"
      ? 6
      : type === "pin"
        ? 4
        : type === "arrow"
          ? 8
          : type === "play" ||
              type === "wifi" ||
              type === "lock" ||
              type === "cart" ||
              type === "search" ||
              type === "coffee" ||
              type === "home" ||
              type === "battery" ||
              type === "avatar" ||
              type === "gear" ||
              type === "plane" ||
              type === "mic" ||
              type === "download" ||
              type === "calendar" ||
              type === "wallet" ||
              type === "phone" ||
              type === "headphones" ||
              type === "laptop" ||
              type === "camera" ||
              type === "trend" ||
              type === "trophy" ||
              type === "pie"
            ? 6
            : type === "barchart"
              ? 4
            : 10;

  const explicitFill = parsePrimaryFillColor(prompt, type);
  const explicitStroke = parsePrimaryStrokeColor(prompt, type);

  // Phase 1 prompt 009: Lock -> Unlock is a multi-part icon with explicit choreography.
  // Implement it deterministically so it doesn't feel like a generic lock + ring.
  if (type === "lock" && normalizePrompt(prompt).includes("unlock")) {
    const normalized = normalizePrompt(prompt);

    const hex = /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi;
    const bodyFillMatches = Array.from(
      normalized.matchAll(/\block body fill\b[^\n#]*(#(?:[0-9a-f]{6}|[0-9a-f]{3}))\b/gi),
    ).map((m) => m[1]);
    const shackleStrokeMatches = Array.from(
      normalized.matchAll(/\bshackle stroke\b[^\n#]*(#(?:[0-9a-f]{6}|[0-9a-f]{3}))(?:[^#\n]*(#(?:[0-9a-f]{6}|[0-9a-f]{3})))?/gi),
    ).flatMap((m) => [m[1], m[2]].filter(Boolean) as string[]);

    const lockedBodyFill = bodyFillMatches[0] ?? "#64748B";
    const unlockedBodyFill = bodyFillMatches[1] ?? "#22C55E";
    const shackleLocked = shackleStrokeMatches[0] ?? "#94A3B8";
    const shackleUnlocked = shackleStrokeMatches[1] ?? "#16A34A";
    const keyholeFill = (normalized.match(/\bkeyhole fill\b[^\n#]*(#(?:[0-9a-f]{6}|[0-9a-f]{3}))\b/i)?.[1] ??
      background) as string;

    // Phase 1 says ~100px tall; we upscale slightly for readability in 1920x1080.
    const lockSize = format === "landscape" ? 260 : format === "portrait" ? 240 : 220;
    const x = (canvas.width - lockSize) / 2;
    const y = (canvas.height - lockSize) / 2;

    const entry: AnimationKeyframe[] = [
      {start: 0, end: 0.3, property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: 0.3, property: "scale", from: 0.5, to: 1, easing: "spring"},
    ];

    const shackleLift: AnimationKeyframe[] = [
      {start: 0.8, end: 1.1, property: "translateY", from: 0, to: -28, easing: "easeInOut"},
    ];

    const bodyToGreen: AnimationKeyframe[] = [
      {start: 1.1, end: 1.4, property: "opacity", from: 0, to: 1, easing: "easeOut"},
    ];

    const bodyFadeOut: AnimationKeyframe[] = [
      {start: 1.1, end: 1.4, property: "opacity", from: 1, to: 0, easing: "easeOut"},
    ];

    const shackleToGreen: AnimationKeyframe[] = [
      {start: 1.4, end: 1.65, property: "opacity", from: 0, to: 1, easing: "easeOut"},
    ];

    const shackleFadeOut: AnimationKeyframe[] = [
      {start: 1.4, end: 1.65, property: "opacity", from: 1, to: 0, easing: "easeOut"},
    ];

    const bounce: AnimationKeyframe[] = [
      {start: 1.65, end: 1.78, property: "scale", from: 1, to: 1.12, easing: "spring"},
      {start: 1.78, end: 1.9, property: "scale", from: 1.12, to: 1, easing: "easeOut"},
    ];

    const glowBurst: AnimationKeyframe[] = [
      {start: 1.9, end: 2.05, property: "scale", from: 0.9, to: 1.35, easing: "easeOut"},
      {start: 1.9, end: 2.05, property: "opacity", from: 0.0, to: 0.5, easing: "easeOut"},
      {start: 2.05, end: 2.3, property: "opacity", from: 0.5, to: 0.0, easing: "easeOut"},
    ];

    const elements: AnimatedElement[] = [
      {
        id: "lock-1-glow",
        type: "glow",
        layer: "background" as const,
        x: x - lockSize * 0.14,
        y: y - lockSize * 0.14,
        width: lockSize * 1.28,
        height: lockSize * 1.28,
        fill: unlockedBodyFill,
        opacity: 0,
        animations: glowBurst,
      },
      {
        id: "lock-1-shackle-locked",
        type: "lockshackle",
        layer: "main" as const,
        x,
        y,
        width: lockSize,
        height: lockSize,
        stroke: shackleLocked,
        strokeWidth: 6,
        opacity: 1,
        animations: [...entry, {start: 0, end: 0.95, property: "draw", from: 0, to: 1, easing: "easeInOut"}, ...shackleLift, ...shackleFadeOut, ...bounce],
      },
      {
        id: "lock-1-shackle-unlocked",
        type: "lockshackle",
        layer: "main" as const,
        x,
        y,
        width: lockSize,
        height: lockSize,
        stroke: shackleUnlocked,
        strokeWidth: 6,
        opacity: 0,
        animations: [
          // Keep hidden until the "color transition" beat.
          {start: 0, end: 1.4, property: "opacity", from: 0, to: 0, easing: "linear"},
          {start: 0, end: 0.95, property: "draw", from: 0, to: 1, easing: "easeInOut"},
          ...shackleLift,
          ...shackleToGreen,
          ...bounce,
        ],
      },
      {
        id: "lock-1-body-locked",
        type: "lockbody",
        layer: "main" as const,
        x,
        y,
        width: lockSize,
        height: lockSize,
        fill: lockedBodyFill,
        opacity: 1,
        animations: [...entry, ...bodyFadeOut, ...bounce],
      },
      {
        id: "lock-1-body-unlocked",
        type: "lockbody",
        layer: "main" as const,
        x,
        y,
        width: lockSize,
        height: lockSize,
        fill: unlockedBodyFill,
        opacity: 0,
        animations: [
          {start: 0, end: 1.1, property: "opacity", from: 0, to: 0, easing: "linear"},
          ...bodyToGreen,
          ...bounce,
        ],
      },
      {
        id: "lock-1-keyhole",
        type: "lockkeyhole",
        layer: "foreground" as const,
        x,
        y,
        width: lockSize,
        height: lockSize,
        fill: keyholeFill,
        opacity: 0,
        animations: entry,
      },
    ];

    return animationSpecSchema.parse({
      id: slugify(prompt),
      title: prompt,
      duration: Math.max(duration, 2.8),
      fps: 30,
      loop: false,
      canvas,
      elements,
    });
  }

  const primaryElement: AnimatedElement = {
    id: `${type}-1`,
    type,
    layer: "main" as const,
    x: centeredX,
    y: centeredY,
    width: isScene ? canvas.width : size,
    height: isScene ? canvas.height : size,
    viewBoxWidth: sceneViewBox?.width ?? undefined,
    viewBoxHeight: sceneViewBox?.height ?? undefined,
    offsetX,
    offsetY,
    fill:
      type === "heart"
        ? explicitFill ?? accent ?? "#FF2D55"
        : type === "star"
          ? explicitFill ?? accent ?? "#FBBF24"
          : type === "pin"
            ? explicitFill ?? accent ?? "#EF4444"
            : type === "play"
              ? accent ?? "#FFFFFF"
              : type === "battery"
                ? explicitFill ?? accent ?? "#22C55E"
            : undefined,
    stroke:
      type === "heart" || type === "star"
        ? undefined
        : explicitStroke ?? defaultStroke,
    strokeWidth:
      type === "heart" || type === "star"
        ? undefined
        : defaultStrokeWidth,
    opacity: type === "heart" ? 0.92 : 1,
    glowColor:
      type === "heart" && hints.glow
        ? parseGlowColor(prompt, type) ?? accent ?? explicitFill ?? "#FF2D55"
        : type === "star" && (hints.glow || hints.burst)
          ? accent ?? "#FBBF24"
          : undefined,
    glowStrength:
      type === "heart" && hints.glow
        ? getStyleAdjustedGlowStrength(hints.subtle ? 0.45 : 0.75, styles)
        : type === "star" && (hints.glow || hints.burst)
          ? getStyleAdjustedGlowStrength(0.7, styles)
          : undefined,
    trail: type === "bell" ? hints.swing || hints.energetic : undefined,
    flash: type === "checkmark" ? hints.bounce || hints.draw : undefined,
    ripple: type === "pin" ? hints.drop || hints.energetic : undefined,
    shadowColor: type === "pin" ? "#000000" : undefined,
    shadowBlur: type === "pin" ? 16 : undefined,
    animations: isScene || type === "rupee"
      ? [{start: 0, end: duration, property: "draw", from: 0, to: 1, easing: "linear"}]
      : getDefaultAnimations(type, duration, hints, styles, prompt),
  };

  const base = {
    id: slugify(prompt),
    title: prompt,
    duration,
    fps: 30,
    loop,
    canvas,
    // Secondary effects (glow/ring/shadow/steam/etc) are derived later after we normalize the main element.
    // Otherwise we'd risk double-inserting the same effect (base + derived) which can cause flicker/overdraw.
    elements: [primaryElement],
  };

  // Scene templates should be deterministic: ignore the model's element list entirely.
  if (
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
  ) {
    return animationSpecSchema.parse(base);
  }

  const merged =
    candidate && typeof candidate === "object"
      ? {
          ...base,
          ...candidate,
          canvas: {
            ...base.canvas,
            ...((candidate as Partial<AnimationSpec>).canvas ?? {}),
          },
          elements:
            Array.isArray((candidate as Partial<AnimationSpec>).elements) &&
            (candidate as Partial<AnimationSpec>).elements?.length
              ? (candidate as Partial<AnimationSpec>).elements
              : base.elements,
        }
      : base;

  if (forceFormatCanvas) {
    merged.canvas.width = base.canvas.width;
    merged.canvas.height = base.canvas.height;
  }

  if (forceCenter && Array.isArray(merged.elements) && merged.elements.length > 0) {
    merged.elements = merged.elements.map((element) => ({
      ...element,
      x: (merged.canvas.width - element.width) / 2,
      y:
        merged.canvas.height > merged.canvas.width && element.type === "bell"
          ? Math.round(merged.canvas.height * 0.44)
          : (merged.canvas.height - element.height) / 2,
    }));
  }

  if (Array.isArray(merged.elements)) {
    const effectTypes = new Set<ShapeType>(["ring", "glow", "spark", "shadow", "steam", "wave"]);

    const normalizedNonEffectElements = merged.elements
      .filter((element) => !effectTypes.has(element.type))
      .map((element) =>
        normalizeViewBoxForType(
          normalizeElementForType(ensureLayer(element), type, accent, format, hints),
        ),
      );

    // For some icons, keep choreography deterministic regardless of model output.
    // This prevents "random" timelines from the LLM from degrading motion quality.
    const deterministicTypes: ShapeType[] = [
      "burger",
      "barchart",
      "phone",
      "rocket",
      "plant",
      "truck",
      "doctor",
      "solar",
      "notifstack",
    ];
    if (deterministicTypes.includes(type)) {
      for (let i = 0; i < normalizedNonEffectElements.length; i += 1) {
        const element = normalizedNonEffectElements[i];
        if (element.type !== type) {
          continue;
        }

        normalizedNonEffectElements[i] = {
          ...element,
          animations: getDefaultAnimations(type, duration, hints, styles, prompt),
        };
      }
    }

    const primaryForEffects =
      normalizedNonEffectElements.find((element) => element.layer === "main") ??
      normalizedNonEffectElements[0];
    const explicitGlowColor = parseGlowColor(prompt, type);
    const derivedSecondaryElements = primaryForEffects
      ? buildSecondaryElements(type, primaryForEffects, accent, hints, styles, canvas, explicitGlowColor)
      : [];

    const preservedSecondaryElements = merged.elements
      .filter((element) => effectTypes.has(element.type))
      .filter((element) => isAllowedEffectForPromptType(type, element.type))
      .map((element) => normalizeViewBoxForType(ensureLayer(element)));

    merged.elements = [
      ...normalizedNonEffectElements,
      ...preservedSecondaryElements,
      ...derivedSecondaryElements,
    ]
      .map((element) => ensureLayer(element))
      .map((element) => normalizeViewBoxForType(element));
  }

  return animationSpecSchema.parse(merged);
};
