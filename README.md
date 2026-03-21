# animate-svg
Prompt-driven SVG motion graphics generator built on a strict spec pipeline.

## Overview

`animate-svg` is a local tool for turning text prompts into short, structured SVG motion videos.

It is not a generic text-to-video model. It does not synthesize raw footage or freeform scenes. Instead, it generates a **structured animation specification**, builds an SVG scene from that specification, and renders the result through Remotion.

The project is aimed at promptable motion graphics use cases such as:

- icon-led motion snippets
- product and utility scenes
- text-led promotional motion
- explainers and interstitials
- repeatable social/video design assets

The output is a **deterministic, renderable `AnimationSpec`** made of positioned SVG elements, keyframed motion, and a bounded canvas/duration model.

## Why This Exists

Most prompt-based video tooling breaks down in one of two ways:

1. It produces visually interesting but uncontrollable output.
2. It produces structured output, but the structure is too low-level and brittle to author at scale.

Motion design teams, developers, and automation-heavy content workflows usually need something in the middle:

- promptable enough to move fast
- structured enough to inspect and debug
- deterministic enough to rerender consistently
- constrained enough to fit brand systems and template families

That is the problem `animate-svg` is solving.

The useful part is not only “prompt in, video out”. The useful part is:

- a semantic intermediate layer
- reusable scene families
- SVG-native composition
- deterministic rendering
- inspectable output

That makes it relevant for:

- creators generating repeatable short-form motion assets
- product marketing teams making launch/feature visuals
- design systems that need a programmable motion layer
- developers building prompt-driven video generation workflows
- educational / explainer content where scene structure matters more than cinematic footage

## Core Concept

The mental model is simple:

> A prompt should not generate pixels directly.  
> It should generate a **structured scene plan** that the renderer can execute consistently.

In this project, prompt-driven generation works by translating language into a constrained motion representation, then compiling that into a final SVG animation.

There are two important consequences of that design:

- prompts influence **scene choice, layout intent, style intent, and motion profile**
- prompts do **not** directly author low-level geometry or arbitrary frame-by-frame behavior

That constraint is intentional. It keeps the system debuggable and keeps output quality tied to scene families and renderer quality, not to prompt luck.

## How the Pipeline Works

### End-to-end flow

```text
Prompt
  -> prompt routing / hint extraction
  -> semantic MotionSpec generation
  -> optional OpenAI refinement
  -> deterministic compile to AnimationSpec
  -> normalization / fallback rules
  -> Remotion composition render
  -> MP4 output
```

### Step-by-step

1. **Prompt ingestion**
   - A prompt enters through the CLI or a QA/render script.
   - The prompt may be plain language, or it may include structured hints like:
     - `headline:`
     - `subheadline:`
     - `variant:`
     - `background:`
     - `accent:`

2. **Prompt routing**
   - The router in [`src/ai/prompt-router.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\prompt-router.ts) decides whether the prompt is best handled as:
     - a text-led family
     - an object/utility scene
     - a mixed icon + text scene

3. **Semantic spec generation**
   - The default production path creates a compact `MotionSpec`.
   - That happens via:
     - [`src/motion-spec/generate.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\motion-spec\generate.ts)
     - optional refinement in [`src/motion-spec/refine-with-openai.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\motion-spec\refine-with-openai.ts)

4. **Deterministic compile**
   - [`src/motion-spec/compile.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\motion-spec\compile.ts) turns the semantic `MotionSpec` into a concrete `AnimationSpec`.
   - This is where prompt intent becomes actual scene structure.

5. **Template / family build**
   - Text families are built in [`src/ai/text-template-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\text-template-spec.ts)
   - Object and mixed scenes are built in [`src/ai/object-scene-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\object-scene-spec.ts)

