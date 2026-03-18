export type RegressionPrompt = {
  id: string;
  category: "icon" | "style" | "behavior";
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
].filter(Boolean) as RegressionPrompt[];
