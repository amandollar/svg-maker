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
    if (input.includes(name)) {
      return hex;
    }
  }

  const hexMatch = input.match(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i);
  return hexMatch?.[0];
};

export const parseCanvasFormat = (prompt: string) => {
  const normalized = normalizePrompt(prompt);

  if (includesAny(normalized, ["vertical", "portrait", "reel", "story", "9:16"])) {
    return "portrait" as const;
  }

  if (includesAny(normalized, ["landscape", "wide", "youtube", "16:9", "horizontal"])) {
    return "landscape" as const;
  }

  return "square" as const;
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

  return findKnownColor(normalized);
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
