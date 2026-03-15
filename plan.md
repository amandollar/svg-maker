Below is a **clean `plan.md` you can directly drop into your repo** (perfect for Cursor / AI coding tools).
It turns your **Phase-1 prompt spec (SVG Motion Graphics)** into an **actual engineering plan**.

The plan assumes you're using **Remotion + React + SVG**, which fits perfectly with the animation timelines you wrote.

---

# plan.md

```md
# SVG Motion Graphics Engine — Phase 1 Implementation Plan

Author: Aman Sharma  
Goal: Implement Phase-1 motion graphics engine capable of rendering SVG animations from structured animation specifications.

Phase 1 covers:
- 55 animation prompts
- SVG icon + scene animations
- Timeline-based animation system
- Built using Remotion + React + SVG

-------------------------------------------------------------------------------

# 1. Architecture Overview

Pipeline:

Prompt Spec
   ↓
AnimationSpec JSON
   ↓
Animation Engine
   ↓
Remotion Composition
   ↓
Rendered Video / GIF / MP4

Each prompt becomes a structured spec.

Example:

Prompt → Parsed Spec → Renderer → Remotion timeline.

-------------------------------------------------------------------------------

# 2. Tech Stack

Core Rendering
- Remotion
- React
- SVG

Language
- TypeScript

Utilities
- Zod (schema validation)
- Remotion interpolation
- React components

Project Structure:

src/
 ├── engine/
 │   ├── timeline.ts
 │   ├── easing.ts
 │   ├── animation-player.ts
 │   └── types.ts
 │
 ├── components/
 │   ├── shapes/
 │   │   ├── Heart.tsx
 │   │   ├── Bell.tsx
 │   │   ├── Checkmark.tsx
 │   │   └── ...
 │   │
 │   ├── scenes/
 │   │   ├── RocketLaunch.tsx
 │   │   ├── CitySkyline.tsx
 │   │   └── ...
 │
 ├── specs/
 │   ├── prompt001.ts
 │   ├── prompt002.ts
 │   ├── prompt003.ts
 │   └── ...
 │
 ├── renderer/
 │   ├── render-svg.tsx
 │   └── render-animation.tsx
 │
 ├── compositions/
 │   ├── Prompt001.tsx
 │   ├── Prompt002.tsx
 │   └── ...
 │
 └── index.ts

-------------------------------------------------------------------------------

# 3. Core Engine

## 3.1 AnimationSpec Type

Every prompt converts to this structure.

```

type AnimationSpec = {
canvas: {
width: number
height: number
}

duration: number

elements: AnimatedElement[]
}

```
```

type AnimatedElement = {
id: string
type: "path" | "circle" | "rect" | "group"
svgProps: object

animations: AnimationKeyframe[]
}

```
```

type AnimationKeyframe = {
start: number
end: number

property:
| "scale"
| "opacity"
| "translateX"
| "translateY"
| "rotate"
| "strokeDashoffset"
| "fill"

from: number | string
to: number | string

easing: string
}

```

-------------------------------------------------------------------------------

# 4. Timeline Engine

Timeline maps seconds → frames.

Example:

```

const frame = useCurrentFrame()
const fps = 30
const time = frame / fps

```

Keyframe interpolation:

```

interpolate(
frame,
[startFrame, endFrame],
[fromValue, toValue],
{ easing }
)

```

-------------------------------------------------------------------------------

# 5. Easing Library

Implement custom curves used in prompts.

File:

engine/easing.ts

Supported:

```

easeIn
easeOut
easeInOut
spring
cubicBezier
linear

```

Example:

```

export const snapUp = cubicBezier(0.4,0,0.6,1)
export const spring = cubicBezier(0.34,1.56,0.64,1)

```

-------------------------------------------------------------------------------

# 6. SVG Rendering System

Generic renderer component:

```

<SVGRenderer spec={AnimationSpec} />
```

Responsibilities:

* Render SVG root
* Loop through elements
* Apply animation transforms
* Handle groups

Example:

```
elements.map(element => {
   return <AnimatedElement element={element} frame={frame}/>
})
```

---

# 7. Shape Library

Reusable shapes.

Location:

```
components/shapes
```

Examples:

Heart
Bell
Star
Pin
Battery
Wifi
Lock
PlayButton
Cart

Each exports:

```
export const HeartIcon = () => (...)
```

---

# 8. Scene Components

More complex scenes.

Location:

```
components/scenes
```

Examples:

RocketLaunch
CitySkyline
FarmScene
HospitalRoom
PodcastStudio
StartupOffice
FamilyPark
DiwaliScene

Each scene:

```
export const RocketLaunchScene = ({frame}) => { }
```

---

# 9. Prompt Spec Files

Each prompt becomes a spec file.

Example:

```
specs/prompt001.ts
```

Example content:

```
export const Prompt001Spec: AnimationSpec = {
  canvas: { width:1080, height:1080 },
  duration: 2.5,

  elements:[
    {
      id:"heart",
      type:"path",
      svgProps:{ fill:"#FF2D55" },

      animations:[
        {
          start:0,
          end:0.1,
          property:"scale",
          from:1,
          to:1.35,
          easing:"snapUp"
        }
      ]
    }
  ]
}
```

---

# 10. Remotion Composition

Each prompt becomes a composition.

Example:

```
export const Prompt001 = () => {
 return (
   <Composition
     id="prompt001"
     component={Prompt001Scene}
     durationInFrames={75}
     fps={30}
     width={1080}
     height={1080}
   />
 )
}
```

---

# 11. Rendering CLI

Render videos via CLI.

Example:

```
npm run render prompt001
```

CLI script:

```
scripts/render.ts
```

Steps:

1. Load spec
2. Render Remotion composition
3. Export MP4

---

# 12. Prompt Implementation Order

Implement prompts in complexity layers.

Level 1 — Icons
001–010

Level 2 — UI Icons
011–020

Level 3 — Data & Business
021–025

Level 4 — Lifestyle Objects
026–035

Level 5 — Scenes
036–055

---

# 13. Development Milestones

## Milestone 1

Engine core

* AnimationSpec
* Timeline engine
* SVG renderer

## Milestone 2

Basic shapes

* Heart
* Checkmark
* Bell
* Arrow
* Star

## Milestone 3

UI icons

* Wifi
* Lock
* Cart
* Search
* Battery

## Milestone 4

Business graphics

* Bar chart
* Pie chart
* Trending line

## Milestone 5

Complex scenes

* Rocket
* City skyline
* Startup office
* Family park
* Diwali

---

# 14. Future (Phase 2)

Add:

Natural language → AnimationSpec

Example:

```
"Create a heart pulse animation"
```

↓

AI outputs spec JSON

↓

Renderer generates animation automatically.

---

# 15. Final Goal

By end of Phase 1 the system can:

* Render 55 animations
* Use structured animation specs
* Export videos programmatically
* Support reusable SVG components
* Prepare for AI prompt → animation conversion

---

```

---

## Why this plan is **very strong technically**

It separates:

1️⃣ **AnimationSpec (data)**  
2️⃣ **Renderer (engine)**  
3️⃣ **Scenes (components)**  
4️⃣ **Prompts (content)**

Which means later you can build exactly what you were describing earlier:

> **AI → AnimationSpec → Remotion → Video**

That is literally how **tools like Hera / Runway style motion engines work.**

---

## If you want, I can also give you the **next extremely important file**

`animation-spec.schema.ts`

which will:

- validate specs using **Zod**
- prevent broken animations
- make the engine production-safe.

This is actually the **core of the system.**
```
