export const normalizePrompt = (input: string): string => {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
};

export const includesAny = (input: string, needles: string[]): boolean => {
  return needles.some((needle) => input.includes(needle));
};

const colorMap = {
  red: "#FF2D55",
  pink: "#FF2D55",
  green: "#22C55E",
  blue: "#3B82F6",
  gold: "#FACC15",
  yellow: "#FACC15",
  white: "#FFFFFF",
  black: "#111111",
  navy: "#0F172A",
  orange: "#F97316",
  purple: "#8B5CF6",
  indigo: "#6366F1",
  mint: "#10B981",
} as const;

const findKnownColor = (input: string): string | undefined => {
  for (const [name, hex] of Object.entries(colorMap)) {
    // Avoid substring matches like "staggered" -> "red".
    if (new RegExp(`\\b${name}\\b`, "i").test(input)) {
      return hex;
    }
  }

  const hexMatch = input.match(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i);
  return hexMatch?.[0];
};

export const parseCanvasFormat = (prompt: string) => {
  const normalized = normalizePrompt(prompt);

  // Explicit dimension hint like "1920x1080" should win.
  // Phase 1 prompts sometimes contain encoding artifacts like "1080Ã—1080" instead of "1080x1080".
  const dimsMatch = normalized.match(/\b(\d{3,4})\s*(?:x|×|\u00d7|ã—|Ã—)\s*(\d{3,4})\b/i);
  if (dimsMatch) {
    const w = Number(dimsMatch[1]);
    const h = Number(dimsMatch[2]);
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
      if (w > h) return "landscape" as const;
      if (h > w) return "portrait" as const;
      return "square" as const;
    }
  }

  // Note: avoid matching generic "vertical" because Phase 1 prompts contain phrases like "vertical stroke".
  if (includesAny(normalized, ["portrait", "reel", "story", "9:16", "vertical video"])) {
    return "portrait" as const;
  }

  // Note: avoid matching generic "wide" because Phase 1 prompts contain phrases like "160px wide".
  // Note: avoid matching generic "horizontal" because Phase 1 prompts contain phrases like "horizontal bar".
  if (includesAny(normalized, ["landscape", "youtube", "16:9", "widescreen", "horizontal video"])) {
    return "landscape" as const;
  }

  return "square" as const;
};

const colorNames = Object.keys(colorMap).join("|");
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseColorAfterLabel = (normalized: string, label: string): string | undefined => {
  const re = new RegExp(
    `\\b${escapeRegExp(label)}\\b\\s*(?:color\\s*)?(?:is|:)?\\s*(#[0-9a-f]{3,6}|${colorNames})\\b`,
    "i",
  );
  const m = normalized.match(re);
  if (!m) return undefined;
  return findKnownColor(m[1]!.toLowerCase());
};

export const parsePrimaryFillColor = (prompt: string, type: string): string | undefined => {
  const normalized = normalizePrompt(prompt);
  const t = type.toLowerCase();

  // Prefer explicit labeled lines from Phase 1 prompts.
  if (t === "heart") {
    return (
      parseColorAfterLabel(normalized, "heart fill") ??
      parseColorAfterLabel(normalized, "heart icon fill") ??
      parseColorAfterLabel(normalized, "fill")
    );
  }

  if (t === "star") {
    return (
      parseColorAfterLabel(normalized, "star fill") ??
      parseColorAfterLabel(normalized, "fill")
    );
  }

  if (t === "pin") {
    return (
      parseColorAfterLabel(normalized, "pin fill") ??
      parseColorAfterLabel(normalized, "marker fill") ??
      parseColorAfterLabel(normalized, "fill")
    );
  }

  if (t === "battery") {
    return parseColorAfterLabel(normalized, "battery fill") ?? parseColorAfterLabel(normalized, "fill");
  }

  return undefined;
};

