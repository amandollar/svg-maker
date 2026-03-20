export type RegressionPrompt = {
  id: string;
  category: "icon" | "style" | "behavior" | "text" | "scene";
  prompt: string;
};

import {getPhase1PromptBlock} from "../phase1/load";

const phase1 = (number: number, category: RegressionPrompt["category"]): RegressionPrompt => {
  const block = getPhase1PromptBlock(number);
  return {
    id: `prompt-${block.number}`,
    category,
    prompt: block.text,
  };
};

const phase1Safe = (
  number: number,
  category: RegressionPrompt["category"],
): RegressionPrompt | null => {
  try {
    return phase1(number, category);
  } catch (error) {
    // Keep QA resilient to gaps (e.g. Phase 1 file missing PROMPT 036).
    console.warn(
      `[qa] Skipping Phase 1 prompt ${String(number).padStart(3, "0")}: ${(error as Error)?.message ?? String(error)}`,
    );
    return null;
  }
};

export const regressionPromptSuite: RegressionPrompt[] = [
  // Phase 1 prompts are the source of truth. We test against the raw prompt blocks directly.
  phase1Safe(1, "icon"),
  phase1Safe(2, "icon"),
  phase1Safe(3, "icon"),
  phase1Safe(4, "icon"),
  phase1Safe(5, "icon"),
  phase1Safe(6, "icon"),
  phase1Safe(7, "icon"),
  phase1Safe(8, "icon"),
  phase1Safe(9, "icon"),
  phase1Safe(10, "icon"),
  phase1Safe(11, "icon"),
  phase1Safe(12, "icon"),
  phase1Safe(13, "icon"),
  phase1Safe(14, "icon"),
  phase1Safe(15, "icon"),
  phase1Safe(16, "icon"),
  phase1Safe(17, "icon"),
  phase1Safe(18, "icon"),
  phase1Safe(19, "icon"),
  phase1Safe(20, "icon"),
  phase1Safe(21, "icon"),
  phase1Safe(22, "icon"),
  phase1Safe(23, "icon"),
  phase1Safe(24, "icon"),
  phase1Safe(25, "icon"),
  phase1Safe(26, "icon"),
  phase1Safe(27, "icon"),
  phase1Safe(28, "icon"),
  phase1Safe(29, "icon"),
  phase1Safe(30, "icon"),
  phase1Safe(31, "behavior"),
  phase1Safe(32, "behavior"),
  phase1Safe(33, "behavior"),
  phase1Safe(34, "behavior"),
  phase1Safe(35, "behavior"),
  phase1Safe(36, "behavior"),
  phase1Safe(37, "behavior"),
  phase1Safe(38, "behavior"),
  phase1Safe(39, "icon"),
  phase1Safe(40, "behavior"),
  {
    id: "text-hero-launch",
    category: "text",
    prompt:
      'headline: Launch Faster\nsubheadline: Deterministic SVG motion for product stories\ntagline: product launch',
  },
  {
    id: "text-kinetic-security",
    category: "text",
    prompt:
      'kinetic typography\nheadline: Built For Trust\nsubheadline: Security motion that feels premium',
  },
  {
    id: "text-quote-editorial",
    category: "text",
    prompt: 'quote animation "Design is how it works." "Steve Jobs"',
  },
  {
    id: "text-stat-growth",
    category: "text",
    prompt:
      'stat counter\nheadline: Revenue Growth\nvalue: 128%\nlabel: YoY lift\nsubheadline: Q4 performance across the funnel',
  },
  {
    id: "text-list-features",
    category: "text",
    prompt:
      'bullet list\nheadline: What You Get\n- Fast generation\n- Reusable SVG scenes\n- Better text motion\n- Deterministic output',
  },
  {
    id: "text-icon-callout",
    category: "text",
    prompt:
      'icon callout secure feature\nheadline: Built Secure\nsubheadline: Motion language for trust, onboarding, and product demos\ntagline: platform layer',
  },
  {
    id: "text-hero-brief",
    category: "text",
    prompt:
      "Create a premium launch headline animation for a SaaS product.\nCANVAS: 1080x1080\nDURATION: 4.5s\nVISUAL LAYOUT:\nBold centered title with supporting copy and a subtle highlight sweep.\nThe message should feel polished and editorial.\nUse a clean accent line and leave generous spacing.",
  },
  {
    id: "text-quote-brief",
    category: "text",
    prompt:
      "Quote animation for a founder story.\nVISUAL LAYOUT:\nElegant pull quote on a soft card with editorial typography.\n\"Great products feel obvious in hindsight.\"\n\"Founder Note\"",
  },
  {
    id: "text-masked-launch",
    category: "text",
    prompt:
      "masked reveal headline\nheadline: Ship With Confidence\nsubheadline: A polished motion layer for launches, onboarding, and product stories\ntagline: release system",
  },
  {
    id: "text-masked-brief",
    category: "text",
    prompt:
      "Create a section title interstitial for a product story.\nVISUAL LAYOUT:\nLarge reveal headline, clean wipe, centered composition.\nUse a premium tone with a subtle accent line.\nHeadline should feel bold and cinematic.",
  },
  {
    id: "text-chapter-launch",
    category: "text",
    prompt:
      "chapter break\nchapter: 02\nheadline: Launch Sequence\nsubheadline: The moment the product story shifts from setup to reveal\nkicker: chapter marker",
  },
  {
    id: "text-chapter-brief",
    category: "text",
    prompt:
      "Create a premium chapter intro card for a documentary-style product video.\nSECTION 03\nVISUAL LAYOUT:\nLarge translucent number in the background, bold editorial title, clean divider, supporting line below.\nThe tone should feel cinematic and composed.",
  },
  {
    id: "scene-heart-love",
    category: "scene",
    prompt:
      'heart animation written "I love you"\nbackground: #111111\naccent: pink',
  },
  {
    id: "scene-play-intro",
    category: "scene",
    prompt:
      "play button video intro reveal\nheadline: Watch The Story\nsubheadline: A cleaner SVG opener for product videos and social promos",
  },
  {
    id: "scene-phone-launch",
    category: "scene",
    prompt:
      "smartphone app launch\nheadline: App Launch\nsubheadline: Motion-led product reveal with UI energy and structured copy",
  },
  {
    id: "scene-headphones-podcast",
    category: "scene",
    prompt:
      "headphones music podcast studio\nheadline: Podcast Mode\nsubheadline: A creator-ready audio scene with live energy, visual meters, and editorial framing",
  },
  {
    id: "scene-wallet-cashflow",
    category: "scene",
    prompt:
      "wallet open payment cashflow\nheadline: Cashflow\nsubheadline: A warm finance scene with wallet reveal, payout chips, and cleaner balance storytelling",
  },
  {
    id: "scene-laptop-focus",
    category: "scene",
    prompt:
      "laptop work from home productivity\nheadline: Focus Mode\nsubheadline: A cleaner productivity scene with app window, task rhythm, and structured UI energy",
  },
  {
    id: "scene-pie-market-share",
    category: "scene",
    prompt:
      "pie chart slice market share\nheadline: Market Share\nsubheadline: A clearer donut-chart scene with brand lead, segment legend, and graphic market storytelling",
  },
  {
    id: "scene-download-save",
    category: "scene",
    prompt:
      "download arrow file saving\nheadline: Saved Securely\nsubheadline: A stronger file-save scene with progress state, receipt card, and cleaner utility motion",
  },
  {
    id: "scene-kpi-card",
    category: "scene",
    prompt:
      "bar chart mini kpi snapshot\nheadline: Revenue Lift\nsubheadline: A dashboard-ready growth moment with clearer structure",
  },
  {
    id: "scene-search-query",
    category: "scene",
    prompt:
      "search icon query loading\nheadline: Find The Right Match\nsubheadline: A stronger SVG search scene with query input and result rows",
  },
  {
    id: "scene-cart-checkout",
    category: "scene",
    prompt:
      "shopping cart add to cart\nheadline: Add To Cart\nsubheadline: Cleaner ecommerce motion with product card and checkout-ready CTA",
  },
  {
    id: "scene-battery-charge",
    category: "scene",
    prompt:
      "battery charging energy level\nheadline: Charging Up\nsubheadline: A clearer battery scene with visible progress and product-style motion",
  },
  {
    id: "scene-calendar-countdown",
    category: "scene",
    prompt:
      "calendar date event countdown\nheadline: Event Countdown\nsubheadline: A cleaner countdown scene with date focus and supporting detail",
  },
  {
    id: "scene-trend-growth",
    category: "scene",
    prompt:
      "trending up arrow growth chart\nheadline: Growth Curve\nsubheadline: A clearer market-style SVG scene with signal, chart stage, and KPI chips",
  },
].filter(Boolean) as RegressionPrompt[];
