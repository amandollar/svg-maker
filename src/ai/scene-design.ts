import {extractStyleHints, includesAny, normalizePrompt} from "./prompt-helpers";

export type DesignLookId = "product" | "editorial" | "dashboard" | "romantic";
export type ObjectProminenceTier = "balanced" | "dominant";
export type TextDensityTier = "compact" | "balanced" | "dense";
export type MotionRhythmTier = "steady" | "snappy" | "dramatic";

export type SceneDesignTokens = {
  look: DesignLookId;
  paletteGroup: "light-ui" | "dark-ui" | "warm-editorial" | "romantic";
  objectProminence: ObjectProminenceTier;
  textDensity: TextDensityTier;
  motionRhythm: MotionRhythmTier;
  surfaceMix: number;
  elevatedMix: number;
  frameMix: number;
  trackMix: number;
  edgeMix: number;
  ornamentOpacity: number;
  minContrast: number;
};

export type FitTextBlockInput = {
  headline: string;
  subheadline?: string;
  maxWidth: number;
  maxHeight: number;
  headlineChars: number;
  maxHeadlineLines: number;
  subChars: number;
  maxSubLines: number;
  headlineDesired: number;
  headlineMin: number;
  subDesired: number;
  subMin: number;
  headlineWidthFactor: number;
  subWidthFactor: number;
  headlineLetterSpacing?: number;
  subLetterSpacing?: number;
  headlineLineHeight: number;
  subLineHeight: number;
  preferDroppingSubheadline?: boolean;
};