export const parsePrimaryStrokeColor = (prompt: string, type: string): string | undefined => {
  const normalized = normalizePrompt(prompt);
  const t = type.toLowerCase();

  if (t === "checkmark") {
    return (
      parseColorAfterLabel(normalized, "check stroke") ??
      parseColorAfterLabel(normalized, "checkmark stroke") ??
      parseColorAfterLabel(normalized, "stroke")
    );
  }

  if (t === "bell") {
    return parseColorAfterLabel(normalized, "bell stroke") ?? parseColorAfterLabel(normalized, "stroke");
  }

  if (t === "arrow") {
    return parseColorAfterLabel(normalized, "arrow stroke") ?? parseColorAfterLabel(normalized, "stroke");
  }

  if (t === "wifi") {
    return parseColorAfterLabel(normalized, "wifi stroke") ?? parseColorAfterLabel(normalized, "stroke");
  }

  if (t === "lock") {
    return parseColorAfterLabel(normalized, "lock stroke") ?? parseColorAfterLabel(normalized, "stroke");
  }

  if (t === "cart") {
    return parseColorAfterLabel(normalized, "cart stroke") ?? parseColorAfterLabel(normalized, "stroke");
  }

  if (t === "search") {
    return parseColorAfterLabel(normalized, "search stroke") ?? parseColorAfterLabel(normalized, "stroke");
  }

  if (t === "coffee") {
    // Phase 1 coffee prompt labels the cup explicitly.
    return (
      parseColorAfterLabel(normalized, "cup stroke") ??
      parseColorAfterLabel(normalized, "coffee stroke") ??
      parseColorAfterLabel(normalized, "stroke")
    );
  }

  return undefined;
};

export const parseDuration = (prompt: string): number | undefined => {
  const normalized = normalizePrompt(prompt);
  const numericMatch = normalized.match(/\b(\d+(?:\.\d+)?)\s*(s|sec|secs|second|seconds)\b/);

  if (numericMatch) {
    return Number(numericMatch[1]);
  }

  if (normalized.includes("quick")) {
    return 1.5;
  }

  if (normalized.includes("slow")) {
    return 3.5;
  }

  return undefined;
};

export const parseLoop = (prompt: string): boolean => {
  const normalized = normalizePrompt(prompt);

  const explicit = normalized.match(/\bloop\b\s*(?:is|:)?\s*(yes|no)\b/i);
  if (explicit) {
    return explicit[1]!.toLowerCase() === "yes";
  }

  if (includesAny(normalized, ["no loop", "single play", "play once", "once", "one shot"])) {
    return false;
  }

  if (includesAny(normalized, ["loop", "looping", "seamless loop"])) {
    return true;
  }

  return true;
};

