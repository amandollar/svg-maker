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
  parseLoop,
  type MotionHints,
  type StyleHints,
} from "./prompt-helpers";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "generated-animation";

const inferElementType = (prompt: string): ShapeType => {
  const normalized = normalizePrompt(prompt);

  if (includesAny(normalized, ["rocket", "launch day", "startup / launch", "startup launch", "liftoff", "lift off"])) {
    return "rocket";
  }

  if (
    includesAny(normalized, [
      "rupee",
      "\u20B9",
      "inr",
      "rupee/dollar",
      "rupee dollar",
      "fintech india",
      "indian fintech",
      "payment gateway",
      "mutual fund",
      "investment platform",
      "wealth",
      "up i",
      "upi",
      "currency badge",
      "gold circular frame",
    ])
  ) {
    return "rupee";
  }

  if (
    includesAny(normalized, [
      "certificate",
      "certificate of completion",
      "award scroll",
      "course completion",
      "completion certificate",
      "certificate scroll",
      "earned your certificate",
    ])
  ) {
    return "certificate";
  }

  // Desk/work scenes often mention "plant" as a prop, so detect desk BEFORE plant.
  if (
    includesAny(normalized, [
      "person at desk",
      "desk scene",
      "work scene",
      "productive work",
      "workspace",
      "desk lamp",
      "sticky notes",
      "typing",
      "remote work",
      "work from anywhere",
    ])
  ) {
    return "desk";
  }

  // Keep plant detection focused so generic "plant" props in other scenes don't steal the prompt.
  if (includesAny(normalized, ["growing plant", "plant growing", "growth journey", "progress / growth", "roots", "terracotta pot", "stem grows", "leaves unfurl"])) {
    return "plant";
  }

  if (includesAny(normalized, ["delivery truck", "truck", "shipping", "ecommerce", "logistics", "express delivery", "order is on the way"])) {
    return "truck";
  }

  if (includesAny(normalized, ["doctor", "medical", "health consultation", "telehealth", "hospital", "stethoscope", "clipboard"])) {
    return "doctor";
  }

  if (includesAny(normalized, ["solar panel", "solar", "clean energy", "renewable", "sun rays", "energy bolt"])) {
    return "solar";
  }

  if (includesAny(normalized, ["notification stack", "notifications", "social media dashboard", "notification cards", "badge count"])) {
    return "notifstack";
  }

  if (
    includesAny(normalized, [
      "globe",
      "world map",
      "worldwide",
      "global reach",
      "global network",
      "connected world",
      "around the world",
      "across the globe",
      "international",
    ])
  ) {
    return "globe";
  }

  if (includesAny(normalized, ["bar chart", "barchart", "kpi", "bars", "chart"])) {
    return "barchart";
  }

  if (includesAny(normalized, ["trending", "trend", "growth", "stock", "upward line"])) {
    return "trend";
  }

  if (includesAny(normalized, ["wallet", "payment", "cashflow", "payout"])) {
    return "wallet";
  }

  if (includesAny(normalized, ["trophy", "winner", "achievement", "award"])) {
    return "trophy";
  }

  if (includesAny(normalized, ["pie chart", "pie", "market share", "slice"])) {
    return "pie";
  }

  if (includesAny(normalized, ["smartphone", "phone", "app launch", "mobile"])) {
    return "phone";
  }

  if (includesAny(normalized, ["headphones", "music", "podcast"])) {
    return "headphones";
  }

  if (includesAny(normalized, ["laptop", "productivity", "work from home"])) {
    return "laptop";
  }

  if (includesAny(normalized, ["camera", "dslr", "photography"])) {
    return "camera";
  }

  if (includesAny(normalized, ["burger", "food", "restaurant", "delivery"])) {
    return "burger";
  }

  if (includesAny(normalized, ["coffee", "cappuccino", "latte", "cup"])) {
    return "coffee";
  }

  if (includesAny(normalized, ["home icon", "home", "house", "property", "real estate"])) {
    return "home";
  }

  if (includesAny(normalized, ["battery", "charging", "charge"])) {
    return "battery";
  }

  if (includesAny(normalized, ["avatar", "user", "profile", "person"])) {
    return "avatar";
  }

  if (includesAny(normalized, ["settings", "gear", "cog"])) {
    return "gear";
  }

  if (includesAny(normalized, ["paper plane", "send", "message sent", "plane"])) {
    return "plane";
  }

  if (includesAny(normalized, ["microphone", "mic", "recording", "record"])) {
    return "mic";
  }

  if (includesAny(normalized, ["download", "file saving", "save file", "saving"])) {
    return "download";
  }

  if (includesAny(normalized, ["calendar", "date", "event", "countdown"])) {
    return "calendar";
  }

  if (includesAny(normalized, ["wifi", "wi-fi", "connectivity", "signal", "network"])) {
    return "wifi";
  }

  if (includesAny(normalized, ["lock", "unlock", "security", "secure"])) {
    return "lock";
  }

  if (includesAny(normalized, ["cart", "shopping", "add to cart", "checkout", "basket"])) {
    return "cart";
  }

  if (includesAny(normalized, ["search", "query", "magnifier", "magnifying"])) {
    return "search";
  }

  if (includesAny(normalized, ["pin", "location", "map", "marker", "place", "store"])) {
    return "pin";
  }

  if (includesAny(normalized, ["star", "rating", "favorite", "review", "highlight"])) {
    return "star";
  }

  if (includesAny(normalized, ["arrow", "swipe", "cta", "scroll up"])) {
    return "arrow";
  }

  if (normalized.includes("bell") || normalized.includes("notify") || normalized.includes("alert")) {
    return "bell";
  }

  if (
    normalized.includes("check") ||
    normalized.includes("success") ||
    normalized.includes("done") ||
    normalized.includes("complete") ||
    normalized.includes("verified")
  ) {
    return "checkmark";
  }

  // Avoid misclassifying playback instructions like "play once" as a play-button icon.
  if (includesAny(normalized, ["play button", "play icon", "play symbol", "video intro", "intro reveal"])) {
    return "play";
  }

  return "heart";
};

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

