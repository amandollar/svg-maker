import type {PromptRequest} from "../engine/request";
import type {AnimatedElement, AnimationKeyframe, AnimationProperty, AnimationSpec, ShapeType} from "../engine/types";
import {
  extractStyleHints,
  includesAny,
  normalizePrompt,
  parseAccentColor,
  parseBackgroundColor,
  parseCanvasFormat,
  parseDuration,
} from "./prompt-helpers";
import {
  ensureSurfaceContrast,
  ensureTextContrast,
  fitTextBlock,
  resolveSceneDesignTokens,
  type SceneDesignTokens,
} from "./scene-design";

type CanvasSpec = {format: "square" | "portrait" | "landscape"; width: number; height: number; background: string};
type SceneVariant = "icon-lockup" | "media-card" | "dashboard-card" | "device-card";
type SearchCompositionVariant = "search-card" | "search-spotlight" | "search-dashboard";
type CartCompositionVariant = "cart-card" | "cart-spotlight" | "cart-checkout-stack";
type DownloadCompositionVariant = "download-card" | "download-spotlight" | "download-save-stack";
type SceneLookId = "romantic" | "cinematic" | "product" | "dashboard" | "editorial" | "neon";
type SceneStyle = {
  look: SceneLookId;
  background: string;
  accent: string;
  text: string;
  secondary: string;
  frame: string;
  surface: string;
  elevated: string;
  track: string;
  edge: string;
  design: SceneDesignTokens;
};
type ScenePayload = {
  headline?: string;
  subheadline?: string;
  kicker?: string;
};

const SCENE_READY_TYPES = new Set<ShapeType>([
  "heart",
  "bell",
  "play",
  "lock",
  "cart",
  "search",
  "battery",
  "calendar",
  "barchart",
  "trend",
  "wallet",
  "pie",
  "phone",
  "headphones",
  "laptop",
  "download",
  "gear",
  "mic",
]);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "generated-scene";

const getCanvas = (request: PromptRequest, background: string): CanvasSpec => {
  const format = request.canvasFormat ?? parseCanvasFormat(request.prompt);
  if (format === "portrait") return {format, width: 1080, height: 1920, background};
  if (format === "landscape") return {format, width: 1920, height: 1080, background};
  return {format, width: 1080, height: 1080, background};
};

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
  return {r: Number.parseInt(value.slice(0, 2), 16), g: Number.parseInt(value.slice(2, 4), 16), b: Number.parseInt(value.slice(4, 6), 16)};
};

