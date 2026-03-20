export type PromptTrial = {
  id: string;
  prompt: string;
};

export const promptTrialSuite: PromptTrial[] = [
  {
    id: "trial-heart-love",
    prompt: 'heart animation written "I love you"\nbackground: #111111\naccent: pink',
  },
  {
    id: "trial-heart-pink",
    prompt: "pink heart with black bg\nsoft pulse glow\npremium romantic mood",
  },
  {
    id: "trial-search-match",
    prompt: "search icon query loading\nheadline: Find The Right Match\nsubheadline: A stronger SVG search scene with query input and result rows",
  },
  {
    id: "trial-app-launch",
    prompt: "smartphone app launch\nheadline: App Launch\nsubheadline: Motion-led product reveal with UI energy and structured copy",
  },
  {
    id: "trial-market-share",
    prompt: "pie chart slice market share\nheadline: Market Share\nsubheadline: A clearer donut-chart scene with brand lead, segment legend, and graphic market storytelling",
  },
  {
    id: "trial-podcast-mode",
    prompt: "headphones music podcast studio\nheadline: Podcast Mode\nsubheadline: A creator-ready audio scene with live energy, visual meters, and editorial framing",
  },
  {
    id: "trial-focus-mode",
    prompt: "laptop work from home productivity\nheadline: Focus Mode\nsubheadline: A cleaner productivity scene with app window, task rhythm, and structured UI energy",
  },
  {
    id: "trial-text-launch",
    prompt: "masked reveal headline\nheadline: Ship With Confidence\nsubheadline: A polished motion layer for launches, onboarding, and product stories\ntagline: release system",
  },
];