const getDefaultAnimations = (type: ShapeType, duration: number, hints: MotionHints) => {
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

  if (type === "mic") {
    const peak = hints.energetic ? 1.12 : 1.08;
    return [
      {start: 0, end: Math.min(0.35, duration * 0.22), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.6), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.95, duration * 0.6), end: Math.min(1.2, duration * 0.75), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(1.2, duration * 0.75), end: Math.min(1.5, duration * 0.92), property: "scale", from: peak, to: 1, easing: "easeOut"},
    ] satisfies AnimationKeyframe[];
  }

  if (type === "download") {
    return [
      {start: 0, end: Math.min(0.25, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.8, duration * 0.55), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.55, duration * 0.35), end: Math.min(1.2, duration * 0.78), property: "translateY", from: -10, to: 8, easing: "spring"},
      {start: Math.min(1.2, duration * 0.78), end: Math.min(1.55, duration * 0.95), property: "translateY", from: 8, to: 0, easing: "easeOut"},
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
    const peak = hints.energetic ? 1.09 : 1.06;
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.9, duration * 0.55), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.9, duration * 0.55), end: Math.min(1.2, duration * 0.72), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(1.2, duration * 0.72), end: Math.min(1.45, duration * 0.9), property: "scale", from: peak, to: 1, easing: "easeOut"},
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
    return [
      {start: 0, end: Math.min(0.3, duration * 0.18), property: "opacity", from: 0, to: 1, easing: "easeOut"},
      {start: 0, end: Math.min(0.95, duration * 0.55), property: "draw", from: 0, to: 1, easing: "easeInOut"},
      {start: Math.min(0.95, duration * 0.55), end: Math.min(1.2, duration * 0.72), property: "scale", from: 1, to: peak, easing: "spring"},
      {start: Math.min(1.2, duration * 0.72), end: Math.min(1.45, duration * 0.9), property: "scale", from: peak, to: 1, easing: "easeOut"},
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
    const drawEnd = Math.min(0.85, duration * 0.55);
    const bouncePeak = hints.bounce || hints.energetic ? 1.16 : 1.12;
    const flashStart = Math.min(drawEnd + 0.02, duration * 0.7);
    const flashEnd = Math.min(drawEnd + 0.22, duration * 0.86);
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
    return [
      {start: 0, end: Math.min(0.08, duration * 0.06), property: "rotate", from: 0, to: base, easing: "easeIn"},
      {start: Math.min(0.08, duration * 0.06), end: Math.min(0.2, duration * 0.14), property: "rotate", from: base, to: -base * 1.1, easing: "spring"},
      {start: Math.min(0.2, duration * 0.14), end: Math.min(0.34, duration * 0.24), property: "rotate", from: -base * 1.1, to: base * 0.75, easing: "spring"},
      {start: Math.min(0.34, duration * 0.24), end: Math.min(0.48, duration * 0.34), property: "rotate", from: base * 0.75, to: -base * 0.5, easing: "spring"},
      {start: Math.min(0.48, duration * 0.34), end: settleTime, property: "rotate", from: -base * 0.5, to: base * 0.22, easing: "spring"},
      {start: settleTime, end: endTime, property: "rotate", from: base * 0.22, to: 0, easing: "easeOut"},
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
  if (!["ring", "glow", "spark", "shadow", "steam"].includes(effectType)) {
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

  // Default: allow subtle ring/glow/shadow; never allow sparks unless star.
  return effectType === "ring" || effectType === "glow" || effectType === "shadow";
};

const buildSecondaryElements = (
  type: ShapeType,
  primary: AnimatedElement,
  accent: string | undefined,
  hints: MotionHints,
  styles: StyleHints,
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
        fill: accent ?? "#FF2D55",
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

  if (
    type === "lock" ||
    type === "cart" ||
    type === "search" ||
    type === "home" ||
    type === "avatar" ||
    type === "plane" ||
    type === "mic" ||
    type === "download" ||
    type === "calendar" ||
    type === "trend" ||
    type === "wallet" ||
    type === "trophy" ||
    type === "pie" ||
    type === "headphones" ||
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
    return {
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
    };
  }

  if (effectiveType === "bell") {
    return {
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
    };
  }

  if (effectiveType === "arrow") {
    return {
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
    };
  }

  if (effectiveType === "play") {
    return {
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
    };
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
    return {
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
    };
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

  return {
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
  };
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
  const type = inferElementType(prompt);
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
  const centeredX = isScene ? 0 : (canvas.width - size) / 2;
  const centeredY = isScene
    ? 0
    : format === "portrait" && type === "bell"
      ? Math.round(canvas.height * 0.44)
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

  const primaryElement: AnimatedElement = {
    id: `${type}-1`,
    type,
    layer: "main" as const,
    x: centeredX,
    y: centeredY,
    width: isScene ? canvas.width : size,
    height: isScene ? canvas.height : size,
    viewBoxWidth: isScene ? (format === "landscape" ? 160 : format === "portrait" ? 90 : 100) : undefined,
    viewBoxHeight: isScene ? (format === "landscape" ? 90 : format === "portrait" ? 160 : 100) : undefined,
    offsetX,
    offsetY,
    fill:
      type === "heart"
        ? accent ?? "#FF2D55"
        : type === "star"
          ? accent ?? "#FBBF24"
          : type === "pin"
            ? accent ?? "#EF4444"
            : type === "play"
              ? accent ?? "#FFFFFF"
              : type === "battery"
                ? accent ?? "#22C55E"
            : undefined,
    stroke:
      type === "heart" || type === "star"
        ? undefined
        : defaultStroke,
    strokeWidth:
      type === "heart" || type === "star"
        ? undefined
        : defaultStrokeWidth,
    opacity: type === "heart" ? 0.92 : 1,
    glowColor:
      type === "heart" && hints.glow
        ? accent ?? "#FF2D55"
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
      : getDefaultAnimations(type, duration, hints),
  };

  const base = {
    id: slugify(prompt),
    title: prompt,
    duration,
    fps: 30,
    loop,
    canvas,
    elements: [primaryElement, ...buildSecondaryElements(type, primaryElement, accent, hints, styles)],
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
    const effectTypes = new Set<ShapeType>(["ring", "glow", "spark", "shadow", "steam"]);

    const normalizedNonEffectElements = merged.elements
      .filter((element) => !effectTypes.has(element.type))
      .map((element) =>
        normalizeElementForType(ensureLayer(element), type, accent, format, hints),
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
          animations: getDefaultAnimations(type, duration, hints),
        };
      }
    }

    const primaryForEffects =
      normalizedNonEffectElements.find((element) => element.layer === "main") ??
      normalizedNonEffectElements[0];
    const derivedSecondaryElements = primaryForEffects
      ? buildSecondaryElements(type, primaryForEffects, accent, hints, styles)
      : [];

    const preservedSecondaryElements = merged.elements
      .filter((element) => effectTypes.has(element.type))
      .filter((element) => isAllowedEffectForPromptType(type, element.type))
      .map((element) => ensureLayer(element));

    merged.elements = [
      ...normalizedNonEffectElements,
      ...preservedSecondaryElements,
      ...derivedSecondaryElements,
    ].map((element) => ensureLayer(element));
  }

  return animationSpecSchema.parse(merged);
};