6. **Normalization and safeguards**
   - [`src/ai/normalize-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\normalize-spec.ts) applies defaults, fit rules, size corrections, and safety passes.
   - This is where the system prevents common failures like:
     - clipped text
     - bad icon sizing
     - invalid element defaults
     - inconsistent scene geometry

7. **Render**
   - The final `AnimationSpec` is rendered by Remotion through:
     - [`src/compositions/AnimationSpecComposition.tsx`](C:\Users\LENOVO\Desktop\animate-svg\src\compositions\AnimationSpecComposition.tsx)
     - [`src/renderer/SvgRenderer.tsx`](C:\Users\LENOVO\Desktop\animate-svg\src\renderer\SvgRenderer.tsx)

8. **Export**
   - Render scripts write MP4 files to `out/` for review, benchmark testing, and demo packaging.

### Validation and fallback

Validation is built into the pipeline rather than treated as a separate QA concern.

- `MotionSpec` is validated with Zod in [`src/motion-spec/schema.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\motion-spec\schema.ts)
- `AnimationSpec` and element structures are validated in [`src/engine/types.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\engine\types.ts)
- fit/fallback logic is applied in the family builders and normalization layer
- square-safe layouts are treated as first-class stress cases

## Template System

In this project, a “template” means one of two things:

1. **Hand-authored animation templates**
   - Registered in [`src/templates/index.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\templates\index.ts)
   - These are static sample compositions like heart/checkmark/bell demos.

2. **Prompt-driven scene families**
   - Built dynamically from prompt intent in:
     - [`src/ai/text-template-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\text-template-spec.ts)
     - [`src/ai/object-scene-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\object-scene-spec.ts)

The second category is the important one for the product.

### What a family controls

A family defines:

- overall layout structure
- object and text placement
- motion rhythm
- stage/panel geometry
- supporting chips, rails, dividers, badges, and overlays
- default visual hierarchy
- variant selection rules
- square/portrait/landscape fallback behavior

### Static structure vs dynamic content

A family has a **static composition model** and **dynamic content inputs**.

Static structure:

- stage shape
- card layout
- headline zone
- icon placement
- transition style
- ornament rules

Dynamic content:

- title
- subheadline
- prompt-derived icon or scene choice
- background/accent hints
- motion profile
- selected variant (`card`, `spotlight`, `stack`, etc.)

### Adding a new template/family

To add a new prompt-driven family well, the expected path is:

1. define routing conditions
2. create a family builder
3. define layout-safe defaults
4. add prompt-trial coverage
5. render multiple prompts
6. only mark it stable after surviving those prompts

This project deliberately prefers **family-level hardening** over one-off prompt fixes.

## Architecture

There is no backend service, queue, or remote render worker in the current implementation. This is a local generation and render tool.

### High-level architecture

```text
CLI / QA Scripts / Remotion Studio
          |
          v
       AI Layer
  (routing + semantic scene choice)
          |
          v
   MotionSpec Layer
 (semantic intermediate schema)
          |
          v
   Family Builders
(text + object scene generators)
          |
          v
 Normalization + Validation
          |
          v
   AnimationSpec Renderer
     (SVG + Remotion)
```

### Major modules

| Module | Responsibility |
|---|---|
| `src/ai` | Prompt routing, family selection, scene builders, normalization |
| `src/generation` | Top-level generation pipeline orchestration |
| `src/motion-spec` | Semantic intermediate schema and deterministic compile |
| `src/engine` | Core request/spec types and validation |
| `src/renderer` | Final SVG rendering logic |
| `src/components/shapes` | Reusable icon/shape primitives |
| `src/compositions` | Remotion compositions |
| `src/templates` | Static example templates |
| `src/phase1` | Reference prompt coverage tooling |
| `src/qa` | Prompt suites and batch render scripts |

### Key architectural decisions

#### 1. Semantic intermediate spec
The system does not go directly from prompt to final render spec.  
It goes through `MotionSpec`.

This matters because it allows:

- prompt interpretation to evolve without breaking the renderer
- renderer changes without rewriting prompt logic
- optional OpenAI refinement without surrendering control of final output

#### 2. Deterministic compile
The compiler converts a semantic decision into a constrained `AnimationSpec`.

That is the main control boundary in the project.

#### 3. Family-first generation
The system is organized around **families of scenes**, not arbitrary prompt rendering.  
That is why quality can be improved at the family level.

#### 4. Validation in the core types
The renderer only accepts validated specs. That prevents a large class of layout and schema drift issues.

#### 5. Square-first hardening
Square output is the main stress format. Many of the recent quality fixes were about making square layouts stop breaking.

## Features

### Prompt-driven scene generation
- prompt-to-spec generation through a deterministic pipeline
- optional OpenAI refinement on top of a stable local base