export const parseBackgroundColor = (prompt: string): string | undefined => {
  const normalized = normalizePrompt(prompt);
  const phraseMatch = normalized.match(
    /\b(?:on|with|against)\s+(#[0-9a-f]{3,6}|red|pink|green|blue|gold|yellow|white|black|navy|orange|purple|indigo|mint)\s+background\b/i,
  );

  if (phraseMatch) {
    return findKnownColor(phraseMatch[1].toLowerCase());
  }

  const explicitMatch = normalized.match(/\bbackground\b\s*(?:is|:)?\s*(#[0-9a-f]{3,6})\b/i);
  if (explicitMatch) {
    return findKnownColor(explicitMatch[1].toLowerCase());
  }

  if (normalized.includes("dark background")) {
    return "#111111";
  }

  if (normalized.includes("light background")) {
    return "#F8FAFC";
  }

  return undefined;
};

export const parseAccentColor = (prompt: string): string | undefined => {
  const normalized = normalizePrompt(prompt);
  const leadingColorMatch = normalized.match(
    /\b(red|pink|green|blue|gold|yellow|white|black|navy|orange|purple|indigo|mint|#[0-9a-f]{3,6})\b(?=.*\b(heart|bell|check|checkmark|notification|success)\b)/i,
  );

  if (leadingColorMatch) {
    return findKnownColor(leadingColorMatch[1].toLowerCase());
  }

  const colorAfterWith = normalized.match(
    /\bwith\s+(#[0-9a-f]{3,6}|red|pink|green|blue|gold|yellow|white|black|navy|orange|purple|indigo|mint)\b/i,
  );

  if (colorAfterWith) {
    return findKnownColor(colorAfterWith[1].toLowerCase());
  }

  // Fallback: first recognized color in the prompt.
  // Phase 1 prompts often list `Background: #...` first; don't treat that as an accent.
  const bg = parseBackgroundColor(prompt)?.toLowerCase();
  const candidate = findKnownColor(normalized);
  if (candidate && bg && candidate.toLowerCase() === bg) {
    return undefined;
  }
  return candidate;
};

export const parseGlowColor = (prompt: string, type: string): string | undefined => {
  const normalized = normalizePrompt(prompt);
  const t = type.toLowerCase();

  // Phase 1 often uses an explicit "Glow color:" line.
  // Keep this conservative: only parse when labeled to avoid confusing it with unrelated colors.
  if (t === "heart" || t === "star" || t === "bell") {
    return (
      parseColorAfterLabel(normalized, "glow color") ??
      parseColorAfterLabel(normalized, "glow")
    );
  }

  return parseColorAfterLabel(normalized, "glow color") ?? undefined;
};

export type MotionHints = {
  glow: boolean;
  bounce: boolean;
  draw: boolean;
  swing: boolean;
  drop: boolean;
  burst: boolean;
  subtle: boolean;
  energetic: boolean;
};

export type StyleHints = {
  premium: boolean;
  soft: boolean;
  bold: boolean;
  playful: boolean;
  neon: boolean;
  editorial: boolean;
  minimal: boolean;
};

export type MotionProfile = "snappy" | "smooth" | "bouncy" | "premium" | "minimal";

export const extractMotionHints = (prompt: string): MotionHints => {
  const normalized = normalizePrompt(prompt);

  return {
    glow: includesAny(normalized, ["glow", "glowing", "soft glow", "neon"]),
    bounce: includesAny(normalized, ["bounce", "bouncy", "pop", "finish bounce"]),
    draw: includesAny(normalized, ["draw", "stroke draw", "line draw", "reveal"]),
    swing: includesAny(normalized, ["swing", "ringing", "ring", "shake"]),
    drop: includesAny(normalized, ["drop", "dropping", "fall", "pin drop"]),
    burst: includesAny(normalized, ["burst", "spark", "pop burst", "rating reveal"]),
    subtle: includesAny(normalized, ["subtle", "gentle", "elegant", "soft"]),
    energetic: includesAny(normalized, ["energetic", "bold", "strong", "dynamic"]),
  };
};

export const extractStyleHints = (prompt: string): StyleHints => {
  const normalized = normalizePrompt(prompt);

  return {
    premium: includesAny(normalized, ["premium", "luxury", "elegant", "refined"]),
    soft: includesAny(normalized, ["soft", "gentle", "romantic", "dreamy", "pastel"]),
    bold: includesAny(normalized, ["bold", "strong", "high-contrast", "loud"]),
    playful: includesAny(normalized, ["playful", "fun", "cute", "cheerful"]),
    neon: includesAny(normalized, ["neon", "glowing", "electric"]),
    editorial: includesAny(normalized, ["editorial", "poster", "graphic", "fashion"]),
    minimal: includesAny(normalized, ["minimal", "clean", "simple", "sleek"]),
  };
};

export const inferMotionProfile = (prompt: string): MotionProfile => {
  const normalized = normalizePrompt(prompt);
  const hints = extractMotionHints(prompt);
  const styles = extractStyleHints(prompt);

  if (styles.minimal || normalized.includes("minimal")) return "minimal";
  if (styles.premium || normalized.includes("premium")) return "premium";
  if (hints.bounce || hints.energetic || normalized.includes("bouncy")) return "bouncy";
  if (styles.soft || hints.subtle || normalized.includes("smooth") || normalized.includes("gentle")) return "smooth";
  return "snappy";
};
