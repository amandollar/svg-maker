import type {PromptRequest} from "../engine/request";
import type {ShapeType} from "../engine/types";
import {includesAny, normalizePrompt} from "./prompt-helpers";

export type PromptRoute = {
  type: ShapeType;
  confidence: number; // 0..1
  scores: Record<string, number>;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const splitPromptTokens = (normalized: string) => normalized.split(/[^a-z0-9%+$#]+/g).filter(Boolean);

const matchesPromptTerm = (normalized: string, tokens: string[], term: string) => {
  const normalizedTerm = normalizePrompt(term);
  if (!normalizedTerm) return false;
  if (/^[a-z0-9%+$#]+$/.test(normalizedTerm)) {
    return tokens.includes(normalizedTerm);
  }
  return normalized.includes(normalizedTerm);
};

type ScoredIntent = {
  type: ShapeType;
  positives: Array<{w: number; terms: string[]}>;
  negatives?: Array<{w: number; terms: string[]}>;
};

const scoreIntent = (normalized: string, tokens: string[], intent: ScoredIntent) => {
  let score = 0;

  for (const rule of intent.positives) {
    if (rule.terms.some((term) => matchesPromptTerm(normalized, tokens, term))) {
      score += rule.w;
    }
  }

  for (const rule of intent.negatives ?? []) {
    if (rule.terms.some((term) => matchesPromptTerm(normalized, tokens, term))) {
      score -= rule.w;
    }
  }

  return score;
};

const templateIdToType = (templateId: string): ShapeType | null => {
  const id = templateId.toLowerCase();
  const tokens = id.split(/[^a-z0-9]+/g).filter(Boolean);
  const has = (token: string) => tokens.includes(token) || id === token;
  const hasAny = (list: string[]) => list.some((t) => has(t));

  if (has("certificate")) return "certificate";
  if (has("rupee")) return "rupee";
  if (has("desk")) return "desk";
  if (has("globe")) return "globe";
  if (hasAny(["notifstack", "notif", "notification"])) return "notifstack";
  if (hasAny(["solar", "solarpanel", "panel"])) return "solar";
  if (has("doctor")) return "doctor";
  if (has("truck")) return "truck";
  if (has("plant")) return "plant";
  if (has("rocket")) return "rocket";

  // Common icon template ids.
  if (has("heart")) return "heart";
  if (hasAny(["check", "checkmark"])) return "checkmark";
  if (has("bell")) return "bell";
  if (has("arrow")) return "arrow";
  if (has("star")) return "star";
  if (has("pin")) return "pin";
  if (hasAny(["wifi", "wi", "fi"])) return "wifi";
  if (hasAny(["lock", "unlock"])) return "lock";
  if (has("cart")) return "cart";
  if (has("search")) return "search";
  if (has("coffee")) return "coffee";
  if (hasAny(["home", "house"])) return "home";
  if (has("battery")) return "battery";
  if (hasAny(["avatar", "profile", "user"])) return "avatar";
  if (hasAny(["gear", "cog", "settings"])) return "gear";
  if (hasAny(["plane", "send"])) return "plane";
  // Important: "microphone" contains "phone" as a substring; token matching avoids collisions.
  if (hasAny(["mic", "microphone"])) return "mic";
  if (has("download")) return "download";
  if (has("calendar")) return "calendar";
  if (has("barchart") || (has("bar") && has("chart")) || has("kpi")) return "barchart";
  if (has("trend")) return "trend";
  if (has("wallet")) return "wallet";
  if (has("trophy")) return "trophy";
  if (has("pie") || (has("pie") && has("chart"))) return "pie";
  if (hasAny(["phone", "smartphone", "mobile"])) return "phone";
  if (has("headphones")) return "headphones";
  if (has("laptop")) return "laptop";
  if (has("camera")) return "camera";
  if (has("burger")) return "burger";
  if (has("play")) return "play";
  if (hasAny(["hero", "headline", "quote", "typography", "kinetic", "masked", "text", "bullet", "steps", "list", "callout", "chapter", "interstitial", "section"])) return "text";

  return null;
};

// High-signal deterministic templates first (Phase 1 scenes + rupee + certificate).
// These are intentionally conservative: we'd rather not steal prompts for other icons.
const PRIMARY_INTENTS: ScoredIntent[] = [
  {
    type: "certificate",
    positives: [
      {w: 5, terms: ["certificate of completion", "completion certificate", "certificate scroll"]},
      {w: 4, terms: ["certificate", "award scroll", "course completion"]},
      {w: 2, terms: ["seal", "ribbon", "scroll", "unfurl"]},
    ],
  },
  {
    type: "rupee",
    positives: [
      {w: 6, terms: ["\u20b9", "inr", "rupee"]},
      {w: 4, terms: ["fintech india", "indian fintech", "upi", "payment gateway"]},
      {w: 2, terms: ["currency badge", "gold circular frame", "wealth", "investment"]},
    ],
    negatives: [{w: 4, terms: ["person at desk", "desk scene", "work scene", "workspace"]}],
  },
  {
    type: "desk",
    positives: [
      {w: 6, terms: ["person at desk"]},
      {w: 4, terms: ["desk scene", "work scene", "workspace", "productive work"]},
      {w: 2, terms: ["typing", "desk lamp", "sticky notes", "cursor blink"]},
    ],
    negatives: [{w: 3, terms: ["growing plant", "plant growing", "roots draw", "terracotta pot"]}],
  },
  {
    type: "globe",
    positives: [
      {w: 6, terms: ["globe network", "connected world", "global network"]},
      {w: 4, terms: ["globe", "global reach", "worldwide", "world map"]},
      {w: 2, terms: ["orbit ring", "pins", "connection arc", "satellite"]},
    ],
  },
  {
    type: "notifstack",
    positives: [
      {w: 6, terms: ["notification stack"]},
      {w: 4, terms: ["notification cards", "badge count", "dashboard notifications"]},
      {w: 2, terms: ["stacked cards", "badge numbers", "count up"]},
    ],
  },
  {
    type: "solar",
    positives: [
      {w: 6, terms: ["solar panel"]},
      {w: 4, terms: ["solar", "clean energy", "renewable"]},
      {w: 2, terms: ["energy bolt", "sun rays"]},
    ],
  },
  {
    type: "doctor",
    positives: [
      {w: 6, terms: ["doctor medical scene"]},
      {w: 4, terms: ["doctor", "telehealth", "health consultation", "stethoscope"]},
      {w: 2, terms: ["clipboard", "hospital"]},
    ],
  },
  {
    type: "truck",
    positives: [
      {w: 6, terms: ["delivery truck"]},
      {w: 4, terms: ["truck", "express delivery", "logistics", "shipping"]},
      {w: 2, terms: ["wheels", "road line", "cargo door"]},
    ],
  },
  {
    type: "plant",
    positives: [
      {w: 6, terms: ["growing plant", "plant growing"]},
      {w: 4, terms: ["terracotta pot", "roots draw", "stem grows", "leaves unfurl"]},
      {w: 2, terms: ["growth journey", "progress / growth"]},
    ],
    negatives: [{w: 4, terms: ["desk", "workspace", "person at desk"]}],
  },
  {
    type: "rocket",
    positives: [
      {w: 6, terms: ["rocket launch", "liftoff", "launch day"]},
      {w: 4, terms: ["rocket", "startup launch"]},
      {w: 2, terms: ["flame flicker", "particles", "stars fade in"]},
    ],
  },
];

// Secondary mapping for simpler icons (kept lightweight; normalize-spec still enforces details).
const ICON_INTENTS: Array<{type: ShapeType; terms: string[]}> = [
  {type: "heart", terms: ["heart", "like", "favorite", "love"]},
  {type: "checkmark", terms: ["check", "success", "done", "complete", "verified"]},
  {type: "bell", terms: ["bell", "notify", "notification", "alert", "subscribe"]},
  {type: "arrow", terms: ["arrow", "swipe", "cta"]},
  {type: "star", terms: ["star", "rating", "favorite", "highlight"]},
  {type: "pin", terms: ["pin", "location", "map", "marker", "place"]},
  {type: "play", terms: ["play button", "play icon", "video intro", "intro reveal"]},
  {type: "wifi", terms: ["wifi", "wi-fi", "connectivity", "signal"]},
  {type: "lock", terms: ["lock", "unlock", "security", "secure"]},
  {type: "cart", terms: ["cart", "add to cart", "checkout", "shopping"]},
  {type: "search", terms: ["search", "query", "magnifier", "magnifying"]},
  {type: "coffee", terms: ["coffee", "cappuccino", "latte", "cup"]},
  {type: "home", terms: ["home", "house", "real estate", "property"]},
  {type: "battery", terms: ["battery", "charging", "charge"]},
  {type: "avatar", terms: ["avatar", "user", "profile"]},
  {type: "gear", terms: ["settings", "gear", "cog"]},
  {type: "plane", terms: ["paper plane", "message sent", "send"]},
  {type: "mic", terms: ["microphone", "mic", "recording", "record"]},
  {type: "download", terms: ["download", "save file", "file saving"]},
  {type: "calendar", terms: ["calendar", "date", "event", "countdown"]},
  {type: "barchart", terms: ["bar chart", "barchart", "kpi", "dashboard"]},
  {type: "trend", terms: ["trending up", "growth chart", "upward trend", "trending", "trend", "stock", "upward line"]},
  {type: "wallet", terms: ["wallet", "payment", "cashflow", "payout"]},
  {type: "trophy", terms: ["trophy", "winner", "achievement", "award"]},
  {type: "pie", terms: ["pie chart", "market share", "slice"]},
  {type: "phone", terms: ["smartphone", "phone", "mobile", "app launch"]},
  {type: "headphones", terms: ["headphones", "music", "podcast"]},
  {type: "laptop", terms: ["laptop", "productivity", "work from home"]},
  {type: "camera", terms: ["camera", "dslr", "photography"]},
  {type: "burger", terms: ["burger", "food", "restaurant", "delivery"]},
];

const TEXT_INTENT: ScoredIntent = {
  type: "text",
  positives: [
    {w: 6, terms: ["kinetic typography", "text animation", "headline animation", "quote animation"]},
    {w: 5, terms: ["hero text", "title card", "masked text", "text reveal", "typewriter", "icon callout", "feature highlight", "chapter intro", "chapter break", "section marker"]},
    {w: 4, terms: ["headline", "subheadline", "tagline", "quote", "testimonial", "bullet list", "checklist", "text only", "interstitial", "chapter title"]},
    {w: 3, terms: ["words on screen", "typography", "title", "statement", "quote card", "chapter", "section"]},
  ],
};

const hasExplicitTextStructure = (prompt: string) =>
  /(?:^|\n)\s*(headline|title|main text|copy|subheadline|subtitle|supporting text|body|description|tagline|kicker|eyebrow|label|quote|author|attribution|source|items|bullets|points|features|steps|value|stat|metric|number|section|chapter|part|scene)\s*:/im.test(
    prompt,
  );

const hasQuotedText = (prompt: string) => /["\u201c\u201d][^"\u201c\u201d\n]{2,140}["\u201c\u201d]/i.test(prompt);

const isStrongTextCue = (normalized: string) =>
  includesAny(normalized, [
    "kinetic typography",
    "text animation",
    "headline animation",
    "quote animation",
    "text only",
    "words on screen",
    "title card",
    "chapter intro",
    "chapter break",
    "section marker",
    "interstitial",
  ]);

const hasMixedSceneCue = (normalized: string) =>
  includesAny(normalized, [
    "written",
    "with text",
    "with headline",
    "video intro",
    "video player",
    "player",
    "app launch",
    "add to cart",
    "query loading",
    "search result",
    "countdown",
    "kpi",
    "dashboard",
    "market share",
    "cashflow",
    "podcast",
    "recording live",
    "battery charging",
    "charging up",
    "charging",
    "energy level",
    "download",
    "save file",
    "file saving",
  ]);

export const routePromptToType = (request: PromptRequest): PromptRoute => {
  if (request.templateId) {
    const override = templateIdToType(request.templateId);
    if (override) {
      return {type: override, confidence: 1, scores: {templateId: 999}};
    }
  }

  const normalized = normalizePrompt(request.prompt);
  const tokens = splitPromptTokens(normalized);
  const scores: Record<string, number> = {};

  // Prefer deterministic templates when we have signal.
  let best: {type: ShapeType; score: number} = {type: "heart", score: Number.NEGATIVE_INFINITY};
  let second: {type: ShapeType; score: number} = {type: "heart", score: Number.NEGATIVE_INFINITY};

  for (const intent of PRIMARY_INTENTS) {
    const s = scoreIntent(normalized, tokens, intent);
    scores[intent.type] = s;
    if (s > best.score) {
      second = best;
      best = {type: intent.type, score: s};
    } else if (s > second.score) {
      second = {type: intent.type, score: s};
    }
  }

  const explicitTextStructure = hasExplicitTextStructure(request.prompt);
  const hasQuotedCopy = hasQuotedText(request.prompt);
  const strongTextCue = explicitTextStructure || hasQuotedCopy || isStrongTextCue(normalized);
  const mixedSceneCue = hasMixedSceneCue(normalized);
  const textScore = scoreIntent(normalized, tokens, TEXT_INTENT) + (hasQuotedCopy ? 2 : 0) + (explicitTextStructure ? 3 : 0);
  scores.text = textScore;

  const iconScores = ICON_INTENTS
    .map((icon) => {
      const matchedTerms = icon.terms.filter((term) => matchesPromptTerm(normalized, tokens, term));
      const score = matchedTerms.reduce((sum, term) => sum + (term.includes(" ") ? 2 : 1), 0);
      return {icon, score};
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
  const iconMatch = iconScores[0]?.icon;
  const sceneLikePrompt = mixedSceneCue || Boolean(iconMatch && best.type !== "text");

  if (best.score >= 4) {
    if (strongTextCue && textScore >= 5 && (!sceneLikePrompt || best.type === "text")) {
      const confidence = clamp01(0.52 + textScore / 12);
      return {type: "text", confidence, scores};
    }
    const margin = best.score - Math.max(0, second.score);
    const confidence = clamp01(0.35 + margin / 10 + best.score / 16);
    return {type: best.type, confidence, scores};
  }

  if (iconMatch && mixedSceneCue) {
    const primarySignal = Math.max(0, best.score, textScore - 2);
    const confidence = clamp01(0.62 + primarySignal / 12);
    return {type: iconMatch.type, confidence, scores};
  }

  if (iconMatch && !strongTextCue && textScore < 6) {
    const primarySignal = Math.max(0, best.score);
    const confidence = clamp01(0.55 + primarySignal / 10);
    return {type: iconMatch.type, confidence, scores};
  }

  if (((strongTextCue && textScore >= 4) || textScore >= 5) && !sceneLikePrompt) {
    const confidence = clamp01(0.52 + textScore / 12);
    return {type: "text", confidence, scores};
  }

  if (iconMatch) {
    const primarySignal = Math.max(0, best.score);
    const confidence = clamp01(0.55 + primarySignal / 10);
    return {type: iconMatch.type, confidence, scores};
  }

  return {type: "heart", confidence: 0.2, scores};
};