### SVG-native rendering
- final scenes are built from typed SVG elements
- supports icons, panels, text, glow/ring effects, supporting overlays

### Family-based generation
- text families such as hero, kinetic, masked, chapter
- utility/product families such as search, download, cart, battery, calendar
- mixed icon + text scenes

### Scene variation
Current variation work is focused on stable families first.

Examples:

- cart:
  - card
  - spotlight
  - checkout stack
- download:
  - card
  - spotlight
  - save stack

### Review-oriented output flows
- benchmark prompt-trial renders
- progress packs
- curated showcase renders
- Phase 1 coverage reporting

## Tech Stack

| Technology | Use |
|---|---|
| TypeScript | Core language and type safety |
| React | Component model for Remotion compositions |
| Remotion | Video rendering and preview workflow |
| Zod | Schema validation for specs and elements |
| OpenAI SDK | Optional MotionSpec refinement |
| Node.js | CLI scripts, generation scripts, QA batch rendering |

## Project Structure

```text
animate-svg/
├── icons/                     # SVG/icon source assets
├── out/                       # Rendered outputs and review packs
├── src/
│   ├── ai/                    # Prompt routing, family builders, normalization
│   ├── components/
│   │   └── shapes/            # Reusable icon/shape primitives
│   ├── compositions/          # Remotion compositions
│   ├── data/                  # Generated request/spec modules
│   ├── engine/                # Core schema/types for animation requests/specs
│   ├── generation/            # Top-level generation pipeline
│   ├── motion-spec/           # Semantic intermediate spec + compiler
│   ├── phase1/                # Coverage/reference tooling
│   ├── qa/                    # Prompt suites and batch render scripts
│   ├── renderer/              # SVG renderer
│   ├── templates/             # Static example templates
│   ├── generate.ts            # Prompt -> generated spec modules
│   ├── index.ts               # Remotion root registration
│   └── Root.tsx               # Composition registration
├── phase1.prompts.md          # Reference prompt set
├── package.json
└── README.md
```

### Important files

- [`src/generate.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\generate.ts)  
  Prompt entry point for generating `src/data/generated-*`.

- [`src/generation/deterministic.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\generation\deterministic.ts)  
  Default production generation path.

- [`src/motion-spec/schema.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\motion-spec\schema.ts)  
  Semantic intermediate spec.

- [`src/motion-spec/compile.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\motion-spec\compile.ts)  
  Semantic-to-renderable compile step.

- [`src/ai/text-template-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\text-template-spec.ts)  
  Text-family scene generation.

- [`src/ai/object-scene-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\ai\object-scene-spec.ts)  
  Utility/object/mixed scene generation.

- [`src/renderer/SvgRenderer.tsx`](C:\Users\LENOVO\Desktop\animate-svg\src\renderer\SvgRenderer.tsx)  
  Final renderer for typed SVG scenes.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Windows/macOS/Linux environment capable of running Remotion locally

### Installation

```bash
npm install
```

### Environment variables

Create a `.env` file from `.env.example`.

Supported variables:

```bash
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_ENABLE_MOTION_SPEC=1
OPENAI_MODEL_MOTION_SPEC=gpt-4o
OPENAI_MOTION_SPEC_ALLOW_TEMPLATE=1
OPENAI_DEBUG=0
```

Notes:

- The default pipeline can run fully offline if `OPENAI_ENABLE_MOTION_SPEC=0`.
- The OpenAI call is used for **MotionSpec refinement**, not raw final animation generation.

### Local development commands

```bash
npm run dev
npm run build
npm run build:node
npm run generate -- "simple heart pulse"
npm run render:generated
npm run phase1:coverage
npm run qa:render-prompt-trial-videos
npm run qa:render-progress-videos
```

## Usage

### 1. Generate a prompt

```bash
npm run generate -- "search icon query loading
headline: Find The Right Match
subheadline: A stronger SVG search scene with query input and result rows"
```

This writes:

- [`src/data/generated-request.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\data\generated-request.ts)
- [`src/data/generated-spec.ts`](C:\Users\LENOVO\Desktop\animate-svg\src\data\generated-spec.ts)

### 2. Preview in Remotion Studio

```bash
npm run dev
```

Open the `generated-prompt` composition.

### 3. Render the generated prompt

```bash
npm run render:generated
```

This exports:

- [out/generated-prompt.mp4](C:\Users\LENOVO\Desktop\animate-svg\out\generated-prompt.mp4)

### Example prompts

#### Simple icon-led
```text
simple heart pulse
background: #111111
accent: #ff4d8d
```

#### Utility scene
```text
download file card
headline: Saving File
subheadline: A cleaner save-state scene with progress, archive feel, and handoff clarity
```

#### Mixed product scene
```text
featured product cart spotlight
headline: Best Seller
subheadline: A hero commerce scene with product spotlight and conversion energy
```

#### Text-led
```text
kinetic typography security headline
headline: Built To Protect
subheadline: Fast-moving words, crisp hierarchy, and premium product confidence
```

### Output expectations

A prompt does **not** produce arbitrary video. It produces a constrained motion graphic that fits one of the supported families and variants.

Typical output characteristics:
- short duration
- structured hierarchy
- SVG-native composition
- repeatable rendering
- consistent canvas dimensions and timing

## Developer Notes

### Mental model
The important artifact in this codebase is not the prompt. It is the **renderable spec**.

The design goal is to keep the following layers separate:

- prompt interpretation
- semantic scene selection
- family layout logic
- render-time SVG output

That separation is what keeps the system debuggable.

### Why `MotionSpec` matters
The `MotionSpec` layer is the boundary between “language” and “rendering”.

It is intentionally small:
- template
- canvas
- timing
- style
- title
- notes

That keeps it stable while scene families evolve underneath it.

### Why the project uses family hardening
Prompt-by-prompt fixes do not scale.  
The project has been moving toward:

- stable family rules
- shared fit logic
- square-safe fallbacks
- reusable variation patterns

This is the right direction if the goal is production-grade prompt-to-motion output rather than a long tail of brittle prompt hacks.

### Extension points
If you want to extend the system, the best places to do it are:

1. **Add a new family**
   - route prompt category
   - add builder
   - add prompt-trial coverage
   - harden square fit

2. **Add a new variant to a stable family**
   - keep the family semantics
   - change composition dominance
   - do not just recolor the same layout

3. **Improve primitives**
   - shape rendering
   - badge/card geometry
   - text fit helpers
   - normalization rules

## Current Limitations

This project is useful today, but it is still mid-build.

### 1. Variation depth is uneven
Some families now support composition variants, but many still do not. Even where variants exist, the visual distance between them is still being tuned.

### 2. Square hardening is still ongoing
Square is the main stress case. A lot of recent work has been about preventing overlap, clipping, and bad hierarchy in square layouts.

### 3. Broad coverage is ahead of premium coverage
The engine can generate a wider range of prompts than it can render at consistently high taste.

### 4. Family quality is uneven
Some families are already presentable:
- search
- download
- cart
- podcast
- focus mode
- heart

Others still need more hardening.

### 5. There is no API/backend service layer yet
This is currently a local generation/render tool, not a hosted multi-user platform.

## Roadmap

### Short term
- finish hardening fragile families into stable ones
- increase visual separation between variants in stable families
- remove stale scripts and cleanup historical QA clutter
- improve contrast and hierarchy in pale utility scenes

### Mid term
- add 2–3 real SVG composition variants to more stable families
- strengthen family-level design tokens
- improve benchmark and progress-pack review workflows
- tighten Phase 1 coverage tracking around stable vs fragile output

### Longer term
- deeper brand/system customization
- stronger renderer primitives
- clearer public interface for programmatic generation
- broader prompt coverage without losing determinism

## Contributing

Contributions are welcome, but this repo benefits most from focused, family-level improvements rather than broad speculative changes.

### Good contributions
- fix a fragile family without adding prompt hacks
- improve icon/shape rendering quality
- add a meaningful composition variant to an already stable family
- improve layout safety or spec validation
- add benchmark prompts and review tooling tied to real output quality

### Less helpful contributions
- adding many new prompt types without hardening
- folder-only refactors without improving the generation/render path
- changing output behavior without prompt-trial coverage

### Suggested workflow
1. pick a family or renderer issue
2. add or update a prompt-trial case
3. make the change
4. rerender outputs
5. verify the family got better without regressing nearby prompts

## License

This repository does not currently include a license file. If you plan to publish or accept external contributions, add an explicit license first.
