import type {PromptRequest} from "../engine/request";
import type {AnimatedElement, AnimationKeyframe, AnimationProperty, AnimationSpec, ShapeType} from "../engine/types";
import {
  extractStyleHints,
  includesAny,
  inferMotionProfile,
  normalizePrompt,
  parseAccentColor,
  parseBackgroundColor,
  parseCanvasFormat,
  parseDuration,
} from "./prompt-helpers";

type TextVariant = "hero" | "kinetic" | "quote" | "stat" | "list" | "icon-callout" | "masked" | "chapter";
type CanvasSpec = {format: "square" | "portrait" | "landscape"; width: number; height: number; background: string};
type TextPayload = {
  headline: string;
  subheadline?: string;
  kicker?: string;
  attribution?: string;
  items?: string[];
  value?: string;
  label?: string;
  iconType?: ShapeType;
  sectionNumber?: string;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "generated-text-animation";

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

const getReadableTextColor = (background: string) => {
  const {r, g, b} = hexToRgb(background);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.57 ? "#111827" : "#F8FAFC";
};

const getSecondaryTextColor = (background: string) => {
  const {r, g, b} = hexToRgb(background);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.57 ? "#374151" : "#CBD5E1";
};

const cleanCopy = (value: string) => value.replace(/^["'`\u2018\u2019\u201c\u201d]+|["'`\u2018\u2019\u201c\u201d]+$/g, "").replace(/\s+/g, " ").trim();
const titleCase = (value: string) =>
  value.split(/\s+/).filter(Boolean).map((word) => (/^[A-Z0-9%+$.-]{2,}$/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join(" ");

const isMetaLine = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (/^prompt\s+\d+/i.test(trimmed)) return true;
  if (/^[\u2500\u2501\u2502\u2014=\-]{4,}$/.test(trimmed)) return true;
  if (/^(canvas|duration|loop|svg|visual layout|animation timeline|easing curves|color specification|motion style|typography|background|accent|palette)\s*:/i.test(trimmed)) return true;
  if (/^[A-Z][A-Z /&-]{4,}:/.test(trimmed)) return true;
  if (/^#[0-9a-f]{3,6}$/i.test(trimmed)) return true;
  return false;
};

const isDirectiveCopyLine = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (/^(create|make|use|build|design|animate|show|write|add|give)\b/i.test(trimmed)) return true;
  if (/^(quote animation|chapter break|masked reveal|bullet list|stat counter|icon callout|kinetic typography)\b/i.test(trimmed)) return true;
  if (/\b(?:visual layout|supporting copy|centered composition|editorial typography|subtle accent|clean divider|clean wipe|large translucent number|bold centered title|headline should|tone should|should feel|should be|leave generous spacing)\b/i.test(trimmed)) return true;
  return false;
};

const extractMeaningfulLines = (prompt: string) =>
  prompt
    .split(/\r?\n/)
    .map((line) => cleanCopy(line))
    .filter((line) => Boolean(line))
    .filter((line) => !isMetaLine(line))
    .filter((line) => !/^[-*\u2022]\s+/.test(line))
    .filter((line) => !/^\d+\.\s+/.test(line))
    .filter((line) => !/^[a-z][a-z ]+:\s*#[0-9a-f]{3,6}/i.test(line));

const sentenceCase = (value: string) => {
  const cleaned = cleanCopy(value);
  if (!cleaned) return cleaned;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const truncateCopy = (value: string, maxChars: number) => {
  const cleaned = cleanCopy(value);
  if (cleaned.length <= maxChars) return cleaned;
  const shortened = cleaned.slice(0, maxChars).replace(/\s+\S*$/, "");
  return `${shortened}...`;
};

const extractSectionNumber = (prompt: string) => {
  const labeled = parseLabeledValue(prompt, ["section", "chapter", "part", "step", "scene"]);
  if (labeled) {
    const match = labeled.match(/\b([0-9]{1,2}|[ivxlcdm]{1,6})\b/i);
    if (match?.[1]) return match[1].toUpperCase().padStart(/^\d+$/.test(match[1]) ? 2 : match[1].length, "0");
  }

  const direct = prompt.match(/\b(?:section|chapter|part|step|scene)\s+([0-9]{1,2}|[ivxlcdm]{1,6})\b/i);
  if (direct?.[1]) return direct[1].toUpperCase().padStart(/^\d+$/.test(direct[1]) ? 2 : direct[1].length, "0");

  return undefined;
};

const extractNarrativeFallback = (prompt: string) => {
  const lines = extractMeaningfulLines(prompt);
  const candidates = lines.filter((line) => line.length >= 12);
  const preferred = candidates.filter((line) => !isDirectiveCopyLine(line));
  const headlinePool = preferred;
  const headline = headlinePool.find((line) => line.length <= 56) ?? headlinePool.find((line) => line.length <= 72);
  const subPool = candidates.filter((line) => line !== headline);
  const preferredSubPool = subPool.filter((line) => !isDirectiveCopyLine(line));
  const subheadline = preferredSubPool.find((line) => line.length <= 96);
  return {
    headline: headline ? sentenceCase(truncateCopy(headline, 72)) : undefined,
    subheadline: subheadline ? sentenceCase(truncateCopy(subheadline, 120)) : undefined,
  };
};

const parseLabeledValue = (prompt: string, labels: string[]) => {
  for (const label of labels) {
    const match = prompt.match(new RegExp(`(?:^|\\n)\\s*${label}\\s*:\\s*(.+)$`, "im"));
    if (match?.[1]) return cleanCopy(match[1]);
  }
  return undefined;
};

const extractQuotedSegments = (prompt: string) =>
  Array.from(prompt.matchAll(/["\u201c\u201d]([^"\u201c\u201d\n]{2,180})["\u201c\u201d]/g)).map((match) => cleanCopy(match[1] ?? "")).filter(Boolean);

const inferSubject = (prompt: string) => {
  const match = prompt.match(/\b(?:for|about|around)\s+([a-z0-9][^,.\n]{3,80})/i);
  return match?.[1] ? titleCase(cleanCopy(match[1]).replace(/^(a|an|the)\s+/i, "")) : undefined;
};

const inferHeadline = (prompt: string, variant: TextVariant) => {
  const normalized = normalizePrompt(prompt);
  const subject = inferSubject(prompt);
  if (variant === "quote") return subject ? `"${subject}"` : "Words That Land";
  if (variant === "stat") return "Key Metric";
  if (variant === "list") return "What Matters";
  if ((variant === "chapter" || variant === "masked") && subject) {
    if (/product story|story/i.test(subject)) return "Product Story";
    if (/documentary/i.test(subject)) return "Next Chapter";
    if (/product video|launch video/i.test(subject)) return "Product Video";
  }
  if (variant === "hero" && subject) {
    if (/saas/i.test(subject) && includesAny(normalized, ["launch", "release", "drop"])) return "SaaS Launch";
    if (/product/i.test(subject) && includesAny(normalized, ["launch", "release", "drop"])) return "Product Launch";
  }
  if (variant === "icon-callout" && subject) return subject;
  if (includesAny(normalized, ["launch", "drop", "release"])) return "Launch Day";
  if (includesAny(normalized, ["sale", "discount", "offer", "deal"])) return "Limited Offer";
  if (includesAny(normalized, ["growth", "revenue", "analytics", "kpi", "dashboard"])) return "Growth In Motion";
  if (includesAny(normalized, ["secure", "security", "trust", "lock"])) return "Built Secure";
  if (includesAny(normalized, ["podcast", "music", "audio"])) return "Now Playing";
  return subject ?? "Make It Move";
};

const inferSubheadline = (prompt: string, headline: string) => {
  const subject = inferSubject(prompt);
  return subject && subject.toLowerCase() !== headline.toLowerCase() ? subject : undefined;
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

const extractListItems = (prompt: string) => {
  const bulletLines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*\u2022]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => cleanCopy(line.replace(/^[-*\u2022]\s+/, "").replace(/^\d+\.\s+/, "")))
    .filter(Boolean);
  if (bulletLines.length > 0) return bulletLines.slice(0, 5);
  const labeled = parseLabeledValue(prompt, ["items", "bullets", "points", "features", "steps"]);
  return labeled ? labeled.split(/[|;,]/).map((item) => cleanCopy(item)).filter(Boolean).slice(0, 5) : [];
};

const extractStatValue = (prompt: string) => {
  const labeled = parseLabeledValue(prompt, ["value", "stat", "metric", "number"]);
  if (labeled) return labeled;
  return prompt.match(/\b(?:\$|\u20b9|\u20ac|\u00a3)?\d[\d,.]*(?:\+|%|x|k|m|b)?\b/i)?.[0];
};

const inferIconType = (prompt: string): ShapeType | undefined => {
  const normalized = normalizePrompt(prompt);
  if (includesAny(normalized, ["rocket", "launch"])) return "rocket";
  if (includesAny(normalized, ["lock", "secure", "security", "trust"])) return "lock";
  if (includesAny(normalized, ["trend", "growth", "revenue", "analytics"])) return "trend";
  if (includesAny(normalized, ["star", "rating"])) return "star";
  if (includesAny(normalized, ["play", "video"])) return "play";
  if (includesAny(normalized, ["notification", "bell", "alert"])) return "bell";
  if (includesAny(normalized, ["wifi", "signal"])) return "wifi";
  if (includesAny(normalized, ["phone", "mobile"])) return "phone";
  if (includesAny(normalized, ["wallet", "payment"])) return "wallet";
  if (includesAny(normalized, ["search", "discover"])) return "search";
  if (includesAny(normalized, ["heart", "love"])) return "heart";
  if (includesAny(normalized, ["check", "verified", "success"])) return "checkmark";
  return undefined;
};

const pickVariant = (prompt: string): TextVariant => {
  const normalized = normalizePrompt(prompt);
  if (includesAny(normalized, ["chapter break", "chapter title", "section marker", "chapter card", "interstitial", "chapter intro"])) return "chapter";
  if (includesAny(normalized, ["masked reveal", "masked text", "wipe reveal", "reveal headline", "section title", "interstitial title"])) return "masked";
  if (includesAny(normalized, ["quote", "testimonial", "quotation", "author", "said"])) return "quote";
  if (includesAny(normalized, ["bullet list", "bullet", "steps", "feature list", "checklist", "agenda"])) return "list";
  if (includesAny(normalized, ["stat", "metric", "kpi", "counter", "growth", "analytics", "revenue", "users", "downloads", "conversion"])) return "stat";
  if (includesAny(normalized, ["icon callout", "icon with headline", "feature highlight", "product callout", "secure feature", "launch card"])) return "icon-callout";
  if (includesAny(normalized, ["kinetic", "typography", "word by word", "line by line", "typewriter", "stagger", "lyrics", "motivational"])) return "kinetic";
  return "hero";
};

const buildPayload = (prompt: string, variant: TextVariant): TextPayload => {
  const quoted = extractQuotedSegments(prompt);
  const headlineLabel = parseLabeledValue(prompt, ["headline", "title", "main text", "copy"]);
  const subheadlineLabel = parseLabeledValue(prompt, ["subheadline", "subtitle", "supporting text", "body", "description"]);
  const kickerLabel = parseLabeledValue(prompt, ["tagline", "kicker", "eyebrow", "label"]);
  const quoteLabel = parseLabeledValue(prompt, ["quote"]);
  const attributionLabel = parseLabeledValue(prompt, ["author", "attribution", "source", "by"]);
  const items = extractListItems(prompt);
  const value = extractStatValue(prompt);
  const iconType = inferIconType(prompt);
  const narrative = extractNarrativeFallback(prompt);
  const sectionNumber = extractSectionNumber(prompt);

  if (variant === "quote") {
    return {
      headline: quoteLabel ?? quoted[0] ?? headlineLabel ?? narrative.headline ?? inferHeadline(prompt, variant),
      subheadline: subheadlineLabel ?? narrative.subheadline,
      attribution: attributionLabel ?? quoted[1],
    };
  }

  if (variant === "list") {
    return {
      headline: headlineLabel ?? kickerLabel ?? narrative.headline ?? inferHeadline(prompt, variant),
      subheadline: subheadlineLabel ?? narrative.subheadline,
      items: items.length > 0 ? items : ["Clear message", "Strong pacing", "Deterministic output"],
      kicker: kickerLabel && kickerLabel !== headlineLabel ? kickerLabel : undefined,
    };
  }

  if (variant === "stat") {
    return {
      headline: headlineLabel ?? narrative.headline ?? inferHeadline(prompt, variant),
      subheadline: subheadlineLabel ?? narrative.subheadline,
      value: value ?? "42%",
      label: parseLabeledValue(prompt, ["label", "metric label", "caption"]) ?? kickerLabel ?? "Conversion Lift",
      iconType,
    };
  }

  if (variant === "icon-callout") {
    return {
      headline: headlineLabel ?? quoted[0] ?? narrative.headline ?? inferHeadline(prompt, variant),
      subheadline: subheadlineLabel ?? quoted[1] ?? narrative.subheadline,
      kicker: kickerLabel,
      iconType: iconType ?? "rocket",
    };
  }

  if (variant === "chapter") {
    const chapterLines = prompt
      .split(/\r?\n/)
      .map((line) => cleanCopy(line))
      .filter((line) => Boolean(line))
      .filter((line) => !isMetaLine(line))
      .filter((line) => !isDirectiveCopyLine(line))
      .filter((line) => !/^(section|chapter|part|scene)\b/i.test(line));
    const chapterHeadline = chapterLines[0] ? sentenceCase(truncateCopy(chapterLines[0], 72)) : undefined;
    const chapterSubheadline = chapterLines.find((line) => line !== chapterLines[0]) ? sentenceCase(truncateCopy(chapterLines.find((line) => line !== chapterLines[0])!, 120)) : undefined;
    return {
      headline: headlineLabel ?? chapterHeadline ?? narrative.headline ?? inferHeadline(prompt, variant),
      subheadline: subheadlineLabel ?? chapterSubheadline ?? narrative.subheadline,
      kicker: kickerLabel ?? parseLabeledValue(prompt, ["chapter label", "section label", "eyebrow"]) ?? "Next Story",
      sectionNumber: sectionNumber ?? "01",
    };
  }

  const headline = headlineLabel ?? quoted[0] ?? narrative.headline ?? inferHeadline(prompt, variant);
  return {headline, subheadline: subheadlineLabel ?? quoted[1] ?? narrative.subheadline ?? inferSubheadline(prompt, headline), kicker: kickerLabel, iconType};
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
  if (!(start < peak && peak < end)) {
    return;
  }

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
  if (iconType === "rocket" || strokeTypes.has(iconType)) {
    animations.push({start: 0, end: Math.min(0.8, duration * 0.38), property: "draw", from: 0, to: 1, easing: "easeInOut"});
  }
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

const buildHeroElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number, prompt: string): AnimatedElement[] => {
  const landscape = spec.format === "landscape";
  const portrait = spec.format === "portrait";
  const motion = inferMotionProfile(prompt);
  const fontFamily = pickFontFamily(prompt);
  const headlineLines = wrapText(payload.headline, landscape ? 17 : portrait ? 11 : 13, 3);
  const subLines = payload.subheadline ? wrapText(payload.subheadline, landscape ? 28 : portrait ? 18 : 22, portrait ? 3 : 2) : [];
  const baseX = landscape ? 176 : portrait ? 122 : 128;
  const blockWidth = landscape ? Math.round(spec.width * 0.46) : portrait ? Math.round(spec.width * 0.66) : Math.round(spec.width * 0.62);
  const headlineFontSize = fitFontSize(
    headlineLines,
    blockWidth,
    landscape ? 92 : portrait ? 78 : 84,
    landscape ? 74 : portrait ? 54 : 62,
    0.76,
    -2.8,
  );
  const subFontSize = landscape ? 30 : portrait ? 24 : 30;
  const topY = landscape ? 292 : portrait ? 450 : 300;
  const lineHeight = 0.9;
  const glowSize = landscape ? 540 : portrait ? 520 : 560;
  const secondaryText = getSecondaryTextColor(spec.background);
  const headlineHeight = headlineLines.length * headlineFontSize * lineHeight + 30;
  const subY = topY + headlineHeight + 56;
  const subHeight = subLines.length > 0 ? subLines.length * subFontSize * 1.16 + 24 : 0;
  const frameHeight = headlineHeight + subHeight + (subLines.length > 0 ? 168 : 132);
  const frameWidth = landscape ? Math.round(spec.width * 0.62) : portrait ? Math.round(spec.width * 0.76) : Math.round(spec.width * 0.72);
  const frameX = baseX - 56;
  const frameY = topY - 84;
  const accentBlockWidth = landscape ? Math.min(420, Math.round(blockWidth * 0.56)) : portrait ? Math.min(360, Math.round(blockWidth * 0.7)) : Math.min(380, Math.round(blockWidth * 0.62));
  const accentBlockHeight = Math.round(headlineFontSize * 1.85);
  const accentBlockX = baseX - 22;
  const accentBlockY = topY - Math.round(headlineFontSize * 0.42);
  const sweepWidth = landscape ? 360 : portrait ? 260 : 300;
  const sweepX = baseX + (landscape ? 18 : 6);
  const sweepY = topY + headlineHeight - Math.round(headlineFontSize * 0.18);
  const glowAnimations: AnimationKeyframe[] = [
    {start: 0, end: Math.min(0.7, duration * 0.24), property: "opacity", from: 0, to: 0.16, easing: "easeOut"},
    {start: 0, end: Math.min(0.8, duration * 0.3), property: "scale", from: 0.72, to: 1, easing: "spring"},
  ];
  if (duration > 3) {
    glowAnimations.push(
      {start: 1.1, end: Math.min(duration - 0.8, 2.3), property: "scale", from: 1, to: motion === "minimal" ? 1.02 : 1.08, easing: "easeInOut"},
      {start: Math.min(duration - 0.8, 2.3), end: Math.min(duration - 0.2, 3.1), property: "scale", from: motion === "minimal" ? 1.02 : 1.08, to: 1, easing: "easeInOut"},
    );
    appendMirrorAnimation(
      glowAnimations,
      "translateY",
      Math.min(1.35, duration * 0.34),
      Math.min(2.18, duration * 0.52),
      Math.min(duration - 0.18, 3.26),
      0,
      motion === "minimal" ? -8 : -14,
      "easeInOut",
    );
  }

  const sweepAnimations: AnimationKeyframe[] = [
    {start: 0.18, end: Math.min(0.78, duration * 0.34), property: "opacity", from: 0, to: 0.2, easing: "easeOut"},
    {start: 0.18, end: Math.min(0.78, duration * 0.34), property: "translateX", from: -28, to: 34, easing: "easeInOut"},
  ];
  appendMirrorAnimation(
    sweepAnimations,
    "translateX",
    Math.min(1.4, duration * 0.34),
    Math.min(2.28, duration * 0.54),
    Math.min(duration - 0.18, 3.34),
    18,
    landscape ? 84 : 62,
    "easeInOut",
  );
  appendMirrorAnimation(
    sweepAnimations,
    "opacity",
    Math.min(1.4, duration * 0.34),
    Math.min(2.28, duration * 0.54),
    Math.min(duration - 0.18, 3.34),
    0.16,
    0.28,
    "easeInOut",
  );

  const headlineAnimations: AnimationKeyframe[] = [
    {start: 0, end: Math.min(0.88, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"},
    {start: 0, end: Math.min(0.88, duration * 0.34), property: "translateY", from: 36, to: 0, easing: "spring"},
    {start: 0, end: Math.min(0.88, duration * 0.34), property: "scale", from: 0.965, to: 1, easing: "easeOut"},
  ];
  appendMirrorAnimation(
    headlineAnimations,
    "translateY",
    Math.min(1.32, duration * 0.32),
    Math.min(2.12, duration * 0.5),
    Math.min(duration - 0.2, 3.18),
    0,
    -10,
    "easeInOut",
  );
  appendMirrorAnimation(
    headlineAnimations,
    "scale",
    Math.min(1.32, duration * 0.32),
    Math.min(2.12, duration * 0.5),
    Math.min(duration - 0.2, 3.18),
    1,
    1.018,
    "easeInOut",
  );

  const elements: AnimatedElement[] = [
    buildPanelElement({id: "hero-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: textColor, cornerRadius: 52, opacity: 0, animations: [{start: 0, end: Math.min(0.52, duration * 0.24), property: "opacity", from: 0, to: 0.075, easing: "easeOut"}, {start: 0, end: Math.min(0.52, duration * 0.24), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "hero-rail", layer: "foreground", x: frameX + 22, y: frameY + 26, width: 12, height: Math.max(180, frameHeight - 52), fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.04, end: Math.min(0.4, duration * 0.18), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.04, end: Math.min(0.4, duration * 0.18), property: "scale", from: 0.2, to: 1, easing: "spring"}]}),
    {id: "text-glow", type: "glow", layer: "background", x: landscape ? baseX - 160 : portrait ? baseX - 120 : baseX - 110, y: landscape ? topY - 130 : portrait ? topY - 150 : topY - 110, width: glowSize, height: glowSize, fill: accent, glowColor: accent, glowStrength: 0.72, opacity: 0, animations: glowAnimations},
    buildPanelElement({id: "hero-accent-block", layer: "background", x: accentBlockX, y: accentBlockY, width: accentBlockWidth, height: accentBlockHeight, fill: accent, stroke: accent, strokeWidth: 2, cornerRadius: 34, opacity: 0, animations: [{start: 0.06, end: Math.min(0.48, duration * 0.22), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}, {start: 0.06, end: Math.min(0.48, duration * 0.22), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "headline-sweep", layer: "background", x: sweepX, y: sweepY, width: sweepWidth, height: Math.max(20, Math.round(headlineFontSize * 0.2)), fill: accent, cornerRadius: 999, opacity: 0, animations: sweepAnimations}),
    buildTextElement({id: "headline", layer: "main", x: baseX, y: topY, width: blockWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineFontSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2.8, lineHeight, opacity: 0, animations: headlineAnimations}),
  ];

  if (payload.kicker) {
    elements.unshift(buildPanelElement({id: "kicker-bg", layer: "foreground", x: baseX, y: topY - 90, width: Math.min(Math.max(payload.kicker.length * 16 + 42, 164), 300), height: 40, fill: accent, stroke: accent, strokeWidth: 2, cornerRadius: 999, opacity: 0, animations: [{start: 0, end: Math.min(0.32, duration * 0.16), property: "opacity", from: 0, to: 0.18, easing: "easeOut"}, {start: 0, end: Math.min(0.32, duration * 0.16), property: "scale", from: 0.86, to: 1, easing: "spring"}]}));
    elements.unshift(buildTextElement({id: "kicker", layer: "foreground", x: baseX + 20, y: topY - 84, width: 300, height: 28, fill: accent, text: payload.kicker.toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.4, lineHeight: 1, opacity: 0, animations: [{start: 0.02, end: Math.min(0.34, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.02, end: Math.min(0.34, duration * 0.18), property: "translateY", from: 12, to: 0, easing: "easeOut"}]}));
  }

  if (subLines.length > 0) {
    const subheadlineAnimations: AnimationKeyframe[] = [
      {start: 0.2, end: Math.min(1.18, duration * 0.48), property: "opacity", from: 0, to: 0.92, easing: "easeOut"},
      {start: 0.2, end: Math.min(1.18, duration * 0.48), property: "translateY", from: 20, to: 0, easing: "easeOut"},
    ];
    appendMirrorAnimation(
      subheadlineAnimations,
      "translateY",
      Math.min(1.54, duration * 0.38),
      Math.min(2.42, duration * 0.58),
      Math.min(duration - 0.14, 3.38),
      0,
      -8,
      "easeInOut",
    );
    elements.push(buildPanelElement({id: "accent-line", layer: "foreground", x: baseX, y: subY - 28, width: landscape ? 180 : portrait ? 144 : 156, height: 7, fill: accent, opacity: 0, cornerRadius: 999, animations: [{start: 0.14, end: Math.min(0.52, duration * 0.24), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.14, end: Math.min(0.52, duration * 0.24), property: "scale", from: 0.4, to: 1, easing: "spring"}]}));
    elements.push(buildTextElement({id: "subheadline", layer: "foreground", x: baseX, y: subY, width: blockWidth, height: subHeight, fill: secondaryText, text: subLines.join("\n"), fontSize: subFontSize, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.35, lineHeight: 1.16, opacity: 0, animations: subheadlineAnimations}));
  }

  return elements;
};

const buildKineticElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number, prompt: string): AnimatedElement[] => {
  const fontFamily = pickFontFamily(prompt);
  const secondaryText = getSecondaryTextColor(spec.background);
  const portrait = spec.format === "portrait";
  const lines = wrapText(payload.headline, portrait ? 12 : 16, 5);
  const blockWidth = portrait ? Math.round(spec.width * 0.76) : Math.round(spec.width * 0.74);
  const fontSize = fitFontSize(
    lines.map((line) => line.toUpperCase()),
    blockWidth - 24,
    portrait ? 94 : spec.format === "landscape" ? 84 : 92,
    portrait ? 62 : spec.format === "landscape" ? 64 : 68,
    0.82,
    1.1,
  );
  const lineGap = Math.round(fontSize * 0.92);
  const startY = Math.round((spec.height - lines.length * lineGap) / 2);
  const elements: AnimatedElement[] = [
    buildPanelElement({id: "kinetic-rail", layer: "background", x: Math.round(spec.width * 0.06), y: startY - 36, width: 10, height: lines.length * lineGap + 84, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0, end: Math.min(0.48, duration * 0.24), property: "opacity", from: 0, to: 0.2, easing: "easeOut"}, {start: 0, end: Math.min(0.48, duration * 0.24), property: "scale", from: 0.2, to: 1, easing: "spring"}]}),
  ];

  lines.forEach((line, index) => {
    const width = Math.min(blockWidth, Math.round(line.length * fontSize * 0.74) + 56);
    const align = portrait ? "center" : index % 2 === 0 ? "left" : "right";
    const x = align === "center"
      ? Math.round((spec.width - width) / 2)
      : align === "left"
        ? Math.round(spec.width * 0.1)
        : Math.max(Math.round(spec.width * 0.1), spec.width - width - Math.round(spec.width * 0.1));
    const y = startY + index * lineGap;
    const lineColor = index === 1 || index === lines.length - 1 ? accent : textColor;
    const panelColor = index === 1 || index === lines.length - 1 ? accent : textColor;
    const panelOpacity = index === 1 || index === lines.length - 1 ? 0.16 : 0.08;
    const start = 0.12 + index * (portrait ? 0.2 : 0.24);
    const end = Math.min(start + 0.64, duration * 0.82);
    const panelAnimations: AnimationKeyframe[] = [
      {start, end: Math.min(end - 0.06, end), property: "opacity", from: 0, to: panelOpacity, easing: "easeOut"},
      {start, end: Math.min(end - 0.06, end), property: "scale", from: 0.92, to: 1, easing: "spring"},
    ];
    const lineAnimations: AnimationKeyframe[] = [
      {start, end, property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start, end, property: "translateY", from: 34, to: 0, easing: "spring"},
      {start, end, property: "translateX", from: align === "center" ? 0 : align === "left" ? -34 : 34, to: 0, easing: "easeOut"},
      {start, end, property: "scale", from: 0.94, to: 1, easing: "easeOut"},
    ];
    appendMirrorAnimation(
      panelAnimations,
      "translateX",
      Math.min(start + 1.18, duration * 0.42),
      Math.min(start + 1.82, duration * 0.6),
      Math.min(duration - 0.16, start + 2.54),
      0,
      align === "center" ? 0 : align === "left" ? 16 : -16,
      "easeInOut",
    );
    appendMirrorAnimation(
      lineAnimations,
      "translateY",
      Math.min(start + 1.08, duration * 0.4),
      Math.min(start + 1.74, duration * 0.58),
      Math.min(duration - 0.16, start + 2.46),
      0,
      -10,
      "easeInOut",
    );
    appendMirrorAnimation(
      lineAnimations,
      "scale",
      Math.min(start + 1.08, duration * 0.4),
      Math.min(start + 1.74, duration * 0.58),
      Math.min(duration - 0.16, start + 2.46),
      1,
      1.016,
      "easeInOut",
    );
    elements.push(buildPanelElement({id: `line-panel-${index}`, layer: "background", x: x - 18, y: y - 18, width: width + 36, height: fontSize + 34, fill: panelColor, cornerRadius: 30, opacity: 0, animations: panelAnimations}));
    elements.push(buildTextElement({id: `line-text-${index}`, layer: "main", x, y, width, height: fontSize + 18, fill: lineColor, text: line.toUpperCase(), fontSize, fontWeight: 900, fontFamily, textAlign: align, letterSpacing: 1.1, lineHeight: 0.96, opacity: 0, animations: lineAnimations}));
  });

  if (payload.subheadline) {
    const subLines = wrapText(payload.subheadline, spec.format === "portrait" ? 28 : 36, 2);
    const subStart = Math.min(0.48 + lines.length * (portrait ? 0.18 : 0.22), duration * 0.62);
    const subEnd = Math.min(subStart + 0.9, duration * 0.88);
    const subAnimations: AnimationKeyframe[] = [
      {start: subStart, end: subEnd, property: "opacity", from: 0, to: 0.9, easing: "easeOut"},
      {start: subStart, end: subEnd, property: "translateY", from: 18, to: 0, easing: "easeOut"},
    ];
    appendMirrorAnimation(
      subAnimations,
      "translateY",
      Math.min(subStart + 0.9, duration * 0.56),
      Math.min(subStart + 1.46, duration * 0.72),
      Math.min(duration - 0.12, subStart + 2.18),
      0,
      -6,
      "easeInOut",
    );
    elements.push(buildTextElement({id: "kinetic-subheadline", layer: "foreground", x: Math.round(spec.width * 0.1), y: startY + lines.length * lineGap + 34, width: Math.round(spec.width * 0.8), height: subLines.length * 36 * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: 34, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "center", letterSpacing: -0.2, lineHeight: 1.16, opacity: 0, animations: subAnimations}));
  }

  return elements;
};

const buildQuoteElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number, prompt: string): AnimatedElement[] => {
  const fontFamily = pickFontFamily(prompt);
  const portrait = spec.format === "portrait";
  const quoteLines = wrapText(payload.headline, portrait ? 11 : 20, portrait ? 5 : 4);
  const blockWidth = portrait ? Math.round(spec.width * 0.58) : Math.round(spec.width * 0.52);
  const quoteFontSize = fitFontSize(quoteLines, blockWidth, portrait ? 42 : 62, portrait ? 28 : 46, 0.96, -1.1);
  const baseX = spec.format === "portrait" ? Math.round(spec.width * 0.14) : Math.round(spec.width * 0.2);
  const baseY = spec.format === "portrait" ? Math.round(spec.height * 0.26) : Math.round(spec.height * 0.24);
  const elements: AnimatedElement[] = [
    buildPanelElement({id: "quote-card", layer: "background", x: baseX - 44, y: baseY - 56, width: blockWidth + 112, height: quoteLines.length * quoteFontSize * 1.02 + 160, fill: textColor, cornerRadius: 42, opacity: 0, animations: [{start: 0, end: Math.min(0.46, duration * 0.2), property: "opacity", from: 0, to: 0.06, easing: "easeOut"}, {start: 0, end: Math.min(0.46, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "quote-line", layer: "foreground", x: baseX - 28, y: baseY + 10, width: 10, height: quoteLines.length * quoteFontSize * 0.95 + 36, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.18), property: "scale", from: 0.2, to: 1, easing: "spring"}]}),
    buildTextElement({id: "quote-mark", layer: "background", x: baseX - 8, y: baseY - 130, width: 180, height: 180, fill: accent, text: "\u201c", fontSize: 180, fontWeight: 900, fontFamily: "Georgia, 'Times New Roman', serif", textAlign: "left", lineHeight: 1, opacity: 0, animations: [{start: 0, end: Math.min(0.5, duration * 0.2), property: "opacity", from: 0, to: 0.22, easing: "easeOut"}, {start: 0, end: Math.min(0.5, duration * 0.2), property: "translateY", from: 28, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "quote-body", layer: "main", x: baseX, y: baseY, width: blockWidth, height: quoteLines.length * quoteFontSize * 1.02 + 20, fill: textColor, text: quoteLines.join("\n"), fontSize: quoteFontSize, fontWeight: 700, fontFamily, textAlign: "left", letterSpacing: -1.1, lineHeight: 1.02, opacity: 0, animations: [{start: 0.08, end: Math.min(0.9, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.9, duration * 0.34), property: "translateY", from: 36, to: 0, easing: "spring"}]}),
  ];
  const metaCopy = payload.attribution ?? payload.subheadline;
  if (metaCopy) {
    const metaY = baseY + quoteLines.length * quoteFontSize * 1.02 + (portrait ? 30 : 42);
    elements.push(buildPanelElement({id: "quote-attribution-line", layer: "foreground", x: baseX, y: metaY - 24, width: Math.min(148, Math.max(96, metaCopy.length * 8)), height: 5, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.24, end: Math.min(0.86, duration * 0.34), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.24, end: Math.min(0.86, duration * 0.34), property: "scale", from: 0.4, to: 1, easing: "spring"}]}));
    elements.push(buildTextElement({id: "quote-attribution", layer: "foreground", x: baseX, y: metaY, width: blockWidth, height: 42, fill: accent, text: metaCopy.toUpperCase(), fontSize: 26, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.4, lineHeight: 1, opacity: 0, animations: [{start: 0.28, end: Math.min(1.15, duration * 0.48), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.28, end: Math.min(1.15, duration * 0.48), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}));
  }
  return elements;
};

const buildStatElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number): AnimatedElement[] => {
  const secondaryText = getSecondaryTextColor(spec.background);
  const portrait = spec.format === "portrait";
  const topX = Math.round(spec.width * 0.12);
  const cardWidth = spec.format === "landscape" ? Math.round(spec.width * 0.76) : Math.round(spec.width * 0.78);
  const cardHeight = portrait ? 560 : 440;
  const cardY = Math.round((spec.height - cardHeight) / 2);
  const iconSize = portrait ? 156 : 132;
  const valueFontSize = portrait ? 138 : 132;
  const headlineSize = portrait ? 44 : 40;
  const valueWidth = cardWidth - 72 - (payload.iconType ? iconSize + 18 : 0);
  const headlineY = cardY + 92 + valueFontSize + 112;
  const elements: AnimatedElement[] = [
    buildPanelElement({id: "stat-card", layer: "background", x: topX, y: cardY, width: cardWidth, height: cardHeight, fill: textColor, cornerRadius: 36, opacity: 0, animations: [{start: 0, end: Math.min(0.42, duration * 0.18), property: "opacity", from: 0, to: 0.08, easing: "easeOut"}, {start: 0, end: Math.min(0.42, duration * 0.18), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "stat-accent-bar", layer: "foreground", x: topX + 36, y: cardY + 36, width: 120, height: 10, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.06, end: Math.min(0.46, duration * 0.22), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0.06, end: Math.min(0.46, duration * 0.22), property: "scale", from: 0.5, to: 1, easing: "spring"}]}),
    buildTextElement({id: "stat-value", layer: "main", x: topX + 36, y: cardY + 92, width: valueWidth, height: valueFontSize + 28, fill: textColor, text: payload.value ?? "42%", fontSize: valueFontSize, fontWeight: 900, fontFamily: "'Arial Black', 'Segoe UI', sans-serif", textAlign: "left", letterSpacing: -3, lineHeight: 0.92, opacity: 0, animations: [{start: 0.08, end: Math.min(0.72, duration * 0.34), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.72, duration * 0.34), property: "translateY", from: 34, to: 0, easing: "spring"}, {start: 0.08, end: Math.min(0.72, duration * 0.34), property: "scale", from: 0.92, to: 1, easing: "easeOut"}]}),
    buildTextElement({id: "stat-headline", layer: "foreground", x: topX + 36, y: headlineY, width: valueWidth, height: headlineSize + 18, fill: accent, text: payload.headline, fontSize: headlineSize, fontWeight: 800, fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", textAlign: "left", letterSpacing: -1, lineHeight: 1, opacity: 0, animations: [{start: 0.22, end: Math.min(1.0, duration * 0.44), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.22, end: Math.min(1.0, duration * 0.44), property: "translateY", from: 18, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "stat-label", layer: "foreground", x: topX + 36, y: cardY + cardHeight - 84, width: cardWidth - 72 - iconSize, height: 44, fill: secondaryText, text: (payload.label ?? "Conversion Lift").toUpperCase(), fontSize: 28, fontWeight: 700, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.2, lineHeight: 1, opacity: 0, animations: [{start: 0.28, end: Math.min(1.14, duration * 0.52), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.28, end: Math.min(1.14, duration * 0.52), property: "translateY", from: 14, to: 0, easing: "easeOut"}]}),
  ];
  if (payload.subheadline) elements.push(buildTextElement({id: "stat-subheadline", layer: "foreground", x: topX + 36, y: headlineY + headlineSize + 34, width: valueWidth, height: 88, fill: secondaryText, text: wrapText(payload.subheadline, portrait ? 24 : 34, portrait ? 3 : 2).join("\n"), fontSize: portrait ? 24 : 28, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.3, lineHeight: 1.15, opacity: 0, animations: [{start: 0.3, end: Math.min(1.2, duration * 0.56), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.3, end: Math.min(1.2, duration * 0.56), property: "translateY", from: 16, to: 0, easing: "easeOut"}]}));
  if (payload.iconType) elements.push(buildIconElement("stat-icon", payload.iconType, topX + cardWidth - iconSize - 42, cardY + cardHeight - iconSize - 42, iconSize, accent, duration));
  return elements;
};

const buildListElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number): AnimatedElement[] => {
  const items = (payload.items ?? []).slice(0, 4);
  const secondaryText = getSecondaryTextColor(spec.background);
  const left = Math.round(spec.width * 0.12);
  const top = spec.format === "portrait" ? Math.round(spec.height * 0.18) : Math.round(spec.height * 0.2);
  const headlineSize = spec.format === "portrait" ? 86 : 76;
  const itemHeight = spec.format === "portrait" ? 146 : 120;
  const width = Math.round(spec.width * 0.76);
  const elements: AnimatedElement[] = [buildTextElement({id: "list-headline", layer: "main", x: left, y: top, width, height: headlineSize + 24, fill: textColor, text: payload.headline, fontSize: headlineSize, fontWeight: 900, fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", textAlign: "left", letterSpacing: -2, lineHeight: 0.95, opacity: 0, animations: [{start: 0, end: Math.min(0.68, duration * 0.3), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0, end: Math.min(0.68, duration * 0.3), property: "translateY", from: 32, to: 0, easing: "spring"}]})];
  if (payload.kicker) elements.push(buildTextElement({id: "list-kicker", layer: "foreground", x: left, y: top - 54, width, height: 28, fill: accent, text: payload.kicker.toUpperCase(), fontSize: 24, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.4, lineHeight: 1, opacity: 0, animations: [{start: 0, end: Math.min(0.34, duration * 0.16), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0, end: Math.min(0.34, duration * 0.16), property: "translateY", from: 12, to: 0, easing: "easeOut"}]}));
  items.forEach((item, index) => {
    const y = top + headlineSize + 34 + index * itemHeight;
    const start = 0.16 + index * 0.16;
    const end = Math.min(start + 0.56, duration * 0.72);
    elements.push(buildPanelElement({id: `list-card-${index}`, layer: "background", x: left, y, width, height: itemHeight - 18, fill: textColor, cornerRadius: 28, opacity: 0, animations: [{start, end: Math.min(end - 0.08, end), property: "opacity", from: 0, to: 0.07, easing: "easeOut"}, {start, end: Math.min(end - 0.08, end), property: "translateX", from: -24, to: 0, easing: "easeOut"}]}));
    elements.push(buildPanelElement({id: `list-dot-${index}`, layer: "foreground", x: left + 28, y: y + 34, width: 28, height: 28, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start, end: Math.min(end - 0.04, end), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start, end: Math.min(end - 0.04, end), property: "scale", from: 0.3, to: 1, easing: "spring"}]}));
    elements.push(buildTextElement({id: `list-text-${index}`, layer: "foreground", x: left + 76, y: y + 28, width: width - 104, height: itemHeight - 30, fill: index === 0 ? textColor : secondaryText, text: wrapText(item, spec.format === "portrait" ? 26 : 36, 2).join("\n"), fontSize: spec.format === "portrait" ? 36 : 34, fontWeight: index === 0 ? 800 : 700, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.4, lineHeight: 1.14, opacity: 0, animations: [{start, end, property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start, end, property: "translateY", from: 18, to: 0, easing: "easeOut"}]}));
  });
  return elements;
};

const buildIconCalloutElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number): AnimatedElement[] => {
  const secondaryText = getSecondaryTextColor(spec.background);
  const landscape = spec.format === "landscape";
  const stacked = !landscape;
  const portrait = spec.format === "portrait";
  const fontFamily = pickFontFamily(payload.headline);
  const cardX = Math.round(spec.width * 0.1);
  const cardY = landscape ? Math.round(spec.height * 0.18) : Math.round(spec.height * 0.17);
  const cardWidth = spec.format === "portrait" ? Math.round(spec.width * 0.78) : Math.round(spec.width * 0.76);
  const cardHeight = landscape ? Math.round(spec.height * 0.62) : spec.format === "portrait" ? Math.round(spec.height * 0.44) : Math.round(spec.height * 0.56);
  const iconSize = landscape ? 210 : portrait ? 154 : 170;
  const iconX = landscape ? cardX + 42 : cardX + Math.round((cardWidth - iconSize) / 2);
  const iconY = landscape ? cardY + 58 : cardY + 54;
  const textX = landscape ? iconX + iconSize + 56 : cardX + 54;
  const textY = landscape ? cardY + 84 : iconY + iconSize + 96;
  const textWidth = landscape ? cardWidth - (textX - cardX) - 56 : cardWidth - 108;
  const headlineLines = wrapText(payload.headline, landscape ? 16 : portrait ? 12 : 14, 3);
  const headlineSize = fitFontSize(headlineLines, textWidth, landscape ? 62 : portrait ? 44 : 48, landscape ? 48 : portrait ? 32 : 34, 0.72, -1.8);
  const subLines = payload.subheadline ? wrapText(payload.subheadline, landscape ? 28 : portrait ? 18 : 20, landscape ? 2 : portrait ? 4 : 3) : [];
  const headlineAlign = landscape ? "left" : "center";
  const subAlign = headlineAlign;
  const highlightWidth = Math.min(textWidth * (landscape ? 0.8 : 0.68), landscape ? 320 : 280);
  const highlightX = landscape ? textX - 10 : textX + Math.round((textWidth - highlightWidth) / 2);

  if (stacked) {
    const contentX = cardX + 52;
    const contentWidth = cardWidth - 104;
    const badgeSize = portrait ? 182 : 190;
    const badgeX = cardX + 52;
    const badgeY = cardY + 58;
    const iconBadgeInset = portrait ? 34 : 30;
    const badgeIconSize = badgeSize - iconBadgeInset * 2;
    const badgeIconX = badgeX + iconBadgeInset;
    const badgeIconY = badgeY + iconBadgeInset;
    const kickerY = badgeY + badgeSize + 36;
    const heroHeadlineLines = wrapText(payload.headline, portrait ? 11 : 12, 3);
    const heroHeadlineSize = fitFontSize(heroHeadlineLines, contentWidth, portrait ? 60 : 64, portrait ? 40 : 42, 0.74, -2.2);
    const heroSubLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 19 : 22, portrait ? 3 : 3) : [];
    const heroSubSize = portrait ? 24 : 26;
    const headlineY = kickerY + 26;
    const headlineHeight = heroHeadlineLines.length * heroHeadlineSize * 0.94 + 22;
    const subY = headlineY + headlineHeight + 34;

    const stackedElements: AnimatedElement[] = [
      buildPanelElement({id: "callout-card", layer: "background", x: cardX, y: cardY, width: cardWidth, height: cardHeight, fill: textColor, cornerRadius: 42, opacity: 0, animations: [{start: 0, end: Math.min(0.46, duration * 0.2), property: "opacity", from: 0, to: 0.08, easing: "easeOut"}, {start: 0, end: Math.min(0.46, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
      {id: "callout-aura", type: "glow", layer: "background", x: badgeX - 44, y: badgeY - 44, width: badgeSize + 88, height: badgeSize + 88, fill: accent, glowColor: accent, glowStrength: 0.72, opacity: 0, animations: [{start: 0.02, end: Math.min(0.54, duration * 0.24), property: "opacity", from: 0, to: 0.16, easing: "easeOut"}, {start: 0.02, end: Math.min(0.54, duration * 0.24), property: "scale", from: 0.78, to: 1, easing: "spring"}]},
      buildPanelElement({id: "callout-badge", layer: "background", x: badgeX, y: badgeY, width: badgeSize, height: badgeSize, fill: accent, stroke: accent, strokeWidth: 2, cornerRadius: 36, opacity: 0, animations: [{start: 0.04, end: Math.min(0.42, duration * 0.2), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}, {start: 0.04, end: Math.min(0.42, duration * 0.2), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
      buildPanelElement({id: "callout-badge-bar", layer: "foreground", x: badgeX + 20, y: badgeY + 20, width: badgeSize - 40, height: 10, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.08, end: Math.min(0.4, duration * 0.18), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.08, end: Math.min(0.4, duration * 0.18), property: "scale", from: 0.45, to: 1, easing: "spring"}]}),
      buildIconElement("callout-icon", payload.iconType ?? "rocket", badgeIconX, badgeIconY, badgeIconSize, accent, duration),
      buildTextElement({id: "callout-kicker", layer: "foreground", x: contentX, y: kickerY, width: contentWidth, height: 26, fill: accent, text: (payload.kicker ?? "Feature Highlight").toUpperCase(), fontSize: 22, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.6, lineHeight: 1, opacity: 0, animations: [{start: 0.12, end: Math.min(0.46, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.12, end: Math.min(0.46, duration * 0.2), property: "translateY", from: 12, to: 0, easing: "easeOut"}]}),
      buildPanelElement({id: "callout-kicker-line", layer: "foreground", x: contentX, y: kickerY + 34, width: Math.min(160, Math.max(108, ((payload.kicker ?? "Feature Highlight").length * 9))), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.14, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: 0.86, easing: "easeOut"}, {start: 0.14, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
      buildPanelElement({id: "callout-highlight", layer: "background", x: contentX + 6, y: headlineY + heroHeadlineLines.length * heroHeadlineSize * 0.94 - heroHeadlineSize * 0.22, width: Math.min(contentWidth * 0.74, portrait ? 320 : 360), height: Math.max(18, Math.round(heroHeadlineSize * 0.18)), fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.78, duration * 0.34), property: "opacity", from: 0, to: 0.18, easing: "easeOut"}, {start: 0.18, end: Math.min(0.78, duration * 0.34), property: "translateX", from: -14, to: 18, easing: "easeInOut"}]}),
      buildTextElement({id: "callout-headline", layer: "main", x: contentX, y: headlineY, width: contentWidth, height: headlineHeight, fill: textColor, text: heroHeadlineLines.join("\n"), fontSize: heroHeadlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2.2, lineHeight: 0.94, opacity: 0, animations: [{start: 0.16, end: Math.min(0.9, duration * 0.38), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.16, end: Math.min(0.9, duration * 0.38), property: "translateY", from: 24, to: 0, easing: "spring"}]}),
    ];

    if (heroSubLines.length > 0) {
      stackedElements.push(buildTextElement({id: "callout-subheadline", layer: "foreground", x: contentX, y: subY, width: contentWidth, height: heroSubLines.length * heroSubSize * 1.16 + 18, fill: secondaryText, text: heroSubLines.join("\n"), fontSize: heroSubSize, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.35, lineHeight: 1.16, opacity: 0, animations: [{start: 0.28, end: Math.min(1.16, duration * 0.52), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.28, end: Math.min(1.16, duration * 0.52), property: "translateY", from: 14, to: 0, easing: "easeOut"}]}));
    }

    return stackedElements;
  }

  const elements: AnimatedElement[] = [
    buildPanelElement({id: "callout-card", layer: "background", x: cardX, y: cardY, width: cardWidth, height: cardHeight, fill: textColor, cornerRadius: 36, opacity: 0, animations: [{start: 0, end: Math.min(0.46, duration * 0.2), property: "opacity", from: 0, to: 0.08, easing: "easeOut"}, {start: 0, end: Math.min(0.46, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "callout-accent", layer: "foreground", x: cardX + 30, y: cardY + 30, width: 112, height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.04, end: Math.min(0.36, duration * 0.18), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0.04, end: Math.min(0.36, duration * 0.18), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
    buildIconElement("callout-icon", payload.iconType ?? "rocket", iconX, iconY, iconSize, accent, duration),
    buildPanelElement({id: "callout-highlight", layer: "background", x: highlightX, y: textY + headlineLines.length * headlineSize * 0.95 - headlineSize * 0.26, width: highlightWidth, height: Math.max(16, Math.round(headlineSize * 0.18)), fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.74, duration * 0.34), property: "opacity", from: 0, to: 0.2, easing: "easeOut"}, {start: 0.18, end: Math.min(0.74, duration * 0.34), property: "translateX", from: landscape ? -26 : -6, to: landscape ? 36 : 6, easing: "easeInOut"}]}),
    buildTextElement({id: "callout-headline", layer: "main", x: textX, y: textY, width: textWidth, height: headlineLines.length * headlineSize * 0.95 + 18, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", textAlign: headlineAlign, letterSpacing: -1.8, lineHeight: 0.95, opacity: 0, animations: [{start: 0.14, end: Math.min(0.92, duration * 0.38), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.14, end: Math.min(0.92, duration * 0.38), property: "translateY", from: 26, to: 0, easing: "spring"}]}),
  ];
  if (subLines.length > 0) elements.push(buildTextElement({id: "callout-subheadline", layer: "foreground", x: textX, y: textY + headlineLines.length * headlineSize * 0.95 + 28, width: textWidth, height: subLines.length * 30 * 1.16 + 20, fill: secondaryText, text: subLines.join("\n"), fontSize: stacked ? (portrait ? 21 : 24) : 34, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: subAlign, letterSpacing: -0.4, lineHeight: 1.16, opacity: 0, animations: [{start: 0.28, end: Math.min(1.18, duration * 0.52), property: "opacity", from: 0, to: 0.92, easing: "easeOut"}, {start: 0.28, end: Math.min(1.18, duration * 0.52), property: "translateY", from: 14, to: 0, easing: "easeOut"}]}));
  if (payload.kicker) elements.push(buildTextElement({id: "callout-kicker", layer: "foreground", x: stacked ? cardX + 40 : textX, y: stacked ? iconY + iconSize + 28 : textY - 44, width: stacked ? cardWidth - 80 : textWidth, height: 24, fill: accent, text: payload.kicker.toUpperCase(), fontSize: 22, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: headlineAlign, letterSpacing: 1.4, lineHeight: 1, opacity: 0, animations: [{start: 0.08, end: Math.min(0.44, duration * 0.2), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.08, end: Math.min(0.44, duration * 0.2), property: "translateY", from: 10, to: 0, easing: "easeOut"}]}));
  return elements;
};

const buildMaskedRevealElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number, prompt: string): AnimatedElement[] => {
  const fontFamily = pickFontFamily(prompt);
  const secondaryText = getSecondaryTextColor(spec.background);
  const portrait = spec.format === "portrait";
  const landscape = spec.format === "landscape";
  const blockWidth = landscape ? Math.round(spec.width * 0.4) : portrait ? Math.round(spec.width * 0.66) : Math.round(spec.width * 0.56);
  const headlineLines = wrapText(payload.headline, portrait ? 11 : 14, 3);
  const subLines = payload.subheadline ? wrapText(payload.subheadline, portrait ? 18 : 26, portrait ? 3 : 2) : [];
  const headlineSize = fitFontSize(headlineLines, blockWidth, portrait ? 70 : landscape ? 72 : 66, portrait ? 48 : landscape ? 52 : 46, 0.78, -2.4);
  const lineHeight = 0.9;
  const headlineHeight = headlineLines.length * headlineSize * lineHeight + Math.round(headlineSize * 0.7);
  const subFontSize = portrait ? 23 : 28;
  const subLineHeight = 1.16;
  const subGap = Math.round(headlineSize * 0.7);
  const baseX = landscape ? 240 : portrait ? 140 : 172;
  const baseY = portrait ? 430 : landscape ? 300 : 320;
  const frameHeight = headlineHeight + (subLines.length > 0 ? subLines.length * subFontSize * subLineHeight + subGap + 132 : 118);
  const frameWidth = landscape ? Math.round(spec.width * 0.56) : portrait ? Math.round(spec.width * 0.74) : Math.round(spec.width * 0.68);
  const frameX = baseX - 62;
  const frameY = baseY - 88;
  const stageX = landscape ? frameX - 86 : portrait ? frameX - 44 : frameX - 54;
  const stageY = frameY + 24;
  const stageWidth = portrait ? 220 : 250;
  const stageHeight = Math.max(220, Math.round(frameHeight * 0.52));
  const accentRailX = frameX + 24;
  const accentRailY = frameY + 34;
  const accentRailHeight = Math.max(180, frameHeight - 66);
  const highlightWidth = Math.min(Math.round(blockWidth * 0.72), portrait ? 300 : 340);
  const highlightX = baseX + 12;
  const highlightY = baseY + headlineHeight - Math.round(headlineSize * 0.22);
  const slabWidth = portrait ? Math.min(300, Math.round(blockWidth * 0.72)) : Math.min(360, Math.round(blockWidth * 0.78));
  const slabHeight = Math.round(headlineSize * 1.6);
  const slabX = baseX - 20;
  const slabY = baseY - Math.round(headlineSize * 0.3);
  const subY = baseY + headlineHeight + subGap;

  const auraAnimations: AnimationKeyframe[] = [
    {start: 0.02, end: Math.min(0.56, duration * 0.24), property: "opacity", from: 0, to: 0.16, easing: "easeOut"},
    {start: 0.02, end: Math.min(0.56, duration * 0.24), property: "scale", from: 0.76, to: 1, easing: "spring"},
  ];
  appendMirrorAnimation(
    auraAnimations,
    "scale",
    Math.min(1.32, duration * 0.34),
    Math.min(2.16, duration * 0.52),
    Math.min(duration - 0.14, 3.18),
    1,
    1.08,
    "easeInOut",
  );
  appendMirrorAnimation(
    auraAnimations,
    "opacity",
    Math.min(1.32, duration * 0.34),
    Math.min(2.16, duration * 0.52),
    Math.min(duration - 0.14, 3.18),
    0.16,
    0.22,
    "easeInOut",
  );

  const wipeAnimations: AnimationKeyframe[] = [
    {start: 0.12, end: Math.min(0.72, duration * 0.34), property: "opacity", from: 0, to: 0.18, easing: "easeOut"},
    {start: 0.12, end: Math.min(0.72, duration * 0.34), property: "translateX", from: -24, to: 26, easing: "easeInOut"},
  ];
  appendMirrorAnimation(
    wipeAnimations,
    "translateX",
    Math.min(1.48, duration * 0.36),
    Math.min(2.34, duration * 0.56),
    Math.min(duration - 0.16, 3.3),
    12,
    portrait ? 54 : 70,
    "easeInOut",
  );
  appendMirrorAnimation(
    wipeAnimations,
    "opacity",
    Math.min(1.48, duration * 0.36),
    Math.min(2.34, duration * 0.56),
    Math.min(duration - 0.16, 3.3),
    0.14,
    0.26,
    "easeInOut",
  );

  const headlineAnimations: AnimationKeyframe[] = [
    {start: 0.08, end: Math.min(0.82, duration * 0.36), property: "opacity", from: 0, to: 1, easing: "easeOut"},
    {start: 0.08, end: Math.min(0.82, duration * 0.36), property: "translateY", from: 32, to: 0, easing: "spring"},
    {start: 0.08, end: Math.min(0.82, duration * 0.36), property: "scale", from: 0.96, to: 1, easing: "easeOut"},
  ];
  appendMirrorAnimation(
    headlineAnimations,
    "translateY",
    Math.min(1.28, duration * 0.32),
    Math.min(2.08, duration * 0.5),
    Math.min(duration - 0.18, 3.08),
    0,
    -10,
    "easeInOut",
  );
  appendMirrorAnimation(
    headlineAnimations,
    "scale",
    Math.min(1.28, duration * 0.32),
    Math.min(2.08, duration * 0.5),
    Math.min(duration - 0.18, 3.08),
    1,
    1.018,
    "easeInOut",
  );

  const elements: AnimatedElement[] = [
    buildPanelElement({id: "masked-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: textColor, cornerRadius: 48, opacity: 0, animations: [{start: 0, end: Math.min(0.4, duration * 0.2), property: "opacity", from: 0, to: 0.075, easing: "easeOut"}, {start: 0, end: Math.min(0.4, duration * 0.2), property: "scale", from: 0.94, to: 1, easing: "spring"}]}),
    {id: "masked-aura", type: "glow", layer: "background", x: stageX - 70, y: stageY - 54, width: stageWidth + 140, height: stageHeight + 110, fill: accent, glowColor: accent, glowStrength: 0.78, opacity: 0, animations: auraAnimations},
    buildPanelElement({id: "masked-stage", layer: "background", x: stageX, y: stageY, width: stageWidth, height: stageHeight, fill: accent, stroke: accent, strokeWidth: 2, cornerRadius: 38, opacity: 0, animations: [{start: 0.04, end: Math.min(0.44, duration * 0.2), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}, {start: 0.04, end: Math.min(0.44, duration * 0.2), property: "scale", from: 0.88, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "masked-rail", layer: "foreground", x: accentRailX, y: accentRailY, width: 12, height: accentRailHeight, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.06, end: Math.min(0.4, duration * 0.18), property: "opacity", from: 0, to: 0.9, easing: "easeOut"}, {start: 0.06, end: Math.min(0.4, duration * 0.18), property: "scale", from: 0.2, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "masked-top-bar", layer: "foreground", x: baseX, y: baseY - 34, width: portrait ? 116 : 132, height: 8, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.04, end: Math.min(0.34, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.04, end: Math.min(0.34, duration * 0.18), property: "scale", from: 0.35, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "masked-slab", layer: "background", x: slabX, y: slabY, width: slabWidth, height: slabHeight, fill: accent, cornerRadius: 30, opacity: 0, animations: [{start: 0.08, end: Math.min(0.5, duration * 0.24), property: "opacity", from: 0, to: 0.12, easing: "easeOut"}, {start: 0.08, end: Math.min(0.5, duration * 0.24), property: "scale", from: 0.9, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "masked-wipe", layer: "background", x: highlightX, y: highlightY, width: highlightWidth, height: Math.max(22, Math.round(headlineSize * 0.19)), fill: accent, cornerRadius: 999, opacity: 0, animations: wipeAnimations}),
    buildTextElement({id: "masked-headline", layer: "main", x: baseX, y: baseY, width: blockWidth, height: headlineHeight, fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2.4, lineHeight, opacity: 0, animations: headlineAnimations}),
  ];

  if (payload.kicker) {
    elements.push(buildTextElement({id: "masked-kicker", layer: "foreground", x: baseX, y: baseY - 72, width: blockWidth, height: 24, fill: accent, text: payload.kicker.toUpperCase(), fontSize: 20, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 1.8, lineHeight: 1, opacity: 0, animations: [{start: 0, end: Math.min(0.28, duration * 0.14), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0, end: Math.min(0.28, duration * 0.14), property: "translateY", from: 12, to: 0, easing: "easeOut"}]}));
  }

  if (subLines.length > 0) {
    const subAnimations: AnimationKeyframe[] = [
      {start: 0.24, end: Math.min(1.08, duration * 0.5), property: "opacity", from: 0, to: 0.92, easing: "easeOut"},
      {start: 0.24, end: Math.min(1.08, duration * 0.5), property: "translateY", from: 18, to: 0, easing: "easeOut"},
    ];
    appendMirrorAnimation(
      subAnimations,
      "translateY",
      Math.min(1.58, duration * 0.38),
      Math.min(2.44, duration * 0.58),
      Math.min(duration - 0.14, 3.42),
      0,
      -8,
      "easeInOut",
    );
    elements.push(buildPanelElement({id: "masked-sub-line", layer: "foreground", x: baseX, y: subY - 26, width: portrait ? 136 : 152, height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.18, end: Math.min(0.72, duration * 0.34), property: "opacity", from: 0, to: 0.85, easing: "easeOut"}, {start: 0.18, end: Math.min(0.72, duration * 0.34), property: "scale", from: 0.45, to: 1, easing: "spring"}]}));
    elements.push(buildTextElement({id: "masked-subheadline", layer: "foreground", x: baseX, y: subY, width: blockWidth, height: subLines.length * subFontSize * subLineHeight + 24, fill: secondaryText, text: subLines.join("\n"), fontSize: subFontSize, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.3, lineHeight: subLineHeight, opacity: 0, animations: subAnimations}));
  }

  return elements;
};

const buildChapterElements = (payload: TextPayload, spec: CanvasSpec, accent: string, textColor: string, duration: number, prompt: string): AnimatedElement[] => {
  const fontFamily = pickFontFamily(prompt);
  const secondaryText = getSecondaryTextColor(spec.background);
  const portrait = spec.format === "portrait";
  const numeralSize = portrait ? 116 : spec.format === "landscape" ? 150 : 164;
  const leftColumnX = portrait ? 40 : spec.format === "landscape" ? Math.round(spec.width * 0.1) : Math.round(spec.width * 0.12);
  const leftColumnWidth = portrait ? numeralSize : numeralSize + 48;
  const baseX = portrait ? 52 : leftColumnX + leftColumnWidth + (spec.format === "landscape" ? 48 : 36);
  const blockWidth = portrait ? spec.width - 104 : spec.format === "landscape" ? Math.round(spec.width * 0.34) : Math.round(spec.width * 0.4);
  const headlineLines = wrapText(payload.headline, spec.format === "portrait" ? 12 : 15, 3);
  const subLines = payload.subheadline ? wrapText(payload.subheadline, spec.format === "portrait" ? 24 : 30, 2) : [];
  const headlineSize = fitFontSize(headlineLines, blockWidth, portrait ? 54 : spec.format === "landscape" ? 64 : 62, portrait ? 40 : spec.format === "landscape" ? 40 : 40, 0.72, -2);
  const subFontSize = portrait ? 26 : 32;
  const subLineHeight = 1.14;
  const headlineLineHeight = 0.94;
  const baseY = portrait ? 236 : spec.format === "landscape" ? Math.round(spec.height * 0.28) : Math.round(spec.height * 0.33);
  const numeralX = leftColumnX;
  const numeralY = portrait ? 104 : baseY + 20;
  const subGap = portrait ? 52 : 34;
  const frameHeight = headlineLines.length * headlineSize * headlineLineHeight + (subLines.length > 0 ? subLines.length * subFontSize * subLineHeight + subGap + (portrait ? 128 : 130) : portrait ? 120 : 136);
  const frameX = portrait ? 28 : baseX - 36;
  const frameY = portrait ? baseY - 58 : baseY - 44;
  const frameWidth = portrait ? spec.width - 56 : Math.max(blockWidth + 84, spec.format === "landscape" ? 520 : 560);
  const sectionNumber = payload.sectionNumber ?? "01";

  const chapterNumberAnimations: AnimationKeyframe[] = [
    {start: 0, end: Math.min(0.5, duration * 0.22), property: "opacity", from: 0, to: portrait ? 0.09 : 0.12, easing: "easeOut"},
    {start: 0, end: Math.min(0.5, duration * 0.22), property: "scale", from: 0.82, to: 1, easing: "spring"},
  ];
  appendMirrorAnimation(
    chapterNumberAnimations,
    "translateY",
    Math.min(1.18, duration * 0.3),
    Math.min(2.08, duration * 0.48),
    Math.min(duration - 0.18, 3.24),
    0,
    -16,
    "easeInOut",
  );

  const chapterHeadlineAnimations: AnimationKeyframe[] = [
    {start: 0.12, end: Math.min(0.88, duration * 0.38), property: "opacity", from: 0, to: 1, easing: "easeOut"},
    {start: 0.12, end: Math.min(0.88, duration * 0.38), property: "translateY", from: 32, to: 0, easing: "spring"},
    {start: 0.12, end: Math.min(0.88, duration * 0.38), property: "scale", from: 0.96, to: 1, easing: "easeOut"},
  ];
  appendMirrorAnimation(
    chapterHeadlineAnimations,
    "translateY",
    Math.min(1.42, duration * 0.34),
    Math.min(2.28, duration * 0.54),
    Math.min(duration - 0.16, 3.26),
    0,
    -8,
    "easeInOut",
  );

  const elements: AnimatedElement[] = [
    buildTextElement({id: "chapter-number", layer: "background", x: numeralX, y: numeralY, width: numeralSize, height: numeralSize, fill: accent, text: sectionNumber, fontSize: numeralSize, fontWeight: 900, fontFamily: "'Arial Black', 'Segoe UI', sans-serif", textAlign: "left", letterSpacing: -6, lineHeight: 0.88, opacity: 0, animations: chapterNumberAnimations}),
    buildPanelElement({id: "chapter-frame", layer: "background", x: frameX, y: frameY, width: frameWidth, height: frameHeight, fill: textColor, cornerRadius: 44, opacity: 0, animations: [{start: 0.06, end: Math.min(0.46, duration * 0.22), property: "opacity", from: 0, to: 0.06, easing: "easeOut"}, {start: 0.06, end: Math.min(0.46, duration * 0.22), property: "scale", from: 0.95, to: 1, easing: "spring"}]}),
    buildPanelElement({id: "chapter-divider", layer: "foreground", x: baseX, y: baseY - 18, width: Math.min(192, Math.max(128, (payload.kicker ?? "").length * 10 + 48)), height: 6, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.08, end: Math.min(0.36, duration * 0.18), property: "opacity", from: 0, to: 0.95, easing: "easeOut"}, {start: 0.08, end: Math.min(0.36, duration * 0.18), property: "scale", from: 0.4, to: 1, easing: "spring"}]}),
    buildTextElement({id: "chapter-kicker", layer: "foreground", x: baseX, y: baseY - 56, width: blockWidth, height: 24, fill: accent, text: (payload.kicker ?? "Next Story").toUpperCase(), fontSize: 22, fontWeight: 800, fontFamily: "'Segoe UI', Arial, sans-serif", textAlign: "left", letterSpacing: 2, lineHeight: 1, opacity: 0, animations: [{start: 0.02, end: Math.min(0.3, duration * 0.15), property: "opacity", from: 0, to: 1, easing: "easeOut"}, {start: 0.02, end: Math.min(0.3, duration * 0.15), property: "translateY", from: 14, to: 0, easing: "easeOut"}]}),
    buildTextElement({id: "chapter-headline", layer: "main", x: baseX, y: baseY, width: blockWidth, height: headlineLines.length * headlineSize * headlineLineHeight + Math.round(headlineSize * 0.55), fill: textColor, text: headlineLines.join("\n"), fontSize: headlineSize, fontWeight: 900, fontFamily, textAlign: "left", letterSpacing: -2, lineHeight: headlineLineHeight, opacity: 0, animations: chapterHeadlineAnimations}),
  ];

  if (subLines.length > 0) {
    const subY = baseY + headlineLines.length * headlineSize * headlineLineHeight + subGap;
    const chapterSubAnimations: AnimationKeyframe[] = [
      {start: 0.28, end: Math.min(1.16, duration * 0.52), property: "opacity", from: 0, to: 0.92, easing: "easeOut"},
      {start: 0.28, end: Math.min(1.16, duration * 0.52), property: "translateY", from: 18, to: 0, easing: "easeOut"},
    ];
    appendMirrorAnimation(
      chapterSubAnimations,
      "translateY",
      Math.min(1.7, duration * 0.4),
      Math.min(2.52, duration * 0.6),
      Math.min(duration - 0.1, 3.46),
      0,
      -6,
      "easeInOut",
    );
    elements.push(buildTextElement({id: "chapter-subheadline", layer: "foreground", x: baseX, y: subY, width: blockWidth, height: subLines.length * subFontSize * subLineHeight + 18, fill: secondaryText, text: subLines.join("\n"), fontSize: subFontSize, fontWeight: 600, fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", textAlign: "left", letterSpacing: -0.3, lineHeight: subLineHeight, opacity: 0, animations: chapterSubAnimations}));
    elements.push(buildPanelElement({id: "chapter-bottom-line", layer: "foreground", x: baseX, y: subY + subLines.length * subFontSize * subLineHeight + 18, width: 168, height: 5, fill: accent, cornerRadius: 999, opacity: 0, animations: [{start: 0.34, end: Math.min(1.22, duration * 0.56), property: "opacity", from: 0, to: 0.85, easing: "easeOut"}, {start: 0.34, end: Math.min(1.22, duration * 0.56), property: "scale", from: 0.42, to: 1, easing: "spring"}]}));
  }

  return elements;
};

export const buildTextAnimationSpec = (request: PromptRequest): AnimationSpec => {
  const background = parseBackgroundColor(request.prompt) ?? "#0B1020";
  const canvas = getCanvas(request, background);
  const duration = clamp(parseDuration(request.prompt) ?? 4.4, 2.2, 8);
  const accent = parseAccentColor(request.prompt) ?? "#38BDF8";
  const textColor = getReadableTextColor(background);
  const variant = pickVariant(request.prompt);
  const payload = buildPayload(request.prompt, variant);

  const elements =
    variant === "kinetic"
      ? buildKineticElements(payload, canvas, accent, textColor, duration, request.prompt)
      : variant === "quote"
        ? buildQuoteElements(payload, canvas, accent, textColor, duration, request.prompt)
        : variant === "chapter"
          ? buildChapterElements(payload, canvas, accent, textColor, duration, request.prompt)
        : variant === "masked"
          ? buildMaskedRevealElements(payload, canvas, accent, textColor, duration, request.prompt)
        : variant === "stat"
          ? buildStatElements(payload, canvas, accent, textColor, duration)
          : variant === "list"
            ? buildListElements(payload, canvas, accent, textColor, duration)
            : variant === "icon-callout"
              ? buildIconCalloutElements(payload, canvas, accent, textColor, duration)
              : buildHeroElements(payload, canvas, accent, textColor, duration, request.prompt);

  return {
    id: slugify(payload.value ? `${payload.headline}-${payload.value}` : payload.headline),
    title: payload.headline,
    duration,
    fps: 30,
    loop: false,
    canvas: {width: canvas.width, height: canvas.height, background: canvas.background},
    elements,
  };
};