export type FitTextBlockResult = {
  headlineLines: string[];
  subLines: string[];
  headlineSize: number;
  subSize: number;
  headlineHeight: number;
  subHeight: number;
  totalHeight: number;
  simplified: boolean;
};

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const cleanCopy = (value: string) =>
  value.replace(/^["'`\u2018\u2019\u201c\u201d]+|["'`\u2018\u2019\u201c\u201d]+$/g, "").replace(/\s+/g, " ").trim();

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
  return {r: Number.parseInt(value.slice(0, 2), 16), g: Number.parseInt(value.slice(2, 4), 16), b: Number.parseInt(value.slice(4, 6), 16)};
};

const rgbToHex = ({r, g, b}: {r: number; g: number; b: number}) =>
  `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;

export const mixHex = (from: string, to: string, amount: number) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const t = clamp(amount, 0, 1);
  return rgbToHex({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });
};

const getLuminance = (hex: string) => {
  const {r, g, b} = hexToRgb(hex);
  const toLinear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

export const getContrastRatio = (a: string, b: string) => {
  const l1 = getLuminance(a);
  const l2 = getLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const ensureTextContrast = (background: string, preferred: string, minimum = 3.8) => {
  if (getContrastRatio(background, preferred) >= minimum) return preferred;
  const dark = "#111827";
  const light = "#F8FAFC";
  const darkContrast = getContrastRatio(background, dark);
  const lightContrast = getContrastRatio(background, light);
  return darkContrast >= lightContrast ? dark : light;
};

export const ensureSurfaceContrast = (background: string, surface: string, accent: string, minimum = 1.18) => {
  if (getContrastRatio(background, surface) >= minimum) return surface;
  const darker = mixHex(surface, "#111827", 0.16);
  if (getContrastRatio(background, darker) >= minimum) return darker;
  const lighter = mixHex(surface, accent, 0.16);
  if (getContrastRatio(background, lighter) >= minimum) return lighter;
  return mixHex(background, accent, 0.22);
};

const wrapText = (value: string, maxChars: number, maxLines: number) => {
  const words = cleanCopy(value).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let current = "";
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index]!;
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) {
      current = [current, ...words.slice(index + 1)].join(" ");
      break;
    }
  }
  if (current) lines.push(current);
  return lines.length > maxLines ? [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(" ")] : lines;
};

const truncateToChars = (value: string, maxChars: number) => {
  const cleaned = cleanCopy(value);
  if (cleaned.length <= maxChars) return cleaned;
  const shortened = cleaned.slice(0, maxChars).replace(/\s+\S*$/, "");
  return `${shortened}...`;
};

const fitFontSize = (
  lines: string[],
  maxWidth: number,
  desired: number,
  min: number,
  charFactor: number,
  letterSpacing = 0,
) => {
  const longest = Math.max(0, ...lines.map((line) => cleanCopy(line).length));
  if (longest === 0 || maxWidth <= 0) return desired;
  const estimatedWidth = longest * desired * charFactor + Math.max(0, longest - 1) * letterSpacing;
  if (estimatedWidth <= maxWidth) return desired;
  const scaled = Math.floor((desired * maxWidth) / estimatedWidth);
  return clamp(scaled, min, desired);
};

export const fitTextBlock = (input: FitTextBlockInput): FitTextBlockResult => {
  const {
    headline,
    subheadline,
    maxWidth,
    maxHeight,
    headlineChars,
    maxHeadlineLines,
    subChars,
    maxSubLines,
    headlineDesired,
    headlineMin,
    subDesired,
    subMin,
    headlineWidthFactor,
    subWidthFactor,
    headlineLetterSpacing = 0,
    subLetterSpacing = 0,
    headlineLineHeight,
    subLineHeight,
    preferDroppingSubheadline = true,
  } = input;

  let simplified = false;
  let workingHeadline = truncateToChars(headline, Math.max(headlineChars * maxHeadlineLines + 24, headlineChars * 2));
  let workingSub = subheadline ? truncateToChars(subheadline, Math.max(subChars * maxSubLines + 24, subChars * 2)) : undefined;

  let headlineLines = wrapText(workingHeadline, headlineChars, maxHeadlineLines);
  let subLines = workingSub ? wrapText(workingSub, subChars, maxSubLines) : [];
  let headlineSize = fitFontSize(headlineLines, maxWidth, headlineDesired, headlineMin, headlineWidthFactor, headlineLetterSpacing);
  let subSize = subLines.length > 0 ? fitFontSize(subLines, maxWidth, subDesired, subMin, subWidthFactor, subLetterSpacing) : subDesired;

  const measure = () => {
    const headlineHeight = headlineLines.length * headlineSize * headlineLineHeight + Math.max(18, headlineSize * 0.25);
    const subHeight = subLines.length > 0 ? subLines.length * subSize * subLineHeight + Math.max(12, subSize * 0.2) : 0;
    const gap = subLines.length > 0 ? Math.max(18, headlineSize * 0.4) : 0;
    return {headlineHeight, subHeight, totalHeight: headlineHeight + gap + subHeight};
  };

  let metrics = measure();
  let attempts = 0;
  while (metrics.totalHeight > maxHeight && attempts < 10) {
    attempts += 1;
    if (subLines.length > 0 && (subSize > subMin || subLines.length > 2)) {
      if (subSize > subMin) subSize = Math.max(subMin, subSize - 2);
      else subLines = subLines.slice(0, Math.max(1, subLines.length - 1));
      simplified = true;
    } else if (headlineSize > headlineMin) {
      headlineSize = Math.max(headlineMin, headlineSize - 2);
      simplified = true;
    } else if (headlineLines.length > 2) {
      workingHeadline = truncateToChars(workingHeadline, Math.max(headlineChars * (maxHeadlineLines - 1), headlineChars + 8));
      headlineLines = wrapText(workingHeadline, headlineChars, Math.max(2, maxHeadlineLines - 1));
      simplified = true;
    } else if (subLines.length > 0 && preferDroppingSubheadline) {
      subLines = [];
      subSize = subDesired;
      simplified = true;
    } else {
      break;
    }
    metrics = measure();
  }

  return {
    headlineLines,
    subLines,
    headlineSize,
    subSize: subLines.length > 0 ? subSize : 0,
    headlineHeight: metrics.headlineHeight,
    subHeight: metrics.subHeight,
    totalHeight: metrics.totalHeight,
    simplified,
  };
};

export const resolveSceneDesignTokens = (prompt: string, preferredLook: DesignLookId = "product"): SceneDesignTokens => {
  const normalized = normalizePrompt(prompt);
  const styles = extractStyleHints(prompt);

  let look = preferredLook;
  if (styles.editorial || includesAny(normalized, ["chapter", "section", "interstitial", "quote"])) look = "editorial";
  else if (styles.soft || styles.playful || includesAny(normalized, ["heart", "love", "romantic", "bell alert"])) look = "romantic";
  else if (includesAny(normalized, ["dashboard", "kpi", "chart", "metric", "market share", "trend", "battery"])) look = "dashboard";
  else if (includesAny(normalized, ["search", "download", "cart", "app launch", "productivity", "ui", "product"])) look = "product";

  switch (look) {
    case "romantic":
      return {
        look,
        paletteGroup: "romantic",
        objectProminence: "dominant",
        textDensity: "compact",
        motionRhythm: "dramatic",
        surfaceMix: 0.28,
        elevatedMix: 0.42,
        frameMix: 0.12,
        trackMix: 0.28,
        edgeMix: 0.18,
        ornamentOpacity: 0.2,
        minContrast: 3.9,
      };
    case "editorial":
      return {
        look,
        paletteGroup: "warm-editorial",
        objectProminence: "balanced",
        textDensity: "balanced",
        motionRhythm: "steady",
        surfaceMix: 0.2,
        elevatedMix: 0.34,
        frameMix: 0.08,
        trackMix: 0.38,
        edgeMix: 0.24,
        ornamentOpacity: 0.12,
        minContrast: 4.2,
      };
    case "dashboard":
      return {
        look,
        paletteGroup: "dark-ui",
        objectProminence: "balanced",
        textDensity: "dense",
        motionRhythm: "snappy",
        surfaceMix: 0.24,
        elevatedMix: 0.34,
        frameMix: 0.12,
        trackMix: 0.24,
        edgeMix: 0.12,
        ornamentOpacity: 0.14,
        minContrast: 4,
      };
    case "product":
    default:
      return {
        look,
        paletteGroup: "light-ui",
        objectProminence: "dominant",
        textDensity: "balanced",
        motionRhythm: "steady",
        surfaceMix: 0.22,
        elevatedMix: 0.34,
        frameMix: 0.1,
        trackMix: 0.34,
        edgeMix: 0.18,
        ornamentOpacity: 0.12,
        minContrast: 4.2,
      };
  }
};
