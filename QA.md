# Prompt Regression Checks

This project includes a small regression prompt suite so prompt-to-animation quality can be checked consistently over time.

## Prompt suite

Source:

- `src/qa/prompt-suite.ts`

The suite covers:

- core icon behavior
- style variation
- motion variation

## Run the suite

```bash
npm run qa:generate
```

This writes generated JSON specs to:

- `artifacts/regression-specs/`

## What to review

For each prompt, check:

- icon type is correct
- canvas ratio is correct
- element is centered when expected
- style intent is visible
- motion intent is visible
- no malformed colors, sizes, or invisible strokes

## Recommended workflow

1. Run `npm run qa:generate`
2. Pick any changed prompt
3. Copy the exact Phase 1 prompt you want to validate from `phase1.prompts.md` (or use `src/qa/prompt-suite.ts` for the curated regression subset)
4. Run `npm run generate -- "..."` for the prompt you want to inspect visually
5. Open `generated-prompt` in Remotion Studio
