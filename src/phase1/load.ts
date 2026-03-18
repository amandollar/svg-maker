import fs from "node:fs";
import path from "node:path";

export type Phase1PromptBlock = {
  number: string; // "001"
  title: string;
  text: string; // full block starting at PROMPT XXX line
};

let cached: Map<string, Phase1PromptBlock> | null = null;

const loadRawPhase1Text = () => {
  const filePath = path.resolve(process.cwd(), "phase1.prompts.md");
  return fs.readFileSync(filePath, "utf8");
};

const parsePhase1Prompts = (raw: string) => {
  const map = new Map<string, Phase1PromptBlock>();

  // Note: We intentionally parse by the PROMPT XXX: header lines and keep the full block
  // to stay as close as possible to the Phase 1 source-of-truth file.
  const re = /^PROMPT\s+(\d{3})\s*:\s*(.+)$/gm;
  const matches = Array.from(raw.matchAll(re));

  for (let i = 0; i < matches.length; i += 1) {
    const m = matches[i];
    if (!m || m.index == null) continue;

    const number = m[1];
    const title = (m[2] ?? "").trim();
    const start = m.index;
    const end = i + 1 < matches.length && matches[i + 1]?.index != null ? matches[i + 1]!.index! : raw.length;

    const rawBlock = raw.slice(start, end).trim();

    // Keep the Phase 1 prompt as the source of truth, but strip purely optional sections that
    // frequently contain variant backgrounds/colors and can confuse our parsers.
    const cutAtHeader = (value: string, header: string) => {
      const idx = value.toLowerCase().indexOf(header.toLowerCase());
      return idx >= 0 ? value.slice(0, idx).trim() : value;
    };

    let text = rawBlock;
    text = cutAtHeader(text, "COLOR VARIANTS:");
    text = cutAtHeader(text, "USAGE CONTEXT:");

    map.set(number, {number, title, text});
  }

  return map;
};

export const getPhase1Prompts = (): Map<string, Phase1PromptBlock> => {
  if (cached) return cached;
  cached = parsePhase1Prompts(loadRawPhase1Text());
  return cached;
};

export const getPhase1PromptBlock = (number: string | number): Phase1PromptBlock => {
  const key = typeof number === "number" ? String(number).padStart(3, "0") : number.padStart(3, "0");
  const map = getPhase1Prompts();
  const block = map.get(key);
  if (!block) {
    throw new Error(`Phase 1 prompt ${key} not found in phase1.prompts.md`);
  }
  return block;
};