const rgbToHex = ({r, g, b}: {r: number; g: number; b: number}) =>
  `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;

const mixHex = (from: string, to: string, amount: number) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const t = clamp(amount, 0, 1);
  return rgbToHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
};

const getReadableTextColor = (background: string) => {
  const {r, g, b} = hexToRgb(background);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.57 ? "#111827" : "#F8FAFC";
};

const getSecondaryTextColor = (background: string) => {
  const {r, g, b} = hexToRgb(background);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.57 ? "#475569" : "#CBD5E1";
};

const getSceneLook = (type: ShapeType, prompt: string, variant: SceneVariant): SceneLookId => {
  const styles = extractStyleHints(prompt);

  if (styles.neon) return "neon";
  if (styles.editorial || type === "calendar" || type === "pie") return "editorial";
  if (styles.soft || styles.playful || type === "heart" || type === "bell") return "romantic";
  if (variant === "media-card" || type === "play" || type === "headphones" || type === "mic") return "cinematic";
  if (variant === "dashboard-card" || type === "battery" || type === "trend" || type === "barchart" || type === "wallet") return "dashboard";
  if (variant === "device-card" || type === "phone" || type === "search" || type === "cart" || type === "laptop") return "product";
  return "neon";
};

const getLookDefaults = (look: SceneLookId, type: ShapeType) => {
  switch (look) {
    case "romantic":
      return {background: "#110814", accent: type === "bell" ? "#F97316" : "#FF4FA3"};
    case "cinematic":
      return {background: type === "headphones" || type === "mic" ? "#1B1027" : "#140E1F", accent: type === "play" ? "#F97316" : "#A855F7"};
    case "product":
      return {background: type === "cart" ? "#FFF4E8" : "#F5EFE6", accent: type === "cart" ? "#F97316" : "#2563EB"};
    case "dashboard":
      return {background: type === "battery" ? "#07190F" : "#071722", accent: type === "battery" ? "#84CC16" : "#22C55E"};
    case "editorial":
      return {background: type === "calendar" ? "#2A1539" : "#F5EBDD", accent: type === "calendar" ? "#F59E0B" : "#111827"};
    case "neon":
    default:
      return {background: type === "phone" ? "#0F1433" : "#08111F", accent: type === "phone" ? "#8B5CF6" : "#38BDF8"};
  }
};

const resolveSceneStyle = (prompt: string, type: ShapeType, variant: SceneVariant): SceneStyle => {
  const look = getSceneLook(type, prompt, variant);
  const defaults = getLookDefaults(look, type);
  const background = parseBackgroundColor(prompt) ?? defaults.background;
  const accent = parseAccentColor(prompt) ?? defaults.accent;
  const preferredLook = look === "romantic" ? "romantic" : look === "dashboard" ? "dashboard" : look === "editorial" ? "editorial" : "product";
  const design = resolveSceneDesignTokens(prompt, preferredLook);
  const text = ensureTextContrast(background, getReadableTextColor(background), design.minContrast);
  const secondary = ensureTextContrast(background, getSecondaryTextColor(background), Math.max(3, design.minContrast - 1.1));
  const frame = ensureSurfaceContrast(background, mixHex(background, text, design.frameMix), accent, 1.08);
  const surface = ensureSurfaceContrast(background, mixHex(background, accent, design.surfaceMix), accent, 1.12);
  const elevated = ensureSurfaceContrast(background, mixHex(background, accent, design.elevatedMix), accent, 1.16);
  const track = ensureSurfaceContrast(background, mixHex(frame, text, design.trackMix), accent, 1.1);
  const edge = ensureTextContrast(surface, mixHex(accent, text, design.edgeMix), 2.4);
  return {look, background, accent, text, secondary, frame, surface, elevated, track, edge, design};
};

const cleanCopy = (value: string) => value.replace(/^["'`\u2018\u2019\u201c\u201d]+|["'`\u2018\u2019\u201c\u201d]+$/g, "").replace(/\s+/g, " ").trim();

const parseLabeledValue = (prompt: string, labels: string[]) => {
  for (const label of labels) {
    const match = prompt.match(new RegExp(`(?:^|\\n)\\s*${label}\\s*:\\s*(.+)$`, "im"));
    if (match?.[1]) return cleanCopy(match[1]);
  }
  return undefined;
};

const extractQuotedSegments = (prompt: string) =>
  Array.from(prompt.matchAll(/["\u201c\u201d]([^"\u201c\u201d\n]{2,180})["\u201c\u201d]/g))
    .map((match) => cleanCopy(match[1] ?? ""))
    .filter(Boolean);

const extractWrittenText = (prompt: string) => {
  const quoted = extractQuotedSegments(prompt);
  if (quoted[0]) return quoted[0];
  const match = prompt.match(/\b(?:written|saying|text|title)\b\s+([a-z0-9 ,.'!?\-]{3,80})/i);
  return match?.[1] ? cleanCopy(match[1]) : undefined;
};

const wrapText = (text: string, maxCharsPerLine: number, maxLines: number) => {
  const words = cleanCopy(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [text];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const tentative = current ? `${current} ${word}` : word;
    if (tentative.length <= maxCharsPerLine || current.length === 0) {
      current = tentative;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }
  const used = lines.join(" ").split(/\s+/).filter(Boolean).length;
  const currentWords = current ? current.split(/\s+/).filter(Boolean).length : 0;
  const remaining = words.slice(used + currentWords);
  const tail = [current, ...remaining].filter(Boolean).join(" ").trim();
  if (tail) lines.push(tail);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s+\S*$/, "");
    return kept;
  }
  return lines.slice(0, maxLines);
};

const fitFontSize = (
  lines: string[],
  width: number,
  start: number,
  min: number,
  widthFactor: number,
  letterSpacing = 0,
) => {
  let size = start;
  while (size > min) {
    const widest = Math.max(...lines.map((line) => line.length));
    const estimated = widest * size * widthFactor + Math.max(0, widest - 1) * letterSpacing;
    if (estimated <= width) return size;
    size -= 2;
  }
  return min;
};

const pickFontFamily = (prompt: string) => {
  const styles = extractStyleHints(prompt);
  if (styles.editorial) return "Georgia, 'Times New Roman', serif";
  if (styles.premium) return "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  if (styles.bold || styles.neon) return "'Arial Black', 'Segoe UI', sans-serif";
  return "'Trebuchet MS', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
};

const buildTextElement = (element: Omit<AnimatedElement, "type">): AnimatedElement => ({
  ...element,
  type: "text",
  viewBoxWidth: element.viewBoxWidth ?? element.width,
  viewBoxHeight: element.viewBoxHeight ?? element.height,
  animations: element.animations ?? [],
});

const buildPanelElement = (element: Omit<AnimatedElement, "type">): AnimatedElement => ({
  ...element,
  type: "panel",
  viewBoxWidth: element.viewBoxWidth ?? element.width,
  viewBoxHeight: element.viewBoxHeight ?? element.height,
  animations: element.animations ?? [],
});

const buildSceneBackdropOrnaments = (
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
): AnimatedElement[] => {
  const inset = canvas.format === "landscape" ? 86 : 52;
  const width = canvas.width - inset * 2;
  const height = canvas.height - inset * 2;
  const centerX = Math.round((canvas.width - 320) / 2);
  const centerY = Math.round((canvas.height - 320) / 2);

  if (sceneStyle.look === "romantic") {
    return [
      {
        id: "backdrop-glow",
        type: "glow",
        layer: "background",
        x: centerX - 120,
        y: centerY - 80,
        width: 560,
        height: 560,
        fill: sceneStyle.accent,
        glowColor: sceneStyle.accent,
        glowStrength: 0.84,
        opacity: 0,
        animations: [
          {start: 0, end: Math.min(0.72, duration * 0.3), property: "opacity", from: 0, to: 0.12, easing: "easeOut"},
          {start: 0, end: Math.min(0.72, duration * 0.3), property: "scale", from: 0.82, to: 1, easing: "spring"},
        ],
      },
      {
        id: "backdrop-ring",
        type: "ring",
        layer: "background",
        x: canvas.width - 320,
        y: 110,
        width: 220,
        height: 220,
        stroke: sceneStyle.edge,
        strokeWidth: 5,
        opacity: 0,
        animations: [
          {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 0.42, easing: "easeOut"},
          {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "draw", from: 0, to: 1, easing: "easeInOut"},
        ],
      },
      {
        id: "backdrop-spark",
        type: "spark",
        layer: "background",
        x: 132,
        y: canvas.height - 320,
        width: 110,
        height: 110,
        stroke: sceneStyle.edge,
        strokeWidth: 5,
        opacity: 0,
        animations: [
          {start: 0.22, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 0.48, easing: "easeOut"},
          {start: 0.22, end: Math.min(0.88, duration * 0.38), property: "scale", from: 0.68, to: 1, easing: "spring"},
        ],
      },
    ];
  }

  if (sceneStyle.look === "cinematic") {
    return [
      buildPanelElement({
        id: "backdrop-top-band",
        layer: "background",
        x: inset,
        y: 72,
        width,
        height: canvas.format === "portrait" ? 26 : 18,
        fill: sceneStyle.edge,
        cornerRadius: 999,
        opacity: 0,
        animations: [{start: 0, end: Math.min(0.44, duration * 0.18), property: "opacity", from: 0, to: 0.34, easing: "easeOut"}],
      }),
      buildPanelElement({
        id: "backdrop-bottom-band",
        layer: "background",
        x: inset + Math.round(width * 0.16),
        y: canvas.height - 98,
        width: Math.round(width * 0.68),
        height: canvas.format === "portrait" ? 30 : 20,
        fill: sceneStyle.edge,
        cornerRadius: 999,
        opacity: 0,
        animations: [{start: 0.06, end: Math.min(0.5, duration * 0.2), property: "opacity", from: 0, to: 0.28, easing: "easeOut"}],
      }),
      {
        id: "backdrop-cinematic-glow",
        type: "glow",
        layer: "background",
        x: canvas.width - 420,
        y: 120,
        width: 420,
        height: 420,
        fill: sceneStyle.accent,
        glowColor: sceneStyle.accent,
        glowStrength: 0.7,
        opacity: 0,
        animations: [{start: 0, end: Math.min(0.68, duration * 0.28), property: "opacity", from: 0, to: 0.08, easing: "easeOut"}],
      },
    ];
  }

  if (sceneStyle.look === "product") {
    return [
      buildPanelElement({
        id: "backdrop-product-sheet-a",
        layer: "background",
        x: canvas.width - 390,
        y: 124,
        width: 250,
        height: 360,
        fill: sceneStyle.surface,
        cornerRadius: 42,
        opacity: 0,
        animations: [{start: 0.02, end: Math.min(0.48, duration * 0.2), property: "opacity", from: 0, to: 0.42, easing: "easeOut"}],
      }),
      buildPanelElement({
        id: "backdrop-product-sheet-b",
        layer: "background",
        x: canvas.width - 300,
        y: 190,
        width: 180,
        height: 270,
        fill: sceneStyle.elevated,
        cornerRadius: 36,
        opacity: 0,
        animations: [{start: 0.08, end: Math.min(0.54, duration * 0.24), property: "opacity", from: 0, to: 0.3, easing: "easeOut"}],
      }),
      {
        id: "backdrop-product-ring",
        type: "ring",
        layer: "background",
        x: 96,
        y: 110,
        width: 180,
        height: 180,
        stroke: sceneStyle.edge,
        strokeWidth: 5,
        opacity: 0,
        animations: [
          {start: 0.1, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 0.34, easing: "easeOut"},
          {start: 0.1, end: Math.min(0.82, duration * 0.34), property: "draw", from: 0, to: 1, easing: "easeInOut"},
        ],
      },
    ];
  }

  if (sceneStyle.look === "dashboard") {
    return [0.16, 0.34, 0.52, 0.7].map((ratio, index) =>
      buildPanelElement({
        id: `backdrop-dashboard-grid-${index}`,
        layer: "background",
        x: inset,
        y: Math.round(canvas.height * ratio),
        width: width,
        height: 4,
        fill: sceneStyle.edge,
        cornerRadius: 999,
        opacity: 0,
        animations: [
          {start: 0.04 + index * 0.04, end: Math.min(0.52 + index * 0.04, duration * 0.24), property: "opacity", from: 0, to: 0.2, easing: "easeOut"},
          {start: 0.04 + index * 0.04, end: Math.min(0.52 + index * 0.04, duration * 0.24), property: "scale", from: 0.2, to: 1, easing: "easeOut"},
        ],
      }),
    );
  }

  if (sceneStyle.look === "editorial") {
    return [
      buildPanelElement({
        id: "backdrop-editorial-rail",
        layer: "background",
        x: 72,
        y: 72,
        width: 20,
        height: canvas.height - 144,
        fill: sceneStyle.edge,
        cornerRadius: 999,
        opacity: 0,
        animations: [{start: 0, end: Math.min(0.42, duration * 0.18), property: "opacity", from: 0, to: 0.56, easing: "easeOut"}],
      }),
      buildPanelElement({
        id: "backdrop-editorial-rule",
        layer: "background",
        x: 116,
        y: 110,
        width: Math.round(canvas.width * 0.42),
        height: 8,
        fill: sceneStyle.edge,
        cornerRadius: 999,
        opacity: 0,
        animations: [{start: 0.06, end: Math.min(0.46, duration * 0.2), property: "opacity", from: 0, to: 0.5, easing: "easeOut"}],
      }),
    ];
  }

  return [
    {
      id: "backdrop-neon-ring",
      type: "ring",
      layer: "background",
      x: canvas.width - 300,
      y: canvas.height - 300,
      width: 200,
      height: 200,
      stroke: sceneStyle.edge,
      strokeWidth: 5,
      opacity: 0,
      animations: [
        {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 0.4, easing: "easeOut"},
        {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      ],
    },
    {
      id: "backdrop-neon-glow",
      type: "glow",
      layer: "background",
      x: 80,
      y: 90,
      width: 340,
      height: 340,
      fill: sceneStyle.accent,
      glowColor: sceneStyle.accent,
      glowStrength: 0.72,
      opacity: 0,
      animations: [{start: 0, end: Math.min(0.64, duration * 0.26), property: "opacity", from: 0, to: 0.08, easing: "easeOut"}],
    },
  ];
};

const appendMirrorAnimation = (
  animations: AnimationKeyframe[],
  property: AnimationProperty,
  start: number,
  peak: number,
  end: number,
  from: number,
  to: number,
  easing: AnimationKeyframe["easing"] = "easeInOut",
) => {
  if (!(start < peak && peak < end)) return;
  animations.push(
    {start, end: peak, property, from, to, easing},
    {start: peak, end, property, from: to, to: from, easing},
  );
};

const buildIconElement = (id: string, iconType: ShapeType, x: number, y: number, size: number, accent: string, duration: number): AnimatedElement => {
  const strokeTypes = new Set<ShapeType>(["checkmark", "bell", "arrow", "play", "wifi", "lock", "cart", "search", "coffee", "home", "battery", "avatar", "gear", "plane", "mic", "download", "calendar", "trend", "wallet", "trophy", "pie", "phone", "headphones", "laptop", "camera"]);
  const fillTypes = new Set<ShapeType>(["heart", "star", "pin"]);
  const animations: AnimationKeyframe[] = [
    {start: 0, end: Math.min(0.34, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
    {start: 0, end: Math.min(0.46, duration * 0.22), property: "scale", from: 0.78, to: 1, easing: "spring"},
  ];
  if (strokeTypes.has(iconType)) {
    animations.push({start: 0, end: Math.min(0.76, duration * 0.34), property: "draw", from: 0, to: 1, easing: "easeInOut"});
  }
  appendMirrorAnimation(animations, "translateY", Math.min(1.05, duration * 0.28), Math.min(1.8, duration * 0.48), Math.min(duration - 0.12, 2.7), 0, -10);
  return {
    id,
    type: iconType,
    layer: "foreground",
    x,
    y,
    width: size,
    height: size,
    fill: fillTypes.has(iconType) || iconType === "battery" ? accent : undefined,
    stroke: strokeTypes.has(iconType) ? accent : undefined,
    strokeWidth: strokeTypes.has(iconType) ? 6 : undefined,
    opacity: 0,
    animations,
  };
};

const buildSearchIconElement = (
  id: string,
  x: number,
  y: number,
  size: number,
  accent: string,
  duration: number,
): AnimatedElement => ({
  ...buildIconElement(id, "search", x, y, size, accent, duration),
  strokeWidth: size >= 180 ? 4 : 3.5,
});

const buildHeartSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, design} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const stacked = portrait || square;
  const frameX = portrait ? 82 : square ? 106 : 92;
  const frameY = portrait ? 230 : square ? 118 : 164;
  const frameWidth = portrait ? canvas.width - 164 : square ? canvas.width - 212 : canvas.width - 184;
  const frameHeight = portrait ? 1240 : square ? 844 : 720;
  const stageX = frameX + (square ? 68 : 44);
  const stageY = frameY + (square ? 56 : 54);
  const stageWidth = portrait ? frameWidth - 88 : square ? frameWidth - 136 : 430;
  const stageHeight = portrait ? 520 : square ? 338 : frameHeight - 108;
  const heartSize = portrait ? 250 : square ? 244 : 236;
  const heartX = stageX + Math.round((stageWidth - heartSize) / 2);
  const heartY = stageY + (portrait ? 92 : square ? 28 : Math.round((stageHeight - heartSize) / 2) - 10);
  const textX = stacked ? (square ? frameX + 112 : stageX) : stageX + stageWidth + 78;
  const textY = stacked ? (square ? stageY + stageHeight + 92 : stageY + stageHeight + 70) : frameY + 198;
  const textWidth = stacked ? (square ? frameWidth - 224 : stageWidth) : frameWidth - (textX - frameX) - 74;
  const textAlign = square ? "center" : "left";
  const fit = fitTextBlock({
    headline: payload.headline ?? "I love you",
    subheadline: payload.subheadline,
    maxWidth: textWidth,
    maxHeight: portrait ? 320 : square ? 274 : 286,
    headlineChars: portrait ? 12 : 14,
    maxHeadlineLines: 2,
    subChars: portrait ? 22 : 24,
    maxSubLines: stacked ? 3 : 4,
    headlineDesired: portrait ? 82 : square ? 78 : 92,
    headlineMin: portrait ? 48 : 52,
    subDesired: portrait ? 24 : 26,
    subMin: 20,
    headlineWidthFactor: 0.76,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2.2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.16,
  });
  const headlineLines = fit.headlineLines;
  const headlineSize = fit.headlineSize;
  const headlineHeight = fit.headlineHeight;
  const subLines = fit.subLines;
  const subY = textY + headlineHeight + 28;
  const chipY = portrait ? frameY + frameHeight - 122 : square ? frameY + frameHeight - 112 : frameY + frameHeight - 104;
  const notePanelX = square ? frameX + 48 : textX - 20;
  const notePanelY = square ? textY - 44 : textY - 20;
  const notePanelWidth = square ? frameWidth - 96 : textWidth + 40;
  const notePanelHeight = square ? 274 : subLines.length > 0 ? 208 : 148;
  const heartTagWidth = portrait ? 206 : square ? 224 : 182;
  const heartTagX = square ? frameX + Math.round((frameWidth - heartTagWidth) / 2) : textX;
  const chipWidth = portrait ? 276 : square ? 286 : 240;
  const chipX = square ? frameX + Math.round((frameWidth - chipWidth) / 2) : textX;
  const stageInsetX = stageX + (square ? 22 : 18);
  const stageInsetY = stageY + 22;
  const stageInsetWidth = stageWidth - (square ? 44 : 36);
  const stageInsetHeight = stageHeight - (square ? 72 : 56);
  const stageRibbonWidth = Math.round(stageWidth * (square ? 0.5 : 0.42));
  const stageRibbonX = stageX + Math.round((stageWidth - stageRibbonWidth) / 2);
  const dotGap = square ? 90 : 82;
  const noteFill = mixHex(surface, "#FFFFFF", 0.09);
  const noteStroke = mixHex(accent, textColor, 0.14);

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "heart-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 56, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "heart-stage", layer: "background", x: stageX, y: stageY, width: stageWidth, height: stageHeight, fill: surface, cornerRadius: 46, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "heart-stage-inset", layer: "background", x: stageInsetX, y: stageInsetY, width: stageInsetWidth, height: stageInsetHeight, fill: mixHex(surface, "#FFFFFF", 0.14), cornerRadius: 38, opacity: 0, animations: [{start: 0.06, end: Math.min(0.54, duration * 0.24), property: "opacity", from: 0, to: 0.42, easing: "easeOut"}]}),
    buildPanelElement({id: "heart-stage-sheen", layer: "background", x: stageX + 24, y: stageY + 24, width: stageWidth - 48, height: square ? 86 : 72, fill: mixHex(accent, "#FFFFFF", 0.72), cornerRadius: 999, opacity: 0, animations: [{start: 0.1, end: Math.min(0.58, duration * 0.26), property: "opacity", from: 0, to: Math.max(0.08, design.ornamentOpacity * 0.75), easing: "easeOut"}, {start: 0.1, end: Math.min(0.58, duration * 0.26), property: "scale", from: 0.84, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "heart-stage-ribbon", layer: "background", x: stageRibbonX, y: stageY + stageHeight - (square ? 46 : 40), width: stageRibbonWidth, height: 10, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.16, end: Math.min(0.74, duration * 0.32), property: "opacity", from: 0, to: 0.54, easing: "easeOut"}, {start: 0.16, end: Math.min(0.74, duration * 0.32), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    ...[0, 1, 2, 3].map((index) =>
      buildPanelElement({
        id: `heart-dot-${index}`,
        layer: "background",
        x: stageX + 44 + index * dotGap,
        y: stageY + 34 + (index % 2) * 10,
        width: square ? 14 : 16,
        height: square ? 14 : 16,
        fill: index === 1 ? accent : mixHex(accent, textColor, 0.2),
        cornerRadius: 999,
        opacity: 0,
        animations: [
          {start: 0.08 + index * 0.04, end: Math.min(0.56 + index * 0.02, duration * 0.24), property: "opacity", from: 0, to: index === 1 ? 0.84 : 0.46, easing: "easeOut"},
          {start: 0.08 + index * 0.04, end: Math.min(0.56 + index * 0.02, duration * 0.24), property: "scale", from: 0.5, to: 1, easing: "spring"},
        ],
      })
    ),
    {id: "heart-aura-main", type: "glow", layer: "background", x: heartX - 110, y: heartY - 100, width: heartSize + 220, height: heartSize + 220, fill: accent, glowColor: accent, glowStrength: 0.86, opacity: 0, animations: [{start: 0.06, end: Math.min(0.62, duration * 0.26), property: "opacity", from: 0, to: 0.16, easing: "easeOut"}, {start: 0.06, end: Math.min(0.62, duration * 0.26), property: "scale", from: 0.82, to: 1, easing: "spring"}]},
    {id: "heart-aura-soft", type: "glow", layer: "background", x: heartX - 56, y: heartY - 46, width: heartSize + 112, height: heartSize + 112, fill: accent, glowColor: mixHex(accent, "#FFFFFF", 0.12), glowStrength: 0.54, opacity: 0, animations: [{start: 0.16, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}]},
    {id: "heart-orbit-ring", type: "ring", layer: "background", x: heartX - 34, y: heartY - 30, width: heartSize + 68, height: heartSize + 68, stroke: mixHex(accent, textColor, 0.18), strokeWidth: 4, opacity: 0, animations: [{start: 0.12, end: Math.min(0.74, duration * 0.32), property: "opacity", from: 0, to: 0.42, easing: "easeOut"}, {start: 0.12, end: Math.min(0.74, duration * 0.32), property: "scale", from: 0.9, to: 1, easing: "spring"}, {start: 0.12, end: Math.min(0.82, duration * 0.36), property: "draw", from: 0, to: 1, easing: "easeInOut"}]},
    {id: "heart-orbit-ring-soft", type: "ring", layer: "background", x: heartX - 56, y: heartY - 52, width: heartSize + 112, height: heartSize + 112, stroke: mixHex(accent, "#FFFFFF", 0.2), strokeWidth: 3, opacity: 0, animations: [{start: 0.18, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 0.26, easing: "easeOut"}, {start: 0.18, end: Math.min(0.88, duration * 0.38), property: "draw", from: 0, to: 1, easing: "easeInOut"}]},
    buildIconElement("heart-main", "heart", heartX, heartY, heartSize, accent, duration),
    buildIconElement("heart-mini-a", "heart", square ? frameX + 24 : stageX + 34, square ? frameY + 206 : stageY + stageHeight - (portrait ? 168 : 128), portrait ? 72 : square ? 76 : 62, mixHex(accent, "#FFFFFF", 0.08), duration),
    buildIconElement("heart-mini-b", "heart", square ? frameX + frameWidth - 112 : stageX + stageWidth - (portrait ? 132 : 112), square ? frameY + 82 : stageY + 28, portrait ? 86 : square ? 88 : 74, mixHex(accent, textColor, 0.18), duration),
    buildPanelElement({id: "heart-note-panel", layer: "background", x: notePanelX, y: notePanelY, width: notePanelWidth, height: notePanelHeight, fill: noteFill, stroke: noteStroke, strokeWidth: 2, cornerRadius: square ? 40 : 34, opacity: 0, animations: [{start: 0.12, end: Math.min(0.62, duration * 0.28), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.12, end: Math.min(0.62, duration * 0.28), property: "scale", from: 0.92, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "heart-tag", layer: "foreground", x: heartTagX, y: textY - 56, width: heartTagWidth, height: 44, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.12, end: Math.min(0.52, duration * 0.22), property: "opacity", from: 0, to: 0.86, easing: "easeOut"}, {start: 0.12, end: Math.min(0.52, duration * 0.22), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "heart-tag-text", layer: "foreground", x: square ? heartTagX : heartTagX + 24, y: textY - 42, width: square ? heartTagWidth : portrait ? 158 : 134, height: 20, fill: accent, text: (payload.kicker ?? "LOVE NOTE").toUpperCase(), fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.16, end: Math.min(0.56, duration * 0.24), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "heart-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign, letterSpacing: -2.2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.18, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.18, end: Math.min(0.88, duration * 0.38), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "heart-sub-line", layer: "foreground", x: square ? frameX + Math.round((frameWidth - Math.round(textWidth * 0.34)) / 2) : textX, y: subY - 20, width: Math.round(textWidth * (square ? 0.34 : 0.4)), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.24, end: Math.min(0.82, duration * 0.34), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
      buildTextElement({id: "heart-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * (portrait ? 24 : 28) * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : square ? 28 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.28, end: Math.min(1.04, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.28, end: Math.min(1.04, duration * 0.46), property: "translateY", from: 16, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "heart-chip", layer: "foreground", x: chipX, y: chipY, width: chipWidth, height: 58, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.14, duration * 0.52), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.34, end: Math.min(1.14, duration * 0.52), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "heart-chip-text", layer: "foreground", x: square ? chipX : chipX + 24, y: chipY + 18, width: square ? chipWidth : portrait ? 228 : 192, height: 20, fill: accent, text: "ROMANTIC SVG SCENE", fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.38, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
  ];
};

const buildPlaySceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const frameX = portrait ? 86 : 96;
  const frameY = portrait ? 248 : 140;
  const frameWidth = portrait ? canvas.width - 172 : canvas.width - 192;
  const frameHeight = portrait ? 1120 : canvas.height - 280;
  const viewportX = frameX + 42;
  const viewportY = frameY + 42;
  const viewportWidth = frameWidth - 84;
  const viewportHeight = portrait ? 430 : 360;
  const playSize = portrait ? 156 : 184;
  const playX = viewportX + Math.round((viewportWidth - playSize) / 2);
  const playY = viewportY + Math.round((viewportHeight - playSize) / 2);
  const headlineLines = wrapText(payload.headline ?? "Watch The Story", portrait ? 13 : 18, 3);
  const textX = viewportX;
  const textY = viewportY + viewportHeight + 84;
  const textWidth = viewportWidth;
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 64 : 72, portrait ? 42 : 50, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 24;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 28 : 40, 3) : [];
  const subY = textY + headlineHeight + 34;
  const progressY = frameY + frameHeight - 96;
  const chromeY = viewportY + 24;
  const thumbY = progressY - (portrait ? 128 : 116);
  const thumbWidth = Math.round((textWidth - (portrait ? 18 : 24)) / 2);

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "play-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.44, duration * 0.2), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0, end: Math.min(0.44, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "play-viewport", layer: "background", x: viewportX, y: viewportY, width: viewportWidth, height: viewportHeight, fill: surface, cornerRadius: 40, opacity: 0, animations: [{start: 0.04, end: Math.min(0.52, duration * 0.22), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.04, end: Math.min(0.52, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "play-chrome-left", layer: "foreground", x: viewportX + 24, y: chromeY, width: 64, height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.08, end: Math.min(0.48, duration * 0.22), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.08, end: Math.min(0.48, duration * 0.22), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "play-chrome-mid", layer: "foreground", x: viewportX + 100, y: chromeY, width: 42, height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.12, end: Math.min(0.52, duration * 0.24), property: "opacity", from: 0, to: 0.34, easing: "easeOut"}, {start: 0.12, end: Math.min(0.52, duration * 0.24), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
    {id: "play-aura", type: "glow", layer: "background", x: playX - 90, y: playY - 90, width: playSize + 180, height: playSize + 180, fill: accent, glowColor: accent, glowStrength: 0.72, opacity: 0, animations: [{start: 0.08, end: Math.min(0.66, duration * 0.28), property: "opacity", from: 0, to: 0.16, easing: "easeOut"}, {start: 0.08, end: Math.min(0.66, duration * 0.28), property: "scale", from: 0.76, to: 1, easing: "spring"}]} ,
    buildIconElement("play-icon", "play", playX, playY, playSize, accent, duration),
    buildTextElement({id: "play-kicker", layer: "foreground", x: textX, y: textY - 44, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "VIDEO INTRO").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.1, end: Math.min(0.36, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.1, end: Math.min(0.36, duration * 0.16), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "play-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 26, to: 0, easing: "spring"}]}),
    buildPanelElement({id: "play-thumb-a", layer: "background", x: textX, y: thumbY, width: thumbWidth, height: portrait ? 84 : 92, fill: elevated, cornerRadius: 22, opacity: 0, animations: [{start: 0.26, end: Math.min(0.98, duration * 0.44), property: "opacity", from: 0, to: 0.62, easing: "easeOut"}, {start: 0.26, end: Math.min(0.98, duration * 0.44), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "play-thumb-b", layer: "background", x: textX + thumbWidth + (portrait ? 18 : 24), y: thumbY, width: thumbWidth, height: portrait ? 84 : 92, fill: surface, cornerRadius: 22, opacity: 0, animations: [{start: 0.3, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.52, easing: "easeOut"}, {start: 0.3, end: Math.min(1.02, duration * 0.46), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "play-progress-track", layer: "background", x: textX, y: progressY, width: textWidth, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(0.76, duration * 0.34), property: "opacity", from: 0, to: 0.86, easing: "easeOut"}]}),
    buildPanelElement({id: "play-progress-bar", layer: "foreground", x: textX, y: progressY, width: Math.round(textWidth * 0.62), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.34, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.28, end: Math.min(1.34, duration * 0.58), property: "scale", from: 0.36, to: 1, easing: "easeOut"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "play-sub-line", layer: "foreground", x: textX, y: subY - 22, width: Math.round(textWidth * 0.48), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.2, end: Math.min(0.68, duration * 0.3), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.2, end: Math.min(0.68, duration * 0.3), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildTextElement({id: "play-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * (portrait ? 24 : 28) * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.25, lineHeight: 1.16, opacity: 0, animations: [{start: 0.22, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(1.08, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
  ];
};

const buildBatterySceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const frameX = portrait ? 88 : 96;
  const frameY = portrait ? 292 : 178;
  const frameWidth = portrait ? canvas.width - 176 : canvas.width - 192;
  const frameHeight = portrait ? 980 : 720;
  const batterySize = portrait ? 228 : 220;
  const batteryX = frameX + 56;
  const batteryY = frameY + 88;
  const chargeTrackX = batteryX + 46;
  const chargeTrackY = batteryY + batterySize + 42;
  const chargeTrackWidth = portrait ? 280 : 300;
  const textX = portrait ? frameX + 56 : batteryX + batterySize + 116;
  const textY = portrait ? chargeTrackY + 88 : frameY + 132;
  const textWidth = portrait ? frameWidth - 112 : frameWidth - (textX - frameX) - 92;
  const headlineLines = wrapText(payload.headline ?? "Charging Up", portrait ? 14 : 18, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 68 : 68, portrait ? 42 : 46, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 22;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 24 : 24, 4) : [];
  const subY = textY + headlineHeight + 28;
  const chipY = portrait ? frameY + frameHeight - 130 : frameY + frameHeight - 108;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "battery-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    {id: "battery-aura", type: "glow", layer: "background", x: batteryX - 80, y: batteryY - 80, width: batterySize + 160, height: batterySize + 160, fill: accent, glowColor: accent, glowStrength: 0.74, opacity: 0, animations: [{start: 0.04, end: Math.min(0.58, duration * 0.24), property: "opacity", from: 0, to: 0.16, easing: "easeOut"}, {start: 0.04, end: Math.min(0.58, duration * 0.24), property: "scale", from: 0.76, to: 1, easing: "spring"}]} ,
    buildPanelElement({id: "battery-stage", layer: "background", x: batteryX - 22, y: batteryY - 22, width: batterySize + 44, height: batterySize + 44, fill: surface, cornerRadius: 42, opacity: 0, animations: [{start: 0.08, end: Math.min(0.62, duration * 0.26), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.08, end: Math.min(0.62, duration * 0.26), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildIconElement("battery-icon", "battery", batteryX, batteryY, batterySize, accent, duration),
    buildPanelElement({id: "battery-track", layer: "background", x: chargeTrackX, y: chargeTrackY, width: chargeTrackWidth, height: 16, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.74, duration * 0.34), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}]}),
    buildPanelElement({id: "battery-fill", layer: "foreground", x: chargeTrackX, y: chargeTrackY, width: Math.round(chargeTrackWidth * 0.78), height: 16, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.22, end: Math.min(1.26, duration * 0.56), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.22, end: Math.min(1.26, duration * 0.56), property: "scale", from: 0.28, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "battery-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "ENERGY LEVEL").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.34, duration * 0.16), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "battery-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 24, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "battery-sub-line", layer: "foreground", x: textX, y: subY - 22, width: Math.round(textWidth * 0.44), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.2, end: Math.min(0.72, duration * 0.32), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.2, end: Math.min(0.72, duration * 0.32), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildTextElement({id: "battery-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * (portrait ? 24 : 28) * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.24, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(1.08, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "battery-chip", layer: "foreground", x: textX, y: chipY, width: portrait ? 260 : 280, height: 58, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.3, end: Math.min(1.12, duration * 0.5), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.3, end: Math.min(1.12, duration * 0.5), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "battery-chip-text", layer: "foreground", x: textX + 24, y: chipY + 16, width: portrait ? 220 : 240, height: 28, fill: accent, text: "FAST CHARGE READY", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.34, end: Math.min(1.16, duration * 0.52), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.34, end: Math.min(1.16, duration * 0.52), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
  ];
};

const buildCalendarSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const frameX = portrait ? 88 : 96;
  const frameY = portrait ? 286 : 178;
  const frameWidth = portrait ? canvas.width - 176 : canvas.width - 192;
  const frameHeight = portrait ? 980 : 720;
  const calendarSize = portrait ? 232 : 220;
  const calendarX = frameX + 56;
  const calendarY = frameY + 86;
  const dateBadgeX = calendarX + 24;
  const dateBadgeY = calendarY + 164;
  const dateBadgeWidth = portrait ? 184 : 168;
  const dateBadgeHeight = portrait ? 128 : 116;
  const textX = portrait ? frameX + 56 : calendarX + calendarSize + 120;
  const textY = portrait ? calendarY + calendarSize + 112 : frameY + 132;
  const textWidth = portrait ? frameWidth - 112 : frameWidth - (textX - frameX) - 88;
  const headlineLines = wrapText(payload.headline ?? "Event Countdown", portrait ? 14 : 18, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 66 : 68, portrait ? 42 : 46, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 22;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 24 : 24, 4) : [];
  const subY = textY + headlineHeight + 30;
  const countY = portrait ? frameY + frameHeight - 166 : frameY + frameHeight - 132;
  const chipWidth = portrait ? 190 : 168;
  const chipGap = 22;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "calendar-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    {id: "calendar-aura", type: "glow", layer: "background", x: calendarX - 72, y: calendarY - 72, width: calendarSize + 144, height: calendarSize + 144, fill: accent, glowColor: accent, glowStrength: 0.72, opacity: 0, animations: [{start: 0.04, end: Math.min(0.58, duration * 0.24), property: "opacity", from: 0, to: 0.15, easing: "easeOut"}, {start: 0.04, end: Math.min(0.58, duration * 0.24), property: "scale", from: 0.76, to: 1, easing: "spring"}]} ,
    buildPanelElement({id: "calendar-stage", layer: "background", x: calendarX - 18, y: calendarY - 18, width: calendarSize + 36, height: calendarSize + 36, fill: surface, cornerRadius: 42, opacity: 0, animations: [{start: 0.08, end: Math.min(0.62, duration * 0.26), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.08, end: Math.min(0.62, duration * 0.26), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildIconElement("calendar-icon", "calendar", calendarX, calendarY, calendarSize, accent, duration),
    buildPanelElement({id: "calendar-date-badge", layer: "foreground", x: dateBadgeX, y: dateBadgeY, width: dateBadgeWidth, height: dateBadgeHeight, fill: elevated, cornerRadius: 28, opacity: 0, animations: [{start: 0.16, end: Math.min(0.86, duration * 0.38), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.16, end: Math.min(0.86, duration * 0.38), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildTextElement({id: "calendar-date-number", layer: "foreground", x: dateBadgeX, y: dateBadgeY + 18, width: dateBadgeWidth, height: 70, fill: accent, text: "12", fontSize: portrait ? 74 : 68, fontWeight: 900, fontFamily: "'Arial Black', 'Segoe UI', sans-serif", textAlign: "center", letterSpacing: -2, lineHeight: 0.94, opacity: 0, animations: [{start: 0.2, end: Math.min(0.92, duration * 0.42), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.2, end: Math.min(0.92, duration * 0.42), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "calendar-date-label", layer: "foreground", x: dateBadgeX, y: dateBadgeY + 82, width: dateBadgeWidth, height: 26, fill: accent, text: "DAYS LEFT", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1.6, lineHeight: 1, opacity: 0, animations: [{start: 0.24, end: Math.min(0.96, duration * 0.44), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.24, end: Math.min(0.96, duration * 0.44), property: "translateY", from: 8, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "calendar-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "COUNTDOWN").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.34, duration * 0.16), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "calendar-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 24, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "calendar-sub-line", layer: "foreground", x: textX, y: subY - 22, width: Math.round(textWidth * 0.46), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.2, end: Math.min(0.72, duration * 0.32), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.2, end: Math.min(0.72, duration * 0.32), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildTextElement({id: "calendar-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * (portrait ? 24 : 28) * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.24, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(1.08, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "calendar-chip-a", layer: "foreground", x: textX, y: countY, width: chipWidth, height: 62, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.3, end: Math.min(1.12, duration * 0.5), property: "opacity", from: 0, to: 0.14, easing: "easeOut"}, {start: 0.3, end: Math.min(1.12, duration * 0.5), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "calendar-chip-a-text", layer: "foreground", x: textX + 22, y: countY + 18, width: chipWidth - 44, height: 26, fill: accent, text: "12 DAYS", fontSize: 22, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.34, end: Math.min(1.16, duration * 0.52), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.34, end: Math.min(1.16, duration * 0.52), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildPanelElement({id: "calendar-chip-b", layer: "foreground", x: textX + chipWidth + chipGap, y: countY, width: chipWidth, height: 62, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.1, easing: "easeOut"}, {start: 0.36, end: Math.min(1.18, duration * 0.54), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "calendar-chip-b-text", layer: "foreground", x: textX + chipWidth + chipGap + 22, y: countY + 18, width: chipWidth - 44, height: 26, fill: accent, text: "SAVE THE DATE", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.4, end: Math.min(1.22, duration * 0.56), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.4, end: Math.min(1.22, duration * 0.56), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
  ];
};

const buildTrendSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const frameX = portrait ? 88 : 96;
  const frameY = portrait ? 286 : 178;
  const frameWidth = portrait ? canvas.width - 176 : canvas.width - 192;
  const frameHeight = portrait ? 980 : 720;
  const chartX = frameX + 56;
  const chartY = frameY + 84;
  const chartWidth = portrait ? frameWidth - 112 : 420;
  const chartHeight = portrait ? 300 : 240;
  const trendSize = portrait ? 220 : 210;
  const trendX = chartX + Math.round((chartWidth - trendSize) / 2);
  const trendY = chartY + Math.round((chartHeight - trendSize) / 2);
  const textX = portrait ? frameX + 56 : chartX + chartWidth + 86;
  const textY = portrait ? chartY + chartHeight + 96 : frameY + 136;
  const textWidth = portrait ? frameWidth - 112 : frameWidth - (textX - frameX) - 88;
  const headlineLines = wrapText(payload.headline ?? "Growth Curve", portrait ? 14 : 18, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 66 : 68, portrait ? 42 : 46, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 22;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 24 : 24, 4) : [];
  const subY = textY + headlineHeight + 30;
  const chipY = portrait ? frameY + frameHeight - 166 : frameY + frameHeight - 132;
  const chipWidth = portrait ? 210 : 188;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "trend-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "trend-chart-stage", layer: "background", x: chartX, y: chartY, width: chartWidth, height: chartHeight, fill: surface, cornerRadius: 40, opacity: 0, animations: [{start: 0.06, end: Math.min(0.58, duration * 0.24), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.06, end: Math.min(0.58, duration * 0.24), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    ...[0.2, 0.46, 0.72].map((ratio, index) =>
      buildPanelElement({
        id: `trend-grid-${index}`,
        layer: "foreground",
        x: chartX + 28,
        y: chartY + Math.round(chartHeight * ratio),
        width: chartWidth - 56,
        height: 4,
        fill: accent,
        cornerRadius: 999,
        opacity: 0,
        animations: [
          {start: 0.08 + index * 0.05, end: Math.min(0.56 + index * 0.04, duration * 0.28), property: "opacity", from: 0, to: 0.16, easing: "easeOut"},
          {start: 0.08 + index * 0.05, end: Math.min(0.56 + index * 0.04, duration * 0.28), property: "scale", from: 0.3, to: 1, easing: "easeOut"},
        ],
      }),
    ),
    {id: "trend-aura", type: "glow", layer: "background", x: trendX - 70, y: trendY - 70, width: trendSize + 140, height: trendSize + 140, fill: accent, glowColor: accent, glowStrength: 0.74, opacity: 0, animations: [{start: 0.08, end: Math.min(0.62, duration * 0.26), property: "opacity", from: 0, to: 0.16, easing: "easeOut"}, {start: 0.08, end: Math.min(0.62, duration * 0.26), property: "scale", from: 0.76, to: 1, easing: "spring"}]} ,
    buildIconElement("trend-icon", "trend", trendX, trendY, trendSize, accent, duration),
    buildTextElement({id: "trend-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "GROWTH SIGNAL").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.34, duration * 0.16), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "trend-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 24, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "trend-sub-line", layer: "foreground", x: textX, y: subY - 22, width: Math.round(textWidth * 0.46), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.2, end: Math.min(0.72, duration * 0.32), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.2, end: Math.min(0.72, duration * 0.32), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildTextElement({id: "trend-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * (portrait ? 24 : 28) * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.24, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(1.08, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "trend-chip-a", layer: "foreground", x: textX, y: chipY, width: chipWidth, height: 62, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.3, end: Math.min(1.12, duration * 0.5), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.3, end: Math.min(1.12, duration * 0.5), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "trend-chip-a-text", layer: "foreground", x: textX + 22, y: chipY + 18, width: chipWidth - 44, height: 26, fill: accent, text: "+42%", fontSize: 24, fontWeight: 900, fontFamily: "'Arial Black', 'Segoe UI', sans-serif", textAlign: "left", letterSpacing: -0.4, lineHeight: 1, opacity: 0, animations: [{start: 0.34, end: Math.min(1.16, duration * 0.52), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.34, end: Math.min(1.16, duration * 0.52), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildPanelElement({id: "trend-chip-b", layer: "foreground", x: textX + chipWidth + 22, y: chipY, width: chipWidth, height: 62, fill: surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.36, end: Math.min(1.18, duration * 0.54), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "trend-chip-b-text", layer: "foreground", x: textX + chipWidth + 44, y: chipY + 18, width: chipWidth - 44, height: 26, fill: accent, text: "Q4 LIFT", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.4, end: Math.min(1.22, duration * 0.56), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.4, end: Math.min(1.22, duration * 0.56), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
  ];
};

const buildBarChartSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const frameX = portrait ? 86 : 92;
  const frameY = portrait ? 272 : 170;
  const frameWidth = portrait ? canvas.width - 172 : canvas.width - 184;
  const frameHeight = portrait ? 1040 : 736;
  const chartX = frameX + 54;
  const chartY = frameY + 78;
  const chartWidth = portrait ? frameWidth - 108 : 430;
  const chartHeight = portrait ? 360 : 312;
  const textX = portrait ? frameX + 54 : chartX + chartWidth + 78;
  const textY = portrait ? chartY + chartHeight + 96 : frameY + 124;
  const textWidth = portrait ? frameWidth - 108 : frameWidth - (textX - frameX) - 82;
  const headlineLines = wrapText(payload.headline ?? "Revenue Lift", portrait ? 14 : 16, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 68 : 72, portrait ? 44 : 48, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 24;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 24 : 24, 4) : [];
  const subY = textY + headlineHeight + 28;
  const chipY = portrait ? frameY + frameHeight - 152 : frameY + frameHeight - 120;
  const baseY = chartY + chartHeight - 44;
  const barWidth = portrait ? 62 : 58;
  const barGap = portrait ? 28 : 22;
  const bars = [0.28, 0.48, 0.66, 0.88];

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "kpi-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "kpi-stage", layer: "background", x: chartX, y: chartY, width: chartWidth, height: chartHeight, fill: surface, cornerRadius: 40, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    ...[0.18, 0.42, 0.66].map((ratio, index) =>
      buildPanelElement({
        id: `kpi-grid-${index}`,
        layer: "foreground",
        x: chartX + 34,
        y: chartY + Math.round(chartHeight * ratio),
        width: chartWidth - 68,
        height: 4,
        fill: edge,
        cornerRadius: 999,
        opacity: 0,
        animations: [
          {start: 0.08 + index * 0.04, end: Math.min(0.54 + index * 0.04, duration * 0.26), property: "opacity", from: 0, to: 0.34, easing: "easeOut"},
          {start: 0.08 + index * 0.04, end: Math.min(0.54 + index * 0.04, duration * 0.26), property: "scale", from: 0.24, to: 1, easing: "easeOut"},
        ],
      }),
    ),
    ...bars.flatMap((ratio, index) => {
      const x = chartX + 48 + index * (barWidth + barGap);
      const height = Math.round((chartHeight - 110) * ratio);
      const y = baseY - height;
      return [
        buildPanelElement({
          id: `kpi-bar-${index}`,
          layer: "foreground",
          x,
          y,
          width: barWidth,
          height,
          fill: index === bars.length - 1 ? accent : elevated,
          cornerRadius: 22,
          opacity: 0,
          animations: [
            {start: 0.14 + index * 0.08, end: Math.min(0.88 + index * 0.06, duration * 0.44), property: "opacity", from: 0, to: 0.96, easing: "easeOut"},
            {start: 0.14 + index * 0.08, end: Math.min(0.88 + index * 0.06, duration * 0.44), property: "translateY", from: 30, to: 0, easing: "spring"},
          ],
        }),
        buildPanelElement({
          id: `kpi-bar-cap-${index}`,
          layer: "foreground",
          x: x + 10,
          y: y - 22,
          width: barWidth - 20,
          height: 10,
          fill: index === bars.length - 1 ? accent : edge,
          cornerRadius: 999,
          opacity: 0,
          animations: [
            {start: 0.2 + index * 0.08, end: Math.min(0.96 + index * 0.06, duration * 0.48), property: "opacity", from: 0, to: 0.8, easing: "easeOut"},
            {start: 0.2 + index * 0.08, end: Math.min(0.96 + index * 0.06, duration * 0.48), property: "scale", from: 0.4, to: 1, easing: "spring"},
          ],
        }),
      ];
    }),
    buildPanelElement({id: "kpi-top-chip", layer: "foreground", x: chartX + chartWidth - 182, y: chartY + 28, width: 140, height: 54, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.86, duration * 0.4), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.18, end: Math.min(0.86, duration * 0.4), property: "scale", from: 0.82, to: 1, easing: "spring"}]}),
    buildTextElement({id: "kpi-top-chip-text", layer: "foreground", x: chartX + chartWidth - 154, y: chartY + 16, width: 100, height: 24, fill: accent, text: "+128%", fontSize: 22, fontWeight: 900, fontFamily: "'Arial Black', 'Segoe UI', sans-serif", textAlign: "left", letterSpacing: -0.4, lineHeight: 1, opacity: 0, animations: [{start: 0.24, end: Math.min(0.94, duration * 0.44), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.24, end: Math.min(0.94, duration * 0.44), property: "translateY", from: 8, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "kpi-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "KPI SNAPSHOT").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.34, duration * 0.16), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "kpi-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 24, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "kpi-sub-line", layer: "foreground", x: textX, y: subY - 22, width: Math.round(textWidth * 0.44), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.2, end: Math.min(0.72, duration * 0.32), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.2, end: Math.min(0.72, duration * 0.32), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildTextElement({id: "kpi-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * (portrait ? 24 : 28) * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.24, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(1.08, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "kpi-track", layer: "foreground", x: textX, y: chipY, width: textWidth, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}]}),
    buildPanelElement({id: "kpi-progress", layer: "foreground", x: textX, y: chipY, width: Math.round(textWidth * 0.72), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.32, end: Math.min(1.12, duration * 0.52), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.32, end: Math.min(1.12, duration * 0.52), property: "scale", from: 0.32, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "kpi-chip", layer: "foreground", x: textX, y: chipY + 34, width: portrait ? 240 : 228, height: 58, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.16, duration * 0.54), property: "opacity", from: 0, to: 0.78, easing: "easeOut"}, {start: 0.36, end: Math.min(1.16, duration * 0.54), property: "scale", from: 0.82, to: 1, easing: "spring"}]}),
    buildTextElement({id: "kpi-chip-text", layer: "foreground", x: textX + 24, y: chipY + 50, width: 180, height: 24, fill: accent, text: "DASHBOARD READY", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.4, end: Math.min(1.2, duration * 0.56), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.4, end: Math.min(1.2, duration * 0.56), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
  ];
};

const buildPhoneSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 86 : square ? 96 : 92;
  const frameY = portrait ? 248 : square ? 132 : 162;
  const frameWidth = portrait ? canvas.width - 172 : square ? canvas.width - 192 : canvas.width - 184;
  const frameHeight = portrait ? 1180 : square ? 884 : 760;
  const phoneWidth = portrait ? frameWidth - 128 : square ? 308 : 340;
  const phoneHeight = portrait ? 680 : square ? 492 : 560;
  const phoneX = portrait ? frameX + 64 : square ? frameX + Math.round((frameWidth - phoneWidth) / 2) : frameX + 64;
  const phoneY = frameY + (portrait ? 90 : square ? 94 : 90);
  const screenX = phoneX + 22;
  const screenY = phoneY + 24;
  const screenWidth = phoneWidth - 44;
  const screenHeight = phoneHeight - 48;
  const textX = portrait ? frameX + 58 : square ? frameX + 168 : phoneX + phoneWidth + 86;
  const textY = portrait ? phoneY + phoneHeight + 92 : square ? phoneY + phoneHeight + 62 : frameY + 138;
  const textWidth = portrait ? frameWidth - 116 : square ? frameWidth - 336 : frameWidth - (textX - frameX) - 78;
  const textAlign = square ? "center" : "left";
  const headlineLines = wrapText(payload.headline ?? "App Launch", portrait || square ? 14 : 16, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 68 : square ? 68 : 70, portrait ? 44 : square ? 46 : 46, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 24;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 24 : 24, 4) : [];
  const subY = textY + headlineHeight + 30;
  const ctaY = portrait ? frameY + frameHeight - 138 : square ? frameY + frameHeight - 120 : frameY + frameHeight - 114;
  const chipY = portrait ? textY + headlineHeight + 202 : square ? subY + 138 : subY + 158;
  const railWidth = portrait ? frameWidth - 116 : square ? Math.round(textWidth * 0.5) : 14;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "phone-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "phone-text-rail", layer: "background", x: portrait ? textX : square ? textX + Math.round((textWidth - railWidth) / 2) : textX - 36, y: portrait ? textY - 18 : square ? textY - 22 : frameY + 104, width: railWidth, height: portrait ? 12 : square ? 8 : frameHeight - 208, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.08, end: Math.min(0.44, duration * 0.18), property: "opacity", from: 0, to: 0.64, easing: "easeOut"}, {start: 0.08, end: Math.min(0.44, duration * 0.18), property: "scale", from: 0.26, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "phone-body", layer: "background", x: phoneX, y: phoneY, width: phoneWidth, height: phoneHeight, fill: textColor, stroke: edge, strokeWidth: 4, cornerRadius: 56, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "phone-screen", layer: "background", x: screenX, y: screenY, width: screenWidth, height: screenHeight, fill: surface, cornerRadius: 42, opacity: 0, animations: [{start: 0.08, end: Math.min(0.56, duration * 0.24), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}]}),
    buildPanelElement({id: "phone-notch", layer: "foreground", x: phoneX + Math.round((phoneWidth - 132) / 2), y: phoneY + 18, width: 132, height: 16, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.08, end: Math.min(0.52, duration * 0.22), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}]}),
    buildPanelElement({id: "phone-hero-card", layer: "foreground", x: screenX + 26, y: screenY + 34, width: screenWidth - 52, height: portrait ? 180 : square ? 168 : 156, fill: elevated, cornerRadius: 34, opacity: 0, animations: [{start: 0.14, end: Math.min(0.82, duration * 0.36), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.14, end: Math.min(0.82, duration * 0.36), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    buildIconElement("phone-app-icon", "phone", square ? screenX + Math.round((screenWidth - 92) / 2) : screenX + 44, screenY + (square ? 48 : 62), portrait ? 96 : square ? 92 : 84, accent, duration),
    buildTextElement({id: "phone-app-title", layer: "foreground", x: square ? screenX + 34 : screenX + 156, y: screenY + (square ? 152 : 66), width: square ? screenWidth - 68 : screenWidth - 190, height: 32, fill: textColor, text: "Launch Mode", fontSize: portrait ? 30 : square ? 30 : 28, fontWeight: 800, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: textAlign, letterSpacing: -0.5, lineHeight: 1, opacity: 0, animations: [{start: 0.2, end: Math.min(0.88, duration * 0.4), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.2, end: Math.min(0.88, duration * 0.4), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "phone-app-copy", layer: "foreground", x: square ? screenX + 34 : screenX + 156, y: screenY + (square ? 194 : 110), width: square ? screenWidth - 68 : screenWidth - 190, height: 60, fill: secondaryText, text: "Product motion\nmade cleaner", fontSize: portrait ? 22 : 20, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: textAlign, letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.24, end: Math.min(0.94, duration * 0.44), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(0.94, duration * 0.44), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    ...[0, 1, 2].flatMap((index) => {
      const y = screenY + (portrait ? 248 : square ? 282 : 220) + index * (portrait ? 122 : square ? 74 : 104);
      const cardHeight = portrait ? 96 : square ? 54 : 82;
      return [
        buildPanelElement({id: `phone-row-${index}`, layer: "foreground", x: screenX + 26, y, width: screenWidth - 52, height: cardHeight, fill: index === 1 ? elevated : surface, cornerRadius: 26, opacity: 0, animations: [{start: 0.22 + index * 0.08, end: Math.min(0.96 + index * 0.06, duration * 0.46), property: "opacity", from: 0, to: 0.86, easing: "easeOut"}, {start: 0.22 + index * 0.08, end: Math.min(0.96 + index * 0.06, duration * 0.46), property: "translateY", from: 16, to: 0, easing: "easeOut"}]}),
        buildPanelElement({id: `phone-row-dot-${index}`, layer: "foreground", x: screenX + 46, y: y + (square ? 16 : 24), width: square ? 22 : 40, height: square ? 22 : 40, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.28 + index * 0.08, end: Math.min(1.02 + index * 0.06, duration * 0.5), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.28 + index * 0.08, end: Math.min(1.02 + index * 0.06, duration * 0.5), property: "scale", from: 0.5, to: 1, easing: "spring"}]}),
        buildPanelElement({id: `phone-row-line-${index}`, layer: "foreground", x: screenX + (square ? 82 : 108), y: y + (square ? 22 : 28), width: Math.round(screenWidth * (square ? (index === 0 ? 0.58 : index === 1 ? 0.66 : 0.48) : index === 0 ? 0.46 : index === 1 ? 0.58 : 0.4)), height: 10, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.32 + index * 0.08, end: Math.min(1.06 + index * 0.06, duration * 0.52), property: "opacity", from: 0, to: 0.78, easing: "easeOut"}, {start: 0.32 + index * 0.08, end: Math.min(1.06 + index * 0.06, duration * 0.52), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
      ];
    }),
    buildPanelElement({id: "phone-dock", layer: "foreground", x: screenX + 54, y: screenY + screenHeight - 42, width: screenWidth - 108, height: 12, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.08, duration * 0.5), property: "opacity", from: 0, to: 0.44, easing: "easeOut"}]}),
    buildTextElement({id: "phone-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "APP LAUNCH").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: textAlign, letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.34, duration * 0.16), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "phone-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: textAlign, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 24, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "phone-sub-line", layer: "foreground", x: square ? textX + Math.round((textWidth - Math.round(textWidth * 0.34)) / 2) : textX, y: subY - 22, width: Math.round(textWidth * (square ? 0.34 : 0.44)), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.2, end: Math.min(0.72, duration * 0.32), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.2, end: Math.min(0.72, duration * 0.32), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildTextElement({id: "phone-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * (portrait ? 24 : 28) * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: textAlign, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.24, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(1.08, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "phone-chip-a", layer: "foreground", x: textX, y: chipY, width: portrait ? 286 : square ? textWidth : 238, height: 62, fill: surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.26, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.26, end: Math.min(1.02, duration * 0.46), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "phone-chip-a-text", layer: "foreground", x: square ? textX : textX + 24, y: chipY + 18, width: square ? textWidth : portrait ? 242 : 190, height: 22, fill: accent, text: "LIVE UI STAGE", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: textAlign, letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.3, end: Math.min(1.06, duration * 0.48), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "phone-chip-b", layer: "foreground", x: square ? textX : textX + (portrait ? 0 : 258), y: chipY + (portrait ? 82 : square ? 82 : 0), width: portrait ? 344 : square ? textWidth : 230, height: 62, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.32, end: Math.min(1.08, duration * 0.5), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.32, end: Math.min(1.08, duration * 0.5), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "phone-chip-b-text", layer: "foreground", x: square ? textX : textX + (portrait ? 24 : 282), y: chipY + (portrait ? 100 : square ? 100 : 18), width: square ? textWidth : portrait ? 296 : 180, height: 22, fill: textColor, text: "Structured reveal, cleaner rhythm", fontSize: portrait ? 20 : 18, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: textAlign, letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.36, end: Math.min(1.12, duration * 0.52), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "phone-cta", layer: "foreground", x: square ? frameX + Math.round((frameWidth - textWidth) / 2) : textX, y: ctaY, width: portrait ? 280 : square ? textWidth : 250, height: 62, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.32, end: Math.min(1.12, duration * 0.52), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.32, end: Math.min(1.12, duration * 0.52), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "phone-cta-text", layer: "foreground", x: square ? textX : textX + 24, y: ctaY + 18, width: square ? textWidth : 210, height: 24, fill: accent, text: "PRODUCT STORY LIVE", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: textAlign, letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.36, end: Math.min(1.16, duration * 0.54), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.36, end: Math.min(1.16, duration * 0.54), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
  ];
};

const buildSearchCardSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const stacked = portrait || square;
  const frameX = portrait ? 86 : 92;
  const frameY = portrait ? 288 : square ? 144 : 154;
  const frameWidth = portrait ? canvas.width - 172 : canvas.width - 184;
  const frameHeight = portrait ? 956 : square ? 880 : 782;
  const searchBarX = frameX + 48;
  const searchBarY = frameY + (portrait ? 62 : 74);
  const searchBarWidth = frameWidth - 96;
  const query = payload.headline ?? "Search Faster";
  const queryLines = wrapText(query, portrait ? 18 : 18, 2);
  const queryHeight = queryLines.length * (portrait ? 40 : 46) + 10;
  const chipsY = searchBarY + (portrait ? 126 : 136);
  const resultsY = chipsY + 96;
  const resultWidth = portrait || square ? searchBarWidth : Math.round(searchBarWidth * 0.54);
  const resultHeight = portrait ? 120 : square ? 92 : 102;
  const resultGap = 28;
  const searchIconSize = portrait ? 72 : square ? 68 : 78;
  const inspectorX = stacked ? searchBarX : searchBarX + resultWidth + 28;
  const inspectorY = square ? resultsY + 3 * (resultHeight + resultGap) + 12 : resultsY;
  const inspectorWidth = stacked ? searchBarWidth : searchBarWidth - resultWidth - 28;
  const inspectorHeight = portrait ? 212 : square ? 150 : frameHeight - (inspectorY - frameY) - 72;
  const subY = stacked ? inspectorY + inspectorHeight + 26 : frameY + frameHeight - 118;
  const topRuleWidth = Math.round(searchBarWidth * (square ? 0.28 : 0.34));
  const topRuleX = square ? frameX + Math.round((frameWidth - topRuleWidth) / 2) : searchBarX;
  const stageHeight = portrait ? 128 : square ? 140 : 146;
  const stageInsetX = searchBarX + 12;
  const stageInsetY = searchBarY - 10;
  const stageInsetWidth = searchBarWidth - 24;
  const stageInsetHeight = square ? 30 : 26;
  const searchTextX = searchBarX + 120;
  const searchTextWidth = searchBarWidth - 154;
  const searchTextY = searchBarY + (portrait ? 22 : square ? 28 : 24);
  const searchCaretX = searchBarX + searchBarWidth - 54;
  const chipWidth = portrait ? 206 : square ? 158 : 164;
  const chipGap = portrait ? 26 : square ? 18 : 24;
  const chipBaseX = square ? searchBarX + Math.round((searchBarWidth - (chipWidth * 3 + chipGap * 2)) / 2) : searchBarX;
  const inspectorBadgeWidth = portrait ? 140 : 152;
  const inspectorBadgeX = square ? inspectorX + Math.round((inspectorWidth - inspectorBadgeWidth) / 2) : inspectorX + 28;
  const inspectorTitleAlign = square ? "center" : "left";
  const inspectorTitleX = square ? inspectorX + 24 : inspectorX + 48;
  const inspectorTitleWidth = square ? inspectorWidth - 48 : inspectorWidth - 96;
  const inspectorRowX = inspectorX + 28;
  const inspectorRowWidth = inspectorWidth - 56;
  const subheadlineHeight = square ? 88 : 56;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "search-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "search-top-rule", layer: "background", x: topRuleX, y: frameY + 26, width: topRuleWidth, height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.02, end: Math.min(0.36, duration * 0.16), property: "opacity", from: 0, to: 0.7, easing: "easeOut"}, {start: 0.02, end: Math.min(0.36, duration * 0.16), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "search-query-stage", layer: "background", x: searchBarX - 12, y: searchBarY - 18, width: searchBarWidth + 24, height: stageHeight, fill: square ? frame : surface, stroke: square ? accent : undefined, strokeWidth: square ? 3 : undefined, cornerRadius: 38, opacity: 0, animations: [{start: 0.03, end: Math.min(0.46, duration * 0.2), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.03, end: Math.min(0.46, duration * 0.2), property: "scale", from: 0.92, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "search-query-stage-glass", layer: "background", x: stageInsetX, y: stageInsetY, width: stageInsetWidth, height: stageInsetHeight, fill: mixHex(surface, "#FFFFFF", 0.22), cornerRadius: 999, opacity: 0, animations: [{start: 0.06, end: Math.min(0.52, duration * 0.24), property: "opacity", from: 0, to: 0.42, easing: "easeOut"}]}),
    ...[0, 1, 2].map((index) =>
      buildPanelElement({id: `search-chrome-dot-${index}`, layer: "background", x: searchBarX + 24 + index * 30, y: searchBarY - 4, width: 12, height: 12, fill: index === 0 ? accent : edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.08 + index * 0.03, end: Math.min(0.56 + index * 0.02, duration * 0.24), property: "opacity", from: 0, to: index === 0 ? 0.84 : 0.5, easing: "easeOut"}, {start: 0.08 + index * 0.03, end: Math.min(0.56 + index * 0.02, duration * 0.24), property: "scale", from: 0.5, to: 1, easing: "spring"}]})
    ),
    buildPanelElement({id: "search-bar", layer: "foreground", x: searchBarX, y: searchBarY, width: searchBarWidth, height: portrait ? 92 : square ? 94 : 102, fill: square ? surface : elevated, stroke: square ? edge : undefined, strokeWidth: square ? 2 : undefined, cornerRadius: 999, opacity: 0, animations: [{start: 0.04, end: Math.min(0.46, duration * 0.22), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.04, end: Math.min(0.46, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    {id: "search-glow", type: "glow", layer: "background", x: searchBarX - 36, y: searchBarY - 18, width: 166, height: 166, fill: accent, glowColor: accent, glowStrength: 0.58, opacity: 0, animations: [{start: 0.06, end: Math.min(0.56, duration * 0.24), property: "opacity", from: 0, to: 0.07, easing: "easeOut"}]},
    buildPanelElement({id: "search-icon-badge", layer: "foreground", x: searchBarX + 18, y: searchBarY + 16, width: square ? 60 : 56, height: square ? 60 : 56, fill: surface, cornerRadius: 18, opacity: 0, animations: [{start: 0.08, end: Math.min(0.52, duration * 0.22), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.08, end: Math.min(0.52, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildSearchIconElement("search-icon", searchBarX + (square ? 30 : 28), searchBarY + (square ? 28 : 26), square ? 36 : 32, accent, duration),
    buildTextElement({id: "search-query", layer: "main", x: searchTextX, y: searchTextY, width: searchTextWidth, height: queryHeight, fill: textColor, text: queryLines.join("\n"), fontSize: portrait ? 36 : square ? 38 : 42, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -1.1, lineHeight: 1.02, opacity: 0, animations: [{start: 0.12, end: Math.min(0.78, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.78, duration * 0.34), property: "translateY", from: 12, to: 0, easing: "easeOut"}]}),
    buildPanelElement({id: "search-caret", layer: "foreground", x: searchCaretX, y: searchBarY + 24, width: 6, height: square ? 38 : 34, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.82, duration * 0.36), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}]}),
    ...["Fast match", "UI cues", "Ranked"].map((label, index) =>
      buildPanelElement({id: `search-chip-${index}`, layer: "foreground", x: chipBaseX + index * (chipWidth + chipGap), y: chipsY, width: chipWidth, height: 48, fill: index === 1 ? elevated : surface, stroke: square ? edge : undefined, strokeWidth: square ? 2 : undefined, cornerRadius: 999, opacity: 0, animations: [{start: 0.16 + index * 0.04, end: Math.min(0.8 + index * 0.04, duration * 0.38), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.16 + index * 0.04, end: Math.min(0.8 + index * 0.04, duration * 0.38), property: "scale", from: 0.84, to: 1, easing: "spring"}]})
    ),
    ...["Fast match", "UI cues", "Ranked"].map((label, index) =>
      buildTextElement({id: `search-chip-text-${index}`, layer: "foreground", x: chipBaseX + 22 + index * (chipWidth + chipGap), y: chipsY + 14, width: chipWidth - 44, height: 20, fill: index === 1 ? textColor : accent, text: label.toUpperCase(), fontSize: 16, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.2 + index * 0.04, end: Math.min(0.84 + index * 0.04, duration * 0.4), property: "opacity", from: 0, to: 1, easing: "easeOut"}]})
    ),
    ...[0, 1, 2].flatMap((index) => {
      const rowY = resultsY + index * (resultHeight + resultGap);
      const lineWidth = index === 0 ? Math.round(resultWidth * 0.56) : index === 1 ? Math.round(resultWidth * 0.42) : Math.round(resultWidth * 0.68);
      return [
        buildPanelElement({id: `search-result-${index}`, layer: "background", x: searchBarX, y: rowY, width: resultWidth, height: resultHeight, fill: index === 1 ? elevated : surface, stroke: square ? edge : undefined, strokeWidth: square ? 2 : undefined, cornerRadius: 30, opacity: 0, animations: [{start: 0.18 + index * 0.1, end: Math.min(0.9 + index * 0.08, duration * 0.46), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.18 + index * 0.1, end: Math.min(0.9 + index * 0.08, duration * 0.46), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
        buildPanelElement({id: `search-result-rail-${index}`, layer: "foreground", x: searchBarX + 10, y: rowY + 12, width: 8, height: resultHeight - 24, fill: index === 1 ? accent : mixHex(accent, "#FFFFFF", 0.42), cornerRadius: 999, opacity: 0, animations: [{start: 0.2 + index * 0.1, end: Math.min(0.92 + index * 0.08, duration * 0.48), property: "opacity", from: 0, to: index === 1 ? 0.82 : 0.48, easing: "easeOut"}]}),
        buildPanelElement({id: `search-result-highlight-${index}`, layer: "background", x: searchBarX + 18, y: rowY + 14, width: Math.round(resultWidth * (index === 1 ? 0.22 : 0.16)), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.22 + index * 0.1, end: Math.min(0.94 + index * 0.08, duration * 0.48), property: "opacity", from: 0, to: index === 1 ? 0.74 : 0.44, easing: "easeOut"}, {start: 0.22 + index * 0.1, end: Math.min(0.94 + index * 0.08, duration * 0.48), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
        buildPanelElement({id: `search-dot-${index}`, layer: "foreground", x: searchBarX + 26, y: rowY + 24, width: 18, height: 18, fill: index === 1 ? accent : edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.2 + index * 0.1, end: Math.min(0.92 + index * 0.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.2 + index * 0.1, end: Math.min(0.92 + index * 0.08, duration * 0.48), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
        buildPanelElement({id: `search-line-${index}`, layer: "foreground", x: searchBarX + 58, y: rowY + 28, width: lineWidth, height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.24 + index * 0.1, end: Math.min(0.96 + index * 0.08, duration * 0.5), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.24 + index * 0.1, end: Math.min(0.96 + index * 0.08, duration * 0.5), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
        buildPanelElement({id: `search-line-sub-${index}`, layer: "foreground", x: searchBarX + 58, y: rowY + 56, width: Math.round(lineWidth * 0.68), height: 10, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.28 + index * 0.1, end: Math.min(1.02 + index * 0.08, duration * 0.54), property: "opacity", from: 0, to: 0.54, easing: "easeOut"}, {start: 0.28 + index * 0.1, end: Math.min(1.02 + index * 0.08, duration * 0.54), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
      ];
    }),
    buildPanelElement({id: "search-inspector", layer: "background", x: inspectorX, y: inspectorY, width: inspectorWidth, height: inspectorHeight, fill: square ? mixHex(frame, surface, 0.42) : surface, stroke: square ? accent : undefined, strokeWidth: square ? 3 : undefined, cornerRadius: 34, opacity: 0, animations: [{start: 0.22, end: Math.min(0.98, duration * 0.44), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(0.98, duration * 0.44), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "search-inspector-glass", layer: "background", x: inspectorX + 18, y: inspectorY + 18, width: inspectorWidth - 36, height: 56, fill: mixHex(surface, "#FFFFFF", 0.16), cornerRadius: 22, opacity: 0, animations: [{start: 0.24, end: Math.min(1, duration * 0.46), property: "opacity", from: 0, to: 0.34, easing: "easeOut"}]}),
    buildPanelElement({id: "search-inspector-badge", layer: "foreground", x: inspectorBadgeX, y: inspectorY + 26, width: inspectorBadgeWidth, height: 46, fill: square ? surface : elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(1, duration * 0.46), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.24, end: Math.min(1, duration * 0.46), property: "scale", from: 0.8, to: 1, easing: "spring"}]}),
    buildTextElement({id: "search-inspector-title", layer: "foreground", x: inspectorTitleX, y: inspectorY + 40, width: inspectorTitleWidth, height: 24, fill: accent, text: "SEARCH SCORE", fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: inspectorTitleAlign, letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.28, end: Math.min(1.04, duration * 0.48), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "search-score-track", layer: "background", x: inspectorRowX, y: inspectorY + 90, width: inspectorRowWidth, height: 16, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.3, end: Math.min(1.06, duration * 0.5), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}]}),
    buildPanelElement({id: "search-score-fill", layer: "foreground", x: inspectorRowX, y: inspectorY + 90, width: Math.round(inspectorRowWidth * 0.74), height: 16, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.16, duration * 0.54), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.34, end: Math.min(1.16, duration * 0.54), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    ...[0, 1, 2].map((_, index) =>
      buildPanelElement({id: `search-inspector-row-${index}`, layer: "foreground", x: inspectorRowX, y: inspectorY + 120 + index * 56, width: Math.round(inspectorRowWidth * (index === 0 ? 0.9 : index === 1 ? 0.72 : 0.54)), height: 12, fill: index === 0 ? textColor : edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.4 + index * 0.06, end: Math.min(1.2 + index * 0.04, duration * 0.56), property: "opacity", from: 0, to: index === 0 ? 0.22 : 0.56, easing: "easeOut"}, {start: 0.4 + index * 0.06, end: Math.min(1.2 + index * 0.04, duration * 0.56), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]})
    ),
    buildTextElement({id: "search-subheadline", layer: "foreground", x: searchBarX, y: subY, width: searchBarWidth, height: subheadlineHeight, fill: secondaryText, text: payload.subheadline ?? "A clearer query-loading scene with UI structure and supporting motion.", fontSize: portrait ? 24 : square ? 24 : 26, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: square ? "center" : "left", letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.34, end: Math.min(1.24, duration * 0.56), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.34, end: Math.min(1.24, duration * 0.56), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
  ];
};

const pickSearchCompositionVariant = (prompt: string): SearchCompositionVariant => {
  const labeled = parseLabeledValue(prompt, ["scene variant", "composition variant", "search variant", "variant"]);
  const normalizedLabel = labeled ? normalizePrompt(labeled) : "";
  if (includesAny(normalizedLabel, ["spotlight"])) return "search-spotlight";
  if (includesAny(normalizedLabel, ["dashboard"])) return "search-dashboard";
  if (includesAny(normalizedLabel, ["card"])) return "search-card";

  const normalized = normalizePrompt(prompt);
  if (includesAny(normalized, ["dashboard", "score", "metrics", "ranked", "analytics", "inspector"])) return "search-dashboard";
  if (includesAny(normalized, ["spotlight", "discover", "focus", "hero", "match"])) return "search-spotlight";
  return "search-card";
};

const buildSearchSpotlightSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track, design} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 86 : 92;
  const frameY = portrait ? 260 : square ? 134 : 160;
  const frameWidth = portrait ? canvas.width - 172 : canvas.width - 184;
  const frameHeight = portrait ? 1100 : square ? 864 : 756;
  const stageSize = portrait ? frameWidth - 128 : square ? 324 : 400;
  const stageX = portrait ? frameX + 64 : square ? frameX + Math.round((frameWidth - stageSize) / 2) : frameX + 82;
  const stageY = frameY + (portrait ? 78 : square ? 84 : 132);
  const iconBadgeSize = portrait ? 284 : square ? 184 : 236;
  const iconBadgeX = stageX + Math.round((stageSize - iconBadgeSize) / 2);
  const iconBadgeY = stageY + Math.round((stageSize - iconBadgeSize) / 2);
  const iconSize = portrait ? 204 : square ? 132 : 196;
  const iconX = iconBadgeX + Math.round((iconBadgeSize - iconSize) / 2);
  const iconY = iconBadgeY + Math.round((iconBadgeSize - iconSize) / 2);
  const textX = portrait ? frameX + 72 : square ? frameX + 82 : stageX + stageSize + 96;
  const textWidth = portrait ? frameWidth - 144 : square ? frameWidth - 164 : frameWidth - (textX - frameX) - 82;
  const textY = portrait ? stageY + stageSize + 92 : square ? stageY + stageSize + 88 : frameY + 168;
  const fit = fitTextBlock({
    headline: payload.headline ?? "Find The Right Match",
    subheadline: payload.subheadline,
    maxWidth: textWidth,
    maxHeight: portrait ? 320 : square ? 198 : 280,
    headlineChars: portrait ? 13 : square ? 15 : 15,
    maxHeadlineLines: 2,
    subChars: portrait ? 24 : 26,
    maxSubLines: 3,
    headlineDesired: portrait ? 72 : square ? 48 : 82,
    headlineMin: square ? 34 : 44,
    subDesired: portrait ? 24 : square ? 21 : 28,
    subMin: square ? 17 : 20,
    headlineWidthFactor: 0.74,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.16,
  });
  const headlineHeight = fit.headlineHeight;
  const subY = textY + headlineHeight + 30;
  const chipsY = portrait ? frameY + frameHeight - 188 : square ? Math.min(frameY + frameHeight - 92, textY + fit.totalHeight + 76) : textY + fit.totalHeight + 82;
  const align = square ? "center" : "left";
  const chipWidth = portrait ? 250 : square ? 188 : 176;
  const chipGap = portrait ? 22 : 18;
  const chipStartX = square
    ? frameX + Math.round((frameWidth - (chipWidth * 2 + chipGap)) / 2)
    : portrait
      ? frameX + Math.round((frameWidth - (chipWidth * 2 + chipGap)) / 2)
      : textX;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "search-spotlight-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "search-spotlight-stage", layer: "background", x: stageX, y: stageY, width: stageSize, height: stageSize, fill: surface, cornerRadius: 42, opacity: 0, animations: [{start: 0.04, end: Math.min(0.52, duration * 0.22), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.04, end: Math.min(0.52, duration * 0.22), property: "scale", from: 0.92, to: 1, easing: "spring"}]}),
    {id: "search-spotlight-glow", type: "glow", layer: "background", x: stageX - 54, y: stageY - 54, width: stageSize + 108, height: stageSize + 108, fill: accent, glowColor: accent, glowStrength: design.objectProminence === "dominant" ? 0.76 : 0.62, opacity: 0, animations: [{start: 0.06, end: Math.min(0.58, duration * 0.24), property: "opacity", from: 0, to: 0.08, easing: "easeOut"}]} ,
    buildPanelElement({id: "search-spotlight-icon-badge", layer: "foreground", x: iconBadgeX, y: iconBadgeY, width: iconBadgeSize, height: iconBadgeSize, fill: elevated, cornerRadius: Math.round(iconBadgeSize * 0.28), opacity: 0, animations: [{start: 0.08, end: Math.min(0.62, duration * 0.28), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.08, end: Math.min(0.62, duration * 0.28), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    {id: "search-spotlight-ring", type: "ring", layer: "background", x: iconBadgeX + 12, y: iconBadgeY + 12, width: iconBadgeSize - 24, height: iconBadgeSize - 24, stroke: mixHex(accent, "#FFFFFF", 0.42), strokeWidth: 3, opacity: 0, animations: [{start: 0.08, end: Math.min(0.72, duration * 0.3), property: "opacity", from: 0, to: 0.32, easing: "easeOut"}, {start: 0.08, end: Math.min(0.72, duration * 0.3), property: "draw", from: 0, to: 1, easing: "easeInOut"}]},
    buildSearchIconElement("search-spotlight-icon", iconX, iconY, iconSize, accent, duration),
    buildPanelElement({id: "search-spotlight-kicker-rule", layer: "foreground", x: align === "center" ? textX + Math.round((textWidth - Math.round(textWidth * 0.32)) / 2) : textX, y: textY - 24, width: Math.round(textWidth * 0.32), height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.08, end: Math.min(0.38, duration * 0.18), property: "opacity", from: 0, to: 0.8, easing: "easeOut"}, {start: 0.08, end: Math.min(0.38, duration * 0.18), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "search-spotlight-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: fit.headlineLines.join("\n"), fontSize: fit.headlineSize, fontWeight: 900, fontFamily, textAlign: align, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    ...(fit.subLines.length > 0 ? [
      buildTextElement({id: "search-spotlight-sub", layer: "foreground", x: textX, y: subY, width: textWidth, height: fit.subHeight + 16, fill: secondaryText, text: fit.subLines.join("\n"), fontSize: fit.subSize || 26, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: align, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.22, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(1.02, duration * 0.46), property: "translateY", from: 14, to: 0, easing: "easeOut"}]}),
    ] : []),
    ...["RANKED", "LIVE SCORE"].flatMap((label, index) => [
      buildPanelElement({id: `search-spotlight-chip-${index}`, layer: "foreground", x: chipStartX + index * (chipWidth + chipGap), y: chipsY, width: chipWidth, height: 58, fill: index === 0 ? elevated : surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.28 + index * 0.06, end: Math.min(1.06 + index * 0.04, duration * 0.48), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.28 + index * 0.06, end: Math.min(1.06 + index * 0.04, duration * 0.48), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
      buildTextElement({id: `search-spotlight-chip-text-${index}`, layer: "foreground", x: chipStartX + 22 + index * (chipWidth + chipGap), y: chipsY + 18, width: chipWidth - 44, height: 22, fill: index === 0 ? accent : edge, text: label, fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.32 + index * 0.06, end: Math.min(1.1 + index * 0.04, duration * 0.5), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    ]),
    buildPanelElement({id: "search-spotlight-track", layer: "background", x: textX, y: chipsY - 42, width: textWidth, height: 14, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(0.94, duration * 0.42), property: "opacity", from: 0, to: 0.76, easing: "easeOut"}]}),
    buildPanelElement({id: "search-spotlight-fill", layer: "foreground", x: textX, y: chipsY - 42, width: Math.round(textWidth * 0.68), height: 14, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.28, end: Math.min(1.02, duration * 0.46), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
  ];
};

const buildSearchDashboardSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const stacked = portrait || square;
  const frameX = portrait ? 84 : 90;
  const frameY = portrait ? 254 : square ? 132 : 156;
  const frameWidth = portrait ? canvas.width - 168 : canvas.width - 180;
  const frameHeight = portrait ? 1120 : square ? 858 : 748;
  const leftX = frameX + 46;
  const topY = frameY + 52;
  const gridWidth = stacked ? frameWidth - 92 : Math.round(frameWidth * 0.54);
  const gridHeight = portrait ? 438 : square ? 338 : frameHeight - 116;
  const rightX = stacked ? leftX : leftX + gridWidth + 34;
  const rightWidth = stacked ? gridWidth : frameWidth - (rightX - frameX) - 48;
  const textY = stacked ? topY + gridHeight + 74 : topY + 40;
  const fit = fitTextBlock({
    headline: payload.headline ?? "Find The Right Match",
    subheadline: payload.subheadline,
    maxWidth: rightWidth,
    maxHeight: portrait ? 270 : 236,
    headlineChars: portrait ? 14 : 15,
    maxHeadlineLines: 2,
    subChars: 24,
    maxSubLines: 3,
    headlineDesired: portrait ? 64 : square ? 62 : 66,
    headlineMin: 40,
    subDesired: portrait ? 24 : 26,
    subMin: 20,
    headlineWidthFactor: 0.74,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -1.8,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.16,
  });
  const textX = portrait ? leftX : rightX;
  const scoreY = portrait ? topY + gridHeight - 80 : frameY + frameHeight - 120;
  const align = stacked ? "center" : "left";
  const chartCardWidth = portrait ? Math.round((gridWidth - 20) / 2) : Math.round(gridWidth * 0.46);
  const chartCardHeight = portrait ? 154 : 170;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "search-dashboard-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "search-dashboard-grid", layer: "background", x: leftX, y: topY, width: gridWidth, height: gridHeight, fill: surface, cornerRadius: 40, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "search-dashboard-topbar", layer: "foreground", x: leftX + 26, y: topY + 24, width: gridWidth - 52, height: 72, fill: elevated, cornerRadius: 28, opacity: 0, animations: [{start: 0.08, end: Math.min(0.58, duration * 0.24), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "search-dashboard-icon-badge", layer: "foreground", x: leftX + 34, y: topY + 18, width: 64, height: 64, fill: surface, cornerRadius: 22, opacity: 0, animations: [{start: 0.1, end: Math.min(0.62, duration * 0.26), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.1, end: Math.min(0.62, duration * 0.26), property: "scale", from: 0.92, to: 1, easing: "spring"}]}),
    buildSearchIconElement("search-dashboard-icon", leftX + 45, topY + 29, 40, accent, duration),
    buildTextElement({id: "search-dashboard-query", layer: "foreground", x: leftX + 116, y: topY + 40, width: gridWidth - 180, height: 28, fill: textColor, text: "QUERY MATCH SCORE", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.12, end: Math.min(0.66, duration * 0.28), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    ...[0, 1, 2, 3].flatMap((index) => {
      const cardX = leftX + 26 + (portrait ? index % 2 : 0) * (chartCardWidth + 20);
      const cardY = topY + 122 + Math.floor(index / (portrait ? 2 : 1)) * (chartCardHeight + 20);
      const width = portrait ? chartCardWidth : gridWidth - 52;
      return [
        buildPanelElement({id: `search-dashboard-card-${index}`, layer: "foreground", x: cardX, y: cardY, width, height: chartCardHeight, fill: index % 2 === 0 ? elevated : surface, cornerRadius: 28, opacity: 0, animations: [{start: 0.16 + index * 0.05, end: Math.min(0.92 + index * 0.04, duration * 0.42), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.16 + index * 0.05, end: Math.min(0.92 + index * 0.04, duration * 0.42), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
        buildPanelElement({id: `search-dashboard-rail-${index}`, layer: "foreground", x: cardX + 18, y: cardY + 18, width: 8, height: chartCardHeight - 36, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.2 + index * 0.05, end: Math.min(0.96 + index * 0.04, duration * 0.44), property: "opacity", from: 0, to: 0.7, easing: "easeOut"}]}),
        buildPanelElement({id: `search-dashboard-line-${index}`, layer: "foreground", x: cardX + 42, y: cardY + 34, width: Math.round(width * 0.52), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.22 + index * 0.05, end: Math.min(0.98 + index * 0.04, duration * 0.46), property: "opacity", from: 0, to: 0.86, easing: "easeOut"}]}),
        buildPanelElement({id: `search-dashboard-line-sub-${index}`, layer: "foreground", x: cardX + 42, y: cardY + 62, width: Math.round(width * (index % 2 === 0 ? 0.36 : 0.44)), height: 10, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.24 + index * 0.05, end: Math.min(1.02 + index * 0.04, duration * 0.48), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}]}),
      ];
    }),
    buildTextElement({id: "search-dashboard-headline", layer: "main", x: textX, y: textY, width: rightWidth, height: fit.headlineHeight, fill: textColor, text: fit.headlineLines.join("\n"), fontSize: fit.headlineSize, fontWeight: 900, fontFamily, textAlign: align, letterSpacing: -1.8, lineHeight: 0.92, opacity: 0, animations: [{start: 0.14, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.14, end: Math.min(0.88, duration * 0.38), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    ...(fit.subLines.length > 0 ? [
      buildTextElement({id: "search-dashboard-sub", layer: "foreground", x: textX, y: textY + fit.headlineHeight + 24, width: rightWidth, height: fit.subHeight + 18, fill: secondaryText, text: fit.subLines.join("\n"), fontSize: fit.subSize || 24, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: align, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.24, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(1.02, duration * 0.46), property: "translateY", from: 14, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "search-dashboard-score-track", layer: "background", x: textX, y: scoreY, width: rightWidth, height: 16, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.3, end: Math.min(1.06, duration * 0.5), property: "opacity", from: 0, to: 0.76, easing: "easeOut"}]}),
    buildPanelElement({id: "search-dashboard-score-fill", layer: "foreground", x: textX, y: scoreY, width: Math.round(rightWidth * 0.78), height: 16, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.12, duration * 0.54), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.34, end: Math.min(1.12, duration * 0.54), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "search-dashboard-score-text", layer: "foreground", x: textX, y: scoreY + 28, width: rightWidth, height: 24, fill: accent, text: "MATCH SCORE  78%", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: align, letterSpacing: 1.1, lineHeight: 1, opacity: 0, animations: [{start: 0.38, end: Math.min(1.16, duration * 0.56), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
  ];
};

const buildSearchSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const compositionVariant = pickSearchCompositionVariant(prompt);
  if (compositionVariant === "search-spotlight") return buildSearchSpotlightSceneElements(payload, canvas, sceneStyle, duration, prompt);
  if (compositionVariant === "search-dashboard") return buildSearchDashboardSceneElements(payload, canvas, sceneStyle, duration, prompt);
  return buildSearchCardSceneElements(payload, canvas, sceneStyle, duration, prompt);
};

const pickCartCompositionVariant = (prompt: string): CartCompositionVariant => {
  const labeled = parseLabeledValue(prompt, ["scene variant", "composition variant", "cart variant", "variant"]);
  const normalizedLabel = labeled ? normalizePrompt(labeled) : "";
  if (includesAny(normalizedLabel, ["spotlight", "hero", "feature"])) return "cart-spotlight";
  if (includesAny(normalizedLabel, ["checkout", "stack", "summary"])) return "cart-checkout-stack";
  if (includesAny(normalizedLabel, ["card"])) return "cart-card";

  const normalized = normalizePrompt(prompt);
  if (includesAny(normalized, ["spotlight", "hero", "featured", "product spotlight"])) return "cart-spotlight";
  if (includesAny(normalized, ["checkout", "summary", "order", "cta", "buy", "purchase"])) return "cart-checkout-stack";
  return "cart-card";
};

const pickDownloadCompositionVariant = (prompt: string): DownloadCompositionVariant => {
  const labeled = parseLabeledValue(prompt, ["scene variant", "composition variant", "download variant", "variant"]);
  const normalizedLabel = labeled ? normalizePrompt(labeled) : "";
  if (includesAny(normalizedLabel, ["spotlight", "hero", "feature"])) return "download-spotlight";
  if (includesAny(normalizedLabel, ["stack", "save stack", "status", "status board"])) return "download-save-stack";
  if (includesAny(normalizedLabel, ["card"])) return "download-card";

  const normalized = normalizePrompt(prompt);
  if (includesAny(normalized, ["spotlight", "hero", "featured", "download spotlight"])) return "download-spotlight";
  if (includesAny(normalized, ["save stack", "status board", "stacked save", "stacked download"])) return "download-save-stack";
  return "download-card";
};

const buildCartCardSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 86 : square ? 92 : 92;
  const frameY = portrait ? 296 : square ? 146 : 170;
  const frameWidth = portrait ? canvas.width - 172 : square ? canvas.width - 184 : canvas.width - 184;
  const frameHeight = portrait ? 980 : square ? 820 : 730;
  const textColumnWidth = portrait ? frameWidth - 96 : square ? 480 : Math.round((frameWidth - 120) * 0.42);
  const fit = fitTextBlock({
    headline: payload.headline ?? "Add To Cart",
    subheadline: payload.subheadline,
    maxWidth: textColumnWidth,
    maxHeight: portrait ? 228 : square ? 196 : 188,
    headlineChars: 14,
    maxHeadlineLines: 2,
    subChars: portrait ? 22 : 24,
    maxSubLines: 3,
    headlineDesired: portrait ? 62 : square ? 54 : 64,
    headlineMin: portrait ? 38 : square ? 40 : 42,
    subDesired: portrait ? 24 : square ? 20 : 26,
    subMin: square ? 16 : 20,
    headlineWidthFactor: 0.74,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.14,
  });
  const headlineLines = fit.headlineLines;
  const headlineSize = fit.headlineSize;
  const headlineHeight = fit.headlineHeight;
  const topX = portrait ? frameX + 48 : square ? frameX + Math.round((frameWidth - textColumnWidth) / 2) : frameX + 48;
  const productWidth = portrait ? frameWidth - 96 : square ? 456 : Math.round((frameWidth - 120) * 0.5);
  const productHeight = portrait ? 180 : square ? 258 : 212;
  const productX = portrait ? topX : square ? frameX + Math.round((frameWidth - productWidth) / 2) : frameX + frameWidth - Math.round((frameWidth - 120) * 0.5) - 48;
  const productY = portrait ? frameY + 56 + headlineHeight + 54 : square ? frameY + 86 : frameY + 84;
  const topY = portrait ? frameY + 56 : square ? productY + productHeight + 64 : frameY + 56;
  const checkoutY = portrait ? productY + productHeight + 34 : square ? frameY + frameHeight - 122 : frameY + frameHeight - 154;
  const ctaWidth = portrait ? frameWidth - 96 : square ? textColumnWidth : textColumnWidth;
  const summaryY = portrait ? checkoutY + 114 : square ? topY + headlineHeight + fit.subHeight + 132 : productY + productHeight + 28;
  const summaryWidth = portrait ? frameWidth - 96 : square ? textColumnWidth : productWidth;
  const priceChipY = portrait ? productY - 84 : square ? topY + headlineHeight + fit.subHeight + 34 : topY + headlineHeight + 136;
  const cartSize = portrait ? 118 : square ? 92 : 106;
  const textAlign = square ? "center" : "left";
  const railX = portrait ? topX : square ? frameX + Math.round((frameWidth - Math.round(textColumnWidth * 0.34)) / 2) : topX;
  const railY = portrait ? topY - 24 : square ? frameY + 34 : topY - 24;
  const railWidth = portrait ? textColumnWidth : square ? Math.round(textColumnWidth * 0.38) : 14;
  const railHeight = portrait ? 10 : square ? 10 : frameHeight - 152;
  const thumbWidth = portrait ? 132 : square ? 148 : 150;
  const thumbHeight = portrait ? 132 : square ? 148 : 150;
  const thumbX = square ? productX + Math.round((productWidth - thumbWidth) / 2) : productX + 26;
  const thumbY = productY + (square ? 26 : 24);
  const badgeWidth = portrait ? 88 : square ? 92 : 102;
  const badgeHeight = portrait ? 88 : square ? 92 : 102;
  const badgeX = square ? thumbX + Math.round((thumbWidth - badgeWidth) / 2) : productX + 48;
  const badgeY = square ? thumbY + 22 : productY + 46;
  const productLineX = square ? productX + 34 : productX + (portrait ? 184 : 210);
  const productLineWidth = square ? productWidth - 68 : portrait ? productWidth - 218 : productWidth - 246;
  const productLine1Y = square ? productY + 190 : productY + 34;
  const productLine2Y = square ? productY + 230 : productY + 84;
  const summaryX = portrait ? topX : square ? topX : productX;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "cart-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-left-rail", layer: "background", x: railX, y: railY, width: railWidth, height: railHeight, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.06, end: Math.min(0.4, duration * 0.18), property: "opacity", from: 0, to: 0.66, easing: "easeOut"}, {start: 0.06, end: Math.min(0.4, duration * 0.18), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-headline", layer: "main", x: topX, y: topY, width: textColumnWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.08, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    buildTextElement({id: "cart-copy", layer: "foreground", x: topX, y: topY + headlineHeight + 22, width: textColumnWidth, height: Math.max(68, fit.subHeight + 12), fill: secondaryText, text: (fit.subLines.length > 0 ? fit.subLines.join("\n") : "Structured SVG motion scenes with cleaner layout logic."), fontSize: fit.subSize || (portrait ? 24 : square ? 20 : 26), fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.18, end: Math.min(0.98, duration * 0.44), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.18, end: Math.min(0.98, duration * 0.44), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-price-chip", layer: "foreground", x: topX, y: priceChipY, width: portrait ? 286 : square ? textColumnWidth : 228, height: 60, fill: surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.22, end: Math.min(1, duration * 0.46), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.22, end: Math.min(1, duration * 0.46), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "cart-price-chip-text", layer: "foreground", x: square ? topX : topX + 22, y: priceChipY + 18, width: portrait ? 244 : square ? textColumnWidth : 184, height: 20, fill: accent, text: "LIMITED DROP  $89", fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.26, end: Math.min(1.04, duration * 0.48), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-product", layer: "background", x: productX, y: productY, width: productWidth, height: productHeight, fill: surface, cornerRadius: 36, opacity: 0, animations: [{start: 0.16, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.16, end: Math.min(0.88, duration * 0.38), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-thumb", layer: "foreground", x: thumbX, y: thumbY, width: thumbWidth, height: thumbHeight, fill: elevated, cornerRadius: 28, opacity: 0, animations: [{start: 0.2, end: Math.min(0.9, duration * 0.4), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-thumb-badge", layer: "foreground", x: badgeX, y: badgeY, width: badgeWidth, height: badgeHeight, fill: accent, cornerRadius: 26, opacity: 0, animations: [{start: 0.24, end: Math.min(0.96, duration * 0.42), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.24, end: Math.min(0.96, duration * 0.42), property: "scale", from: 0.8, to: 1, easing: "spring"}]}),
    buildTextElement({id: "cart-product-line-1", layer: "foreground", x: productLineX, y: productLine1Y, width: productLineWidth, height: 44, fill: textColor, text: "Premium Motion Pack", fontSize: portrait ? 32 : square ? 34 : 34, fontWeight: 800, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.6, lineHeight: 1, opacity: 0, animations: [{start: 0.24, end: Math.min(0.96, duration * 0.42), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.24, end: Math.min(0.96, duration * 0.42), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "cart-product-line-2", layer: "foreground", x: productLineX, y: productLine2Y, width: productLineWidth, height: square ? 64 : 68, fill: secondaryText, text: "Bundle your best SVG scenes\ninto a cleaner checkout moment", fontSize: square ? 20 : 24, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.28, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.28, end: Math.min(1.02, duration * 0.46), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildIconElement("cart-icon", "cart", square ? productX + productWidth - cartSize - 26 : productX + productWidth - cartSize - 34, square ? productY + 26 : productY + 28, cartSize, accent, duration),
    buildPanelElement({id: "cart-summary", layer: "background", x: summaryX, y: summaryY, width: summaryWidth, height: portrait ? 126 : square ? 116 : 98, fill: elevated, cornerRadius: 30, opacity: 0, animations: [{start: 0.3, end: Math.min(1.06, duration * 0.48), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.3, end: Math.min(1.06, duration * 0.48), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-summary-track", layer: "background", x: summaryX + 28, y: summaryY + 30, width: summaryWidth - 56, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.12, duration * 0.52), property: "opacity", from: 0, to: 0.7, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-summary-fill", layer: "foreground", x: summaryX + 28, y: summaryY + 30, width: Math.round((summaryWidth - 56) * 0.78), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.38, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.38, end: Math.min(1.18, duration * 0.54), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-summary-text", layer: "foreground", x: summaryX + 28, y: summaryY + 60, width: summaryWidth - 56, height: 28, fill: edge, text: "Order confidence 78%", fontSize: square ? 24 : 22, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.4, end: Math.min(1.2, duration * 0.56), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-cta", layer: "foreground", x: topX, y: checkoutY, width: ctaWidth, height: 72, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.32, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.32, end: Math.min(1.08, duration * 0.48), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "cart-cta-text", layer: "foreground", x: square ? topX : topX + 28, y: checkoutY + 22, width: square ? ctaWidth : ctaWidth - 56, height: 28, fill: accent, text: "CHECKOUT READY", fontSize: 24, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.3, lineHeight: 1, opacity: 0, animations: [{start: 0.36, end: Math.min(1.14, duration * 0.5), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.36, end: Math.min(1.14, duration * 0.5), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-total-bar", layer: "foreground", x: topX, y: frameY + frameHeight - 110, width: frameWidth - 96, height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.4, end: Math.min(1.22, duration * 0.56), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.4, end: Math.min(1.22, duration * 0.56), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
  ];
};

const buildCartSpotlightSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track, design} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 82 : 92;
  const frameY = portrait ? 252 : square ? 132 : 156;
  const frameWidth = portrait ? canvas.width - 164 : canvas.width - 184;
  const frameHeight = portrait ? 1280 : square ? 900 : 780;
  const stageWidth = portrait ? frameWidth - 110 : square ? 760 : 620;
  const stageHeight = portrait ? 420 : square ? 520 : 390;
  const stageX = frameX + Math.round((frameWidth - stageWidth) / 2);
  const stageY = frameY + (square ? 38 : 54);
  const productWidth = portrait ? 318 : square ? 486 : 344;
  const productHeight = portrait ? 318 : square ? 486 : 344;
  const productX = stageX + Math.round((stageWidth - productWidth) / 2);
  const productY = stageY + Math.round((stageHeight - productHeight) / 2);
  const badgeSize = portrait ? 96 : square ? 140 : 96;
  const badgeX = stageX + stageWidth - badgeSize - (square ? 24 : 34);
  const badgeY = stageY + (square ? 24 : 34);
  const iconSize = portrait ? 88 : square ? 112 : 86;
  const textWidth = portrait ? frameWidth - 170 : square ? 660 : 560;
  const textX = frameX + Math.round((frameWidth - textWidth) / 2);
  const textY = stageY + stageHeight + (square ? 28 : 72);
  const fit = fitTextBlock({
    headline: payload.headline ?? "Ready To Buy",
    subheadline: payload.subheadline,
    maxWidth: textWidth,
    maxHeight: portrait ? 260 : square ? 228 : 240,
    headlineChars: square ? 10 : 15,
    maxHeadlineLines: 2,
    subChars: square ? 18 : 24,
    maxSubLines: square ? 2 : 3,
    headlineDesired: portrait ? 72 : square ? 96 : 74,
    headlineMin: square ? 68 : 44,
    subDesired: portrait ? 24 : square ? 28 : 26,
    subMin: 18,
    headlineWidthFactor: 0.66,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.14,
  });
  const headlineHeight = fit.headlineHeight;
  const summaryWidth = portrait ? frameWidth - 150 : square ? 560 : 468;
  const summaryX = frameX + Math.round((frameWidth - summaryWidth) / 2);
  const summaryY = textY + headlineHeight + fit.subHeight + (square ? 20 : 54);
  const ctaWidth = portrait ? summaryWidth : square ? 470 : 340;
  const ctaX = frameX + Math.round((frameWidth - ctaWidth) / 2);
  const ctaY = frameY + frameHeight - 138;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "cart-spotlight-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 54, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-spotlight-stage", layer: "background", x: stageX, y: stageY, width: stageWidth, height: stageHeight, fill: surface, cornerRadius: 52, opacity: 0, animations: [{start: 0.04, end: Math.min(0.52, duration * 0.24), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0.04, end: Math.min(0.52, duration * 0.24), property: "scale", from: 0.92, to: 1, easing: "spring"}]}),
    {id: "cart-spotlight-glow", type: "glow", layer: "background", x: stageX - 68, y: stageY - 68, width: stageWidth + 136, height: stageHeight + 136, fill: accent, glowColor: accent, glowStrength: design.objectProminence === "dominant" ? 0.9 : 0.76, opacity: 0, animations: [{start: 0.08, end: Math.min(0.58, duration * 0.28), property: "opacity", from: 0, to: 0.13, easing: "easeOut"}]},
    buildPanelElement({id: "cart-spotlight-hero-sheen", layer: "background", x: stageX + 22, y: stageY + 22, width: stageWidth - 44, height: Math.round(stageHeight * 0.24), fill: mixHex(accent, "#FFFFFF", 0.74), cornerRadius: 999, opacity: 0, animations: [{start: 0.1, end: Math.min(0.62, duration * 0.28), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-spotlight-product", layer: "foreground", x: productX, y: productY, width: productWidth, height: productHeight, fill: elevated, cornerRadius: 42, opacity: 0, animations: [{start: 0.1, end: Math.min(0.62, duration * 0.28), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.1, end: Math.min(0.62, duration * 0.28), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-spotlight-thumb", layer: "foreground", x: productX + Math.round(productWidth * 0.08), y: productY + Math.round(productHeight * 0.1), width: Math.round(productWidth * 0.34), height: Math.round(productHeight * 0.34), fill: accent, cornerRadius: 34, opacity: 0, animations: [{start: 0.14, end: Math.min(0.7, duration * 0.32), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-spotlight-price-pill", layer: "foreground", x: productX + Math.round(productWidth * 0.6), y: productY + Math.round(productHeight * 0.12), width: Math.round(productWidth * 0.22), height: square ? 60 : 52, fill: surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.76, duration * 0.34), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.18, end: Math.min(0.76, duration * 0.34), property: "scale", from: 0.82, to: 1, easing: "spring"}]}),
    buildTextElement({id: "cart-spotlight-price-pill-text", layer: "foreground", x: productX + Math.round(productWidth * 0.6), y: productY + Math.round(productHeight * 0.12) + (square ? 17 : 13), width: Math.round(productWidth * 0.22), height: 28, fill: accent, text: "$89", fontSize: square ? 32 : 22, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.2, end: Math.min(0.8, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-spotlight-product-line-1", layer: "foreground", x: productX + 36, y: productY + Math.round(productHeight * 0.56), width: productWidth - 72, height: 54, fill: textColor, text: "Premium Motion Pack", fontSize: square ? 44 : 30, fontWeight: 800, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "center", letterSpacing: -0.8, lineHeight: 1, opacity: 0, animations: [{start: 0.16, end: Math.min(0.74, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-spotlight-product-line-2", layer: "foreground", x: productX + 36, y: productY + Math.round(productHeight * 0.73), width: productWidth - 72, height: 70, fill: secondaryText, text: "Curated SVG scenes\nfor a cleaner storefront", fontSize: square ? 24 : 20, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.18, end: Math.min(0.78, duration * 0.36), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-spotlight-badge", layer: "foreground", x: badgeX, y: badgeY, width: badgeSize, height: badgeSize, fill: elevated, cornerRadius: 26, opacity: 0, animations: [{start: 0.16, end: Math.min(0.72, duration * 0.34), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.16, end: Math.min(0.72, duration * 0.34), property: "scale", from: 0.82, to: 1, easing: "spring"}]}),
    buildIconElement("cart-spotlight-icon", "cart", badgeX + Math.round((badgeSize - iconSize) / 2), badgeY + Math.round((badgeSize - iconSize) / 2), iconSize, accent, duration),
    buildPanelElement({id: "cart-spotlight-rail", layer: "foreground", x: textX + Math.round((textWidth - Math.round(textWidth * 0.3)) / 2), y: textY - 28, width: Math.round(textWidth * 0.3), height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.14, end: Math.min(0.46, duration * 0.22), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.14, end: Math.min(0.46, duration * 0.22), property: "scale", from: 0.28, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-spotlight-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: fit.headlineLines.join("\n"), fontSize: fit.headlineSize, fontWeight: 900, fontFamily, textAlign: "center", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.18, end: Math.min(0.92, duration * 0.42), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.18, end: Math.min(0.92, duration * 0.42), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildTextElement({id: "cart-spotlight-sub", layer: "foreground", x: textX, y: textY + headlineHeight + 20, width: textWidth, height: Math.max(64, fit.subHeight + 16), fill: secondaryText, text: fit.subLines.length > 0 ? fit.subLines.join("\n") : "A clearer checkout scene with product focus and conversion framing.", fontSize: fit.subSize || (square ? 22 : 24), fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.24, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-spotlight-summary", layer: "background", x: summaryX, y: summaryY, width: summaryWidth, height: square ? 124 : 112, fill: elevated, cornerRadius: 34, opacity: 0, animations: [{start: 0.28, end: Math.min(1.06, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.28, end: Math.min(1.06, duration * 0.48), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-spotlight-summary-track", layer: "background", x: summaryX + 28, y: summaryY + 28, width: summaryWidth - 56, height: 14, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.32, end: Math.min(1.12, duration * 0.52), property: "opacity", from: 0, to: 0.74, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-spotlight-summary-fill", layer: "foreground", x: summaryX + 28, y: summaryY + 28, width: Math.round((summaryWidth - 56) * 0.84), height: 14, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.36, end: Math.min(1.18, duration * 0.54), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-spotlight-summary-text", layer: "foreground", x: summaryX + 28, y: summaryY + 60, width: summaryWidth - 56, height: 30, fill: edge, text: "Conversion confidence 84%", fontSize: square ? 24 : 24, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.4, end: Math.min(1.24, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-spotlight-cta", layer: "foreground", x: ctaX, y: ctaY, width: ctaWidth, height: 80, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.42, end: Math.min(1.28, duration * 0.6), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.42, end: Math.min(1.28, duration * 0.6), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "cart-spotlight-cta-text", layer: "foreground", x: ctaX, y: ctaY + 24, width: ctaWidth, height: 30, fill: accent, text: "CHECKOUT READY", fontSize: 24, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.46, end: Math.min(1.34, duration * 0.62), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
  ];
};

const buildCartCheckoutStackSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 82 : 92;
  const frameY = portrait ? 252 : square ? 132 : 152;
  const frameWidth = portrait ? canvas.width - 164 : canvas.width - 184;
  const frameHeight = portrait ? 1260 : square ? 900 : 780;
  const leftWidth = portrait ? frameWidth - 132 : square ? frameWidth - 132 : 520;
  const leftX = portrait ? frameX + 54 : square ? frameX + 66 : frameX + 54;
  const topY = frameY + 64;
  const fit = fitTextBlock({
    headline: payload.headline ?? "Ready To Buy",
    subheadline: payload.subheadline,
    maxWidth: leftWidth,
    maxHeight: portrait ? 250 : square ? 236 : 240,
    headlineChars: square ? 12 : 14,
    maxHeadlineLines: 2,
    subChars: 23,
    maxSubLines: 3,
    headlineDesired: portrait ? 68 : square ? 72 : 72,
    headlineMin: square ? 44 : 42,
    subDesired: portrait ? 24 : square ? 22 : 24,
    subMin: 18,
    headlineWidthFactor: 0.74,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.14,
  });
  const headlineHeight = fit.headlineHeight;
  const rightCardWidth = portrait ? frameWidth - 132 : square ? 560 : 420;
  const rightCardX = portrait ? frameX + frameWidth - rightCardWidth - 46 : square ? frameX + Math.round((frameWidth - rightCardWidth) / 2) : frameX + frameWidth - rightCardWidth - 46;
  const stackTopY = portrait ? topY + headlineHeight + fit.subHeight + 68 : square ? topY + headlineHeight + fit.subHeight + 74 : frameY + 108;
  const card1Y = stackTopY;
  const card2Y = card1Y + (square ? 78 : 56);
  const card3Y = card2Y + (square ? 78 : 56);
  const cardHeight = portrait ? 208 : square ? 246 : 186;
  const summaryX = square ? frameX + Math.round((frameWidth - (frameWidth - 156)) / 2) : leftX;
  const summaryY = square ? card3Y + cardHeight + 48 : topY + headlineHeight + fit.subHeight + 72;
  const summaryWidth = square ? frameWidth - 156 : leftWidth;
  const ctaX = square ? frameX + Math.round((frameWidth - 430) / 2) : leftX;
  const ctaY = frameY + frameHeight - 134;
  const ctaWidth = square ? 430 : portrait ? leftWidth : 320;
  const cartSize = square ? 104 : 82;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "cart-stack-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 54, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-stack-rail", layer: "foreground", x: square ? leftX + Math.round((leftWidth - Math.round(leftWidth * 0.28)) / 2) : leftX, y: topY - 30, width: Math.round(leftWidth * (square ? 0.28 : 0.34)), height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.06, end: Math.min(0.38, duration * 0.18), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.06, end: Math.min(0.38, duration * 0.18), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-stack-headline", layer: "main", x: leftX, y: topY, width: leftWidth, height: headlineHeight, fill: textColor, text: fit.headlineLines.join("\n"), fontSize: fit.headlineSize, fontWeight: 900, fontFamily, textAlign: square ? "center" : "left", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.08, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildTextElement({id: "cart-stack-copy", layer: "foreground", x: leftX, y: topY + headlineHeight + 20, width: leftWidth, height: Math.max(72, fit.subHeight + 16), fill: secondaryText, text: fit.subLines.length > 0 ? fit.subLines.join("\n") : "A stronger ecommerce scene with checkout stack and conversion framing.", fontSize: fit.subSize || (square ? 22 : 24), fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: square ? "center" : "left", letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.16, end: Math.min(0.94, duration * 0.42), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-stack-card-3", layer: "background", x: square ? rightCardX + 58 : rightCardX + 42, y: card3Y, width: square ? rightCardWidth - 116 : rightCardWidth - 84, height: square ? cardHeight - 38 : cardHeight - 24, fill: surface, cornerRadius: 34, opacity: 0, animations: [{start: 0.18, end: Math.min(0.9, duration * 0.4), property: "opacity", from: 0, to: 0.34, easing: "easeOut"}, {start: 0.18, end: Math.min(0.9, duration * 0.4), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildPanelElement({id: "cart-stack-card-2", layer: "background", x: square ? rightCardX + 28 : rightCardX + 20, y: card2Y, width: square ? rightCardWidth - 56 : rightCardWidth - 40, height: square ? cardHeight - 16 : cardHeight - 12, fill: elevated, cornerRadius: 38, opacity: 0, animations: [{start: 0.2, end: Math.min(0.94, duration * 0.42), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.2, end: Math.min(0.94, duration * 0.42), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildPanelElement({id: "cart-stack-card-1", layer: "foreground", x: rightCardX, y: card1Y, width: rightCardWidth, height: cardHeight, fill: surface, cornerRadius: 40, opacity: 0, animations: [{start: 0.22, end: Math.min(0.98, duration * 0.44), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.22, end: Math.min(0.98, duration * 0.44), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildPanelElement({id: "cart-stack-thumb", layer: "foreground", x: rightCardX + 34, y: card1Y + 34, width: square ? 118 : 96, height: square ? 118 : 96, fill: accent, cornerRadius: 28, opacity: 0, animations: [{start: 0.26, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.76, easing: "easeOut"}]}),
    buildIconElement("cart-stack-icon", "cart", rightCardX + rightCardWidth - cartSize - 30, card1Y + 34, cartSize, accent, duration),
    buildTextElement({id: "cart-stack-line-1", layer: "foreground", x: rightCardX + 34, y: card1Y + (square ? 168 : 144), width: rightCardWidth - 68, height: 44, fill: textColor, text: "Premium Motion Pack", fontSize: square ? 36 : 30, fontWeight: 800, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.5, lineHeight: 1, opacity: 0, animations: [{start: 0.28, end: Math.min(1.04, duration * 0.48), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-stack-line-2", layer: "foreground", x: rightCardX + 34, y: card1Y + (square ? 216 : 186), width: rightCardWidth - 68, height: 70, fill: secondaryText, text: "Bundle your best SVG scenes\ninto a cleaner checkout moment", fontSize: square ? 22 : 20, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.3, end: Math.min(1.08, duration * 0.5), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-stack-summary", layer: "background", x: summaryX, y: summaryY, width: summaryWidth, height: 114, fill: elevated, cornerRadius: 30, opacity: 0, animations: [{start: 0.32, end: Math.min(1.1, duration * 0.5), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.32, end: Math.min(1.1, duration * 0.5), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "cart-stack-summary-track", layer: "background", x: summaryX + 28, y: summaryY + 28, width: summaryWidth - 56, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.16, duration * 0.54), property: "opacity", from: 0, to: 0.74, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-stack-summary-fill", layer: "foreground", x: summaryX + 28, y: summaryY + 28, width: Math.round((summaryWidth - 56) * 0.72), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.4, end: Math.min(1.22, duration * 0.56), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.4, end: Math.min(1.22, duration * 0.56), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "cart-stack-summary-text", layer: "foreground", x: summaryX + 28, y: summaryY + 58, width: summaryWidth - 56, height: 28, fill: edge, text: "Checkout confidence 72%", fontSize: square ? 24 : 24, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: square ? "center" : "left", letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.44, end: Math.min(1.26, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "cart-stack-cta", layer: "foreground", x: ctaX, y: ctaY, width: ctaWidth, height: 72, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.42, end: Math.min(1.24, duration * 0.58), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.42, end: Math.min(1.24, duration * 0.58), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "cart-stack-cta-text", layer: "foreground", x: ctaX, y: ctaY + 22, width: ctaWidth, height: 26, fill: accent, text: "CHECKOUT READY", fontSize: 22, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.46, end: Math.min(1.3, duration * 0.6), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
  ];
};

const buildCartSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const compositionVariant = pickCartCompositionVariant(prompt);
  if (compositionVariant === "cart-spotlight") return buildCartSpotlightSceneElements(payload, canvas, sceneStyle, duration, prompt);
  if (compositionVariant === "cart-checkout-stack") return buildCartCheckoutStackSceneElements(payload, canvas, sceneStyle, duration, prompt);
  return buildCartCardSceneElements(payload, canvas, sceneStyle, duration, prompt);
};

const buildHeadphonesSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const stacked = portrait || square;
  const frameX = portrait ? 82 : 92;
  const frameY = portrait ? 234 : square ? 132 : 150;
  const frameWidth = portrait ? canvas.width - 164 : canvas.width - 184;
  const frameHeight = portrait ? 1260 : square ? 900 : 780;
  const stageX = frameX + 46;
  const stageY = frameY + 52;
  const stageWidth = portrait ? frameWidth - 92 : square ? frameWidth - 104 : 548;
  const stageHeight = portrait ? 616 : square ? 430 : frameHeight - 118;
  const textX = stacked ? frameX + 76 : stageX + stageWidth + 76;
  const textY = portrait ? stageY + stageHeight + 84 : square ? stageY + stageHeight + 64 : frameY + 132;
  const textWidth = stacked ? frameWidth - 152 : frameWidth - (textX - frameX) - 72;
  const textAlign = stacked ? "center" : "left";
  const fit = fitTextBlock({
    headline: payload.headline ?? "Podcast Mode",
    subheadline: payload.subheadline,
    maxWidth: textWidth,
    maxHeight: portrait ? 320 : square ? 286 : 300,
    headlineChars: stacked ? 14 : 15,
    maxHeadlineLines: 2,
    subChars: 24,
    maxSubLines: square ? 3 : 4,
    headlineDesired: portrait ? 68 : square ? 70 : 66,
    headlineMin: 42,
    subDesired: portrait ? 24 : square ? 24 : 28,
    subMin: 20,
    headlineWidthFactor: 0.74,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.16,
  });
  const headlineLines = fit.headlineLines;
  const headlineSize = fit.headlineSize;
  const headlineHeight = fit.headlineHeight;
  const subLines = fit.subLines;
  const subY = textY + headlineHeight + 28;
  const iconSize = portrait ? 236 : square ? 214 : 252;
  const iconX = stageX + Math.round((stageWidth - iconSize) / 2);
  const iconY = stageY + (square ? 98 : 114);
  const meterY = stageY + stageHeight - (square ? 128 : 192);
  const episodeWidth = portrait ? 306 : square ? 320 : 252;
  const episodeX = stacked ? frameX + Math.round((frameWidth - episodeWidth) / 2) : textX;
  const episodeY = portrait ? frameY + frameHeight - 122 : square ? frameY + frameHeight - 108 : frameY + frameHeight - 112;
  const onAirWidth = portrait ? 198 : square ? 154 : 166;
  const onAirX = stageX + stageWidth - (portrait ? 246 : square ? 194 : 214);
  const onAirTextX = onAirX + (square ? 28 : 24);
  const onAirTextWidth = onAirWidth - (square ? 56 : 48);
  const kickerRuleWidth = Math.round(textWidth * (stacked ? 0.28 : 0.42));
  const kickerRuleX = stacked ? textX + Math.round((textWidth - kickerRuleWidth) / 2) : textX;
  const meterWidth = portrait ? 52 : square ? 40 : 40;
  const meterGap = portrait ? 102 : square ? 82 : 74;
  const trackX = stageX + (square ? 62 : 56);
  const trackWidth = stageWidth - (square ? 124 : 112);
  const trackY = meterY + (portrait ? 132 : 110);
  const stageAccentWidth = Math.round(stageWidth * (square ? 0.56 : 0.48));
  const stageAccentX = stageX + Math.round((stageWidth - stageAccentWidth) / 2);
  const episodeTextX = stacked ? episodeX : episodeX + 24;
  const episodeTextWidth = stacked ? episodeWidth : 208;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "audio-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "audio-stage", layer: "background", x: stageX, y: stageY, width: stageWidth, height: stageHeight, fill: surface, cornerRadius: 42, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "audio-stage-glass", layer: "background", x: stageX + 24, y: stageY + 24, width: stageWidth - 48, height: Math.round(stageHeight * 0.44), fill: mixHex(surface, "#FFFFFF", 0.2), cornerRadius: 34, opacity: 0, animations: [{start: 0.06, end: Math.min(0.52, duration * 0.24), property: "opacity", from: 0, to: 0.42, easing: "easeOut"}]}),
    buildPanelElement({id: "audio-stage-accent", layer: "background", x: stageAccentX, y: stageY + stageHeight - (square ? 72 : 76), width: stageAccentWidth, height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.8, duration * 0.34), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.18, end: Math.min(0.8, duration * 0.34), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    ...[0, 1, 2, 3].map((index) =>
      buildPanelElement({
        id: `audio-status-dot-${index}`,
        layer: "background",
        x: stageX + 42 + index * (portrait ? 112 : square ? 86 : 74),
        y: stageY + 34,
        width: square ? 16 : 18,
        height: square ? 16 : 18,
        fill: index === 2 ? accent : edge,
        cornerRadius: 999,
        opacity: 0,
        animations: [
          {start: 0.08 + index * 0.03, end: Math.min(0.56 + index * 0.02, duration * 0.24), property: "opacity", from: 0, to: index === 2 ? 0.92 : 0.56, easing: "easeOut"},
          {start: 0.08 + index * 0.03, end: Math.min(0.56 + index * 0.02, duration * 0.24), property: "scale", from: 0.5, to: 1, easing: "spring"},
        ],
      })
    ),
    ...[0, 1, 2, 3, 4].map((index) =>
      buildPanelElement({id: `audio-foam-${index}`, layer: "background", x: stageX + 32 + index * (portrait ? 162 : square ? 128 : 98), y: stageY + 28 + (index % 2) * 12, width: portrait ? 124 : square ? 58 : 72, height: square ? 58 : 72, fill: index % 2 === 0 ? edge : elevated, cornerRadius: 24, opacity: 0, animations: [{start: 0.08 + index * 0.04, end: Math.min(0.62 + index * 0.02, duration * 0.28), property: "opacity", from: 0, to: 0.54, easing: "easeOut"}, {start: 0.08 + index * 0.04, end: Math.min(0.62 + index * 0.02, duration * 0.28), property: "scale", from: 0.74, to: 1, easing: "spring"}]})
    ),
    buildPanelElement({id: "audio-on-air", layer: "foreground", x: onAirX, y: stageY + 34, width: onAirWidth, height: 60, fill: "#EF4444", cornerRadius: 18, opacity: 0, animations: [{start: 0.14, end: Math.min(0.68, duration * 0.3), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.14, end: Math.min(0.68, duration * 0.3), property: "scale", from: 0.8, to: 1, easing: "spring"}]}),
    buildTextElement({id: "audio-on-air-text", layer: "foreground", x: onAirTextX, y: stageY + 52, width: onAirTextWidth, height: 24, fill: "#FFFFFF", text: "ON AIR", fontSize: square ? 18 : 22, fontWeight: 900, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.18, end: Math.min(0.72, duration * 0.32), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    {id: "audio-aura", type: "glow", layer: "background", x: iconX - 110, y: iconY - 100, width: iconSize + 220, height: iconSize + 220, fill: accent, glowColor: accent, glowStrength: 0.76, opacity: 0, animations: [{start: 0.08, end: Math.min(0.72, duration * 0.3), property: "opacity", from: 0, to: 0.14, easing: "easeOut"}, {start: 0.08, end: Math.min(0.72, duration * 0.3), property: "scale", from: 0.78, to: 1, easing: "spring"}]},
    {id: "audio-hero-ring", type: "ring", layer: "background", x: iconX - 38, y: iconY - 36, width: iconSize + 76, height: iconSize + 76, stroke: mixHex(accent, "#FFFFFF", 0.2), strokeWidth: 5, opacity: 0, animations: [{start: 0.12, end: Math.min(0.8, duration * 0.34), property: "opacity", from: 0, to: 0.46, easing: "easeOut"}, {start: 0.12, end: Math.min(0.8, duration * 0.34), property: "draw", from: 0, to: 1, easing: "easeInOut"}]},
    buildIconElement("audio-headphones", "headphones", iconX, iconY, iconSize, accent, duration),
    ...[0, 1, 2, 3, 4, 5].map((index) =>
      buildPanelElement({id: `audio-meter-${index}`, layer: "foreground", x: stageX + 70 + index * meterGap, y: meterY + (index % 3) * 14, width: meterWidth, height: portrait ? (index % 2 === 0 ? 112 : 84) : square ? (index % 2 === 0 ? 78 : 56) : (index % 2 === 0 ? 92 : 68), fill: index === 2 || index === 4 ? accent : elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.26 + index * 0.04, end: Math.min(1.04 + index * 0.04, duration * 0.48), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.26 + index * 0.04, end: Math.min(1.04 + index * 0.04, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]})
    ),
    buildPanelElement({id: "audio-track", layer: "background", x: trackX, y: trackY, width: trackWidth, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.32, end: Math.min(1.08, duration * 0.5), property: "opacity", from: 0, to: 0.78, easing: "easeOut"}]}),
    buildPanelElement({id: "audio-track-fill", layer: "foreground", x: trackX, y: trackY, width: Math.round(trackWidth * 0.58), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.16, duration * 0.54), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.36, end: Math.min(1.16, duration * 0.54), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "audio-kicker-rule", layer: "foreground", x: kickerRuleX, y: textY - 22, width: kickerRuleWidth, height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.08, end: Math.min(0.44, duration * 0.18), property: "opacity", from: 0, to: 0.78, easing: "easeOut"}, {start: 0.08, end: Math.min(0.44, duration * 0.18), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "audio-kicker", layer: "foreground", x: textX, y: textY - 54, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "PODCAST SCENE").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.1, end: Math.min(0.38, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "audio-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.86, duration * 0.38), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.86, duration * 0.38), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "audio-sub-line", layer: "foreground", x: stacked ? textX + Math.round((textWidth - Math.round(textWidth * 0.36)) / 2) : textX, y: subY - 20, width: Math.round(textWidth * (stacked ? 0.36 : 0.34)), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.7, duration * 0.3), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.18, end: Math.min(0.7, duration * 0.3), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
      buildTextElement({id: "audio-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: fit.subHeight + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: fit.subSize || (portrait ? 24 : square ? 24 : 28), fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.24, end: Math.min(1.04, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.24, end: Math.min(1.04, duration * 0.46), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "audio-episode-chip", layer: "foreground", x: episodeX, y: episodeY, width: episodeWidth, height: 62, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.14, duration * 0.52), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.34, end: Math.min(1.14, duration * 0.52), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "audio-episode-text", layer: "foreground", x: episodeTextX, y: episodeY + 18, width: episodeTextWidth, height: 22, fill: accent, text: "EPISODE 47  LIVE", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.38, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
  ];
};

const buildWalletSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const stacked = portrait || square;
  const frameX = portrait ? 88 : square ? 96 : 98;
  const frameY = portrait ? 276 : square ? 138 : 170;
  const frameWidth = portrait ? canvas.width - 176 : square ? canvas.width - 192 : canvas.width - 196;
  const frameHeight = portrait ? 930 : square ? 804 : 736;
  const walletStageSize = portrait ? 276 : square ? 336 : 354;
  const walletStageX = portrait ? frameX + 54 : square ? frameX + Math.round((frameWidth - walletStageSize) / 2) : frameX + 72;
  const walletStageY = frameY + (portrait ? 86 : square ? 82 : 132);
  const textX = stacked ? walletStageX : walletStageX + walletStageSize + 114;
  const textY = stacked ? walletStageY + walletStageSize + (square ? 96 : 100) : frameY + 102;
  const textWidth = stacked ? walletStageSize : frameWidth - (textX - frameX) - 86;
  const textAlign = square ? "center" : "left";
  const headlineLines = wrapText(payload.headline ?? "Cashflow", portrait ? 14 : 16, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 68 : square ? 74 : 82, portrait ? 44 : square ? 50 : 54, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 24;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 24 : 24, 4) : [];
  const subY = textY + headlineHeight + 28;
  const chipsY = portrait ? subY + 170 : square ? subY + 102 : subY + 126;
  const summaryY = portrait ? frameY + frameHeight - 150 : square ? frameY + frameHeight - 126 : frameY + frameHeight - 132;
  const topRailX = portrait ? frameX + 54 : square ? frameX + Math.round((frameWidth - 224) / 2) : textX;
  const topRailWidth = portrait ? 220 : square ? 224 : 264;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "wallet-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "wallet-top-rail", layer: "background", x: topRailX, y: frameY + 36, width: topRailWidth, height: 10, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.02, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.02, end: Math.min(0.34, duration * 0.16), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "wallet-stage", layer: "background", x: walletStageX - (square ? 26 : 34), y: walletStageY - (square ? 28 : 40), width: walletStageSize + (square ? 52 : 68), height: walletStageSize + (square ? 112 : 120), fill: surface, cornerRadius: 52, opacity: 0, animations: [{start: 0.06, end: Math.min(0.52, duration * 0.22), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.06, end: Math.min(0.52, duration * 0.22), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "wallet-stage-sheen", layer: "background", x: walletStageX + 18, y: walletStageY - 6, width: walletStageSize - 36, height: square ? 84 : 68, fill: mixHex(accent, "#FFFFFF", 0.68), cornerRadius: 999, opacity: 0, animations: [{start: 0.1, end: Math.min(0.56, duration * 0.24), property: "opacity", from: 0, to: 0.08, easing: "easeOut"}, {start: 0.1, end: Math.min(0.56, duration * 0.24), property: "scale", from: 0.84, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "wallet-podium", layer: "background", x: walletStageX - 12, y: walletStageY + walletStageSize + (square ? 12 : 20), width: walletStageSize + 24, height: square ? 36 : 32, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.12, end: Math.min(0.6, duration * 0.26), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.12, end: Math.min(0.6, duration * 0.26), property: "scale", from: 0.4, to: 1, easing: "easeOut"}]}),
    {id: "wallet-aura", type: "glow", layer: "background", x: walletStageX - 74, y: walletStageY - 74, width: walletStageSize + 148, height: walletStageSize + 148, fill: accent, glowColor: accent, glowStrength: 0.76, opacity: 0, animations: [{start: 0.08, end: Math.min(0.68, duration * 0.28), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}, {start: 0.08, end: Math.min(0.68, duration * 0.28), property: "scale", from: 0.78, to: 1, easing: "spring"}]},
    buildIconElement("wallet-icon", "wallet", walletStageX, walletStageY, walletStageSize, accent, duration),
    buildPanelElement({id: "wallet-card", layer: "foreground", x: walletStageX + walletStageSize - (portrait ? 110 : square ? 92 : 96), y: walletStageY + (square ? 26 : 34), width: portrait ? 92 : 80, height: portrait ? 134 : square ? 110 : 118, fill: elevated, cornerRadius: 18, opacity: 0, animations: [{start: 0.18, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.18, end: Math.min(0.88, duration * 0.38), property: "translateY", from: 12, to: 0, easing: "easeOut"}]}),
    buildPanelElement({id: "wallet-coin-a", layer: "foreground", x: walletStageX + (square ? 52 : 38), y: walletStageY + walletStageSize - (square ? 72 : 82), width: square ? 48 : 42, height: square ? 48 : 42, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.22, end: Math.min(0.96, duration * 0.42), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.22, end: Math.min(0.96, duration * 0.42), property: "scale", from: 0.5, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "wallet-coin-b", layer: "foreground", x: walletStageX + (square ? 104 : 82), y: walletStageY + walletStageSize - (square ? 92 : 98), width: square ? 36 : 32, height: square ? 36 : 32, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.28, end: Math.min(1.02, duration * 0.46), property: "scale", from: 0.5, to: 1, easing: "spring"}]}),
    buildTextElement({id: "wallet-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "PAYMENT FLOW").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.7, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "wallet-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "wallet-sub-line", layer: "foreground", x: square ? textX + Math.round((textWidth - Math.round(textWidth * 0.34)) / 2) : textX, y: subY - 20, width: Math.round(textWidth * (square ? 0.34 : 0.42)), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.7, duration * 0.3), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.18, end: Math.min(0.7, duration * 0.3), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
      buildTextElement({id: "wallet-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * 28 * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : square ? 26 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.22, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(1.02, duration * 0.46), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "wallet-chip-a", layer: "foreground", x: square ? frameX + 64 : textX, y: chipsY, width: portrait ? 288 : square ? frameWidth - 128 : 278, height: 62, fill: surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.28, end: Math.min(1.08, duration * 0.48), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "wallet-chip-a-text", layer: "foreground", x: square ? frameX + 64 : textX + 24, y: chipsY + 18, width: square ? frameWidth - 128 : portrait ? 244 : 226, height: 22, fill: accent, text: "PAYOUT READY", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.32, end: Math.min(1.12, duration * 0.5), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "wallet-chip-b", layer: "foreground", x: square ? frameX + 64 : textX + (portrait ? 0 : 296), y: square ? chipsY + 78 : chipsY + (portrait ? 82 : 0), width: portrait ? 328 : square ? frameWidth - 128 : 254, height: 62, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.14, duration * 0.52), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.34, end: Math.min(1.14, duration * 0.52), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "wallet-chip-b-text", layer: "foreground", x: square ? frameX + 64 : textX + (portrait ? 24 : 320), y: square ? chipsY + 96 : chipsY + (portrait ? 100 : 18), width: square ? frameWidth - 128 : portrait ? 284 : 206, height: 22, fill: edge, text: "cleaner cashflow scene", fontSize: 18, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.1, lineHeight: 1, opacity: 0, animations: [{start: 0.38, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "wallet-summary-track", layer: "background", x: textX, y: summaryY, width: textWidth, height: 14, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.4, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.76, easing: "easeOut"}]}),
    buildPanelElement({id: "wallet-summary-fill", layer: "foreground", x: textX, y: summaryY, width: Math.round(textWidth * 0.7), height: 14, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.44, end: Math.min(1.24, duration * 0.56), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.44, end: Math.min(1.24, duration * 0.56), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "wallet-summary-text", layer: "foreground", x: textX, y: summaryY + 28, width: textWidth, height: 24, fill: edge, text: "Balance confidence 70%", fontSize: 22, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.48, end: Math.min(1.28, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
  ];
};

const buildLaptopSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 84 : square ? 104 : 96;
  const frameY = portrait ? 234 : square ? 132 : 144;
  const frameWidth = portrait ? canvas.width - 168 : square ? canvas.width - 208 : canvas.width - 192;
  const frameHeight = portrait ? 1240 : square ? 900 : 786;
  const laptopWidth = portrait ? frameWidth - 104 : square ? frameWidth - 132 : 612;
  const laptopX = portrait ? frameX + 52 : square ? frameX + Math.round((frameWidth - laptopWidth) / 2) : frameX + 68;
  const laptopY = frameY + (portrait ? 96 : square ? 96 : 176);
  const laptopHeight = portrait ? 430 : square ? 318 : 392;
  const textX = portrait ? frameX + 56 : square ? frameX + 124 : laptopX + laptopWidth + 72;
  const textY = portrait ? laptopY + laptopHeight + 110 : square ? laptopY + laptopHeight + 92 : frameY + 94;
  const textWidth = portrait ? frameWidth - 112 : square ? frameWidth - 248 : frameWidth - (textX - frameX) - 72;
  const textAlign = square ? "center" : "left";
  const headlineLines = wrapText(payload.headline ?? "Focus Mode", portrait || square ? 14 : 15, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 66 : square ? 62 : 84, portrait ? 44 : square ? 42 : 54, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 24;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, 24, square ? 3 : 4) : [];
  const subY = textY + headlineHeight + 28;
  const chipY = portrait ? subY + 176 : square ? subY + 110 : subY + 126;
  const statusY = portrait ? frameY + frameHeight - 148 : square ? frameY + frameHeight - 116 : frameY + frameHeight - 132;
  const topRailX = portrait ? frameX + 54 : square ? frameX + Math.round((frameWidth - 272) / 2) : textX;
  const topRailWidth = portrait ? 220 : square ? 272 : 286;
  const stageGlassX = laptopX - (square ? 12 : 4);
  const stageGlassY = laptopY - 12;
  const stageGlassWidth = laptopWidth + (square ? 24 : 8);
  const stageGlassHeight = laptopHeight + (square ? 78 : 54);
  const stageAccentWidth = Math.round(laptopWidth * (square ? 0.46 : 0.34));
  const stageAccentX = laptopX + Math.round((laptopWidth - stageAccentWidth) / 2);
  const laptopIconSize = portrait ? 260 : square ? 318 : 332;
  const laptopIconX = laptopX + Math.round((laptopWidth - laptopIconSize) / 2);
  const appWindowX = laptopX + Math.round(laptopWidth * (square ? 0.18 : 0.25));
  const appWindowWidth = Math.round(laptopWidth * (square ? 0.64 : 0.5));
  const appWindowHeight = portrait ? 94 : square ? 118 : 104;
  const subLineWidth = Math.round(textWidth * (square ? 0.4 : 0.44));
  const subLineX = square ? textX + Math.round((textWidth - subLineWidth) / 2) : textX;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "laptop-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "laptop-top-rail", layer: "background", x: topRailX, y: frameY + 34, width: topRailWidth, height: 10, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.02, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.02, end: Math.min(0.34, duration * 0.16), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "laptop-stage", layer: "background", x: laptopX - 24, y: laptopY - 34, width: laptopWidth + 48, height: laptopHeight + 108, fill: surface, cornerRadius: 44, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "laptop-stage-glass", layer: "background", x: stageGlassX, y: stageGlassY, width: stageGlassWidth, height: stageGlassHeight, fill: mixHex(surface, "#FFFFFF", 0.18), cornerRadius: 34, opacity: 0, animations: [{start: 0.08, end: Math.min(0.54, duration * 0.24), property: "opacity", from: 0, to: 0.34, easing: "easeOut"}]}),
    buildPanelElement({id: "laptop-stage-accent", layer: "background", x: stageAccentX, y: laptopY + laptopHeight + 16, width: stageAccentWidth, height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.12, end: Math.min(0.62, duration * 0.28), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.12, end: Math.min(0.62, duration * 0.28), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "laptop-floor", layer: "background", x: laptopX + 24, y: laptopY + laptopHeight + 34, width: laptopWidth - 48, height: 26, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.1, end: Math.min(0.58, duration * 0.24), property: "opacity", from: 0, to: 0.64, easing: "easeOut"}, {start: 0.1, end: Math.min(0.58, duration * 0.24), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
    buildIconElement("laptop-icon", "laptop", laptopIconX, laptopY, laptopIconSize, accent, duration),
    buildPanelElement({id: "laptop-app-window", layer: "foreground", x: appWindowX, y: laptopY + 56, width: appWindowWidth, height: appWindowHeight, fill: accent, cornerRadius: 22, opacity: 0, animations: [{start: 0.16, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.16, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 12, to: 0, easing: "easeOut"}]}),
    ...[0, 1].map((index) =>
      buildPanelElement({id: `laptop-window-line-${index}`, layer: "foreground", x: appWindowX + 24, y: laptopY + 80 + index * 24, width: appWindowWidth - (index === 0 ? 72 : 118), height: 10, fill: mixHex(accent, "#FFFFFF", 0.72), cornerRadius: 999, opacity: 0, animations: [{start: 0.2 + index * 0.04, end: Math.min(0.92 + index * 0.04, duration * 0.42), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.2 + index * 0.04, end: Math.min(0.92 + index * 0.04, duration * 0.42), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]})
    ),
    ...[0, 1, 2].map((index) =>
      buildPanelElement({id: `laptop-task-${index}`, layer: "foreground", x: laptopX + 28, y: laptopY + laptopHeight + 18 + index * 54, width: laptopWidth - 56, height: 34, fill: index === 0 ? elevated : edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.22 + index * 0.06, end: Math.min(0.96 + index * 0.06, duration * 0.42), property: "opacity", from: 0, to: index === 0 ? 0.74 : 0.5, easing: "easeOut"}, {start: 0.22 + index * 0.06, end: Math.min(0.96 + index * 0.06, duration * 0.42), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]})
    ),
    buildTextElement({id: "laptop-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "PRODUCTIVITY SCENE").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.7, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "laptop-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "laptop-sub-line", layer: "foreground", x: subLineX, y: subY - 20, width: subLineWidth, height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.7, duration * 0.3), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.18, end: Math.min(0.7, duration * 0.3), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
      buildTextElement({id: "laptop-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * 28 * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : square ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.22, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(1.02, duration * 0.46), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "laptop-chip-a", layer: "foreground", x: textX, y: chipY, width: portrait ? 292 : square ? textWidth : 278, height: 62, fill: surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.28, end: Math.min(1.08, duration * 0.48), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "laptop-chip-a-text", layer: "foreground", x: square ? textX : textX + 24, y: chipY + 18, width: square ? textWidth : portrait ? 248 : 226, height: 22, fill: accent, text: "FOCUS STACK", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.32, end: Math.min(1.12, duration * 0.5), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "laptop-chip-b", layer: "foreground", x: square ? textX : textX + (portrait ? 0 : 296), y: chipY + (portrait ? 82 : square ? 82 : 0), width: portrait ? 346 : square ? textWidth : 250, height: 62, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.14, duration * 0.52), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.34, end: Math.min(1.14, duration * 0.52), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "laptop-chip-b-text", layer: "foreground", x: square ? textX : textX + (portrait ? 24 : 320), y: chipY + (portrait ? 100 : square ? 100 : 18), width: square ? textWidth : portrait ? 302 : 202, height: 22, fill: edge, text: "workflow clarity, cleaner stage", fontSize: 18, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.1, lineHeight: 1, opacity: 0, animations: [{start: 0.38, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "laptop-status-track", layer: "background", x: textX, y: statusY, width: textWidth, height: 14, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.4, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.76, easing: "easeOut"}]}),
    buildPanelElement({id: "laptop-status-fill", layer: "foreground", x: textX, y: statusY, width: Math.round(textWidth * 0.64), height: 14, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.44, end: Math.min(1.24, duration * 0.56), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.44, end: Math.min(1.24, duration * 0.56), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "laptop-status-text", layer: "foreground", x: textX, y: statusY + 28, width: textWidth, height: 24, fill: edge, text: "Deep-work system 64%", fontSize: 22, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.48, end: Math.min(1.28, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
  ];
};

const buildPieSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const stacked = portrait || square;
  const frameX = portrait ? 84 : square ? 92 : 94;
  const frameY = portrait ? 248 : square ? 146 : 152;
  const frameWidth = portrait ? canvas.width - 168 : square ? canvas.width - 184 : canvas.width - 188;
  const frameHeight = portrait ? 1180 : square ? 784 : 760;
  const chartStageX = frameX + (portrait ? 54 : square ? 86 : 74);
  const chartStageY = frameY + (portrait ? 84 : square ? 78 : 118);
  const chartStageSize = portrait ? 430 : square ? 346 : 456;
  const chartInset = portrait ? 78 : square ? 54 : 84;
  const chartSize = chartStageSize - chartInset * 2;
  const chartX = chartStageX + chartInset;
  const chartY = chartStageY + chartInset;
  const textX = stacked ? chartStageX : chartStageX + chartStageSize + 84;
  const textY = stacked ? chartStageY + chartStageSize + (square ? 74 : 86) : frameY + 102;
  const textWidth = stacked ? chartStageSize : frameWidth - (textX - frameX) - 74;
  const textAlign = square ? "center" : "left";
  const headlineLines = wrapText(payload.headline ?? "Market Share", portrait ? 14 : 16, 2);
  const headlineSize = fitFontSize(headlineLines, textWidth, portrait ? 66 : square ? 74 : 82, portrait ? 44 : square ? 50 : 54, 0.74, -2);
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 24;
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 24 : 24, 4) : [];
  const subY = textY + headlineHeight + 28;
  const legendY = portrait ? subY + 146 : square ? subY + 110 : subY + 116;
  const chipY = portrait ? frameY + frameHeight - 148 : square ? frameY + frameHeight - 122 : frameY + frameHeight - 126;
  const segmentPalette = [accent, elevated, edge, mixHex(edge, textColor, 0.42), mixHex(surface, textColor, 0.32)];

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "pie-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "pie-top-rail", layer: "background", x: portrait ? frameX + 54 : square ? frameX + Math.round((frameWidth - 224) / 2) : textX, y: frameY + 34, width: portrait ? 220 : square ? 224 : 286, height: 10, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.02, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.02, end: Math.min(0.34, duration * 0.16), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "pie-stage", layer: "background", x: chartStageX, y: chartStageY, width: chartStageSize, height: chartStageSize, fill: surface, cornerRadius: 44, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    {id: "pie-aura", type: "glow", layer: "background", x: chartX - 90, y: chartY - 90, width: chartSize + 180, height: chartSize + 180, fill: accent, glowColor: accent, glowStrength: 0.72, opacity: 0, animations: [{start: 0.08, end: Math.min(0.68, duration * 0.28), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}, {start: 0.08, end: Math.min(0.68, duration * 0.28), property: "scale", from: 0.78, to: 1, easing: "spring"}]},
    buildIconElement("pie-icon", "pie", chartX, chartY, chartSize, accent, duration),
    buildPanelElement({id: "pie-hole", layer: "foreground", x: chartX + Math.round(chartSize * 0.28), y: chartY + Math.round(chartSize * 0.28), width: Math.round(chartSize * 0.44), height: Math.round(chartSize * 0.44), fill: frame, cornerRadius: 999, opacity: 0, animations: [{start: 0.14, end: Math.min(0.78, duration * 0.34), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.14, end: Math.min(0.78, duration * 0.34), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "pie-focus-chip", layer: "foreground", x: square ? chartStageX + Math.round((chartStageSize - 164) / 2) : chartStageX + chartStageSize - (portrait ? 194 : 208), y: square ? chartStageY + chartStageSize - 74 : chartStageY + 34, width: portrait ? 150 : 164, height: 56, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.9, duration * 0.38), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.18, end: Math.min(0.9, duration * 0.38), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "pie-focus-chip-text", layer: "foreground", x: square ? chartStageX + Math.round((chartStageSize - 126) / 2) : chartStageX + chartStageSize - (portrait ? 170 : 184), y: square ? chartStageY + chartStageSize - 56 : chartStageY + 52, width: portrait ? 112 : 126, height: 20, fill: accent, text: "32% LEAD", fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.22, end: Math.min(0.94, duration * 0.4), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "pie-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "MARKET SIGNAL").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.7, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "pie-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "pie-sub-line", layer: "foreground", x: square ? textX + Math.round((textWidth - Math.round(textWidth * 0.34)) / 2) : textX, y: subY - 20, width: Math.round(textWidth * (square ? 0.34 : 0.42)), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.7, duration * 0.3), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.18, end: Math.min(0.7, duration * 0.3), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
      buildTextElement({id: "pie-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * 28 * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: portrait ? 24 : square ? 26 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.22, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(1.02, duration * 0.46), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    ...["Our Brand", "Competitor A", "Competitor B"].map((label, index) =>
      buildPanelElement({id: `pie-legend-row-${index}`, layer: "foreground", x: textX, y: legendY + index * 62, width: stacked ? textWidth : Math.min(textWidth, 322), height: 46, fill: index === 0 ? surface : elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.24 + index * 0.06, end: Math.min(1.04 + index * 0.04, duration * 0.48), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.24 + index * 0.06, end: Math.min(1.04 + index * 0.04, duration * 0.48), property: "scale", from: 0.84, to: 1, easing: "spring"}]})
    ),
    ...["Our Brand", "Competitor A", "Competitor B"].flatMap((label, index) => [
      buildPanelElement({id: `pie-legend-dot-${index}`, layer: "foreground", x: textX + 16, y: legendY + 12 + index * 62, width: 22, height: 22, fill: segmentPalette[index], cornerRadius: 999, opacity: 0, animations: [{start: 0.28 + index * 0.06, end: Math.min(1.08 + index * 0.04, duration * 0.5), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.28 + index * 0.06, end: Math.min(1.08 + index * 0.04, duration * 0.5), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildTextElement({id: `pie-legend-text-${index}`, layer: "foreground", x: textX + 54, y: legendY + 10 + index * 62, width: stacked ? textWidth - 154 : 170, height: 22, fill: index === 0 ? textColor : secondaryText, text: label, fontSize: 18, fontWeight: index === 0 ? 800 : 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: -0.1, lineHeight: 1, opacity: 0, animations: [{start: 0.3 + index * 0.06, end: Math.min(1.1 + index * 0.04, duration * 0.5), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}]}),
      buildTextElement({id: `pie-legend-value-${index}`, layer: "foreground", x: stacked ? textX + textWidth - 100 : textX + 218, y: legendY + 10 + index * 62, width: 84, height: 22, fill: accent, text: index === 0 ? "32%" : index === 1 ? "24%" : "18%", fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "right", letterSpacing: 0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.32 + index * 0.06, end: Math.min(1.12 + index * 0.04, duration * 0.52), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    ]),
    buildPanelElement({id: "pie-share-track", layer: "background", x: textX, y: chipY, width: textWidth, height: 16, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.38, end: Math.min(1.14, duration * 0.52), property: "opacity", from: 0, to: 0.78, easing: "easeOut"}]}),
    buildPanelElement({id: "pie-share-fill", layer: "foreground", x: textX, y: chipY, width: Math.round(textWidth * 0.62), height: 16, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.42, end: Math.min(1.2, duration * 0.56), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.42, end: Math.min(1.2, duration * 0.56), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "pie-share-text", layer: "foreground", x: textX, y: chipY + 30, width: textWidth, height: 24, fill: edge, text: "Brand share lead 32%", fontSize: 22, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.46, end: Math.min(1.24, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
  ];
};

const buildDownloadCardSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const landscape = canvas.format === "landscape";
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const stacked = !landscape;
  const frameX = stacked ? 88 : 100;
  const frameY = portrait ? 270 : stacked ? 136 : 176;
  const frameWidth = stacked ? canvas.width - 176 : canvas.width - 200;
  const frameHeight = portrait ? 940 : stacked ? 760 : 708;
  const docStageWidth = portrait ? frameWidth - 108 : square ? 248 : 420;
  const docStageX = portrait ? frameX + 54 : square ? frameX + Math.round((frameWidth - docStageWidth) / 2) : frameX + 74;
  const docStageY = frameY + (portrait ? 84 : square ? 84 : 112);
  const docStageHeight = portrait ? 322 : square ? 184 : 364;
  const docWidth = portrait ? 214 : square ? 136 : 224;
  const docHeight = portrait ? 246 : square ? 158 : 258;
  const docX = docStageX + Math.round((docStageWidth - docWidth) / 2);
  const docY = docStageY + (square ? 12 : 34);
  const textWidth = portrait ? docStageWidth : square ? 420 : frameWidth - (docStageX + docStageWidth + 88 - frameX) - 78;
  const textX = portrait ? docStageX : square ? frameX + Math.round((frameWidth - textWidth) / 2) : docStageX + docStageWidth + 88;
  const textY = portrait ? docStageY + docStageHeight + 94 : square ? docStageY + docStageHeight + 88 : frameY + 104;
  const textAlign = square ? "center" : "left";
  const fit = fitTextBlock({
    headline: payload.headline ?? "Saving File",
    subheadline: payload.subheadline,
    maxWidth: textWidth,
    maxHeight: portrait ? 284 : square ? 168 : stacked ? 248 : 266,
    headlineChars: portrait ? 14 : square ? 15 : 16,
    maxHeadlineLines: 2,
    subChars: 24,
    maxSubLines: 3,
    headlineDesired: portrait ? 66 : square ? 40 : 80,
    headlineMin: square ? 32 : stacked ? 40 : 48,
    subDesired: portrait ? 24 : square ? 17 : 28,
    subMin: square ? 16 : 20,
    headlineWidthFactor: 0.74,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.16,
  });
  const headlineLines = fit.headlineLines;
  const headlineSize = fit.headlineSize;
  const headlineHeight = fit.headlineHeight;
  const subLines = fit.subLines;
  const subY = textY + headlineHeight + 28;
  const chipY = portrait ? subY + 154 : square ? subY + 48 : stacked ? subY + 128 : subY + 124;
  const saveY = portrait ? frameY + frameHeight - 146 : square ? frameY + frameHeight - 96 : stacked ? frameY + frameHeight - 112 : frameY + frameHeight - 124;
  const chipAWidth = portrait ? 292 : square ? 248 : stacked ? 260 : 276;
  const chipATextWidth = portrait ? 248 : square ? 204 : stacked ? 216 : 228;
  const chipBWidth = portrait ? 340 : square ? 248 : stacked ? 260 : 236;
  const chipBX = textX + (portrait ? 0 : stacked ? 0 : 292);
  const chipBY = chipY + (portrait ? 82 : square ? 74 : stacked ? 80 : 0);
  const chipBTextX = textX + (portrait ? 24 : square ? 22 : stacked ? 24 : 316);
  const chipBTextY = chipY + (portrait ? 100 : square ? 92 : stacked ? 98 : 18);
  const chipBTextWidth = portrait ? 292 : square ? 204 : stacked ? 212 : 188;
  const topRailWidth = portrait ? 220 : square ? 154 : 282;
  const topRailX = portrait ? frameX + 54 : square ? frameX + Math.round((frameWidth - topRailWidth) / 2) : textX;
  const iconBadgeSize = square ? 60 : 104;
  const iconBadgeX = docX + Math.round((docWidth - iconBadgeSize) / 2);
  const iconBadgeY = docY + (square ? 22 : 34);
  const iconSize = square ? 28 : 64;
  const iconX = iconBadgeX + Math.round((iconBadgeSize - iconSize) / 2);
  const iconY = iconBadgeY + Math.round((iconBadgeSize - iconSize) / 2);
  const docLineBaseY = iconBadgeY + iconBadgeSize + (square ? 18 : 38);

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "download-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "download-top-rail", layer: "background", x: topRailX, y: frameY + 34, width: topRailWidth, height: 10, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.02, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 0.72, easing: "easeOut"}, {start: 0.02, end: Math.min(0.34, duration * 0.16), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
      buildPanelElement({id: "download-stage", layer: "background", x: docStageX, y: docStageY, width: docStageWidth, height: docStageHeight, fill: square ? mixHex(surface, elevated, 0.42) : surface, stroke: square ? mixHex(accent, "#FFFFFF", 0.45) : undefined, strokeWidth: square ? 2 : undefined, cornerRadius: 40, opacity: 0, animations: [{start: 0.04, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.04, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.92, to: 1, easing: "spring"}]}),
      {id: "download-aura", type: "glow", layer: "background", x: docX - 42, y: docY - 42, width: docWidth + 84, height: docHeight + 84, fill: accent, glowColor: accent, glowStrength: square ? 0.52 : 0.72, opacity: 0, animations: [{start: 0.08, end: Math.min(0.66, duration * 0.28), property: "opacity", from: 0, to: square ? 0.05 : 0.1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.66, duration * 0.28), property: "scale", from: 0.82, to: 1, easing: "spring"}]},
    buildPanelElement({id: "download-doc", layer: "foreground", x: docX, y: docY, width: docWidth, height: docHeight, fill: elevated, stroke: accent, strokeWidth: square ? 3 : 4, cornerRadius: 28, opacity: 0, animations: [{start: 0.1, end: Math.min(0.62, duration * 0.26), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.1, end: Math.min(0.62, duration * 0.26), property: "scale", from: 0.86, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "download-doc-fold", layer: "foreground", x: docX + docWidth - (square ? 40 : 58), y: docY + 18, width: square ? 24 : 34, height: square ? 24 : 34, fill: surface, cornerRadius: 8, opacity: 0, animations: [{start: 0.16, end: Math.min(0.72, duration * 0.3), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}]}),
    buildPanelElement({id: "download-icon-badge", layer: "foreground", x: iconBadgeX, y: iconBadgeY, width: iconBadgeSize, height: iconBadgeSize, fill: surface, cornerRadius: 24, opacity: 0, animations: [{start: 0.14, end: Math.min(0.68, duration * 0.3), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.14, end: Math.min(0.68, duration * 0.3), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildIconElement("download-icon", "download", iconX, iconY, iconSize, accent, duration),
    ...[0, 1, 2].map((index) =>
        buildPanelElement({id: `download-doc-line-${index}`, layer: "foreground", x: docX + (square ? 28 : 34), y: docLineBaseY + index * (square ? 18 : 22), width: index === 0 ? docWidth - (square ? 56 : 68) : index === 1 ? docWidth - (square ? 68 : 84) : docWidth - (square ? 86 : 106), height: square ? 8 : 10, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.22 + index * 0.04, end: Math.min(0.9 + index * 0.04, duration * 0.4), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.22 + index * 0.04, end: Math.min(0.9 + index * 0.04, duration * 0.4), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]})
      ),
    buildPanelElement({id: "download-progress-track", layer: "background", x: docStageX + 34, y: docStageY + docStageHeight - 54, width: docStageWidth - 68, height: 16, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(0.94, duration * 0.42), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}]}),
    buildPanelElement({id: "download-progress-fill", layer: "foreground", x: docStageX + 34, y: docStageY + docStageHeight - 54, width: Math.round((docStageWidth - 68) * 0.78), height: 16, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.1, duration * 0.5), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.28, end: Math.min(1.1, duration * 0.5), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-kicker", layer: "foreground", x: textX, y: textY - 46, width: textWidth, height: 24, fill: accent, text: (payload.kicker ?? "FILE FLOW").toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1.7, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign, letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.12, end: Math.min(0.84, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.84, duration * 0.36), property: "translateY", from: 22, to: 0, easing: "spring"}]}),
    ...(subLines.length > 0 ? [
      buildPanelElement({id: "download-sub-line", layer: "foreground", x: square ? textX + Math.round((textWidth - Math.round(textWidth * 0.42)) / 2) : textX, y: subY - 20, width: Math.round(textWidth * 0.42), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.7, duration * 0.3), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.18, end: Math.min(0.7, duration * 0.3), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
      buildTextElement({id: "download-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: fit.subHeight + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: fit.subSize || (stacked ? 24 : 28), fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: [{start: 0.22, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(1.02, duration * 0.46), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    ] : []),
    buildPanelElement({id: "download-chip-a", layer: "foreground", x: textX, y: chipY, width: chipAWidth, height: 62, fill: surface, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.28, end: Math.min(1.08, duration * 0.48), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
      buildTextElement({id: "download-chip-a-text", layer: "foreground", x: square ? textX : textX + 24, y: chipY + 18, width: square ? chipAWidth : chipATextWidth, height: 22, fill: accent, text: "78% SAVED", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: 1, lineHeight: 1, opacity: 0, animations: [{start: 0.32, end: Math.min(1.12, duration * 0.5), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "download-chip-b", layer: "foreground", x: chipBX, y: chipBY, width: chipBWidth, height: 62, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.14, duration * 0.52), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.34, end: Math.min(1.14, duration * 0.52), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
      buildTextElement({id: "download-chip-b-text", layer: "foreground", x: square ? chipBX : chipBTextX, y: chipBTextY, width: square ? chipBWidth : chipBTextWidth, height: 22, fill: edge, text: "clean save state, clearer handoff", fontSize: 18, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.1, lineHeight: 1, opacity: 0, animations: [{start: 0.38, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "download-save-track", layer: "background", x: textX, y: saveY, width: textWidth, height: 16, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.4, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.78, easing: "easeOut"}]}),
    buildPanelElement({id: "download-save-fill", layer: "foreground", x: textX, y: saveY, width: Math.round(textWidth * 0.78), height: 16, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.44, end: Math.min(1.24, duration * 0.56), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.44, end: Math.min(1.24, duration * 0.56), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-save-text", layer: "foreground", x: textX, y: saveY + 30, width: textWidth, height: 24, fill: edge, text: "File archived successfully", fontSize: 22, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign, letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.48, end: Math.min(1.28, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
  ];
};

const buildDownloadSpotlightSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track, design} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 84 : 92;
  const frameY = portrait ? 248 : square ? 132 : 160;
  const frameWidth = portrait ? canvas.width - 168 : canvas.width - 184;
  const frameHeight = portrait ? 1220 : square ? 900 : 760;
  const stageWidth = portrait ? frameWidth - 110 : square ? 340 : 620;
  const stageHeight = portrait ? 420 : square ? 176 : 384;
  const stageX = frameX + Math.round((frameWidth - stageWidth) / 2);
  const stageY = frameY + (square ? 72 : 56);
  const docWidth = portrait ? 312 : square ? 156 : 320;
  const docHeight = portrait ? 364 : square ? 164 : 372;
  const docX = stageX + Math.round((stageWidth - docWidth) / 2);
  const docY = stageY + Math.round((stageHeight - docHeight) / 2);
  const badgeSize = portrait ? 94 : square ? 60 : 96;
  const badgeX = stageX + stageWidth - badgeSize - 24;
  const badgeY = stageY + 24;
  const iconSize = portrait ? 72 : square ? 40 : 74;
  const textWidth = portrait ? frameWidth - 170 : square ? 430 : 560;
  const textX = frameX + Math.round((frameWidth - textWidth) / 2);
  const textY = stageY + stageHeight + (square ? 68 : 72);
  const fit = fitTextBlock({
    headline: payload.headline ?? "Saving File",
    subheadline: payload.subheadline,
    maxWidth: textWidth,
    maxHeight: portrait ? 260 : square ? 120 : 240,
    headlineChars: square ? 14 : 14,
    maxHeadlineLines: 2,
    subChars: square ? 20 : 24,
    maxSubLines: square ? 2 : 2,
    headlineDesired: portrait ? 70 : square ? 44 : 76,
    headlineMin: square ? 32 : 44,
    subDesired: portrait ? 24 : square ? 16 : 26,
    subMin: 14,
    headlineWidthFactor: 0.66,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.14,
  });
  const headlineHeight = fit.headlineHeight;
  const summaryWidth = portrait ? frameWidth - 150 : square ? 332 : 468;
  const summaryX = frameX + Math.round((frameWidth - summaryWidth) / 2);
  const summaryY = textY + headlineHeight + fit.subHeight + (square ? 22 : 48);
  const ctaWidth = portrait ? summaryWidth : square ? 260 : 340;
  const ctaX = frameX + Math.round((frameWidth - ctaWidth) / 2);
  const ctaY = square ? summaryY + 118 : frameY + frameHeight - 136;
  const progressWidth = Math.round(docWidth * 0.74);
  const progressX = docX + Math.round((docWidth - progressWidth) / 2);
  const progressY = docY + docHeight - (square ? 56 : 72);

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "download-spotlight-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 54, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "download-spotlight-stage", layer: "background", x: stageX, y: stageY, width: stageWidth, height: stageHeight, fill: surface, cornerRadius: 52, opacity: 0, animations: [{start: 0.04, end: Math.min(0.52, duration * 0.24), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0.04, end: Math.min(0.52, duration * 0.24), property: "scale", from: 0.92, to: 1, easing: "spring"}]}),
    {id: "download-spotlight-glow", type: "glow", layer: "background", x: stageX - 64, y: stageY - 64, width: stageWidth + 128, height: stageHeight + 128, fill: accent, glowColor: accent, glowStrength: design.objectProminence === "dominant" ? 0.9 : 0.76, opacity: 0, animations: [{start: 0.08, end: Math.min(0.58, duration * 0.28), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}]},
    buildPanelElement({id: "download-spotlight-sheen", layer: "background", x: stageX + 22, y: stageY + 22, width: stageWidth - 44, height: Math.round(stageHeight * 0.24), fill: mixHex(accent, "#FFFFFF", 0.74), cornerRadius: 999, opacity: 0, animations: [{start: 0.1, end: Math.min(0.62, duration * 0.28), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-doc", layer: "foreground", x: docX, y: docY, width: docWidth, height: docHeight, fill: elevated, stroke: accent, strokeWidth: square ? 3 : 4, cornerRadius: 30, opacity: 0, animations: [{start: 0.1, end: Math.min(0.62, duration * 0.28), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.1, end: Math.min(0.62, duration * 0.28), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "download-spotlight-fold", layer: "foreground", x: docX + docWidth - 42, y: docY + 18, width: 24, height: 24, fill: surface, cornerRadius: 8, opacity: 0, animations: [{start: 0.14, end: Math.min(0.68, duration * 0.3), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-icon-badge", layer: "foreground", x: docX + Math.round((docWidth - 72) / 2), y: docY + 20, width: 72, height: 72, fill: surface, cornerRadius: 22, opacity: 0, animations: [{start: 0.14, end: Math.min(0.68, duration * 0.3), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.14, end: Math.min(0.68, duration * 0.3), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildIconElement("download-spotlight-icon", "download", docX + Math.round((docWidth - iconSize) / 2), docY + 20 + Math.round((72 - iconSize) / 2), iconSize, accent, duration),
    ...[0, 1, 2].map((index) =>
      buildPanelElement({id: `download-spotlight-line-${index}`, layer: "foreground", x: docX + 28, y: docY + (square ? 104 : 162) + index * (square ? 18 : 28), width: index === 0 ? docWidth - 56 : index === 1 ? docWidth - 72 : docWidth - 94, height: square ? 8 : 12, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.22 + index * 0.04, end: Math.min(0.9 + index * 0.04, duration * 0.4), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.22 + index * 0.04, end: Math.min(0.9 + index * 0.04, duration * 0.4), property: "scale", from: 0.2, to: 1, easing: "easeOut"}]})
    ),
    buildPanelElement({id: "download-spotlight-progress-track", layer: "background", x: progressX, y: progressY, width: progressWidth, height: 16, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(0.94, duration * 0.42), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-progress-fill", layer: "foreground", x: progressX, y: progressY, width: Math.round(progressWidth * 0.84), height: 16, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.1, duration * 0.5), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.28, end: Math.min(1.1, duration * 0.5), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-badge", layer: "foreground", x: badgeX, y: badgeY, width: badgeSize, height: badgeSize, fill: elevated, cornerRadius: 28, opacity: 0, animations: [{start: 0.16, end: Math.min(0.72, duration * 0.34), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.16, end: Math.min(0.72, duration * 0.34), property: "scale", from: 0.82, to: 1, easing: "spring"}]}),
    buildTextElement({id: "download-spotlight-badge-text", layer: "foreground", x: badgeX, y: badgeY + 18, width: badgeSize, height: 24, fill: accent, text: "SAVE", fontSize: square ? 18 : 22, fontWeight: 900, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.2, end: Math.min(0.8, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-rail", layer: "foreground", x: textX + Math.round((textWidth - Math.round(textWidth * 0.28)) / 2), y: textY - 28, width: Math.round(textWidth * 0.28), height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.14, end: Math.min(0.46, duration * 0.22), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.14, end: Math.min(0.46, duration * 0.22), property: "scale", from: 0.28, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-spotlight-headline", layer: "main", x: textX, y: textY, width: textWidth, height: fit.headlineHeight, fill: textColor, text: fit.headlineLines.join("\n"), fontSize: fit.headlineSize, fontWeight: 900, fontFamily, textAlign: "center", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.18, end: Math.min(0.92, duration * 0.42), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.18, end: Math.min(0.92, duration * 0.42), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildTextElement({id: "download-spotlight-sub", layer: "foreground", x: textX, y: textY + fit.headlineHeight + 20, width: textWidth, height: Math.max(64, fit.subHeight + 16), fill: secondaryText, text: fit.subLines.length > 0 ? fit.subLines.join("\n") : "A stronger save-state scene with archive clarity and handoff confidence.", fontSize: fit.subSize || (square ? 22 : 24), fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.24, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-summary", layer: "background", x: summaryX, y: summaryY, width: summaryWidth, height: square ? 94 : 112, fill: elevated, cornerRadius: 30, opacity: 0, animations: [{start: 0.28, end: Math.min(1.06, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.28, end: Math.min(1.06, duration * 0.48), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "download-spotlight-summary-track", layer: "background", x: summaryX + 24, y: summaryY + 22, width: summaryWidth - 48, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.32, end: Math.min(1.12, duration * 0.52), property: "opacity", from: 0, to: 0.74, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-summary-fill", layer: "foreground", x: summaryX + 24, y: summaryY + 22, width: Math.round((summaryWidth - 48) * 0.82), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.18, duration * 0.54), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.36, end: Math.min(1.18, duration * 0.54), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-spotlight-summary-text", layer: "foreground", x: summaryX + 24, y: summaryY + 46, width: summaryWidth - 48, height: 24, fill: edge, text: "Archive confidence 82%", fontSize: square ? 18 : 24, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.4, end: Math.min(1.24, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "download-spotlight-cta", layer: "foreground", x: ctaX, y: ctaY, width: ctaWidth, height: 64, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.42, end: Math.min(1.28, duration * 0.6), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.42, end: Math.min(1.28, duration * 0.6), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "download-spotlight-cta-text", layer: "foreground", x: ctaX, y: ctaY + 18, width: ctaWidth, height: 24, fill: accent, text: "ARCHIVE READY", fontSize: 18, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.46, end: Math.min(1.34, duration * 0.62), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
  ];
};

const buildDownloadSaveStackSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, edge, track} = sceneStyle;
  const fontFamily = pickFontFamily(prompt);
  const portrait = canvas.format === "portrait";
  const square = canvas.format === "square";
  const frameX = portrait ? 82 : 92;
  const frameY = portrait ? 252 : square ? 132 : 160;
  const frameWidth = portrait ? canvas.width - 164 : canvas.width - 184;
  const frameHeight = portrait ? 1220 : square ? 900 : 780;
  const textWidth = portrait ? frameWidth - 132 : square ? 360 : 500;
  const textX = portrait ? frameX + 66 : square ? frameX + Math.round((frameWidth - textWidth) / 2) : frameX + 54;
  const topY = frameY + (square ? 72 : 64);
  const fit = fitTextBlock({
    headline: payload.headline ?? "Saving File",
    subheadline: payload.subheadline,
    maxWidth: textWidth,
    maxHeight: portrait ? 240 : square ? 116 : 220,
    headlineChars: square ? 12 : 14,
    maxHeadlineLines: 2,
    subChars: 22,
    maxSubLines: square ? 2 : 3,
    headlineDesired: portrait ? 68 : square ? 38 : 72,
    headlineMin: square ? 30 : 42,
    subDesired: portrait ? 24 : square ? 15 : 24,
    subMin: 16,
    headlineWidthFactor: 0.72,
    subWidthFactor: 0.6,
    headlineLetterSpacing: -2,
    subLetterSpacing: -0.2,
    headlineLineHeight: 0.92,
    subLineHeight: 1.14,
  });
  const headlineHeight = fit.headlineHeight;
  const railWidth = Math.round(textWidth * 0.28);
  const cardWidth = portrait ? frameWidth - 150 : square ? 408 : 420;
  const cardX = frameX + Math.round((frameWidth - cardWidth) / 2);
  const cardHeight = portrait ? 198 : square ? 176 : 196;
  const card1Y = topY + headlineHeight + fit.subHeight + (square ? 92 : 78);
  const card2Y = card1Y + (square ? 54 : 60);
  const card3Y = card2Y + (square ? 54 : 60);
  const summaryWidth = portrait ? frameWidth - 150 : square ? 356 : textWidth;
  const summaryX = frameX + Math.round((frameWidth - summaryWidth) / 2);
  const summaryY = card3Y + cardHeight + (square ? 34 : 44);
  const ctaWidth = portrait ? summaryWidth : square ? 280 : 340;
  const ctaX = frameX + Math.round((frameWidth - ctaWidth) / 2);
  const ctaY = square ? summaryY + 118 : frameY + frameHeight - 134;
  const iconSize = square ? 72 : 76;

  return [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "download-stack-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: frame, cornerRadius: 54, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "download-stack-rail", layer: "foreground", x: textX + Math.round((textWidth - railWidth) / 2), y: topY - 30, width: railWidth, height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.06, end: Math.min(0.38, duration * 0.18), property: "opacity", from: 0, to: 0.82, easing: "easeOut"}, {start: 0.06, end: Math.min(0.38, duration * 0.18), property: "scale", from: 0.24, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-stack-headline", layer: "main", x: textX, y: topY, width: textWidth, height: headlineHeight, fill: textColor, text: fit.headlineLines.join("\n"), fontSize: fit.headlineSize, fontWeight: 900, fontFamily, textAlign: "center", letterSpacing: -2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.08, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildTextElement({id: "download-stack-copy", layer: "foreground", x: textX, y: topY + headlineHeight + 20, width: textWidth, height: Math.max(72, fit.subHeight + 16), fill: secondaryText, text: fit.subLines.length > 0 ? fit.subLines.join("\n") : "A stronger save-state scene with stacked statuses and archive handoff framing.", fontSize: fit.subSize || (square ? 22 : 24), fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.16, end: Math.min(0.94, duration * 0.42), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "download-stack-card-3", layer: "background", x: cardX + (square ? 40 : 54), y: card3Y, width: cardWidth - (square ? 80 : 108), height: cardHeight - (square ? 26 : 34), fill: surface, cornerRadius: 34, opacity: 0, animations: [{start: 0.18, end: Math.min(0.9, duration * 0.4), property: "opacity", from: 0, to: 0.34, easing: "easeOut"}, {start: 0.18, end: Math.min(0.9, duration * 0.4), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildPanelElement({id: "download-stack-card-2", layer: "background", x: cardX + (square ? 18 : 26), y: card2Y, width: cardWidth - (square ? 36 : 52), height: cardHeight - (square ? 8 : 16), fill: elevated, cornerRadius: 38, opacity: 0, animations: [{start: 0.2, end: Math.min(0.94, duration * 0.42), property: "opacity", from: 0, to: 0.58, easing: "easeOut"}, {start: 0.2, end: Math.min(0.94, duration * 0.42), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildPanelElement({id: "download-stack-card-1", layer: "foreground", x: cardX, y: card1Y, width: cardWidth, height: cardHeight, fill: surface, cornerRadius: 40, opacity: 0, animations: [{start: 0.22, end: Math.min(0.98, duration * 0.44), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.22, end: Math.min(0.98, duration * 0.44), property: "translateY", from: 20, to: 0, easing: "spring"}]}),
    buildPanelElement({id: "download-stack-icon-badge", layer: "foreground", x: cardX + 28, y: card1Y + 28, width: square ? 92 : 96, height: square ? 92 : 96, fill: accent, cornerRadius: 30, opacity: 0, animations: [{start: 0.26, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.76, easing: "easeOut"}]}),
    buildIconElement("download-stack-icon", "download", cardX + 28 + Math.round(((square ? 92 : 96) - iconSize) / 2), card1Y + 28 + Math.round(((square ? 92 : 96) - iconSize) / 2), iconSize, mixHex(accent, "#FFFFFF", 0.1), duration),
    buildTextElement({id: "download-stack-line-1", layer: "foreground", x: cardX + 28 + (square ? 118 : 124), y: card1Y + (square ? 38 : 40), width: cardWidth - (square ? 146 : 158), height: 30, fill: textColor, text: "Premium Motion Pack", fontSize: square ? 22 : 30, fontWeight: 800, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.5, lineHeight: 1, opacity: 0, animations: [{start: 0.28, end: Math.min(1.04, duration * 0.48), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-stack-line-2", layer: "foreground", x: cardX + 28 + (square ? 118 : 124), y: card1Y + (square ? 72 : 84), width: cardWidth - (square ? 146 : 158), height: 52, fill: secondaryText, text: "Archive state, handoff tags,\nand cleaner save timing", fontSize: square ? 15 : 20, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.2, lineHeight: 1.14, opacity: 0, animations: [{start: 0.3, end: Math.min(1.08, duration * 0.5), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}]}),
    buildPanelElement({id: "download-stack-summary", layer: "background", x: summaryX, y: summaryY, width: summaryWidth, height: 114, fill: elevated, cornerRadius: 30, opacity: 0, animations: [{start: 0.32, end: Math.min(1.1, duration * 0.5), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.32, end: Math.min(1.1, duration * 0.5), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "download-stack-summary-track", layer: "background", x: summaryX + 28, y: summaryY + 28, width: summaryWidth - 56, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.36, end: Math.min(1.16, duration * 0.54), property: "opacity", from: 0, to: 0.74, easing: "easeOut"}]}),
    buildPanelElement({id: "download-stack-summary-fill", layer: "foreground", x: summaryX + 28, y: summaryY + 28, width: Math.round((summaryWidth - 56) * 0.72), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.4, end: Math.min(1.22, duration * 0.56), property: "opacity", from: 0, to: 0.96, easing: "easeOut"}, {start: 0.4, end: Math.min(1.22, duration * 0.56), property: "scale", from: 0.22, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "download-stack-summary-text", layer: "foreground", x: summaryX + 28, y: summaryY + 58, width: summaryWidth - 56, height: 28, fill: edge, text: "Archive confidence 72%", fontSize: square ? 24 : 24, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1, opacity: 0, animations: [{start: 0.44, end: Math.min(1.26, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}]}),
    buildPanelElement({id: "download-stack-cta", layer: "foreground", x: ctaX, y: ctaY, width: ctaWidth, height: 72, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.42, end: Math.min(1.24, duration * 0.58), property: "opacity", from: 0, to: 0.88, easing: "easeOut"}, {start: 0.42, end: Math.min(1.24, duration * 0.58), property: "scale", from: 0.84, to: 1, easing: "spring"}]}),
    buildTextElement({id: "download-stack-cta-text", layer: "foreground", x: ctaX, y: ctaY + 22, width: ctaWidth, height: 26, fill: accent, text: "ARCHIVE READY", fontSize: 22, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "center", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.46, end: Math.min(1.3, duration * 0.6), property: "opacity", from: 0, to: 1, easing: "easeOut"}]}),
  ];
};

const buildDownloadSceneElements = (
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const compositionVariant = pickDownloadCompositionVariant(prompt);
  if (compositionVariant === "download-spotlight") return buildDownloadSpotlightSceneElements(payload, canvas, sceneStyle, duration, prompt);
  if (compositionVariant === "download-save-stack") return buildDownloadSaveStackSceneElements(payload, canvas, sceneStyle, duration, prompt);
  return buildDownloadCardSceneElements(payload, canvas, sceneStyle, duration, prompt);
};

const subjectLabel = (type: ShapeType) => {
  switch (type) {
    case "heart": return "Heart";
    case "bell": return "Notification";
    case "play": return "Now Playing";
    case "lock": return "Built Secure";
    case "cart": return "Add To Cart";
    case "search": return "Query Loading";
    case "battery": return "Charging Up";
    case "calendar": return "Event Countdown";
    case "barchart": return "KPI Snapshot";
    case "trend": return "Growth Curve";
    case "wallet": return "Cashflow";
    case "pie": return "Market Share";
    case "phone": return "App Launch";
    case "headphones": return "Podcast Mode";
    case "laptop": return "Focus Mode";
    case "download": return "Saving File";
    case "gear": return "Processing";
    case "mic": return "Recording Live";
    default: return "Scene";
  }
};

const inferSubheadline = (type: ShapeType, variant: SceneVariant) => {
  if (variant === "media-card") return "A polished SVG motion scene for video, audio, and creator moments.";
  if (variant === "dashboard-card") return "Structured motion around metrics, progress, and product storytelling.";
  if (variant === "device-card") return "UI-style SVG motion for prompts that mix interface, utility, and copy.";
  switch (type) {
    case "heart": return "Color, motion, and copy working together inside one SVG scene.";
    case "bell": return "Notification energy with a clearer graphic stage and stronger presence.";
    default: return "A mixed SVG composition generated from prompt intent.";
  }
};

const pickVariant = (type: ShapeType, prompt: string): SceneVariant => {
  const normalized = normalizePrompt(prompt);
  if (includesAny(normalized, ["video", "player", "podcast", "audio", "intro reveal", "now playing"])) return "media-card";
  if (includesAny(normalized, ["kpi", "dashboard", "growth", "market share", "countdown", "cashflow", "payment", "chart", "metric"])) return "dashboard-card";
  if (includesAny(normalized, ["app launch", "ui", "productivity", "loading", "query", "search", "cart", "checkout", "device"])) return "device-card";
  if (type === "play" || type === "headphones" || type === "mic") return "media-card";
  if (type === "barchart" || type === "trend" || type === "pie" || type === "wallet" || type === "calendar" || type === "battery") return "dashboard-card";
  if (type === "phone" || type === "laptop" || type === "search" || type === "cart" || type === "download" || type === "gear") return "device-card";
  return "icon-lockup";
};

const buildPayload = (type: ShapeType, prompt: string, variant: SceneVariant): ScenePayload => {
  const written = extractWrittenText(prompt);
  const headline = parseLabeledValue(prompt, ["headline", "title", "main text", "text", "copy"]) ?? written ?? subjectLabel(type);
  const subheadline = parseLabeledValue(prompt, ["subheadline", "subtitle", "supporting text", "body", "description", "tagline"]) ?? inferSubheadline(type, variant);
  const kicker = parseLabeledValue(prompt, ["kicker", "eyebrow", "label", "tag"]) ?? (variant === "media-card" ? "Motion Scene" : undefined);
  return {headline, subheadline, kicker};
};

export const shouldBuildObjectScene = (request: PromptRequest, routedType: ShapeType) => {
  if (!SCENE_READY_TYPES.has(routedType)) return false;
  const normalized = normalizePrompt(request.prompt);
  const explicitCopy = Boolean(parseLabeledValue(request.prompt, ["headline", "title", "text", "copy", "subheadline", "subtitle"]));
  const written = Boolean(extractWrittenText(request.prompt));
  const sceneCue = includesAny(normalized, [
    "written",
    "with text",
    "with headline",
    "title card",
    "player",
    "video intro",
    "podcast",
    "dashboard",
    "countdown",
    "kpi",
    "market share",
    "cashflow",
    "app launch",
    "add to cart",
    "query loading",
    "recording live",
    "productivity",
  ]);

  return explicitCopy || written || sceneCue;
};

const buildSceneElements = (
  type: ShapeType,
  payload: ScenePayload,
  canvas: CanvasSpec,
  sceneStyle: SceneStyle,
  duration: number,
  prompt: string,
): AnimatedElement[] => {
  const {accent, text: textColor, secondary: secondaryText, frame, surface, elevated, track, edge} = sceneStyle;
  if (type === "heart") {
    return buildHeartSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "play") {
    return buildPlaySceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "search") {
    return buildSearchSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "cart") {
    return buildCartSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "battery") {
    return buildBatterySceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "calendar") {
    return buildCalendarSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "trend") {
    return buildTrendSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "barchart") {
    return buildBarChartSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "phone") {
    return buildPhoneSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "headphones") {
    return buildHeadphonesSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "wallet") {
    return buildWalletSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "laptop") {
    return buildLaptopSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "pie") {
    return buildPieSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  if (type === "download") {
    return buildDownloadSceneElements(payload, canvas, sceneStyle, duration, prompt);
  }

  const variant = pickVariant(type, prompt);
  const fontFamily = pickFontFamily(prompt);
  const landscape = canvas.format === "landscape";
  const portrait = canvas.format === "portrait";
  const cardX = landscape ? 136 : portrait ? 82 : 92;
  const cardY = landscape ? 168 : portrait ? 360 : 178;
  const cardWidth = landscape ? Math.round(canvas.width * 0.72) : portrait ? canvas.width - 164 : canvas.width - 184;
  const cardHeight = landscape ? Math.round(canvas.height * 0.58) : portrait ? Math.round(canvas.height * 0.38) : Math.round(canvas.height * 0.62);
  const iconBadgeSize = landscape ? 240 : portrait ? (variant === "media-card" ? 164 : 188) : 206;
  const iconBadgeX = landscape ? cardX + 56 : cardX + 48;
  const iconBadgeY = landscape ? cardY + Math.round((cardHeight - iconBadgeSize) / 2) : cardY + 48;
  const iconInset = Math.round(iconBadgeSize * 0.2);
  const iconSize = iconBadgeSize - iconInset * 2;
  const textX = landscape ? iconBadgeX + iconBadgeSize + 58 : cardX + 56;
  const textY = landscape ? cardY + 94 : iconBadgeY + iconBadgeSize + (variant === "media-card" ? 124 : 52);
  const textWidth = landscape ? cardWidth - (textX - cardX) - 66 : cardWidth - 112;
  const headlineLines = wrapText(payload.headline ?? subjectLabel(type), landscape ? 16 : portrait ? 12 : 14, 3);
  const headlineSize = fitFontSize(
    headlineLines,
    textWidth,
    landscape ? 84 : portrait ? (variant === "media-card" ? 60 : 72) : 76,
    landscape ? 54 : portrait ? 42 : 50,
    0.76,
    -2.2,
  );
  const subLines = payload.subheadline ? wrapText(payload.subheadline, landscape ? 34 : portrait ? 24 : 28, 3) : [];
  const subSize = landscape ? 28 : portrait ? 24 : 26;
  const headlineHeight = headlineLines.length * headlineSize * 0.92 + 24;
  const subY = textY + headlineHeight + 34;

  const glowAnimations: AnimationKeyframe[] = [
    {start: 0, end: Math.min(0.6, duration * 0.24), property: "opacity", from: 0, to: 0.14, easing: "easeOut"},
    {start: 0, end: Math.min(0.6, duration * 0.24), property: "scale", from: 0.78, to: 1, easing: "spring"},
  ];
  appendMirrorAnimation(glowAnimations, "scale", Math.min(1.2, duration * 0.34), Math.min(2.1, duration * 0.54), Math.min(duration - 0.14, 3.1), 1, 1.08);

  const accentBarWidth = variant === "dashboard-card" ? Math.round(textWidth * 0.86) : Math.round(textWidth * 0.52);
  const accentBarY = variant === "media-card" ? cardY + cardHeight - 90 : subY - 22;

  const elements: AnimatedElement[] = [
    ...buildSceneBackdropOrnaments(canvas, sceneStyle, duration),
    buildPanelElement({id: "scene-frame", layer: "background", x: cardX, y: cardY, width: cardWidth, height: cardHeight, fill: frame, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    {id: "scene-glow", type: "glow", layer: "background", x: iconBadgeX - 90, y: iconBadgeY - 90, width: iconBadgeSize + 180, height: iconBadgeSize + 180, fill: accent, glowColor: accent, glowStrength: 0.72, opacity: 0, animations: glowAnimations},
    buildPanelElement({id: "scene-badge", layer: "background", x: iconBadgeX, y: iconBadgeY, width: iconBadgeSize, height: iconBadgeSize, fill: variant === "dashboard-card" ? elevated : surface, cornerRadius: variant === "media-card" ? 42 : 999, opacity: 0, animations: [{start: 0.04, end: Math.min(0.46, duration * 0.22), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.04, end: Math.min(0.46, duration * 0.22), property: "scale", from: 0.86, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "scene-accent-strip", layer: "foreground", x: cardX + 28, y: cardY + 28, width: portrait ? cardWidth - 56 : 14, height: portrait ? 10 : cardHeight - 56, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.06, end: Math.min(0.38, duration * 0.18), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.06, end: Math.min(0.38, duration * 0.18), property: "scale", from: 0.25, to: 1, easing: "spring"}]}),
    buildIconElement("scene-icon", type, iconBadgeX + iconInset, iconBadgeY + iconInset, iconSize, accent, duration),
    buildTextElement({id: "scene-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2.2, lineHeight: 0.92, opacity: 0, animations: [{start: 0.08, end: Math.min(0.82, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.82, duration * 0.34), property: "translateY", from: 28, to: 0, easing: "spring"}]}),
  ];

  if (payload.kicker) {
    elements.push(buildTextElement({id: "scene-kicker", layer: "foreground", x: textX, y: textY - 44, width: textWidth, height: 24, fill: accent, text: payload.kicker.toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0.02, end: Math.min(0.28, duration * 0.14), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.02, end: Math.min(0.28, duration * 0.14), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}));
  }

  if (subLines.length > 0) {
    elements.push(buildPanelElement({id: "scene-accent-bar", layer: "foreground", x: textX, y: accentBarY, width: accentBarWidth, height: variant === "media-card" ? 8 : 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.68, duration * 0.3), property: "opacity", from: 0, to: 0.84, easing: "easeOut"}, {start: 0.18, end: Math.min(0.68, duration * 0.3), property: "scale", from: 0.4, to: 1, easing: "spring"}]}));
    elements.push(buildTextElement({id: "scene-subheadline", layer: "foreground", x: textX, y: subY, width: textWidth, height: subLines.length * subSize * 1.16 + 22, fill: secondaryText, text: subLines.join("\n"), fontSize: subSize, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.25, lineHeight: 1.16, opacity: 0, animations: [{start: 0.22, end: Math.min(1.08, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.22, end: Math.min(1.08, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}));
  }

  if (variant === "media-card") {
    const progressY = landscape ? cardY + cardHeight - 88 : cardY + cardHeight - 108;
    elements.push(
      buildPanelElement({id: "media-track", layer: "background", x: textX, y: progressY, width: textWidth, height: 12, fill: track, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(0.74, duration * 0.34), property: "opacity", from: 0, to: 0.86, easing: "easeOut"}]}),
      buildPanelElement({id: "media-progress", layer: "foreground", x: textX, y: progressY, width: Math.round(textWidth * 0.68), height: 12, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.3, end: Math.min(1.34, duration * 0.58), property: "opacity", from: 0, to: 0.94, easing: "easeOut"}, {start: 0.3, end: Math.min(1.34, duration * 0.58), property: "scale", from: 0.4, to: 1, easing: "easeOut"}]}),
    );
  }

  if (variant === "dashboard-card") {
    const chipY = cardY + cardHeight - (portrait ? 128 : 92);
    elements.push(
      buildPanelElement({id: "dashboard-chip", layer: "foreground", x: textX, y: chipY, width: landscape ? 260 : 220, height: 58, fill: elevated, cornerRadius: 999, opacity: 0, animations: [{start: 0.28, end: Math.min(1.02, duration * 0.46), property: "opacity", from: 0, to: 0.74, easing: "easeOut"}, {start: 0.28, end: Math.min(1.02, duration * 0.46), property: "scale", from: 0.82, to: 1, easing: "spring"}]}),
      buildTextElement({id: "dashboard-chip-text", layer: "foreground", x: textX + 26, y: chipY + 16, width: landscape ? 220 : 180, height: 28, fill: accent, text: "SVG SCENE READY", fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.32, end: Math.min(1.08, duration * 0.5), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.32, end: Math.min(1.08, duration * 0.5), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}),
    );
  }

  if (variant === "device-card") {
    const screenWidth = landscape ? 220 : portrait ? cardWidth - 112 : cardWidth - 112;
    const screenX = landscape ? cardX + cardWidth - screenWidth - 48 : textX;
    const screenY = landscape ? cardY + 52 : cardY + cardHeight - 146;
    elements.push(
      buildPanelElement({id: "device-screen", layer: "background", x: screenX, y: screenY, width: screenWidth, height: landscape ? 120 : 90, fill: surface, cornerRadius: 28, opacity: 0, animations: [{start: 0.24, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 0.86, easing: "easeOut"}, {start: 0.24, end: Math.min(0.88, duration * 0.38), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
      buildPanelElement({id: "device-screen-bar", layer: "foreground", x: screenX + 22, y: screenY + 22, width: Math.round(screenWidth * 0.62), height: 10, fill: edge, cornerRadius: 999, opacity: 0, animations: [{start: 0.3, end: Math.min(1.04, duration * 0.44), property: "opacity", from: 0, to: 0.85, easing: "easeOut"}, {start: 0.3, end: Math.min(1.04, duration * 0.44), property: "scale", from: 0.3, to: 1, easing: "easeOut"}]}),
    );
  }

  return elements;
};

export const buildObjectSceneSpec = (request: PromptRequest, routedType: ShapeType): AnimationSpec => {
  const variant = pickVariant(routedType, request.prompt);
  const sceneStyle = resolveSceneStyle(request.prompt, routedType, variant);
  const canvas = getCanvas(request, sceneStyle.background);
  const duration = clamp(parseDuration(request.prompt) ?? 4.2, 2.2, 8);
  const payload = buildPayload(routedType, request.prompt, variant);
  const elements = buildSceneElements(routedType, payload, canvas, sceneStyle, duration, request.prompt);
  return {
    id: slugify(payload.headline ?? subjectLabel(routedType)),
    title: payload.headline ?? subjectLabel(routedType),
    duration,
    fps: 30,
    loop: false,
    canvas: {width: canvas.width, height: canvas.height, background: canvas.background},
    elements,
  };
};
