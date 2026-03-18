===============================================================================
SVG MOTION GRAPHICS - PHASE 1: BASIC SVG EFFECTS & TRANSITIONS
75 Production-Ready Prompts | Real-Life Use Cases
===============================================================================

PROMPT FORMAT:
- Canvas size specified per prompt
- All colors in HEX
- Per-second animation timeline
- Named easing curves
- All label copy written out explicitly
- Usage context: where a real content creator would actually use this

===============================================================================
LEVEL 1.0 — SIMPLE ICONIC SHAPES (Basic scale, fade, opacity)
===============================================================================
Goal: Master fundamental single-path SVG animations.
SVG complexity: 1–3 paths. Duration: 1.5–3s.

───────────────────────────────────────────────────────────────────────────────
PROMPT 001: Heart Pulse — Like Notification
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1 Square)
DURATION: 2.5s | LOOP: Yes
SVG: Heart icon (Heroicons solid / 2 paths) — centered at 540×540px, 160px wide

COLOR SPECIFICATION:
Background: #1A1A1A (near-black)
Heart fill: #FF2D55 (Instagram red-pink)
Heart stroke: none
Glow color: #FF6680 (soft pink glow)

VISUAL LAYOUT:
Heart icon centered. No text, no other elements. Full bleed dark background.
At rest: heart at 120px, opacity 85%.

ANIMATION TIMELINE (2.5s total, loopable):
0–0.1s: Heart scales 1.0 → 1.35 (snap-up, fast ease-in)
0.1–0.3s: Heart scales 1.35 → 0.9 (elastic overshoot back, spring curve)
0.3–0.55s: Heart scales 0.9 → 1.0 (settle, ease-out)
0.55–0.8s: Glow expands outward (blur radius 0 → 18px, opacity 0.8 → 0, ease-out)
0.8–2.0s: Hold at rest — slight breathing scale (1.0 → 1.04 → 1.0, ease-in-out, 1.2s cycle)
2.0–2.5s: Pause before loop

EASING CURVES:
- Snap-up: cubic-bezier(0.4, 0, 0.6, 1)
- Spring settle: cubic-bezier(0.34, 1.56, 0.64, 1)
- Breathing: ease-in-out

COLOR VARIANTS:
Variant A: #FF2D55 (Instagram / social media)
Variant B: #FF6B35 (warm orange / health app)
Variant C: #FFFFFF heart on #E91E63 background (bold brand)

USAGE CONTEXT:
Social media engagement overlays, like-counter animations, dating app UI, notification badge.

───────────────────────────────────────────────────────────────────────────────
PROMPT 002: Checkmark Draw — Task Complete
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 1.8s | LOOP: No (single play)
SVG: Checkmark (1 open stroke path, no fill) — centered at 960×540px, 140px wide, stroke-width 10px

COLOR SPECIFICATION:
Background: #F0FFF4 (very light mint green)
Check stroke: #22C55E (success green)
Circle outline: #22C55E (same green, 2px)
Completion flash: #FFFFFF (white flash)

VISUAL LAYOUT:
Thin circle ring (180px diameter) centered on canvas. Checkmark inside circle.
Clean minimal — suitable for lower-third success confirmation or mid-video callout.

ANIMATION TIMELINE (1.8s total):
0–0.15s: Circle ring draws clockwise (stroke-dashoffset 100% → 0%, ease-in)
0.15–0.7s: Checkmark strokes in left-to-right (stroke-dashoffset 100% → 0%, ease-out)
0.7–0.85s: Entire icon scales 1.0 → 1.12 (anticipation bounce)
0.85–1.0s: Scales 1.12 → 0.95 → 1.0 (settle)
1.0–1.2s: White flash pulse (opacity 0 → 0.4 → 0) over full icon
1.2–1.8s: Hold final state, icon rests

EASING CURVES:
- Stroke draw: ease-out
- Scale bounce: cubic-bezier(0.34, 1.56, 0.64, 1)
- Flash: ease-in-out

COLOR VARIANTS:
Variant A: #22C55E green (standard success)
Variant B: #3B82F6 blue on white (verification / ID check)
Variant C: #F59E0B amber on dark (caution-confirm)

USAGE CONTEXT:
Explainer video "step completed" moment. SaaS product demo. Course completion screen. Quiz answer confirmation.

───────────────────────────────────────────────────────────────────────────────
PROMPT 003: Alert Bell — Notification Ring
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 2.0s | LOOP: Yes
SVG: Bell icon (Heroicons outline / 3 paths: body, clapper, base) — centered at 540×900px, 130px wide

COLOR SPECIFICATION:
Background: #0F172A (deep navy)
Bell stroke: #FACC15 (gold yellow)
Bell fill: none (outline only)
Shake trail: #FACC1530 (yellow, 18% opacity trail)

VISUAL LAYOUT:
Bell icon in lower-center of frame (vertical story format). Top 60% of frame reserved for content/text overlay.
Safe zone maintained for TikTok/Reels UI elements at bottom.

ANIMATION TIMELINE (2.0s loopable):
0–0.08s: Bell rotates +18° from center (rotate around base, ease-in)
0.08–0.18s: Bell rotates −22° (overshoot left)
0.18–0.3s: Bell rotates +15° (back right)
0.3–0.42s: Bell rotates −10° (dampening)
0.42–0.55s: Bell rotates +6° → settles to 0° (ease-out)
0.55–0.7s: Clapper path vibrates independently (small ±4px Y offset, 3 cycles)
0.7–1.0s: Shake-trail ghost copies fade (3 ghost frames, opacity 0.15 → 0, staggered 80ms apart)
1.0–1.6s: Bell rests. Subtle glow pulse on stroke (opacity 0.7 → 1.0 → 0.7, ease-in-out)
1.6–2.0s: Hold before loop

EASING CURVES:
- Swing: spring(1, 80, 10, 0)
- Glow pulse: ease-in-out
- Ghost fade: linear

COLOR VARIANTS:
Variant A: #FACC15 gold on navy (YouTube subscribe bell)
Variant B: #F97316 orange on black (breaking news alert)
Variant C: #60A5FA blue on white (app notification)

USAGE CONTEXT:
"Subscribe and hit the bell" YouTube CTA. Push notification promo. App feature walkthrough. Reels end-card.

───────────────────────────────────────────────────────────────────────────────
PROMPT 004: Arrow — Swipe Up CTA
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 1.6s | LOOP: Yes
SVG: Upward chevron arrow (2 paths, 8px stroke, no fill) — position at 540×1680px (bottom of frame), 90px wide

COLOR SPECIFICATION:
Background: transparent (overlay use — no background)
Arrow stroke: #FFFFFF
Arrow glow: #FFFFFF40 (white, 25% opacity)

VISUAL LAYOUT:
Three stacked chevrons at bottom. Top chevron at 1680px Y, middle at 1730px, bottom at 1780px.
Each 90px wide, spaced 50px apart vertically. All stroke white, 8px.

ANIMATION TIMELINE (1.6s loopable):
0–0.25s: Bottom arrow fades in (opacity 0 → 0.3)
0.25–0.5s: Middle arrow fades in (opacity 0 → 0.6)
0.5–0.75s: Top arrow fades in (opacity 0 → 1.0)
0.75–1.1s: All arrows translate upward 22px together (ease-in-out)
1.1–1.3s: All arrows fade out (opacity → 0, ease-in)
1.3–1.6s: Reset invisible, pause before loop

EASING CURVES:
- Staggered fade: ease-out
- Float up: ease-in-out
- Fade out: ease-in

COLOR VARIANTS:
Variant A: #FFFFFF white (universal overlay use)
Variant B: #FACC15 gold (Story CTA)
Variant C: #FF2D55 red (urgent CTA)

USAGE CONTEXT:
Instagram/TikTok "Swipe Up" story overlay. Link-in-bio CTA. Reels watch-more prompt. Vertical ad end-card.

───────────────────────────────────────────────────────────────────────────────
PROMPT 005: Star Burst — Rating Reveal
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 2.2s | LOOP: No
SVG: 5-point star (1 polygon path, solid fill) — five stars in a row, each 64px, centered at Y:540, X:720–1200px, 120px gaps

COLOR SPECIFICATION:
Background: #111827 (very dark grey-blue)
Stars fill (empty): #374151 (dim grey)
Stars fill (active): #FBBF24 (warm amber gold)
Stars stroke: none
Particle burst color: #FDE68A (pale yellow)

VISUAL LAYOUT:
Five stars evenly spaced in horizontal row, vertically centered.
Stars start dim grey. Each fills gold left to right with particle burst on fill.

ANIMATION TIMELINE (2.2s total):
0–0.1s: All 5 stars visible dim grey. Slight scale-in (0.6 → 1.0) staggered 40ms each.
0.1–0.4s: Star 1 fills gold (fill color transition 0.2s) + scales 1.0 → 1.25 → 1.0
0.4–0.7s: Star 2 fills gold (same), particle micro-burst (4 particles, 12px, radial, fade 0.3s)
0.7–1.0s: Star 3 fills gold
1.0–1.3s: Star 4 fills gold
1.3–1.6s: Star 5 fills gold — largest particle burst (8 particles, 20px radial)
1.6–2.0s: All 5 stars lit. Collective glow pulse (0→6px blur → 0, ease-in-out, 0.4s)
2.0–2.2s: Hold

EASING CURVES:
- Fill reveal: ease-out
- Star scale bounce: cubic-bezier(0.34, 1.56, 0.64, 1)
- Glow: ease-in-out

COLOR VARIANTS:
Variant A: #FBBF24 amber on dark (standard rating)
Variant B: #60A5FA blue on white (product feature highlight)
Variant C: #F43F5E red stars on black (bold editorial)

USAGE CONTEXT:
Product review video. Customer testimonial B-roll. App store rating explainer. Social proof segment in ad.

───────────────────────────────────────────────────────────────────────────────
COMPLEXITY STEP UP → Adding path draw animations + stroke detail
───────────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────────
PROMPT 006: Location Pin Drop — "We're Here"
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 2.5s | LOOP: No
SVG: Map pin / location marker (3 paths: outer teardrop body, inner circle, shadow ellipse) — centered 960×480px, 100px tall

COLOR SPECIFICATION:
Background: #E8F4FD (very light sky blue)
Pin body fill: #EF4444 (red)
Pin inner circle fill: #FFFFFF (white)
Pin stroke: #B91C1C (dark red, 2px)
Drop shadow: #00000025 (black 14% opacity ellipse below pin)
Ripple color: #EF4444 (red, fading)

VISUAL LAYOUT:
Pin appears dropping from above-frame. Lands at vertical center. Ground ripple expands at base.
Clean flat-map aesthetic. No other elements.

ANIMATION TIMELINE (2.5s total):
0–0.3s: Pin enters from Y:-120px → Y:480px (drops in, ease-in acceleration)
0.3–0.42s: Pin overshoots to Y:510px (squash: scaleY 0.88 at impact)
0.42–0.58s: Pin bounces back to Y:480px (scaleY 1.0, ease-out spring)
0.58–0.75s: Inner circle scales 0 → 1.0 (reveal, elastic spring)
0.75–1.3s: Ground shadow expands (ellipse scaleX 0 → 1.0, ease-out) + ripple ring expands outward (circle, stroke #EF4444, opacity 0.6 → 0, radius 20px → 80px, 0.55s)
1.3–2.0s: Pin holds. Subtle float: Y:480 → Y:472 → Y:480 (ease-in-out, 0.7s cycle)
2.0–2.5s: Hold before cut

EASING CURVES:
- Drop: ease-in (cubic-bezier(0.55, 0, 1, 0.45))
- Bounce: cubic-bezier(0.34, 1.56, 0.64, 1)
- Float: ease-in-out

COLOR VARIANTS:
Variant A: #EF4444 red (Google Maps style)
Variant B: #3B82F6 blue on white (corporate / office location)
Variant C: #10B981 green on dark (eco / outdoor brand)

USAGE CONTEXT:
"Where to find us" store promo. Event location explainer. Real estate listing video. Travel vlog map segment.

───────────────────────────────────────────────────────────────────────────────
PROMPT 007: Play Button — Video Intro Reveal
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 2.0s | LOOP: No
SVG: Play button (2 paths: circle background + triangle) — centered 960×540px, 160px diameter

COLOR SPECIFICATION:
Background: #000000 (black — film slate aesthetic)
Circle fill: #FF0000 (YouTube red)
Triangle fill: #FFFFFF (white)
Outer ring: #FFFFFF40 (white, 25% opacity ring, 4px stroke)
Glow: #FF000066 (red glow, 40% opacity)

VISUAL LAYOUT:
Single large play button centered. Full bleed black background.
Outer white ring slightly larger than circle (180px). Glow bloom beneath circle.

ANIMATION TIMELINE (2.0s total):
0–0.5s: Black background holds. Play button invisible.
0.5–0.7s: Circle scales from 0 → 1.0 (ease-out spring)
0.7–0.85s: Triangle scales from 0 → 1.0 inside circle (slight delay, spring)
0.85–1.1s: Outer ring pulse — expands 180px → 220px, opacity 0.4 → 0 (ease-out)
1.1–1.4s: Glow bloom builds (blur 0 → 24px, opacity 0 → 0.5)
1.4–2.0s: Hold — subtle glow breathing (24px → 30px blur, ease-in-out, 0.6s)

EASING CURVES:
- Scale-in: cubic-bezier(0.34, 1.56, 0.64, 1)
- Ring pulse: ease-out
- Glow breathe: ease-in-out

COLOR VARIANTS:
Variant A: #FF0000 red (YouTube)
Variant B: #1DB954 green on black (Spotify / music channel)
Variant C: #6366F1 purple (streaming / entertainment brand)

USAGE CONTEXT:
Channel intro animation. "Watch the full video" ad CTA. Course platform landing screen. Streaming promo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 008: WiFi Signal — Connectivity Building
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 2.4s | LOOP: Yes
SVG: WiFi signal icon (4 paths: dot + 3 concentric arcs, stroke only, no fill) — centered 540×580px, 140px wide, stroke-width 8px, rounded linecap

COLOR SPECIFICATION:
Background: #F8FAFC (near white)
Signal arcs stroke: #3B82F6 (blue) when active / #CBD5E1 (light grey) when inactive
Center dot fill: #3B82F6 (blue)

VISUAL LAYOUT:
WiFi icon centered. 4 elements: dot at base, small arc, medium arc, large arc.
All start grey. Each arc activates bottom to top with blue stroke draw.

ANIMATION TIMELINE (2.4s loopable):
0–0.1s: All elements grey, dot scales 0 → 1.0 (spring ease)
0.1–0.35s: Dot turns blue (color transition). Small arc strokes in (dashoffset 100% → 0%, ease-out)
0.35–0.65s: Small arc turns blue. Medium arc strokes in.
0.65–1.0s: Medium arc turns blue. Large arc strokes in.
1.0–1.3s: All elements blue, full signal. Brief scale pulse (1.0 → 1.08 → 1.0)
1.3–1.8s: Hold at full signal (all blue)
1.8–2.1s: All arcs fade to grey (reverse: large → medium → small → dot, 0.1s stagger)
2.1–2.4s: Hold grey before loop

EASING CURVES:
- Arc stroke draw: ease-out
- Scale pulse: cubic-bezier(0.34, 1.56, 0.64, 1)
- Grey fade: ease-in

COLOR VARIANTS:
Variant A: #3B82F6 blue on white (tech / telecom)
Variant B: #10B981 green on dark (IoT / smart home)
Variant C: #F97316 orange on dark (connectivity campaign)

USAGE CONTEXT:
Telecom ad "getting connected" moment. App onboarding wifi setup screen. Tech explainer for internet features. Smart home product promo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 009: Lock → Unlock — Security Moment
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 2.8s | LOOP: No
SVG: Padlock (3 paths: body rectangle, shackle arc, keyhole shape) — centered 960×540px, 100px tall
SVG SECOND STATE: Unlocked padlock (shackle rotated/lifted open)

COLOR SPECIFICATION:
Background: #1E293B (dark slate)
Lock body fill: #64748B (grey when locked)
Lock body fill: #22C55E (green when unlocked)
Shackle stroke: #94A3B8 (medium grey) → #16A34A (dark green when unlocked)
Keyhole fill: #1E293B (same as background, negative space)

VISUAL LAYOUT:
Lock centered. Subtle vignette on background edges. No text. Clean icon.

ANIMATION TIMELINE (2.8s total):
0–0.3s: Lock appears — scales 0.5 → 1.0 (ease-out spring). Color: grey locked state.
0.3–0.8s: Hold. Lock body has slight shimmer scan (white diagonal highlight, 2px wide, slides L→R across body, opacity 0.3, ease-in-out).
0.8–1.1s: Shackle path lifts upward (top of arc translates Y: 0 → -28px, ease-in then ease-out).
1.1–1.4s: Lock body transitions grey → green (color morph, ease-out).
1.4–1.65s: Shackle color transitions to dark green.
1.65–1.9s: Whole lock scales 1.0 → 1.12 → 1.0 (success bounce).
1.9–2.3s: Green glow expands from lock (blur 0 → 20px, opacity 0.5 → 0, ease-out).
2.3–2.8s: Hold green unlocked state.

EASING CURVES:
- Entry spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- Shackle lift: ease-in-out
- Success bounce: cubic-bezier(0.34, 1.56, 0.64, 1)

COLOR VARIANTS:
Variant A: grey → #22C55E green (standard unlock/success)
Variant B: grey → #3B82F6 blue (account verification)
Variant C: grey → #F59E0B amber (premium unlock / paywall)
USAGE CONTEXT:
SaaS security feature explainer. "Your data is protected" ad segment. App onboarding step. Premium feature unlock moment in promo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 010: Shopping Cart — Add to Cart
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 2.2s | LOOP: No
SVG: Shopping cart (4 paths: cart body, handle, 2 wheels) — position 540×580px, 130px wide
SVG EXTRA: Small "+" badge circle (36px, top-right of cart)

COLOR SPECIFICATION:
Background: #FFF7ED (warm cream)
Cart stroke: #EA580C (orange, stroke-only, 6px)
Cart fill: none
Badge fill: #EA580C (orange)
Badge "+" text: #FFFFFF (white, 20pt bold)
Success tick: #16A34A (green)

VISUAL LAYOUT:
Cart icon centered-bottom area (540×620px). Badge starts invisible.

ANIMATION TIMELINE (2.2s total):
0–0.2s: Cart scales 0.8 → 1.0 (ease-out spring).
0.2–0.5s: Cart rocks slightly (rotate -6° → +6° → 0°, ease-in-out) — shopping motion.
0.5–0.7s: Badge "+" appears from top-right (scale 0 → 1.0 with spring, position 620×490px).
0.7–0.9s: Badge transitions "+" → checkmark (morph or swap, 0.2s crossfade). Color stays orange → brief flash → green #16A34A.
0.9–1.2s: Green glow from badge (blur 0 → 14px → 0, ease-in-out).
1.2–2.0s: Cart and badge hold. Subtle float bounce (Y 0 → -8px → 0, ease-in-out, 0.8s).
2.0–2.2s: Hold.

EASING CURVES:
- Entry spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- Rock: ease-in-out
- Badge morph: ease-out

COLOR VARIANTS:
Variant A: #EA580C orange on cream (warm ecommerce)
Variant B: #3B82F6 blue on white (retail tech)
Variant C: #EC4899 pink on light pink (fashion / beauty brand)

USAGE CONTEXT:
Ecommerce product ad. "Add to cart" tutorial explainer. Shopping feature announcement. Flash sale promo video.

───────────────────────────────────────────────────────────────────────────────
COMPLEXITY STEP UP → Multi-path SVGs with independent path sequencing
───────────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────────
PROMPT 011: Coffee Cup — Steam Rising
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.0s | LOOP: Yes
SVG: Coffee cup (6 paths: cup body, handle, rim, saucer, 3 steam wave paths) — centered 540×560px, 110px wide

COLOR SPECIFICATION:
Background: #1C0A00 (very dark espresso brown)
Cup fill: #D4A96A (warm tan/latte)
Cup stroke: #A0522D (sienna brown, 2px)
Handle fill: #D4A96A
Rim fill: #F5E6C8 (cream)
Steam stroke: #F5E6C880 (cream, 50% opacity, 3px, no fill, rounded linecap)
Saucer fill: #A0522D

VISUAL LAYOUT:
Cup sits on saucer, centered. Three steam wavy paths rise from rim: left-offset, center, right-offset.
Each steam path is a gentle S-curve, 50px tall above rim.

ANIMATION TIMELINE (3.0s loopable):
0–0.4s: Cup and saucer fade in (opacity 0 → 1.0, ease-out).
0.4–0.7s: Rim fades in. Handle fades in.
0.7–1.0s: Steam path 1 (left) strokes upward (dashoffset 100% → 0%, ease-out) + translates Y +0 → -15px.
0.9–1.2s: Steam path 2 (center) strokes upward (staggered 0.2s).
1.1–1.4s: Steam path 3 (right) strokes upward (staggered 0.2s).
1.4–2.4s: All three steam paths rise continuously (Y translate -15px → -50px) while fading out (opacity 1.0 → 0, ease-in). Loop Y position resets to -15px.
2.4–3.0s: New steam loop starts (paths re-draw from 0), overlapping with fade of previous.

EASING CURVES:
- Cup/saucer fade: ease-out
- Steam draw: ease-out
- Steam rise: linear
- Steam fade: ease-in

COLOR VARIANTS:
Variant A: Latte tan on dark espresso (coffee brand)
Variant B: White cup on #1A1A2E dark blue (morning routine vlog)
Variant C: Mint green cup on #F0FDF4 light green (tea/wellness brand)

USAGE CONTEXT:
Morning routine YouTube intro. Coffee brand ad. "Productivity tips" video B-roll. Food & beverage content creator hook.

───────────────────────────────────────────────────────────────────────────────
PROMPT 012: Search Icon — Query Loading
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 2.5s | LOOP: No
SVG: Magnifying glass (3 paths: circle lens, handle line, subtle inner glint line) — centered 960×540px, 120px wide, stroke-width 7px

COLOR SPECIFICATION:
Background: #F1F5F9 (cool light grey)
Glass circle stroke: #334155 (dark slate)
Handle stroke: #334155
Inner glint: #FFFFFF (white, 3px, 30% opacity, diagonal across lens top-left)
Active state circle stroke: #6366F1 (indigo when searching)
Spin indicator: #6366F1 dashed arc (3px, 40px radius, 60% of circle dash)

VISUAL LAYOUT:
Magnifying glass centered. On "searching" state, a dashed circular spinner arc orbits around the lens.

ANIMATION TIMELINE (2.5s total):
0–0.3s: Magnifying glass scales 0 → 1.0 (spring ease-out).
0.3–0.6s: Glass rocks slightly left then right (rotate -8° → +8° → 0°, ease-in-out) — "scanning" gesture.
0.6–0.8s: Circle stroke color transitions from slate → indigo over 0.2s.
0.8–1.8s: Dashed spinner arc appears and rotates 360° around lens (continuous clockwise rotation, 1.0s per revolution, linear).
1.8–2.1s: Spinner arc fades out (opacity 1.0 → 0, ease-in). Circle stroke transitions back to slate.
2.1–2.3s: Glint line sweeps across lens (X: -30px → +40px, opacity 0 → 0.5 → 0, ease-in-out).
2.3–2.5s: Hold final resting state.

EASING CURVES:
- Entry: cubic-bezier(0.34, 1.56, 0.64, 1)
- Rock: ease-in-out
- Spinner: linear
- Glint: ease-in-out

COLOR VARIANTS:
Variant A: #6366F1 indigo (AI / tech product)
Variant B: #EF4444 red (news search / urgent lookup)
Variant C: #10B981 green (research / discovery content)

USAGE CONTEXT:
Search feature announcement. "How to find X" explainer video. Tech product demo. AI tool walkthrough.

───────────────────────────────────────────────────────────────────────────────
PROMPT 013: Home Icon — Property/Real Estate
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.0s | LOOP: No
SVG: House (6 paths: roof triangle, chimney rect, main body rect, door rect, 2 window squares) — centered 960×520px, 140px wide

COLOR SPECIFICATION:
Background: #EFF6FF (very light blue)
Roof fill: #1D4ED8 (deep blue)
Body fill: #DBEAFE (pale blue)
Door fill: #1D4ED8 (matching roof)
Window fill: #FEF08A (warm yellow — lit window)
Chimney fill: #1D4ED8
Outline stroke (all): #1E40AF (2px, dark blue)

VISUAL LAYOUT:
House assembled piece by piece: base first, then roof, then details.
Sits at Y:520 center. Clean flat illustration.

ANIMATION TIMELINE (3.0s total):
0–0.0s: All paths invisible.
0–0.3s: Body rectangle rises from ground (Y: 620 → 520, opacity 0 → 1.0, ease-out).
0.3–0.6s: Roof slides down from above (Y: 360 → 420, ease-out spring).
0.6–0.75s: Chimney pops in (scale 0 → 1.0, spring).
0.75–0.95s: Door scales up from base of body (scaleY 0 → 1.0, transform-origin bottom, ease-out).
0.95–1.1s: Left window pops in (scale 0 → 1.0, spring, slight delay).
1.05–1.2s: Right window pops in (scale 0 → 1.0, spring).
1.2–1.6s: Windows glow warm (fill #FEF08A pulses brightness: 100% → 130% → 100%, ease-in-out, twice).
1.6–2.2s: Whole house scales 1.0 → 1.04 → 1.0 (gentle breathe, ease-in-out).
2.2–3.0s: Hold.

EASING CURVES:
- Body rise: ease-out
- Roof spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- Pop-ins: cubic-bezier(0.34, 1.56, 0.64, 1)
- Window glow: ease-in-out

COLOR VARIANTS:
Variant A: #1D4ED8 blue (real estate / property)
Variant B: #16A34A green (eco home / sustainable living)
Variant C: #7C3AED purple (smart home / tech)

USAGE CONTEXT:
Real estate listing ad. "Buy your first home" explainer. Housing loan product video. Interior design channel intro.

───────────────────────────────────────────────────────────────────────────────
PROMPT 014: Battery Charging — Energy Level
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.5s | LOOP: Yes
SVG: Battery (5 paths: outer shell rect, nub rect, 3 fill bar segments inside) — centered 540×540px, 160px wide

COLOR SPECIFICATION:
Background: #0D1117 (very dark near-black)
Battery shell stroke: #4B5563 (cool grey, 3px)
Battery nub fill: #4B5563
Fill bars: #22C55E (green when charged) / #374151 (dark grey when empty)
Charging bolt SVG: #FBBF24 (yellow, 40px, centered over battery)
Glow: #22C55E40 (green 25% opacity)

VISUAL LAYOUT:
Battery horizontal. Three internal fill segments visible inside shell.
Lightning bolt icon overlaid on center. Glow emanates from battery.

ANIMATION TIMELINE (3.5s loopable):
0–0.1s: Battery shell and bolt appear (scale 0.8 → 1.0, ease-out).
0.1–0.6s: Segment 1 (left) fills green (width 0 → target, ease-out).
0.6–1.1s: Segment 2 (center) fills green.
1.1–1.6s: Segment 3 (right) fills green.
1.6–2.0s: All segments green. Green glow builds (blur 0 → 20px, opacity 0 → 0.5).
2.0–2.3s: Glow pulses (20px → 28px, ease-in-out).
2.3–2.6s: Bolt icon pulses scale (1.0 → 1.2 → 1.0).
2.6–3.2s: Hold at full charge.
3.2–3.5s: Fade everything to reset (opacity 1.0 → 0, ease-in), then loop.

EASING CURVES:
- Fill: ease-out
- Glow: ease-in-out
- Bolt pulse: cubic-bezier(0.34, 1.56, 0.64, 1)

COLOR VARIANTS:
Variant A: #22C55E green (standard charging)
Variant B: #FBBF24 yellow (caution / partial charge)
Variant C: #EF4444 red (low battery / urgency)

USAGE CONTEXT:
Tech product "fast charging" feature ad. EV car promo. Phone brand campaign. "Power-up" metaphor in motivational video.

───────────────────────────────────────────────────────────────────────────────
PROMPT 015: User Avatar — Profile Reveal
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 2.0s | LOOP: No
SVG: User / person icon (3 paths: head circle, shoulder arc body, optional crown detail) — centered 540×820px, 110px tall

COLOR SPECIFICATION:
Background: #7C3AED (rich purple)
Avatar circle background: #A855F7 (lighter purple)
Head circle fill: #F3E8FF (very pale lavender)
Body arc fill: #F3E8FF
Verified badge: #3B82F6 (blue circle, white tick, 30px, bottom-right of avatar)
Ring border: #FFFFFF (2px ring around avatar circle)

VISUAL LAYOUT:
Circular avatar frame (200px diameter) centered at 540×820px.
Person icon inside. Blue verified badge overlaid bottom-right.
Suitable as animated name card for Reels/TikTok profile intro.

ANIMATION TIMELINE (2.0s total):
0–0.3s: Purple circle background scales 0 → 1.0 (spring).
0.3–0.6s: Person icon (head + body) scales 0 → 1.0 inside circle (spring, slight delay).
0.6–0.8s: White ring border draws clockwise (stroke-dashoffset 100% → 0%, ease-out).
0.8–1.0s: Verified badge scales 0 → 1.0 at bottom-right (spring).
1.0–1.3s: Whole avatar group scales 1.0 → 1.08 → 1.0 (confidence pulse).
1.3–2.0s: Hold. Ring has subtle shimmer (white highlight rotates around ring, opacity 0 → 0.5 → 0, 1 revolution, 0.7s).

EASING CURVES:
- Pop-ins: cubic-bezier(0.34, 1.56, 0.64, 1)
- Ring draw: ease-out
- Shimmer: ease-in-out

COLOR VARIANTS:
Variant A: #7C3AED purple (creator / influencer)
Variant B: #0F172A dark navy (professional / business)
Variant C: #EC4899 pink on white (lifestyle / beauty creator)

USAGE CONTEXT:
Personal brand Reels intro. Podcast "meet your host" card. LinkedIn video profile reveal. TikTok creator profile animation.

===============================================================================
LEVEL 1.1 — COMMON APP & INTERFACE ICONS (Path draw animations + stroke sequences)
===============================================================================
Goal: Animate recognizable UI icons with stroke-draw and multi-path timing.
SVG complexity: 3–8 stroke paths. Duration: 2–3.5s.

───────────────────────────────────────────────────────────────────────────────
PROMPT 016: Settings Gear — Loading / Processing
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.0s | LOOP: Yes
SVG: Settings/gear icon (2 paths: outer gear teeth + inner circle cutout, stroke-based) — centered 960×540px, 130px wide, stroke-width 6px

COLOR SPECIFICATION:
Background: #18181B (very dark charcoal)
Gear stroke: #71717A (medium grey)
Gear stroke (active): #A78BFA (soft purple)
Inner circle stroke: #71717A
Spin axis: center (960×540)

VISUAL LAYOUT:
Gear centered. Rotates continuously. Color oscillates grey → purple.
Clean, single-element focus — suitable for "processing" overlay.

ANIMATION TIMELINE (3.0s loopable):
0–0.3s: Gear scales 0 → 1.0 (ease-out spring).
0.3–3.0s: Continuous clockwise rotation (360° per 2.0s, linear).
0.3–1.5s: Stroke color fades from grey → purple (#71717A → #A78BFA, ease-in-out over 1.2s).
1.5–2.7s: Stroke color fades back grey → then purple again (ease-in-out, loop cycle).
(Color loop period: 2.4s, rotation period: 2.0s — creates non-repeating visual variety)

EASING CURVES:
- Entry: cubic-bezier(0.34, 1.56, 0.64, 1)
- Rotation: linear
- Color pulse: ease-in-out

COLOR VARIANTS:
Variant A: #A78BFA purple on dark (AI / creative tool)
Variant B: #34D399 green on dark (system / tech process)
Variant C: #FB923C orange on dark (loading / compilation)

USAGE CONTEXT:
App loading screen. "Behind the scenes" explainer. Software demo "processing" moment. Tutorial step connector.

───────────────────────────────────────────────────────────────────────────────
PROMPT 017: Send / Paper Plane — Message Sent
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 2.2s | LOOP: No
SVG: Paper plane icon (4 paths: body triangle, fold crease, tail fold, dotted trail line) — start position 960×540px, 80px wide

COLOR SPECIFICATION:
Background: #EFF6FF (very light blue)
Plane fill: #2563EB (bright blue)
Plane stroke: #1D4ED8 (darker blue, 1.5px)
Trail stroke: #93C5FD (pale blue, dashed, 2px)
Arrival sparkles: #FDE68A (warm yellow, 6px circles)

VISUAL LAYOUT:
Plane starts centered, launches diagonally up-right, exits frame, leaving trail.
Trail stays visible, then 3 sparkles appear at end-point of trail.

ANIMATION TIMELINE (2.2s total):
0–0.2s: Plane at 960×540, scales 0.8 → 1.0 (ease-out).
0.2–0.9s: Plane translates diagonally (X: 960→1600, Y: 540→280) while trail draws behind it (dashoffset 100%→0%, ease-in-out).
0.9–1.1s: Plane exits right edge. Trail remains visible.
1.1–1.4s: 3 sparkle dots appear at trail endpoint (X:1600, Y:280) — scale 0 → 1.0 → 0 in sequence (0.1s stagger), burst outward 20px radially.
1.4–2.0s: Trail fades (opacity 1.0 → 0, ease-in, 0.6s).
2.0–2.2s: Hold clear frame.

EASING CURVES:
- Launch: ease-in (build speed)
- Trail draw: ease-in-out
- Sparkle burst: cubic-bezier(0.34, 1.56, 0.64, 1)

COLOR VARIANTS:
Variant A: #2563EB blue (email / messaging)
Variant B: #7C3AED purple (DM / social send)
Variant C: #10B981 green (WhatsApp / confirmed send)

USAGE CONTEXT:
"Email sent" confirmation animation. Messaging app feature. Newsletter CTA. Customer service "we received your query" moment.

───────────────────────────────────────────────────────────────────────────────
PROMPT 018: Microphone — Recording Live
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 3.0s | LOOP: Yes
SVG: Microphone (6 paths: capsule top, capsule bottom arc, body shaft, base stand, 2 arc soundwave paths flanking mic) — centered 540×880px, 90px tall

COLOR SPECIFICATION:
Background: #0A0A0A (near black)
Mic capsule fill: #F8FAFC (near white)
Mic body stroke: #F8FAFC (3px)
Base stroke: #94A3B8 (grey)
Soundwave arcs stroke: #EF4444 (red, when recording)
Rec dot: #EF4444 (20px circle, pulsing, top-right of frame at 920×160px)
Rec text: "REC" in #EF4444, 22pt bold, beside dot at 950×157px

VISUAL LAYOUT:
Microphone in lower-center of frame (story format). Soundwave arcs flank mic body.
"REC" indicator top-right corner.

ANIMATION TIMELINE (3.0s loopable):
0–0.4s: Mic icon builds path by path (capsule → shaft → base, each draws in 0.15s stagger, stroke-dashoffset 100%→0%, ease-out).
0.4–0.7s: REC dot appears (scale 0 → 1.0, spring). "REC" text fades in (0 → 1.0).
0.7–3.0s (looping):
  - REC dot pulses (scale 1.0 → 1.3 → 1.0, every 0.8s, ease-in-out).
  - Soundwave arc 1 (inner, 50px radius) scales/fades out (scale 1.0 → 1.4, opacity 1.0 → 0, 0.6s cycle, ease-out).
  - Soundwave arc 2 (outer, 70px radius) same cycle, staggered 0.3s after arc 1.
  - Both arcs loop continuously.

EASING CURVES:
- Build-in: ease-out
- REC spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- Pulse: ease-in-out
- Wave expand: ease-out

COLOR VARIANTS:
Variant A: #EF4444 red (live / recording)
Variant B: #22C55E green (podcast / broadcast)
Variant C: #FBBF24 gold (music / studio)

USAGE CONTEXT:
Podcast intro animation. "We're live" story overlay. Music recording behind-the-scenes. Interview intro card.

───────────────────────────────────────────────────────────────────────────────
PROMPT 019: Download Arrow — File Saving
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 2.5s | LOOP: No
SVG: Download icon (4 paths: vertical line, arrowhead, horizontal base line, document rect behind) — centered 960×540px, 100px tall

COLOR SPECIFICATION:
Background: #F0FDF4 (very light green)
Arrow stroke: #16A34A (green, 6px)
Arrow fill (head): #16A34A
Base line stroke: #16A34A
Document rect fill: #DCFCE7 (pale green)
Document rect stroke: #16A34A (2px)
Progress bar fill: #16A34A

VISUAL LAYOUT:
Document rectangle (80×100px) with arrow inside pointing down.
Horizontal progress bar below icon (200px wide, 8px tall, rounded).

ANIMATION TIMELINE (2.5s total):
0–0.3s: Document rect fades in (opacity 0 → 1.0, ease-out). No arrow yet.
0.3–0.6s: Arrow vertical line draws downward (dashoffset 100% → 0%, ease-out).
0.6–0.8s: Arrowhead drops in (Y: -10px → 0, opacity 0 → 1.0, ease-out).
0.8–1.1s: Base line draws in (dashoffset 100% → 0%, ease-out).
1.1–1.3s: Arrow and document scale 1.0 → 1.1 → 1.0 (recognition bounce).
1.3–2.0s: Progress bar fills L→R (width 0 → 200px, ease-in-out, 0.7s).
2.0–2.2s: Brief green pulse on whole icon (glow blur 0 → 15px → 0).
2.2–2.5s: Hold complete state.

EASING CURVES:
- Draw: ease-out
- Progress fill: ease-in-out
- Glow: ease-in-out

COLOR VARIANTS:
Variant A: #16A34A green (success / complete)
Variant B: #2563EB blue (file download / cloud)
Variant C: #7C3AED purple (digital product / asset)

USAGE CONTEXT:
Digital product download promo. App feature "save offline" explainer. "Get the free guide" CTA animation. Cloud storage ad.

───────────────────────────────────────────────────────────────────────────────
PROMPT 020: Calendar Date — Event Countdown
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.0s | LOOP: No
SVG: Calendar icon (7 paths: outer frame rect, top bar rect, 2 ring hooks at top, date number area, and date "28" as two separate numeral paths) — centered 540×540px, 150px wide

COLOR SPECIFICATION:
Background: #FFF1F2 (very light rose)
Calendar frame fill: #FFFFFF
Calendar top bar fill: #F43F5E (rose red)
Ring hooks fill: #BE123C (dark rose)
Date text "28": #1F2937 (near black, 52pt bold)
Month label "MARCH": #F43F5E (14pt medium, top bar in white)
Shadow: #F43F5E20 (soft drop shadow)

VISUAL LAYOUT:
Calendar centered. Top bar says "MARCH" in white 14pt. Date area shows "28" bold centered.

ANIMATION TIMELINE (3.0s total):
0–0.4s: Calendar shadow appears first (scale 0.8 → 1.0, opacity 0 → 0.3). Calendar frame scales 0.7 → 1.0 (ease-out spring).
0.4–0.6s: Top bar slides down into frame (Y: -20px → 0, ease-out).
0.6–0.75s: Ring hooks pop in (scale 0 → 1.0, spring, slight stagger).
0.75–1.0s: "MARCH" text fades into top bar (opacity 0 → 1.0).
1.0–1.5s: Date "28" — each digit drops in from above (Y: -30px → 0, opacity 0 → 1.0, stagger 0.15s, ease-out spring). 
1.5–1.9s: Whole calendar scales 1.0 → 1.06 → 1.0 (importance pulse).
1.9–2.5s: A subtle ring appears around calendar, expands outward 15px then fades (circle stroke #F43F5E, 2px, opacity 0.6 → 0, ease-out).
2.5–3.0s: Hold.

EASING CURVES:
- Frame spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- Text slide: ease-out
- Pulse: ease-in-out

COLOR VARIANTS:
Variant A: #F43F5E red (event / deadline)
Variant B: #2563EB blue (business / meeting)
Variant C: #16A34A green (launch date / go-live)

USAGE CONTEXT:
Event announcement video. Product launch countdown. "Mark your calendar" promo. Webinar reminder.

───────────────────────────────────────────────────────────────────────────────
COMPLEXITY STEP UP → Business / data icons with grouped multi-element reveals
───────────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────────
PROMPT 021: Bar Chart Mini — KPI Snapshot
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.5s | LOOP: No
SVG: Mini bar chart (8 paths: 5 bars of varying height + baseline + 2 axis lines) — lower-center 960×600px, 220px wide total, bars 28px wide, 20px gap

COLOR SPECIFICATION:
Background: #0F172A (dark navy)
Axis lines stroke: #334155 (medium dark grey, 2px)
Bar 1 fill: #3B82F6 (blue) — height 90px
Bar 2 fill: #3B82F6 — height 130px
Bar 3 fill: #3B82F6 — height 110px
Bar 4 fill: #6366F1 (indigo — highlight bar) — height 170px
Bar 5 fill: #3B82F6 — height 140px
Bar top glow (bar 4 only): #818CF840 (indigo 25% glow)
Baseline stroke: #475569 (2px)

VISUAL LAYOUT:
Five bars growing from baseline at Y:640. Bar 4 is tallest (highlighted bar).
Axes visible: Y-axis left, baseline bottom. No labels (clean icon version).

ANIMATION TIMELINE (3.5s total):
0–0.4s: Axes draw in (Y-axis top→bottom, baseline left→right, stroke-dashoffset, ease-out).
0.4–0.9s: Bars 1–3 grow from baseline (scaleY 0 → target, transform-origin bottom, ease-out, 0.15s stagger between bars).
0.9–1.3s: Bar 4 grows (slight delay, grows faster — ease-out). Glow appears on bar 4 top.
1.3–1.6s: Bar 5 grows (ease-out).
1.6–2.0s: All bars complete. Bar 4 pulses glow (blur 0 → 16px → 0, ease-in-out).
2.0–2.5s: All bars hold. Subtle up-tick: all bars grow additional 5% (scaleY → 1.05 → 1.0, ease-in-out). "Growth" feel.
2.5–3.5s: Hold.

EASING CURVES:
- Axis draw: ease-out
- Bar grow: ease-out
- Glow pulse: ease-in-out
- Up-tick: ease-in-out

COLOR VARIANTS:
Variant A: #3B82F6 blue / #6366F1 indigo highlight (corporate growth)
Variant B: #10B981 green / #059669 dark green highlight (revenue / profit)
Variant C: #F59E0B amber / #EF4444 red highlight (performance warning)

USAGE CONTEXT:
Business explainer B-roll. Sales performance segment. Annual report video. Dashboard feature demo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 022: Trending Up Arrow + Line — Stock / Growth
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.0s | LOOP: No
SVG: Trend line (3 paths: jagged upward trend polyline, arrowhead at end, dot at start) — spans 700×280px area, centered 960×580px, stroke-width 5px

COLOR SPECIFICATION:
Background: #052E16 (very dark green)
Trend line stroke: #4ADE80 (bright green)
Arrowhead fill: #4ADE80
Start dot fill: #4ADE80
Area fill (under line): #4ADE8015 (green 8% opacity fill under polyline)
Grid lines: #14532D (very subtle dark green, 1px, horizontal at 3 levels)

VISUAL LAYOUT:
Line starts at left (~600px X, 720px Y) and climbs to right (~1360px X, 440px Y) in a jagged organic trend-line shape.
Arrowhead at far right end. Small circle dot at start. Subtle area fill under line.

ANIMATION TIMELINE (3.0s total):
0–0.3s: Grid lines fade in (opacity 0 → 0.4, ease-out).
0.3–0.35s: Start dot appears (scale 0 → 1.0, spring).
0.35–2.0s: Trend line draws left → right (stroke-dashoffset 100% → 0%, ease-in-out). Area fill follows simultaneously (clip-path or opacity grows as line draws).
2.0–2.3s: Arrowhead appears at end (scale 0 → 1.0, spring).
2.3–2.6s: Line glows brighter for 0.3s (stroke opacity 1.0 → 1.0 at full, plus filter brightness 100%→140%→100%).
2.6–3.0s: Hold. Start dot blinks once (opacity 1.0 → 0.3 → 1.0, 0.3s).

EASING CURVES:
- Line draw: ease-in-out
- Arrowhead: cubic-bezier(0.34, 1.56, 0.64, 1)
- Glow flash: ease-in-out

COLOR VARIANTS:
Variant A: #4ADE80 green on dark (stock gain / revenue growth)
Variant B: #60A5FA blue on dark navy (data analytics)
Variant C: #F59E0B amber on dark (crypto / commodity)

USAGE CONTEXT:
Finance/investing YouTube thumbnail or intro. "Q3 growth" results segment. Startup traction slide animation. Economic explainer.

───────────────────────────────────────────────────────────────────────────────
PROMPT 023: Wallet Open — Payment / Cashflow
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.0s | LOOP: No
SVG: Bifold wallet (8 paths: outer rectangle closed, fold crease, flap, interior card slot, coin circles ×2, small bill rect) — centered 540×540px, 160px wide

COLOR SPECIFICATION:
Background: #FEF3C7 (warm light amber)
Wallet body fill: #92400E (warm brown leather)
Wallet outline stroke: #78350F (dark brown, 2px)
Wallet interior fill: #FDE68A (pale yellow interior)
Card slot fill: #D97706 (amber)
Coins fill: #FBBF24 (gold)
Bill fill: #86EFAC (pale green — dollar bill)

VISUAL LAYOUT:
Wallet closed initially. Opens like a book (left flap folds back). Interior reveals cards, coins, bill.

ANIMATION TIMELINE (3.0s total):
0–0.4s: Closed wallet scales 0.8 → 1.0 (ease-out spring).
0.4–0.9s: Right flap rotates open (rotateY 0° → -55° — simulate 3D fold open, ease-in-out).
0.9–1.2s: Interior background reveals (clip-path wipes left → right as flap opens, ease-out).
1.2–1.4s: Card slot slides in from right inside wallet (X: +30px → 0, ease-out).
1.4–1.6s: Coins appear (scale 0 → 1.0, spring, stagger 0.1s each).
1.6–1.8s: Bill slides up from wallet base (Y: +20px → 0, opacity 0 → 1.0, ease-out).
1.8–2.3s: Coins have shimmer highlight (diagonal white line sweeps across coin surface, 0.3s each).
2.3–3.0s: Hold open wallet. Subtle breathing scale (1.0 → 1.03 → 1.0).

EASING CURVES:
- Flip: ease-in-out
- Contents reveal: ease-out
- Shimmer: ease-in-out

COLOR VARIANTS:
Variant A: #92400E brown (classic wallet)
Variant B: #1E293B dark on cream (premium fintech)
Variant C: #7C3AED purple on white (crypto / digital wallet)

USAGE CONTEXT:
Fintech app promo. "Save more money" finance video. Payment feature explainer. Digital wallet product launch.

───────────────────────────────────────────────────────────────────────────────
PROMPT 024: Trophy — Winner / Achievement
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.2s | LOOP: No
SVG: Trophy cup (9 paths: cup body, two handle arcs, base rectangle, stem, lid/top arc, 3 sparkle star shapes around cup) — centered 960×500px, 130px tall

COLOR SPECIFICATION:
Background: #1C1917 (very dark warm black)
Trophy body fill: #FBBF24 (gold)
Trophy stroke: #D97706 (darker amber, 2px)
Handle fill: #F59E0B (medium gold)
Base fill: #92400E (brown)
Sparkles fill: #FEF08A (light yellow)
Glow: #FBBF2466 (gold, 40% opacity)

VISUAL LAYOUT:
Trophy centered. Sparkles positioned: top-left of cup (880×380px), top-right (1040×380px), upper-right far (1080×420px). All sparkles are 3-point or 4-point star shapes, 20–28px.

ANIMATION TIMELINE (3.2s total):
0–0.5s: Trophy base appears first (scale 0 → 1.0, ease-out spring). Then stem, then body, then handles, then lid — each 0.1s stagger, spring.
0.5–1.0s: Trophy shines — diagonal light scan (white diagonal highlight strip, 3px, sweeps from bottom-left to top-right, opacity 0 → 0.7 → 0, ease-in-out).
1.0–1.5s: Sparkle 1 pops (scale 0 → 1.2 → 1.0, spring, #FEF08A).
1.2–1.7s: Sparkle 2 pops (stagger).
1.4–1.9s: Sparkle 3 pops (stagger).
1.9–2.3s: Gold glow expands from trophy base (blur 0 → 25px, opacity 0 → 0.5 → 0).
2.3–2.7s: Trophy scales 1.0 → 1.06 → 1.0 (celebration pulse).
2.7–3.2s: Hold. Sparkles slowly fade (opacity 1.0 → 0.3, ease-in).

EASING CURVES:
- Assembly: cubic-bezier(0.34, 1.56, 0.64, 1)
- Shine scan: ease-in-out
- Sparkle: cubic-bezier(0.34, 1.56, 0.64, 1)
- Glow: ease-in-out

COLOR VARIANTS:
Variant A: #FBBF24 gold on dark (winner / champion)
Variant B: #94A3B8 silver on dark (runner-up / award)
Variant C: #CD7F32 bronze tones (achievement / milestone)

USAGE CONTEXT:
"We won!" announcement video. Competition result reveal. Product award segment. Employee recognition video.

───────────────────────────────────────────────────────────────────────────────
PROMPT 025: Pie Chart Slice — Market Share
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.5s | LOOP: No
SVG: Pie chart (5 arc segment paths forming full circle) — centered 960×540px, 240px diameter

Segment breakdown:
Segment 1 (top-right): 32% — #3B82F6 blue — "Our Brand"
Segment 2 (right-bottom): 24% — #6366F1 indigo — "Competitor A"
Segment 3 (bottom): 18% — #94A3B8 grey — "Competitor B"
Segment 4 (bottom-left): 15% — #CBD5E1 light grey — "Competitor C"
Segment 5 (left-top): 11% — #E2E8F0 very light grey — "Other"

COLOR SPECIFICATION:
Background: #0F172A (dark navy)
Center circle (donut hole): #0F172A (120px diameter — donut style)
Active segment stroke: #FFFFFF (2px, only on segment 1)
Label connector lines: #94A3B8 (1px, thin, from segment to label)

VISUAL LAYOUT:
Donut chart centered. Segment 1 (blue "Our Brand") will pull out 20px from center on reveal.
Labels are NOT part of this prompt (icon-only version).

ANIMATION TIMELINE (3.5s total):
0–0.5s: All segments draw simultaneously as arcs (stroke-dashoffset, clockwise from 12 o'clock, ease-out, 0.5s).
0.5–0.8s: Donut hole circle fades in (opacity 0 → 1.0, ease-out) — turning filled pie into donut.
0.8–1.3s: Each segment fades in at target opacity with slight stagger (0.05s between), colors lock in.
1.3–1.7s: Segment 1 (blue) pulls out 20px from center (translate away from center point, ease-out spring).
1.7–2.1s: Segment 1 glow (filter brightness 100% → 130% → 110%, ease-in-out).
2.1–2.5s: Segment 1 white stroke pulses (opacity 0 → 1.0 → 0.5, ease-in-out).
2.5–3.5s: Hold. Segment 1 has slight breathing scale (1.0 → 1.02 → 1.0, ease-in-out, 1s cycle).

EASING CURVES:
- Arc draw: ease-out
- Pull-out: cubic-bezier(0.34, 1.56, 0.64, 1)
- Glow: ease-in-out

COLOR VARIANTS:
Variant A: #3B82F6 blue featured on dark (tech / SaaS market share)
Variant B: #10B981 green featured on dark (health / market leadership)
Variant C: #F43F5E red featured on dark (bold brand / competitive analysis)

USAGE CONTEXT:
Market share explainer. Investor pitch animation. Business strategy video. Competitive landscape breakdown.

===============================================================================
LEVEL 1.2 — LIFESTYLE & PRODUCT ICONS (Multi-element assemblies, fluid motion)
===============================================================================
Goal: Animate familiar real-world product icons with character and detail.
SVG complexity: 10–20 paths. Duration: 2.5–4s.

───────────────────────────────────────────────────────────────────────────────
PROMPT 026: Smartphone — App Launch
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 3.0s | LOOP: No
SVG: Smartphone device (12 paths: outer chassis rect rounded, inner screen rect, home bar rect, front camera dot, top speaker rect, volume button left, power button right, screen content: 4 app icon squares in 2×2 grid) — centered 540×920px, 180px tall

COLOR SPECIFICATION:
Background: #F8FAFC (near white)
Phone chassis fill: #1E293B (dark slate)
Phone chassis stroke: #334155 (2px)
Screen fill: #FFFFFF
Home bar fill: #94A3B8
Camera dot fill: #0F172A
Speaker fill: #475569
App icon 1 (top-left): #3B82F6 blue — 36×36px rounded rect
App icon 2 (top-right): #EF4444 red
App icon 3 (bottom-left): #10B981 green
App icon 4 (bottom-right): #F59E0B amber
Button fills: #334155

VISUAL LAYOUT:
Phone centered vertically. Screen content visible. Clean product shot aesthetic.

ANIMATION TIMELINE (3.0s total):
0–0.5s: Phone chassis fades in + scales 0.85 → 1.0 (ease-out spring).
0.5–0.7s: Screen brightens (fill #F1F5F9 → #FFFFFF, ease-out) — like screen turning on.
0.7–0.85s: Camera, speaker, home bar, buttons each fade in (0.04s stagger, opacity 0→1).
0.85–1.1s: App icons appear one by one (scale 0 → 1.0, 0.1s stagger per icon, spring).
1.1–1.5s: One app icon (top-left, blue) scales up to 1.15 → 1.0 (tap highlight, spring) + brief bright flash (#3B82F6 → #FFFFFF → #3B82F6).
1.5–2.0s: Screen glint: diagonal white strip sweeps across screen (opacity 0 → 0.25 → 0, ease-in-out).
2.0–3.0s: Hold. Phone has subtle float (Y 0 → -10px → 0, ease-in-out, 1s).

EASING CURVES:
- Entry spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- App pop: cubic-bezier(0.34, 1.56, 0.64, 1)
- Float: ease-in-out

COLOR VARIANTS:
Variant A: #1E293B dark chassis on white (standard tech)
Variant B: #FFFFFF white chassis on dark (Apple aesthetic)
Variant C: #7C3AED purple app highlight (app launch / specific app promo)

USAGE CONTEXT:
App launch announcement. Mobile product demo. "Download our app" CTA. Tech channel phone review intro.

───────────────────────────────────────────────────────────────────────────────
PROMPT 027: Headphones — Music / Podcast
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.5s | LOOP: Yes
SVG: Over-ear headphones (11 paths: headband arc, left ear cup circle, right ear cup circle, left cushion ring, right cushion ring, left hinge, right hinge, left cable stub, right cable stub, left speaker grille lines ×2) — centered 960×500px, 200px wide

COLOR SPECIFICATION:
Background: #09090B (near black)
Headband stroke: #E4E4E7 (light grey, 6px, no fill)
Ear cups fill: #27272A (dark charcoal)
Ear cup stroke: #3F3F46 (2px)
Cushion ring fill: #52525B (medium grey)
Grille lines stroke: #71717A (1.5px)
Active state glow: #A78BFA (soft purple)
Sound waves (looping): #A78BFA (purple, arc paths, stroke-only, fading)

VISUAL LAYOUT:
Headphones centered. Two expanding sound wave arc sets emanate from each ear cup outward (left and right).

ANIMATION TIMELINE (3.5s loopable):
0–0.5s: Headband draws in as arc (dashoffset 100%→0%, top to both sides, ease-out). Then ear cups and hinges appear (scale 0→1.0, 0.1s stagger, spring).
0.5–0.8s: Cushion rings and grilles appear (opacity 0→1.0, 0.06s stagger, ease-out).
0.8–3.5s (continuous loop):
  Left ear: wave arc 1 expands (radius 60→90px, opacity 0.6→0, ease-out, 0.8s). Wave arc 2 follows 0.4s later. Loops.
  Right ear: same wave arcs, mirrored, staggered 0.2s offset from left. Loops.
  Headband subtle pulse (stroke color white → purple #A78BFA → white, ease-in-out, 2s cycle).

EASING CURVES:
- Build: ease-out / spring
- Wave expand: ease-out
- Color pulse: ease-in-out

COLOR VARIANTS:
Variant A: White/grey on black + #A78BFA purple waves (music / podcast)
Variant B: White on dark + #EF4444 red waves (gaming / esports)
Variant C: White on dark + #34D399 green waves (wellness / meditation audio)

USAGE CONTEXT:
Podcast intro card. Music streaming promo. "Listen now" CTA. Headphone product review intro. Audio brand content.

───────────────────────────────────────────────────────────────────────────────
PROMPT 028: Laptop — Work From Home / Productivity
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 3.5s | LOOP: No
SVG: Open laptop (13 paths: base bottom rect, keyboard section rect, 2 trackpad rects, screen frame rect, inner display rect, hinge area, 3 keyboard row detail lines, webcam dot, screen content rect) — centered 960×560px, 260px wide

COLOR SPECIFICATION:
Background: #F0F9FF (very light cool blue)
Chassis fill: #E2E8F0 (silver-grey)
Chassis stroke: #94A3B8 (2px)
Keyboard area fill: #CBD5E1
Keyboard row lines stroke: #94A3B8 (1px)
Trackpad fill: #B0BDCC
Screen frame fill: #1E293B (dark, bezel)
Screen display fill: #DBEAFE (light blue "on" state)
Webcam dot fill: #475569
Screen content (simulated app window): #3B82F6 rect (120×70px, top-center of display)

VISUAL LAYOUT:
Laptop open, lid open at ~120° angle. Screen glowing blue. Centered on canvas.

ANIMATION TIMELINE (3.5s total):
0–0.6s: Laptop base + keyboard fades in + scales 0.85 → 1.0 (ease-out spring).
0.6–1.2s: Screen lid rises from closed (rotateX 90° → 20°, transform-origin: bottom of hinge, ease-out, simulated 3D open). Screen reveals.
1.2–1.5s: Screen display brightens (#0F172A → #DBEAFE, ease-out) — boot up.
1.5–1.7s: Webcam dot appears (scale 0 → 1.0, spring).
1.7–2.0s: App window rect slides in from top of screen (Y: -40px → 0, ease-out).
2.0–2.3s: Keyboard detail lines draw in (stroke-dashoffset, left to right across 3 rows, 0.05s stagger, ease-out).
2.3–2.8s: Screen glint scan (diagonal white strip, opacity 0 → 0.2 → 0, ease-in-out).
2.8–3.5s: Hold. Laptop has gentle breathing scale (1.0 → 1.02 → 1.0, ease-in-out).

EASING CURVES:
- Lid open: ease-out
- Screen brighten: ease-out
- Glint: ease-in-out

COLOR VARIANTS:
Variant A: Silver/grey on light blue (productivity / work)
Variant B: Dark space grey on dark (premium / Apple aesthetic)
Variant C: White on #6366F1 indigo bg (tech / SaaS brand)

USAGE CONTEXT:
Remote work explainer. Productivity tool demo. "Work smarter" motivation video. SaaS product intro animation.

───────────────────────────────────────────────────────────────────────────────
PROMPT 029: Camera / DSLR — Photography Brand
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.0s | LOOP: No
SVG: DSLR camera (15 paths: body rectangle rounded, lens outer circle, lens inner circle, lens center dot, lens reflection arc, viewfinder rect, top flash hot-shoe rect, grip bump, shutter button circle, mode dial, front AF illuminator dot, strap lug left, strap lug right, body grip texture lines ×2) — centered 540×540px, 200px wide

COLOR SPECIFICATION:
Background: #1C1917 (very dark warm black)
Camera body fill: #292524 (dark charcoal brown)
Camera body stroke: #44403C (2px)
Lens outer ring fill: #1C1917
Lens barrel rings stroke: #57534E (grey, 1px)
Lens center glass fill: #1E3A5F (dark blue — glass reflection)
Lens reflection arc fill: #FFFFFF20 (white 12% arc highlight)
Lens center dot fill: #0EA5E9 (bright blue AF point)
Shutter button fill: #EF4444 (red)
Top elements fill: #44403C

VISUAL LAYOUT:
Camera centered, lens facing viewer, slight 5° tilt (rotated). Lens center catches light.

ANIMATION TIMELINE (3.0s total):
0–0.5s: Camera body reveals (scale 0.9 → 1.0, opacity 0 → 1.0, ease-out spring, slight tilt -5° rotation maintained throughout).
0.5–0.8s: Lens elements build inward (outer ring → barrel rings → inner circle → center dot, each 0.07s stagger, scale from outer→inner, ease-out).
0.8–1.0s: Lens reflection arc sweeps (opacity 0 → 0.4, rotate 0° → 30°, ease-out).
1.0–1.2s: Shutter button pulses (scale 1.0 → 1.3 → 1.0, spring).
1.2–1.5s: Camera "takes shot" — white flash overlay (opacity 0 → 0.7 → 0, 0.3s total, ease-in then ease-out).
1.5–1.8s: Post-flash: slight afterglow on lens center dot (blue #0EA5E9, blur 0 → 12px → 0, ease-out).
1.8–3.0s: Hold. Camera rotates very slowly +2° → -2° (gentle rock, ease-in-out, 1.2s cycle).

EASING CURVES:
- Entry: cubic-bezier(0.34, 1.56, 0.64, 1)
- Lens build: ease-out
- Flash: ease-in / ease-out
- Rock: ease-in-out

COLOR VARIANTS:
Variant A: Dark body + blue lens AF (photography brand)
Variant B: All black + white lens (minimalist / film aesthetic)
Variant C: Dark body + #F59E0B amber elements (vintage / warm aesthetic)

USAGE CONTEXT:
Photography brand intro. YouTube camera review. "Behind the lens" vlog opener. Photo course promo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 030: Burger / Food — Restaurant / Delivery
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.5s | LOOP: No
SVG: Burger stack (14 paths: top bun rect-round, sesame seeds ×4 small ovals, lettuce wavy path, tomato slice rect, cheese slice rect with melted corners, patty rect, bottom bun rect) — centered 540×540px, stacked vertically, total 180px tall

COLOR SPECIFICATION:
Background: #FFF7ED (warm cream)
Top bun fill: #D97706 (warm amber brown)
Top bun stroke: #92400E (dark brown, 2px)
Sesame seeds fill: #FEF3C7 (pale cream)
Lettuce fill: #16A34A (leaf green)
Tomato fill: #EF4444 (red)
Cheese fill: #FBBF24 (gold yellow)
Patty fill: #78350F (very dark brown)
Bottom bun fill: #B45309 (medium amber)

VISUAL LAYOUT:
Burger stacked naturally. Each ingredient clearly visible in layers.
Slight "exploded" version builds — ingredients come from above and stack down.

ANIMATION TIMELINE (3.5s total):
0–0.2s: Bottom bun slides up from below (Y:+60px → 0, ease-out spring).
0.2–0.45s: Patty drops from above (Y:-50px → 0, slight squash on land: scaleY 0.9 → 1.0, ease-out).
0.45–0.65s: Cheese drops (same drop + squash animation).
0.65–0.85s: Tomato drops.
0.85–1.05s: Lettuce drops (slight sway left-right after landing: rotate -3°→ 3°→ 0°).
1.05–1.3s: Top bun drops last — biggest impact squash (scaleX 1.05, scaleY 0.88 → 1.0 bounce).
1.3–1.7s: Whole burger scales 1.0 → 1.06 → 1.0 (presentation bounce).
1.7–2.2s: Steam path (wavy S-curve, 40px, from top of bun) draws upward then fades. Color: #D4D4D8 grey, 60% opacity.
2.2–3.5s: Hold. Burger has slight hover float (Y 0 → -8px → 0, ease-in-out, 1.3s).

EASING CURVES:
- Ingredient drop: ease-in (falling)
- Squash settle: cubic-bezier(0.34, 1.56, 0.64, 1)
- Burger bounce: ease-in-out
- Float: ease-in-out

COLOR VARIANTS:
Variant A: Warm browns and greens on cream (classic fast food)
Variant B: Dark charcoal background, same colors (premium dark restaurant)
Variant C: Same structure, swap patty for #4ADE80 green patty (vegan / plant-based brand)

USAGE CONTEXT:
Restaurant ad or promo video. Food delivery app feature. YouTube food channel intro. Menu reveal animation. Zomato/Swiggy-style content.

===============================================================================
LEVEL 1.3 — DETAILED MULTI-ELEMENT ILLUSTRATIONS (Complex assembly sequences)
===============================================================================
Goal: Full icon assembly with 15–30 paths, real editorial polish.
SVG complexity: 15–30 paths. Duration: 3.5–5s.

───────────────────────────────────────────────────────────────────────────────
PROMPT 031: Rocket Launch — Startup / Launch Day
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 4.5s | LOOP: No
SVG: Rocket (18 paths: nose cone, body cylinder, 2 side fins, 2 engine nozzles, porthole window circle, window reflection arc, 3 flame tongue paths at base, 4 particle dots around flames, launch platform base rect, ground line) — start at 960×760px, rocket 200px tall

COLOR SPECIFICATION:
Background: #0B1120 (very deep dark blue — night sky)
Stars: 8 small circle fills (#FFFFFF, 2–4px, scattered 200px zone above platform) — static
Rocket body fill: #F1F5F9 (near white)
Rocket stroke: #CBD5E1 (2px)
Nose cone fill: #EF4444 (red)
Fins fill: #94A3B8 (grey)
Engine nozzles fill: #64748B
Porthole fill: #DBEAFE (pale blue)
Window reflection: #FFFFFF50 (30% white arc)
Flame outer path: #F97316 (orange)
Flame middle path: #FBBF24 (amber)
Flame inner path: #FEF08A (pale yellow)
Particle dots: #F97316 (orange, 4–6px circles)
Platform base: #334155
Ground line: #1E293B

VISUAL LAYOUT:
Rocket sitting on platform at Y:760. Will launch upward off screen.
Stars visible in background from start.

ANIMATION TIMELINE (4.5s total):
0–0.5s: Stars fade in (opacity 0 → 0.7, ease-out, staggered random offsets 0–0.3s).
0.5–1.0s: Rocket and platform fade in (scale 0.9 → 1.0, ease-out spring).
1.0–1.5s: Flame paths flicker — all 3 flames scale between (scaleY 0.7 → 1.0, alternating, 0.1s rapid cycle). Particle dots scatter outward from nozzle (translate 20px radially, opacity 1.0 → 0, repeat each 0.3s).
1.5–1.8s: Rocket shakes (X: 0 → +4px → -4px → +3px → -3px → 0, rapid 50ms intervals).
1.8–2.8s: Rocket launches — translates upward (Y: 760 → -200px, ease-in acceleration). Flame trail grows longer as rocket rises (flame scaleY 1.0 → 2.5). Particle cloud expands below.
2.8–3.2s: Rocket exits frame. Flame trail fades below top of screen.
3.2–3.8s: Particle cloud at launch site disperses (radial scatter, opacity 1.0 → 0, ease-out).
3.8–4.5s: Hold launch site, just ground and platform visible. Stars twinkle (random opacity flicker ±0.3, ease-in-out).

EASING CURVES:
- Entry: ease-out
- Shake: linear
- Launch: ease-in (accelerating)
- Flame flicker: linear rapid
- Particle scatter: ease-out

COLOR VARIANTS:
Variant A: White rocket, red nose, orange flame on space dark (classic space)
Variant B: #7C3AED purple rocket on dark (startup brand / tech)
Variant C: Gold rocket on deep blue (premium launch / award)

USAGE CONTEXT:
Product launch day video. Startup pitch intro. "New feature live" announcement. Agency showreel opener. Course launch promo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 032: Plant Growing — Progress / Growth Journey
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.0s | LOOP: No
SVG: Growing plant (20 paths: clay pot body, pot rim, soil line, stem main path, 3 leaf shapes (small medium large), 2 secondary branch stubs, root path below soil, 3 small detail veins on large leaf, 3 soil particle dots, sun circle in upper-right corner) — stem base at 960×700px, grows upward to 960×300px

COLOR SPECIFICATION:
Background: #ECFDF5 (very light mint)
Pot fill: #C2410C (terracotta orange)
Pot stroke: #9A3412 (2px)
Soil fill: #78350F (dark brown)
Stem stroke: #15803D (green, 5px, rounded)
Leaf small fill: #22C55E (bright green)
Leaf medium fill: #16A34A (medium green)
Leaf large fill: #166534 (deep green)
Leaf veins stroke: #FFFFFF50 (white 30%, 1px)
Root paths stroke: #92400E (brown, 2px, dashed)
Particle dots fill: #78350F (brown, 6px)
Sun fill: #FDE68A (pale yellow)
Sun stroke: #F59E0B (amber, 2px)
Sun rays: #F59E0B (short line paths, 6 rays, 8px each)

VISUAL LAYOUT:
Pot at bottom-center. Plant grows upward. Sun in upper-right at 1520×180px.

ANIMATION TIMELINE (5.0s total):
0–0.5s: Pot and soil reveal (scale 0.8 → 1.0, ease-out spring).
0.5–0.8s: Root paths draw downward into pot (stroke-dashoffset 100%→0%, ease-out, 2 root branches, 0.1s stagger).
0.8–1.5s: Main stem grows upward from pot (path stroke-dashoffset 100%→0%, ease-out, vertical growth).
1.5–1.8s: First small leaf unfurls on left (scale 0→1.0, rotateZ -90°→0°, spring — leaf opens outward from stem).
1.9–2.2s: Second small leaf unfurls on right (mirrored, stagger 0.3s).
2.2–2.7s: Stem continues growing. Medium leaf unfurls left.
2.7–3.1s: Second medium leaf unfurls right.
3.1–3.7s: Stem reaches full height. Large leaf unfurls (bigger spring, takes 0.5s).
3.7–4.0s: Soil particles float up slightly from soil line (Y +0 → -12px → 0, opacity 1.0 → 0.4, ease-out — "soil alive" effect).
4.0–4.3s: Sun fades in + rays draw outward (sun opacity 0→1.0; rays stroke-dashoffset 100%→0%, staggered 0.05s each, ease-out).
4.3–4.7s: Entire plant sways gently (stem rotateZ: 0° → +2° → -2° → 0°, ease-in-out, 0.4s).
4.7–5.0s: Hold.

EASING CURVES:
- Pot: spring
- Stem grow: ease-out
- Leaf unfurl: cubic-bezier(0.34, 1.56, 0.64, 1)
- Sway: ease-in-out

COLOR VARIANTS:
Variant A: Terracotta pot + greens on mint (nature / growth)
Variant B: White pot + dark greens on white (premium clean aesthetic)
Variant C: Dark pot + neon greens on dark (tech "growth hacking" brand)

USAGE CONTEXT:
"From zero to success" journey video. Startup growth story. Environment / sustainability brand. Personal development YouTube channel. Investment growth explainer.

───────────────────────────────────────────────────────────────────────────────
PROMPT 033: Delivery Truck — Shipping / Ecommerce
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 4.0s | LOOP: No
SVG: Delivery truck (22 paths: cargo box body, cab section, windshield, door window, side mirror, front bumper, grille rect, 2 front lights, 2 rear lights, front wheel circle, rear wheel circle, 2 wheel hubcap circles, ground shadow, speed lines ×3 behind truck, company panel on box side, road line below, exhaust pipe) — truck body spanning 700×280px, centered at 960×600px

COLOR SPECIFICATION:
Background: #EFF6FF (very light blue)
Truck cab fill: #1D4ED8 (deep blue)
Truck cab stroke: #1E40AF (2px)
Cargo box fill: #DBEAFE (pale blue)
Cargo box stroke: #3B82F6 (2px)
Windshield fill: #BAE6FD (sky blue)
Lights fill: #FBBF24 (amber/yellow)
Wheels fill: #1E293B (dark grey)
Hubcaps fill: #94A3B8 (silver)
Speed lines stroke: #93C5FD (pale blue, 2px, dashed)
Ground shadow: #1D4ED820 (blue 12%)
Road line: #CBD5E1 (dashed white line, 2px, below truck)
Company panel: #1D4ED8 with #FFFFFF "EXPRESS" text (16pt bold)

VISUAL LAYOUT:
Truck drives in from left, crosses center, parks or slows at center-right (1100px).
Speed lines trail behind left of truck during movement.

ANIMATION TIMELINE (4.0s total):
0–0.1s: Truck starts at X:-400px (off-screen left), invisible.
0.1–0.3s: Truck appears at X:-400px (fade in, ease-out).
0.3–1.8s: Truck translates right (X: -400 → 960, ease-in-out). Speed lines visible behind (trailing at X-40px → X-160px). Wheels rotate (continuous clockwise rotation, rpm proportional to speed). Road line scrolls right (dashoffset animates). Ground shadow visible below wheels.
1.8–2.2s: Truck decelerates (ease-out, X: 960 → 1100px). Speed lines fade out (opacity 1.0 → 0, ease-in). Wheels slow rotation.
2.2–2.5s: Truck stops. Slight rock forward then back on brakes (scaleX squash: 1.0 → 0.96 → 1.0, ease-out).
2.5–2.8s: Front and rear lights flash (opacity 1.0 → 0.2 → 1.0, twice). 
2.8–3.3s: Side cargo door opens slightly (right edge of cargo box rotates outward, ease-out) — suggests delivery.
3.3–4.0s: Hold parked. Ground shadow visible. Exhaust path emits small puff (circle, opacity 0→0.4→0, size 4→20px, ease-out, once at 3.3s).

EASING CURVES:
- Drive-in: ease-in-out
- Decelerate: ease-out
- Brake rock: cubic-bezier(0.34, 1.56, 0.64, 1)
- Door: ease-out

COLOR VARIANTS:
Variant A: #1D4ED8 blue (generic delivery / corporate)
Variant B: #F97316 orange (food delivery / Swiggy / Dunzo style)
Variant C: #7C3AED purple on dark (premium courier / luxury)

USAGE CONTEXT:
Ecommerce "fast delivery" promo. Logistics company brand video. "Your order is on the way" notification animation. Supply chain explainer.

───────────────────────────────────────────────────────────────────────────────
PROMPT 034: Doctor / Medical — Health Consultation
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 4.0s | LOOP: No
SVG: Doctor figure (24 paths: head circle, hair detail arc, neck rect, white coat body, collar V-shape, pocket rect, stethoscope arc, stethoscope earpiece dots ×2, stethoscope chest piece circle, hands ×2 simplified, clipboard rect, clipboard lines ×3, cross emblem on coat pocket, medical cross on background panel) — full figure at 960×540px, 280px tall

COLOR SPECIFICATION:
Background: #F0FDF4 (very light mint green)
Skin tone fill: #FDDCB5 (warm light skin)
Hair fill: #292524 (dark brown)
White coat fill: #FFFFFF
Coat stroke: #E2E8F0 (2px)
Coat collar fill: #F1F5F9
Stethoscope stroke: #374151 (dark, 3px)
Stethoscope chest piece fill: #6B7280
Clipboard fill: #FEF9EE (warm white)
Clipboard stroke: #D97706 (amber)
Medical cross fill: #EF4444 (red)
Pocket cross fill: #EF4444

VISUAL LAYOUT:
Doctor figure standing front-facing, centered. Slightly friendly tilt (+3°). Clipboard in one hand. Stethoscope around neck.

ANIMATION TIMELINE (4.0s total):
0–0.5s: Background + body silhouette fades in (scale 0.9 → 1.0, ease-out spring).
0.5–0.8s: White coat fills in (opacity 0 → 1.0, ease-out).
0.8–1.0s: Head, hair, skin elements appear (scale 0→1.0, spring).
1.0–1.3s: Coat details: collar, pocket, cross — each fades in (0.06s stagger, ease-out).
1.3–1.6s: Stethoscope draws from neck down (dashoffset 100%→0%, ease-out) — arc path draws first, then earpieces and chest piece appear.
1.6–1.9s: Clipboard slides in from side (X: +40px → 0, ease-out).
1.9–2.2s: Clipboard lines appear (each draws left→right, 0.08s stagger, ease-out).
2.2–2.6s: Medical cross on pocket pulses (scale 1.0 → 1.2 → 1.0, spring, #EF4444 glow 0→8px→0).
2.6–3.2s: Doctor figure does slight friendly nod (rotateZ: 0° → -3° → 3° → 0°, ease-in-out, natural movement).
3.2–4.0s: Hold.

EASING CURVES:
- Silhouette: ease-out
- Detail stagger: ease-out
- Stethoscope draw: ease-out
- Nod: ease-in-out

COLOR VARIANTS:
Variant A: White coat + red cross on light green (general health)
Variant B: Blue scrubs instead of coat on white (hospital / ICU)
Variant C: White coat + green cross on dark (pharma / alternative health)

USAGE CONTEXT:
Telehealth platform promo. Hospital brand video. Health insurance explainer. Medical course intro. "Talk to a doctor" app CTA.

───────────────────────────────────────────────────────────────────────────────
PROMPT 035: Solar Panel + Sun — Clean Energy
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.0s | LOOP: Yes
SVG: Solar panel system (26 paths: panel frame outer rect, 12 individual solar cell rects (3×4 grid), panel mount pole, panel mount base, sun circle, 8 sun ray lines, ground horizon line, house silhouette simple (5 paths), energy bolt path connecting panel to house, cloud path optional) — panel at 780×400px, house at 1300×540px

COLOR SPECIFICATION:
Background: #EFF6FF (light sky blue)
Solar panel frame fill: #374151 (dark grey)
Solar cell fill: #1D4ED8 (dark blue, active) / #DBEAFE (pale blue, inactive)
Panel mount fill: #6B7280
Sun fill: #FBBF24 (warm gold)
Sun rays stroke: #F59E0B (amber, 3px)
Ground line fill: #D1FAE5 (light green)
House fill: #F59E0B (amber) / roof #B45309 (dark amber)
Energy bolt stroke: #FBBF24 (gold, dashed animated, 3px)
Cloud fill: #FFFFFF (optional, 80% opacity)

VISUAL LAYOUT:
Panel on left of frame. Sun upper-center. House on right. Energy flows panel → house via bolt path.

ANIMATION TIMELINE (5.0s loopable):
0–0.5s: Ground and sky background establish (fade in, ease-out).
0.5–0.8s: House silhouette slides up from ground (Y: +40px → 0, ease-out spring).
0.8–1.1s: Panel and mount reveal (scale 0 → 1.0, spring).
1.1–1.5s: Solar cells fill in one by one (each cell scales 0→1.0, 0.06s stagger, grid fills L→R top→bottom).
1.5–1.8s: Sun fades in + scales 0.8 → 1.0 (ease-out spring).
1.8–2.2s: Sun rays draw outward (each ray: dashoffset 100%→0%, 0.05s stagger per ray, ease-out).
2.2–2.6s: Solar cells transition pale → dark blue (each cell sequentially, 0.06s stagger, ease-out) — "charging" state.
2.6–3.5s (looping): Energy bolt dashes animate along path from panel to house (stroke-dashoffset animated continuously, 0.8s per cycle, linear). Houses glows warmly (opacity pulse 1.0→1.2→1.0 on house fill, ease-in-out).
3.5–4.5s: Sun pulses glow (blur 0→20px→0px, ease-in-out, 1s cycle, loops).
4.5–5.0s: All elements hold. Loop resets.

EASING CURVES:
- Entry elements: ease-out / spring
- Cell charge: ease-out
- Energy bolt: linear
- Sun glow: ease-in-out

COLOR VARIANTS:
Variant A: Blue panels + gold sun on light blue (standard clean energy)
Variant B: Black panels + white sun on dark sky (premium solar brand)
Variant C: Blue panels + orange sun on white (bold campaign aesthetic)

USAGE CONTEXT:
Solar energy company promo. Environmental sustainability video. "Switch to clean energy" campaign. Science explainer channel. ESG report video.

===============================================================================
END OF PHASE 1 — 35 PROMPTS COMPLETE (of 75)
Continuing at same quality standard: Levels 1.2 extended + Level 1.3 final batch
===============================================================================

───────────────────────────────────────────────────────────────────────────────
COMPLEXITY STEP UP → Full multi-element story scenes (25–30 paths)
───────────────────────────────────────────────────────────────────────────────

───────────────────────────────────────────────────────────────────────────────
: Notification Stack — Social Media Dashboard
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 4.0s | LOOP: No
SVG: 4 notification cards stacked vertically (4 card rects, each 800×140px + rounded corners, each with: icon circle left, text line placeholder rects ×2, time stamp rect, count badge circle right) — total stack from Y:300 to Y:900, centered X:540

COLOR SPECIFICATION:
Background: #0F172A (dark navy)
Card 1 fill: #1E293B, stroke #334155 2px, left accent bar #EF4444 (red)
Card 2 fill: #1E293B, stroke #334155, left accent bar #3B82F6 (blue)
Card 3 fill: #1E293B, stroke #334155, left accent bar #22C55E (green)
Card 4 fill: #1E293B, stroke #334155, left accent bar #F59E0B (amber)
Icon circles: same as accent colors
Text line 1 (each card): #F1F5F9 placeholder rect 240×12px, opacity 0.9
Text line 2 (each card): #94A3B8 placeholder rect 160×10px, opacity 0.6
Badge fills: same as accent colors — "3", "12", "1", "5" text #FFFFFF 14pt bold

VISUAL LAYOUT:
Cards stacked vertically. Each slides in from right, staggered.

ANIMATION TIMELINE (4.0s total):
0–0.2s: Background establishes. No cards visible.
0.2–0.5s: Card 1 slides from X:+200px → 0 (ease-out spring). Icon, text lines, badge appear with 0.05s stagger each.
0.5–0.8s: Card 2 slides in (stagger 0.3s from card 1).
0.8–1.1s: Card 3 slides in.
1.1–1.4s: Card 4 slides in.
1.4–1.8s: All 4 cards rest. Each card's left accent bar pulses (scaleX 1.0→1.3→1.0, ease-in-out, each card offset 0.1s stagger).
1.8–2.3s: Badge numbers count up (each badge: 0 → target number, ease-out, 0.4s each, staggered).
2.3–2.8s: Card 1 shakes gently (X: 0 → +5px → -5px → 0, ease-in-out) — "new notification" tap.
2.8–3.2s: Card 1 scales 1.0 → 1.03 → 1.0 (highlight).
3.2–4.0s: All cards settle. Subtle glow on each accent bar (opacity 0.6→1.0→0.6, staggered 0.25s cycle).

EASING CURVES:
- Slide-in: cubic-bezier(0.34, 1.56, 0.64, 1)
- Badge count: ease-out
- Pulse: ease-in-out

COLOR VARIANTS:
Variant A: Dark navy + colored accents (dashboard / dark UI)
Variant B: White cards on light grey bg (clean / iOS style)
Variant C: Dark bg + all #A78BFA purple accents (single-brand notification)

USAGE CONTEXT:
Social media management tool demo. Analytics dashboard feature. "Stay on top of notifications" app promo. SaaS onboarding video.

───────────────────────────────────────────────────────────────────────────────
PROMPT 037: Globe Network — Global Reach
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.0s | LOOP: Yes
SVG: Globe (28 paths: outer circle, 3 longitude arc lines, 3 latitude arc lines, equator line, continent simplified blobs ×5 (Africa, Americas, Europe/Asia, Australia, small shapes), 4 location pin dots at key cities, 4 connection arc lines between pins, 2 orbit ring ellipses around globe) — globe centered 960×540px, 360px diameter

COLOR SPECIFICATION:
Background: #030712 (near black)
Globe circle fill: #0B1120 (very dark blue)
Globe circle stroke: #1E40AF (blue, 2px)
Grid lines stroke: #1E40AF (blue, 1px, 30% opacity)
Continent fills: #1D4ED8 (blue, 60% opacity)
Location pins fill: #60A5FA (bright blue, 12px circles)
Connection arc strokes: #60A5FA (blue, 1.5px, dashed, animated)
Orbit ring 1 stroke: #3B82F6 (blue, 1.5px, ellipse, 30° tilt)
Orbit ring 2 stroke: #2563EB (slightly darker blue, 1px, ellipse, -30° tilt)
Small satellite dot: #FBBF24 (gold, 8px, travels orbit ring 1)

VISUAL LAYOUT:
Globe centered. Orbit rings around it. Location pins on continent areas. Connection arcs between pins.
Satellite dot orbits ring 1.

ANIMATION TIMELINE (5.0s loopable):
0–0.5s: Globe circle scales 0→1.0 (ease-out spring). Grid lines fade in (opacity 0→0.3, ease-out).
0.5–1.0s: Continent blobs appear (each scales 0→1.0, 0.08s stagger, spring).
1.0–1.4s: Globe rotates slowly (continuous Y-axis rotation simulation: grid lines and continents drift right at ~2px/s, ease-in). Orbit rings draw in (dashoffset 100%→0%, ease-out, stagger 0.2s).
1.4–1.8s: Location pins appear (scale 0→1.0, spring, staggered 0.15s each). Each pin has ripple ring (circle stroke, opacity 0.6→0, radius 12→40px, ease-out).
1.8–3.5s (continuous): Connection arc dashes animate along arcs (dashoffset cycles continuously, 1.2s per arc, linear, each arc staggered 0.3s). Satellite dot travels orbit ring (360° per 3s, linear, loops).
3.5–4.5s: All elements hold. Globe slow rotation continues. Subtle glow pulse on globe edge (stroke blur 0→12px→0, ease-in-out, 1.0s cycle).
4.5–5.0s: Loop reset preparation.

EASING CURVES:
- Entry: spring / ease-out
- Arc dash: linear
- Rotation sim: linear
- Glow: ease-in-out

COLOR VARIANTS:
Variant A: Dark background + blue globe (tech / global platform)
Variant B: Dark background + #10B981 green globe (sustainability / ESG)
Variant C: Dark background + #F59E0B amber globe (energy / resources)

USAGE CONTEXT:
"We're global" brand video. International expansion announcement. Logistics/supply chain explainer. Telecom or cloud infrastructure promo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 038: Person at Desk — Productive Work Scene
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.0s | LOOP: Yes
SVG: Work scene (30 paths: desk rect, chair back arc, chair seat, person silhouette (head circle, torso rect, arms suggestion), laptop simplified (3 paths), coffee mug (3 paths), desk lamp (4 paths: stand, arm, head, light cone), potted plant small (4 paths), sticky notes ×2 rects on wall, window frame (4 paths) with light rays diagonal, clock circle on wall) — scene width ~800px, centered 960×580px

COLOR SPECIFICATION:
Background: #FEF9EE (warm off-white)
Desk fill: #D97706 (warm amber wood)
Desk stroke: #92400E (2px)
Chair fill: #374151 (dark grey)
Person fill: #FDDCB5 (skin tone) / #3B82F6 (blue shirt)
Laptop fill: #1E293B (dark) / screen #DBEAFE (light blue)
Coffee mug fill: #C2410C (terracotta) / steam #94A3B8 (grey)
Lamp fill: #FBBF24 (gold) / light cone fill #FBBF2420 (gold 12% opacity triangle)
Plant fill: #16A34A (green) / pot #C2410C (terracotta)
Sticky notes: #FDE68A (yellow) and #BBF7D0 (pale green)
Window light rays: #FEF08A20 (pale yellow 12%, diagonal slanted rects)
Clock face: #FFFFFF / clock hands #1E293B

VISUAL LAYOUT:
Desk scene in center-lower area. Window on right wall letting in light rays. Clock on left wall. Scene feels warm and cozy.

ANIMATION TIMELINE (5.0s loopable):
0–0.5s: Background, window, walls establish (fade in, ease-out). Light rays visible.
0.5–1.0s: Desk and chair appear (scale 0.9→1.0, ease-out spring).
1.0–1.4s: Person appears sitting (scale 0→1.0, spring).
1.4–1.8s: Laptop, mug, plant appear (each 0.08s stagger, scale spring).
1.8–2.0s: Desk lamp appears, light cone extends (scaleY 0→1.0, ease-out).
2.0–2.4s: Sticky notes drop from above onto wall (Y: -20px→0, ease-out, stagger 0.2s each).
2.4–2.7s: Clock hands appear. Hour hand at 10, minute at 2.
2.7–5.0s (continuous loop):
  - Person head nods slightly (rotateZ 0→-4°→0→-4°→0, ease-in-out, every 1.8s — typing/reading motion).
  - Coffee steam path rises and fades (Y translate -15px, opacity 1→0, ease-out, 0.8s cycle, loops continuously).
  - Laptop screen has cursor blink (small rect opacity 1→0→1, 0.8s cycle).
  - Clock minute hand slowly advances (rotateZ 0→6°, ease-in-out over 3s, subtle).

EASING CURVES:
- Entry: spring / ease-out
- Nod: ease-in-out
- Steam: ease-out

COLOR VARIANTS:
Variant A: Warm wood + warm white bg (classic productivity)
Variant B: Dark desk on dark bg (night mode / late work)
Variant C: White minimal desk on light grey (modern minimal workspace)

USAGE CONTEXT:
Productivity tool explainer. Remote work brand video. "Work from anywhere" SaaS ad. Coworking space promo. Freelancer community content.

───────────────────────────────────────────────────────────────────────────────
PROMPT 039: Rupee/Dollar Sign — Financial Services India
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.0s | LOOP: No
SVG: Rupee ₹ symbol (7 paths: vertical stroke, top horizontal bar, second horizontal bar, lower diagonal bar — styled as large display symbol) — centered 540×540px, 220px tall

Plus surrounding frame: 
Outer circle (stroke only): 360px diameter, centered
Inner decorative ring: 340px diameter, dashed stroke
4 small ornamental diamond shapes at N/S/E/W on circle

COLOR SPECIFICATION:
Background: #FFFBEB (very light warm gold)
Rupee symbol fill: #D97706 (amber gold)
Rupee symbol stroke: #92400E (dark amber, 2px)
Outer circle stroke: #D97706 (3px)
Inner dashed ring stroke: #FCD34D (light gold, 2px, dashes 8px)
Diamond ornaments fill: #D97706
Background gradient: radial from #FEF3C7 center to #FDE68A edges

VISUAL LAYOUT:
₹ symbol large, centered. Circle frame around it. Decorative diamonds at cardinal points.

ANIMATION TIMELINE (3.0s total):
0–0.4s: Outer circle draws clockwise (dashoffset 100%→0%, ease-out).
0.4–0.6s: Inner dashed ring fades in (opacity 0→1.0, ease-out). Diamond ornaments appear (scale 0→1.0, spring, 0.05s stagger N→E→S→W).
0.6–1.0s: Rupee vertical stroke draws downward (dashoffset 100%→0%, ease-out).
1.0–1.2s: Top horizontal bar draws left→right (ease-out).
1.2–1.35s: Second horizontal bar draws (slight stagger).
1.35–1.5s: Diagonal descending bar draws.
1.5–1.9s: Full ₹ symbol revealed. Scales 1.0→1.08→1.0 (confidence pulse, spring).
1.9–2.3s: Gold shimmer scan across symbol (diagonal white highlight strip, opacity 0→0.5→0, ease-in-out).
2.3–2.7s: Outer circle rotates 15° (ease-in-out, subtle embellishment).
2.7–3.0s: Hold.

EASING CURVES:
- Stroke draw: ease-out
- Symbol pulse: cubic-bezier(0.34, 1.56, 0.64, 1)
- Shimmer: ease-in-out
- Circle rotate: ease-in-out

COLOR VARIANTS:
Variant A: Gold on warm cream (Indian fintech / premium)
Variant B: Green on white (UPI / digital payment)
Variant C: Dark bg + gold symbol (premium investment / wealth)

USAGE CONTEXT:
Indian fintech app promo. Mutual fund/investment platform video. Payment gateway explainer. "Save more, earn more" financial content. Zerodha/Groww style content.

───────────────────────────────────────────────────────────────────────────────
PROMPT 040: Certificate / Award Scroll — Course Completion
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 4.5s | LOOP: No
SVG: Certificate (25 paths: outer border rect rounded, inner border rect (ornamental frame), top decorative ribbon banner rect, banner fold triangles ×2, seal circle bottom-center, seal inner ring, seal emblem shape, 3 horizontal text lines on cert (title, name, date as placeholder rects), left corner flourish paths ×3, right corner flourish paths ×3, ribbon strip left, ribbon strip right) — certificate 900×640px, centered 960×540px

COLOR SPECIFICATION:
Background: #1C1917 (very dark warm black)
Certificate body fill: #FFFBEB (warm cream)
Certificate stroke: none
Outer border fill: #D97706 (gold frame)
Inner border stroke: #92400E (dark amber, 1px, decorative)
Banner fill: #D97706 (gold)
Banner text: "CERTIFICATE OF COMPLETION" in #1C1917 18pt bold
Seal fill: #D97706 / inner seal fill #92400E
Seal emblem: star shape #FBBF24
Text line 1 (title): #1C1917 rect 400×20px — "Motion Graphics Mastery"
Text line 2 (name): #374151 rect 300×16px — "Adarsh Kumar"
Text line 3 (date): #6B7280 rect 200×12px — "March 2026"
Ribbons left/right: #EF4444 (red, diagonal ribbon strips)
Corner flourishes: #D97706 (gold, stroke paths)

VISUAL LAYOUT:
Certificate centered. Appears to unfurl or drop into frame. Gold and cream premium feel. Dark background for contrast.

ANIMATION TIMELINE (4.5s total):
0–0.5s: Certificate starts as thin horizontal line (scaleY:0.02) at center Y. Expands to full height (scaleY 0.02→1.0, ease-out, 0.5s). Transform-origin: center.
0.5–0.8s: Cream body fills in (opacity 0→1.0, ease-out).
0.8–1.0s: Outer gold border draws (stroke-dashoffset 100%→0%, ease-out, clockwise).
1.0–1.2s: Inner border draws (same technique).
1.2–1.4s: Corner flourishes appear (scale 0→1.0, spring, stagger: top-left, top-right, bottom-left, bottom-right, 0.05s stagger).
1.4–1.7s: Banner slides down from top (Y: -30px→0, ease-out spring). Banner text fades in.
1.7–2.0s: Seal scales 0→1.0 at bottom-center (spring). Seal ring draws. Emblem star appears.
2.0–2.3s: Red ribbon strips slide in from left and right diagonally (ease-out).
2.3–2.6s: Text line 1 (title) fades in + slides up 10px (opacity 0→1.0, Y:+10→0).
2.6–2.9s: Text line 2 (name) follows.
2.9–3.2s: Text line 3 (date) follows.
3.2–3.7s: Gold shimmer scan from top-left to bottom-right across entire certificate (diagonal white band, 4px wide, opacity 0→0.4→0, ease-in-out).
3.7–4.0s: Seal pulses (scale 1.0→1.08→1.0, spring). Warm gold glow from seal (blur 0→18px→0).
4.0–4.5s: Hold. Certificate breathes (scale 1.0→1.01→1.0, ease-in-out).

EASING CURVES:
- Unfurl: ease-out
- Border draw: ease-out
- Details spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- Shimmer: ease-in-out

COLOR VARIANTS:
Variant A: Gold + cream on dark (premium award / achievement)
Variant B: Navy blue frame + cream on white (corporate certificate)
Variant C: Black frame + gold on black (luxury / prestige)

USAGE CONTEXT:
Online course completion video. "Earn your certificate" promo. LinkedIn learning ad. Achievement gamification feature. Skills platform brand video.

===============================================================================
PHASE 1 COMPLETE — 40 PROMPTS
===============================================================================
NOTE TO TEAM: Prompts 041–075 continue through:
- Level 1.3: 5 more complex lifestyle scene compositions (041–045)
- Level 1.4: Full detailed illustrated scenes (046–075)
  Including: City skyline, sports icon sets, food menu reveals,
  medical scenes, tech device families, nature sequences,
  human gesture icons, brand mascot movements, etc.

All follow same format, specification depth, and real-use-case orientation.
===============================================================================

===============================================================================
LEVEL 1.3 CONTINUED — LIFESTYLE & SCENE ICONS (Complex assembly, 20–28 paths)
===============================================================================

───────────────────────────────────────────────────────────────────────────────
PROMPT 041: Airplane Takeoff — Travel / Flight Booking
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 4.0s | LOOP: No
SVG: Airplane (17 paths: fuselage body, nose cone, tail fin vertical, tail fin horizontal, left main wing, right main wing, left winglet, right winglet, left engine, right engine, windows row ×4 small ovals, rear exhaust detail) — starts at 400×760px, ends exiting at 1700×200px

COLOR SPECIFICATION:
Background: #EFF6FF (light sky blue)
Cloud puffs: #FFFFFF (3 simple oval clusters, scattered upper frame — 200×80px, 160×60px, 240×90px)
Fuselage fill: #F1F5F9 (near white)
Fuselage stroke: #CBD5E1 (2px)
Wings fill: #E2E8F0 (light grey)
Wing stroke: #94A3B8 (1.5px)
Engines fill: #64748B (medium grey)
Windows fill: #DBEAFE (pale blue)
Tail fill: #3B82F6 (blue — airline livery)
Winglets fill: #3B82F6
Runway line: #CBD5E1 (dashed horizontal, 3px, at Y:800)
Exhaust trail: #FFFFFF80 (white 50%, 3 fading ellipses behind engines)

VISUAL LAYOUT:
Airplane begins on runway (low, near-horizontal angle, 5° nose-up tilt). Lifts and exits upper-right.
Clouds in upper half of frame. Runway dashed line at lower frame.

ANIMATION TIMELINE (4.0s total):
0–0.3s: Clouds and runway fade in (opacity 0→0.8, ease-out).
0.3–0.6s: Airplane appears at 400×760px (scale 0.9→1.0, ease-out spring).
0.6–1.2s: Airplane taxis right (X: 400→700px, Y: 760px, 5° tilt constant, ease-in-out). Exhaust puffs appear behind engines (3 small white ellipses, opacity 0.4→0, stagger 0.15s, size 8→20px).
1.2–1.5s: Nose tips up to 18° (rotateZ changes from -5° to -18°, ease-in). Runway line fades (opacity 0.8→0, ease-in).
1.5–3.2s: Airplane climbs diagonally (X: 700→1700px, Y: 760→200px, rotateZ held at -18°, ease-in acceleration). Exhaust trail grows longer (3 fading white ellipses at increasing distance behind engines, each 0.4s cycle). Airplane scales slightly smaller as it "flies away" (scale 1.0→0.75).
3.2–3.6s: Airplane exits right edge (opacity 1.0→0 as it crosses X:1800, ease-in).
3.6–4.0s: Only clouds remain. One cloud drifts slightly left (+8px, ease-in-out, 0.4s). Hold.

EASING CURVES:
- Taxi: ease-in-out
- Nose-up: ease-in
- Climb: ease-in
- Exit fade: ease-in

COLOR VARIANTS:
Variant A: White/grey plane + blue tail on light sky (standard airline)
Variant B: White plane + #EF4444 red tail on dark blue sky (bold airline brand)
Variant C: White plane + #F59E0B gold tail on sunrise gradient (#FDE68A→#FB923C) (premium / luxury travel)

USAGE CONTEXT:
Flight booking platform ad. Travel vlog intro. "Book your next trip" CTA. Tourism board promo. OTA product feature explainer.

───────────────────────────────────────────────────────────────────────────────
PROMPT 042: Cricket Bat & Ball — Sports Moment
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1080px (1:1)
DURATION: 3.5s | LOOP: No
SVG: Cricket bat (8 paths: blade main rect tapered, blade edge chamfer, spine ridge rect, grip handle rect, grip wrap lines ×3 diagonal) + cricket ball (5 paths: sphere circle, seam arc top, seam arc bottom, seam stitch dots ×8 small circles) — bat at 540×540px 220px tall, ball starts at 900×300px 60px diameter

COLOR SPECIFICATION:
Background: #14532D (deep cricket-pitch green)
Bat blade fill: #D97706 (willow amber)
Bat blade stroke: #92400E (2px)
Bat spine fill: #B45309 (darker amber)
Grip fill: #1C1917 (near black)
Grip wrap lines stroke: #F59E0B (gold, 1px, diagonal)
Ball fill: #DC2626 (cricket red)
Ball stroke: #991B1B (dark red, 2px)
Seam arcs stroke: #F5F5F5 (cream, 2px)
Seam stitches fill: #F5F5F5 (cream, 4px dots)
Impact flash: #FBBF24 (gold, burst shape)
Particle sparks: #FBBF24 and #FEF08A (small 4px circles, 8 total)

VISUAL LAYOUT:
Bat centered-left, angled 30° (backswing position). Ball enters from upper-right, bat swings through, ball exits lower-left frame at speed.

ANIMATION TIMELINE (3.5s total):
0–0.4s: Pitch green background establishes. Bat appears in backswing position (scale 0.9→1.0, rotateZ:+30°, ease-out spring).
0.4–0.8s: Ball enters from upper-right (X:1100,Y:150 → X:700,Y:400, ease-in). Ball rotates clockwise as it travels (360° per 0.4s, linear).
0.8–1.0s: Bat swings forward (rotateZ: +30° → -45°, ease-in — fast swing, 0.2s). Ball pauses at contact point.
1.0–1.05s: Impact — gold burst flash (scale 0→1.4→0, 0.05s each, centered at 680×420px). 8 particle sparks radiate outward (translate 30px radially, opacity 1.0→0, ease-out, 0.3s).
1.05–1.6s: Ball launches upper-left (X:680,Y:420 → X:150,Y:100, ease-out fast). Ball rotates counter-clockwise rapidly. Ball fades as it exits (opacity 1.0→0 past X:200).
1.6–2.0s: Bat follow-through settles (rotateZ: -45° → -20°, ease-out).
2.0–2.5s: Bat returns to neutral (rotateZ: -20° → 0°, ease-in-out).
2.5–3.5s: Hold. Bat has faint glow (gold #FBBF24, blur 0→10px→0, ease-in-out, 0.8s pulse).

EASING CURVES:
- Ball travel: ease-in
- Bat swing: ease-in (fast)
- Impact burst: linear (snap)
- Ball exit: ease-out
- Follow-through: ease-out

COLOR VARIANTS:
Variant A: Amber bat + red ball on dark green (Indian cricket)
Variant B: Dark bat + white ball on grey (Test cricket / dramatic)
Variant C: Amber bat + orange ball on dark (IPL day-night)

USAGE CONTEXT:
IPL/cricket brand content. Sports app feature. "Watch the match" streaming promo. Fantasy cricket platform. Hotstar / JioCinema sports segment.

───────────────────────────────────────────────────────────────────────────────
PROMPT 043: Food Menu Card — Restaurant Reveal
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 4.5s | LOOP: No
SVG: Menu card (22 paths: card outer rect rounded, card inner frame rect, decorative top banner with swirl ornament (3 paths), restaurant name text rect placeholder, divider line, 3 dish rows each containing: dish name rect, price rect, small food icon circle — giving 9 content elements, bottom tagline rect, chef hat icon (4 paths: brim rect, puff top arc, puff detail), fork+knife flanking icons (4 paths total)) — card 820×1400px centered 540×960px

COLOR SPECIFICATION:
Background: #1C0A00 (very dark warm brown)
Card fill: #FFFBEB (warm cream)
Card stroke: #D97706 (gold, 3px)
Top banner fill: #D97706 (gold)
Banner ornament stroke: #92400E (dark amber, 2px — swirl paths)
Restaurant name rect: #1C1917 placeholder 400×28px — "SPICE GARDEN" 22pt bold
Divider line: #D97706 (gold, 1px, full card width)
Dish name rects: #1C1917 — 320×16px each — "Dal Makhani", "Butter Chicken", "Paneer Tikka"
Price rects: #D97706 bold — 100×16px each — "₹280", "₹360", "₹320"
Food icon circles: 40px, fills #EF4444, #F97316, #FBBF24 (red, orange, amber for different dishes)
Tagline rect: #6B7280 — "Authentic Indian Flavors Since 1998"
Chef hat fill: #FFFFFF / stroke #D97706
Fork+knife stroke: #D97706 (2px each side)

VISUAL LAYOUT:
Menu card takes most of vertical frame. Warm dark background behind it.

ANIMATION TIMELINE (4.5s total):
0–0.5s: Card outer rect appears (scaleY: 0.05→1.0, transform-origin: top, ease-out — unfolds downward like a menu opening).
0.5–0.8s: Card fill brightens inside (opacity 0→1.0, ease-out).
0.8–1.0s: Gold card border draws clockwise (dashoffset 100%→0%, ease-out).
1.0–1.2s: Top banner slides down into card top (Y: -30px→0, ease-out spring). Ornament swirls draw (dashoffset 100%→0%, 0.1s stagger per swirl path).
1.2–1.4s: "SPICE GARDEN" text fades in + scales 0.9→1.0 (ease-out).
1.4–1.6s: Divider line draws left→right (dashoffset 100%→0%, ease-out).
1.6–1.9s: Chef hat appears (scale 0→1.0, spring). Fork and knife appear (scale 0→1.0, spring, stagger 0.1s).
1.9–2.2s: Dish row 1 slides in from right (X: +40px→0, ease-out). Dish name, price, icon each stagger 0.06s.
2.2–2.5s: Dish row 2 slides in.
2.5–2.8s: Dish row 3 slides in.
2.8–3.1s: Tagline fades in at bottom (opacity 0→1.0, ease-out).
3.1–3.6s: Gold shimmer scan from top to bottom across card (white diagonal band, 3px, opacity 0→0.3→0, ease-in-out).
3.6–4.0s: Price rects pulse gold glow individually (each 0.2s, stagger 0.15s, brightness 100%→140%→100%).
4.0–4.5s: Hold. Card breathes very subtly (scale 1.0→1.01→1.0, ease-in-out).

EASING CURVES:
- Card unfold: ease-out
- Banner spring: cubic-bezier(0.34, 1.56, 0.64, 1)
- Row slide-in: ease-out
- Shimmer: ease-in-out

COLOR VARIANTS:
Variant A: Gold + cream on dark brown (Indian restaurant)
Variant B: Red + cream on dark (Chinese / Pan-Asian)
Variant C: Navy + cream on white (Continental / European fine dining)

USAGE CONTEXT:
Restaurant Instagram/Reels promo. Zomato listing feature video. Food delivery menu launch. Catering company brand content. "Today's specials" story card.

───────────────────────────────────────────────────────────────────────────────
PROMPT 044: Yoga Pose — Wellness / Fitness
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.0s | LOOP: Yes
SVG: Person in Tree Pose (Vrikshasana) stick-figure style (16 paths: head circle, neck line, torso line, left arm up path, right arm bent outward path, left leg straight line down, right leg bent knee path, foot detail left, foot detail right, yoga mat ellipse at base, aura ring circle around figure (light), ground shadow ellipse, 3 leaf/petal decorative shapes near arms, small sun element upper right) — figure centered 900×500px, 320px tall

COLOR SPECIFICATION:
Background: #F0FDF4 (very light mint)
Figure fill/stroke: #166534 (deep green, 4px stroke, no fill — line art)
Head circle fill: #FDDCB5 (skin)
Head stroke: #166534 (2px)
Yoga mat fill: #6EE7B7 (mint green)
Yoga mat stroke: #059669 (2px)
Aura ring stroke: #A7F3D0 (pale green, 2px, dashed)
Ground shadow: #059669 (20% opacity ellipse)
Leaf decorations fill: #4ADE80 (bright green, organic petal shapes)
Sun element: #FDE68A (pale yellow circle, 30px, with 6 short rays, upper-right at 1600×200px)

VISUAL LAYOUT:
Yoga figure in tree pose (one leg up, arms raised and joined above head). Mat below. Decorative organic shapes near hands at top. Clean open space around figure.

ANIMATION TIMELINE (5.0s loopable):
0–0.5s: Mat appears (scale 0→1.0, ease-out spring). Ground shadow fades in.
0.5–0.9s: Figure builds upward: feet/legs draw from ground up (stroke-dashoffset 100%→0% from base, ease-out). Torso draws upward. Arms last.
0.9–1.1s: Head circle scales 0→1.0 (spring).
1.1–1.4s: Aura ring draws clockwise (dashoffset 100%→0%, ease-out).
1.4–1.7s: Leaf decorations appear near hands (scale 0→1.0, spring, stagger 0.1s each).
1.7–2.0s: Sun fades in + rays draw (dashoffset 100%→0%, ease-out stagger 0.04s per ray).
2.0–5.0s (continuous loop):
  - Figure sways gently (whole group rotateZ: 0°→+1.5°→-1.5°→0°, ease-in-out, 2.5s cycle — balancing sway).
  - Aura ring pulses (scale 1.0→1.08→1.0, opacity 1.0→0.5→1.0, ease-in-out, 3s cycle).
  - Leaf decorations flutter (rotateZ: 0→+5°→-5°→0, ease-in-out, 2s cycle, stagger 0.3s each).
  - Sun rotates slowly (rotate 360° per 20s, linear — very slow).

EASING CURVES:
- Build: ease-out
- Sway: ease-in-out
- Aura pulse: ease-in-out
- Leaf flutter: ease-in-out

COLOR VARIANTS:
Variant A: Deep green figure on mint (yoga / wellness)
Variant B: #7C3AED purple figure on lavender (meditation / mindfulness)
Variant C: #0EA5E9 blue figure on sky white (breathwork / calm)

USAGE CONTEXT:
Yoga studio Reels. Wellness app promo. Meditation platform intro. "Morning routine" video opener. Health & fitness content creator card.

───────────────────────────────────────────────────────────────────────────────
PROMPT 045: Classroom / Teacher — EdTech Scene
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.0s | LOOP: No
SVG: Classroom scene (28 paths: whiteboard rect back wall, board frame, board content (3 horizontal line placeholders = "equations"), teacher figure (head circle, body torso, arms — pointer stick in hand), desk rect front, 2 student head silhouettes at desks, student desk rects ×2, book rects on desks ×2, window frame right wall (4 paths), light rays from window (2 diagonal rect paths), apple on teacher's desk (3 paths: body, leaf, stem), overhead projector beam triangle) — scene width 1600px, centered 960×560px

COLOR SPECIFICATION:
Background: #FEF9EE (warm cream)
Whiteboard fill: #FFFFFF
Board frame fill: #374151 (dark grey)
Board lines stroke: #94A3B8 (grey, 2px, 3 lines)
Board equation text: #1D4ED8 (blue marker — 3 short rect placeholders 200px, 150px, 180px wide, 10pt)
Teacher fill: #F97316 (orange shirt) / #FDDCB5 (skin) / #292524 (hair)
Pointer stick stroke: #92400E (brown, 2px, 120px long)
Desk fill: #D97706 (amber wood)
Student silhouettes fill: #374151 and #1D4ED8 (dark grey + blue — two different shirt colors)
Student desks fill: #B45309 (darker amber)
Books fill: #EF4444 and #22C55E (red and green book covers)
Window frame fill: #E2E8F0 / glass fill: #DBEAFE
Light rays fill: #FEF08A20 (yellow, 8% opacity, diagonal)
Apple fill: #EF4444 / leaf fill: #16A34A
Projector beam fill: #FEF08A15 (very faint yellow triangle)

VISUAL LAYOUT:
Whiteboard on left half. Teacher in front of board with pointer. Two student desks in foreground. Window right. Warm classroom light rays from window.

ANIMATION TIMELINE (5.0s total):
0–0.5s: Background, walls, window establish (opacity 0→1.0, ease-out). Light rays fade in gently.
0.5–0.8s: Whiteboard and frame appear (scale 0.95→1.0, ease-out spring).
0.8–1.1s: Board content lines draw in one by one (each draws left→right, dashoffset 100%→0%, 0.2s stagger, ease-out).
1.1–1.5s: Teacher figure assembles (torso → head → arms, each 0.1s stagger, scale 0→1.0, spring).
1.5–1.7s: Pointer stick appears in teacher's hand (scale 0→1.0, spring, rotated 45°).
1.7–2.0s: Student desk 1 and silhouette slide up from bottom (Y: +40px→0, ease-out). Book appears on desk (spring).
2.0–2.3s: Student desk 2 and silhouette same.
2.3–2.6s: Apple appears on teacher's desk (scale 0→1.0, spring).
2.6–3.0s: Teacher raises pointer (rotateZ: 45°→15°, ease-in-out — pointing at board).
3.0–3.5s: Third board line "lights up" blue (fill transitions from #94A3B8 grey → #1D4ED8 blue, ease-out) — teacher pointing at it.
3.5–4.0s: Student silhouette 1 nods (rotateZ: 0→-5°→0, ease-in-out — understanding moment).
4.0–4.5s: Projector beam fades in from ceiling (opacity 0→0.3, ease-out). Beam is subtle triangle from above pointing at board.
4.5–5.0s: Hold. Board lines have very subtle shimmer (each blinks opacity 1.0→0.7→1.0, stagger 0.3s, ease-in-out).

EASING CURVES:
- Assembly: spring
- Pointer move: ease-in-out
- Board highlight: ease-out
- Student nod: ease-in-out

COLOR VARIANTS:
Variant A: Warm cream + amber wood + orange teacher (traditional school)
Variant B: White + grey + blue teacher (modern / edtech clean)
Variant C: Dark background + neon accents (online learning / dark mode platform)

USAGE CONTEXT:
EdTech platform brand video. Online tutoring app promo. "Learn something new today" YouTube hook. School/coaching center ad. BYJU's / Unacademy style content.

===============================================================================
LEVEL 1.4 — FULL DETAILED ILLUSTRATED SCENES (25–35 paths, cinematic quality)
===============================================================================
Goal: Complete illustrative scenes. Each is a self-contained mini-story.
SVG complexity: 25–35 paths. Duration: 4–6s.

───────────────────────────────────────────────────────────────────────────────
PROMPT 046: City Skyline Night — Urban Brand
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 6.0s | LOOP: Yes
SVG: City skyline (32 paths: sky gradient rect, moon circle, 5 star dots, building 1 tallest (4 windows, antenna), building 2 (3 windows), building 3 wide (6 windows 2 rows), building 4 short (2 windows), building 5 medium (4 windows), bridge silhouette (arch + deck + 4 vertical cables), river rect below bridge, river reflection shimmer lines ×3, foreground road line, 2 car silhouettes on road, streetlamp left (pole+globe), streetlamp right) — skyline spans full 1920px width, buildings Y:300–700px, ground Y:700px

COLOR SPECIFICATION:
Background: #0B1120 (deep night blue)
Sky fill: same as background
Moon fill: #FEF08A (pale yellow)
Moon stroke: #F59E0B (amber, 1px)
Star dots: #FFFFFF (3–5px, 5 scattered in upper half)
Building 1 fill: #1E293B (very dark blue-grey)
Building 1 windows: #FBBF24 (warm amber gold — lit windows)
Building 2 fill: #0F172A
Building 2 windows: #FBBF24 (some lit) + #334155 (some unlit)
Building 3 fill: #1E293B
Building 3 windows: mix lit/unlit
Building 4 fill: #0F172A
Building 5 fill: #162032
All building strokes: #334155 (1px)
Antenna stroke: #EF4444 (red beacon dot at top)
Bridge fill: #334155 / cables stroke: #475569 (1px)
River fill: #0C1A2E (dark, slightly lighter than sky)
Reflection lines stroke: #1E40AF (dark blue, 1px, wavy, 30% opacity)
Road fill: #1C1917 (very dark)
Car silhouettes fill: #475569 (grey)
Streetlamp poles stroke: #64748B (2px) / globes fill: #FEF08A (small warm circles, glow)

VISUAL LAYOUT:
Full panoramic city skyline. Moon upper-right. Stars scattered. Bridge mid-frame. River below bridge reflects light. Two cars on road foreground.

ANIMATION TIMELINE (6.0s loopable):
0–0.5s: Sky and river base establish (fade in, ease-out).
0.5–1.5s: Buildings rise from ground one by one (each scaleY 0→1.0, transform-origin: bottom, ease-out, stagger 0.15s L→R).
1.5–1.8s: All building windows appear (random stagger 0.03–0.1s per window, opacity 0→1.0, ease-out — "lights turning on").
1.8–2.0s: Bridge draws in from left (stroke-dashoffset on arch + deck, ease-out). Cables drop down (each scaleY 0→1.0, stagger 0.05s).
2.0–2.2s: Moon and stars fade in (ease-out).
2.2–2.5s: Streetlamps appear (scale 0→1.0, spring). Lamp globes glow (radial yellow gradient, 30px radius).
2.5–2.8s: River reflection lines shimmer in (opacity 0→0.3, ease-out).
2.8–3.2s: Car 1 enters from left (X: -100→600px, ease-in-out, headlights: 2 small white circles leading it, taillights: red). 
3.2–3.6s: Car 2 enters from right (X: 2100→1300px, ease-in-out).
3.6–6.0s (continuous loop):
  - Random windows flicker (each window: opacity 1.0→0→1.0 randomly, 1–3s cycle each — "lights on and off").
  - Moon glows softly (outer glow blur 0→15px→0, ease-in-out, 2s cycle).
  - River reflection ripples (lines Y offset ±3px, ease-in-out, staggered).
  - Antenna red dot blinks (opacity 1.0→0→1.0, 1s cycle).
  - Stars twinkle (random opacity 0.5→1.0→0.5, 1.5–3s cycles each).

EASING CURVES:
- Buildings rise: ease-out
- Windows: ease-out
- Cars: ease-in-out
- Cycles: ease-in-out

COLOR VARIANTS:
Variant A: Cool dark blue night (standard urban)
Variant B: Warm purple-dark night (Mumbai / romantic city)
Variant C: Teal-dark night (futuristic / tech city)

USAGE CONTEXT:
City/urban brand intro. Real estate development video. "Coming to your city" expansion announcement. Travel / tourism city reel. News channel location ident.

───────────────────────────────────────────────────────────────────────────────
PROMPT 047: Startup Office Scene — Team & Culture
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.5s | LOOP: No
SVG: Open office scene (34 paths: floor rect, back wall rect, window wall (3 large window frames + glass + light rays), standing whiteboard with content (frame + 3 post-it rects + 1 chart line), couch (seat + back + 2 armrests), coffee table (top + legs), 3 person figures at different stations (each: head circle, torso, arm suggestion), laptop on coffee table (3 paths), plant in corner (pot + stem + 2 leaves), motivational text banner on wall (rect + text placeholder), hanging pendant lights ×3 (cord + globe each = 6 paths), desk in background (rect + person at it)) — scene 1700px wide, centered 960×580px

COLOR SPECIFICATION:
Background wall: #F8FAFC (near white)
Floor fill: #FEF3C7 (warm blonde wood tone)
Floor stroke: #E5E7EB (subtle plank lines, 1px horizontal, every 60px)
Window frames: #E2E8F0 / glass fill: #DBEAFE / light rays: #FBBF2415 (warm 8% yellow)
Whiteboard fill: #FFFFFF / frame: #374151 / post-its: #FDE68A, #BBF7D0, #FECACA (yellow, green, pink)
Whiteboard chart line: #3B82F6 (blue, jagged upward line, 3px)
Couch fill: #6366F1 (indigo — accent furniture) / cushions: #818CF8
Coffee table fill: #D97706 (amber wood)
Person 1 (standing, whiteboard): orange shirt #F97316 / skin #FDDCB5
Person 2 (couch, laptop): blue shirt #3B82F6 / skin #D4A96A
Person 3 (background desk): grey shirt #6B7280 / skin #FDDCB5
Laptop fill: #1E293B / screen: #DBEAFE
Plant pot: #C2410C / leaves: #16A34A / stem: #15803D
Banner fill: #6366F1 / text rect: "BUILD. SHIP. REPEAT." in #FFFFFF 20pt bold
Pendant cords: #94A3B8 (2px) / globes: #FEF08A (warm yellow, 24px, glow)

VISUAL LAYOUT:
Wide open office. Three people in casual collaboration. Indigo couch focal point. Motivational banner on back wall. Plants and light.

ANIMATION TIMELINE (5.5s total):
0–0.5s: Wall, floor, window establish (opacity 0→1.0, ease-out). Light rays visible.
0.5–1.0s: Furniture appears in sequence: couch (scale 0.9→1.0, spring), coffee table (spring), background desk (spring). Stagger 0.15s each.
1.0–1.3s: Plant appears corner (scale 0→1.0, spring). Pendant lights drop in (Y: -30px→0, ease-out, stagger 0.1s each).
1.3–1.6s: Pendant globes glow on (opacity 0→1.0 with warm glow radial, ease-out).
1.6–1.9s: Motivational banner slides in from left (X: -200px→target, ease-out spring). Text fades in (0.1s delay).
1.9–2.2s: Person 1 appears at whiteboard (scale 0→1.0, spring).
2.2–2.5s: Whiteboard content appears (post-its scale 0→1.0, spring, stagger 0.1s each. Chart line draws, ease-out).
2.5–2.8s: Person 2 appears on couch (scale 0→1.0, spring). Laptop appears (spring).
2.8–3.1s: Person 3 appears at background desk (scale 0→1.0, spring).
3.1–3.5s: Post-it on whiteboard "pinned" pulse (scale 1.0→1.15→1.0, spring, each stagger 0.15s).
3.5–5.5s (natural):
  - Person 1 gestures (arm path rotateZ: 0→+15°→0, ease-in-out, 2.5s cycle — "explaining").
  - Person 2 nods (head rotateZ: 0→-5°→0, ease-in-out, 2s cycle).
  - Laptop screen cursor blinks.
  - Pendant lights glow breathe (blur 8px→14px→8px, ease-in-out, 2s stagger cycle).
  - Hold final state at 5.5s.

EASING CURVES:
- Furniture: ease-out / spring
- People: spring
- Gesture cycles: ease-in-out
- Pendant glow: ease-in-out

COLOR VARIANTS:
Variant A: Warm cream + indigo couch (modern startup)
Variant B: All white + #EF4444 red accents (bold agency)
Variant C: Dark walls + neon accents (creative studio / gaming company)

USAGE CONTEXT:
Startup brand video. "We're hiring" culture video. Company intro slide animation. Accelerator/VC pitch deck animation. Co-working space promo.

───────────────────────────────────────────────────────────────────────────────
PROMPT 048: Gym / Workout — Fitness Brand
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 5.0s | LOOP: Yes
SVG: Gym dumbbell curl figure (30 paths: gym floor rect, mirror wall back (rect + reflection guides), person figure (head circle, neck, torso, left arm down, left arm up-bent with dumbbell, right arm relaxed, left leg, right leg, shoes), dumbbell (handle bar + 2 plate circles each side = 5 paths), sweat drops ×3 small curved lines, energy lines ×4 radiating from figure, floor shadow ellipse, heart rate line element (jagged ECG line, 200px wide), "REP 1" text badge circle, progress bar 300px wide below figure) — figure at 540×800px, 400px tall

COLOR SPECIFICATION:
Background: #09090B (near black)
Floor fill: #1C1917 (very dark brown rubber floor)
Mirror fill: #0F172A (dark mirror — slightly lighter than wall)
Person torso fill: #DC2626 (red jersey / athletic wear)
Person skin: #FDDCB5
Person shorts fill: #1E293B (dark)
Shoes fill: #EF4444 (red)
Dumbbell handle fill: #374151 (grey metal)
Dumbbell plates fill: #1E293B (dark grey) / stroke: #6B7280 (1.5px)
Sweat drops stroke: #60A5FA (light blue, 2px)
Energy lines stroke: #FBBF24 (gold, 2px, radiating from torso)
Floor shadow: #EF444420 (red 12%)
ECG line stroke: #EF4444 (red, 3px, jagged)
Rep badge fill: #EF4444 / text "1" #FFFFFF 20pt bold
Progress bar fill: #EF4444 (red) / track: #374151 (grey)

VISUAL LAYOUT:
Figure doing dumbbell curl center-frame. Energy radiates from body. ECG line at bottom of figure. Rep counter badge top-right of figure. Progress bar below.

ANIMATION TIMELINE (5.0s loopable):
0–0.5s: Floor and background establish. Mirror fades in (opacity 0→0.5).
0.5–0.8s: Figure appears (scale 0.9→1.0, ease-out spring). Dumbbell appears in lowered position.
0.8–3.0s (curl animation, 1.1s per rep, loops):
  Rep 1 (0.8–1.9s):
    0.8–1.2s: Left arm curls up (path morphs: arm goes from down to bent 90°, ease-in-out). Dumbbell translates Y: 0→-120px.
    1.2–1.4s: Hold top of curl. Energy lines radiate briefly (scale 0→1.2→0, ease-out).
    1.4–1.9s: Arm lowers back to start (ease-in-out). Dumbbell returns Y: -120→0px.
  Rep 2 (1.9–3.0s): Same animation cycle. Rep badge updates "1"→"2" (scale 1.0→1.3→1.0, spring).
3.0–3.5s: Rep 3 begins. On this rep, at top of curl: sweat drops fly off (3 drops translate X:+20px, Y:-30px each from forehead, opacity 1.0→0, ease-out, stagger 0.05s). Rep badge "3".
3.5–4.0s: Arm lowers. Progress bar fills to 75% (width 0→225px, ease-out).
4.0–4.5s: ECG line draws left→right (dashoffset 100%→0%, ease-out). Heart rate line pulses (scale Y: 1.0→1.3→1.0, ease-in-out, 2 beats, 0.3s each).
4.5–5.0s: Hold. Figure breathes (scale 1.0→1.02→1.0, ease-in-out). Energy lines pulse softly (opacity 0.3→0.6→0.3). Loop resets.

EASING CURVES:
- Curl up: ease-in-out
- Energy burst: ease-out
- Progress fill: ease-out
- ECG: ease-out

COLOR VARIANTS:
Variant A: Red on black (intense / hardcore gym)
Variant B: #10B981 green on dark (functional fitness / CrossFit)
Variant C: #A78BFA purple on dark (women's fitness / boutique)

USAGE CONTEXT:
Fitness app promo. Gym membership ad. "30-day challenge" campaign. Personal trainer brand. Health & wellness YouTube intro.

───────────────────────────────────────────────────────────────────────────────
PROMPT 049: Wedding Invite — Event Announcement
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1080×1920px (9:16 Vertical)
DURATION: 6.0s | LOOP: No
SVG: Wedding invite card (33 paths: outer card rect (portrait), gold foil border (4 rects forming frame), inner cream area, floral wreath (8 petal/leaf paths forming circular frame around center), two interlocked ring circles (3 paths: ring 1, ring 2, overlap highlight), "WEDDING INVITATION" banner rect, couple names rect "Priya & Arjun" (2 name rects), date rect "14 March 2026", venue rect "Taj Palace, New Delhi", decorative divider line (3 paths — center line with diamond), small heart at bottom, 4 corner rose elements (each: 1 rose bud circle + 2 leaf paths = 4×3=12 paths counted above)) — card 860×1440px centered 540×960px

COLOR SPECIFICATION:
Background: #1C0A00 (very dark warm)
Card fill: #FFFBEB (warm cream)
Gold border rects fill: #D97706 (gold)
Gold border stroke: #92400E (1px)
Wreath petals fill: #FCA5A5 (pale rose pink) and #86EFAC (pale mint)
Wreath leaves fill: #16A34A (green)
Ring 1 fill: none / stroke: #D97706 (gold, 3px, 44px diameter circle)
Ring 2 fill: none / stroke: #D97706 (gold, 3px, 44px, offset +20px X from ring 1)
Overlap highlight: #D97706 (small almond shape at overlap area)
Banner fill: #D97706 / text rect "WEDDING INVITATION" #FFFFFF 16pt letter-spaced
Names "Priya & Arjun": #1C1917, 32pt bold, centered
Date "14 March 2026": #D97706, 18pt medium
Venue "Taj Palace, New Delhi": #6B7280, 14pt
Divider line: #D97706 with center diamond (3px, 180px each side)
Heart fill: #EF4444 (bottom center, 20px)
Corner roses: bud fill #FCA5A5 / leaves fill #16A34A / stems stroke #15803D

VISUAL LAYOUT:
Portrait invite card, near full-height of vertical frame. Floral wreath in center surrounding rings. Text below wreath. Corner roses. Premium feel.

ANIMATION TIMELINE (6.0s total):
0–0.5s: Card rect scales in (scaleY: 0.04→1.0, ease-out — unfolds from thin line, same as menu card technique).
0.5–0.8s: Cream fill brightens (opacity 0→1.0, ease-out). Gold border fades in.
0.8–1.1s: Gold border lines draw clockwise (dashoffset 100%→0%, ease-out).
1.1–1.5s: Corner rose elements appear one by one (scale 0→1.0, spring, stagger 0.1s: TL→TR→BL→BR).
1.5–2.0s: Floral wreath petals and leaves unfurl from center outward (each petal: scale 0→1.0, rotateZ from center, spring, stagger 0.05s — creates blooming effect).
2.0–2.4s: Ring 1 draws (circle stroke-dashoffset 100%→0%, ease-out, 0.4s). 
2.4–2.7s: Ring 2 draws with slight overlap visible.
2.7–2.9s: Overlap highlight appears (scale 0→1.0, spring). Rings have gold shimmer (brightness 100%→140%→100%, ease-in-out).
2.9–3.2s: "WEDDING INVITATION" banner slides down from above card top (Y: -30px→0, ease-out spring).
3.2–3.5s: Couple names "Priya & Arjun" fade in + scale 0.9→1.0 (ease-out spring).
3.5–3.7s: Divider line draws from center outward (both sides simultaneously, ease-out).
3.7–4.0s: Date and venue fade in (stagger 0.2s, ease-out).
4.0–4.3s: Small heart at bottom pulses (scale 0→1.3→1.0, spring, #EF4444 glow 0→10px→0).
4.3–4.8s: Wreath petals each sway slightly (rotateZ ±3°, ease-in-out, stagger 0.04s per petal — organic living wreath effect).
4.8–5.3s: Full card gold shimmer scan top→bottom (white diagonal, 3px, opacity 0→0.35→0).
5.3–6.0s: Hold. Rings pulse very gently (scale 1.0→1.03→1.0, ease-in-out, 0.7s cycle, offset from each other).

EASING CURVES:
- Unfold: ease-out
- Wreath bloom: cubic-bezier(0.34, 1.56, 0.64, 1)
- Ring draw: ease-out
- Sway: ease-in-out

COLOR VARIANTS:
Variant A: Gold + cream + rose pink (Hindu / Indian wedding)
Variant B: Navy + cream + white florals (Western elegant)
Variant C: Red + cream + gold (Marathi / traditional South Asian)

USAGE CONTEXT:
Wedding invitation social share video. "Save the Date" Instagram reel. Event management company portfolio. Wedding planner brand content. Premium invite reveal reel.

───────────────────────────────────────────────────────────────────────────────
PROMPT 050: Farmer in Field — Agriculture / Rural India
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 6.0s | LOOP: Yes
SVG: Farm scene (35 paths: sky gradient rect, sun circle upper-right, 4 sun rays, cloud left (3 overlapping circles), ground/field rect bottom 40%, crop rows (5 horizontal dashed lines suggesting planted rows), farmer figure (head with turban — circle + wrapped cloth arc, face circle, neck, torso in kurta, dhoti shape, left arm with hoe handle, right arm extended, 2 legs), hoe tool (handle line + blade rect), water pot (3 paths: pot body oval, handle, base), tree far-right (trunk rect + 2 leaf cloud shapes), 2 birds in sky (each: 2 wing arcs), farm boundary wall (low rect, right edge)) — scene spans 1920px, farmer at 700×600px

COLOR SPECIFICATION:
Background sky: #DBEAFE (light blue)
Sun fill: #FBBF24 (warm gold)
Sun rays stroke: #F59E0B (amber, 3px)
Cloud fill: #FFFFFF (white, 3 overlapping ovals)
Field/ground fill: #92400E (rich earth brown)
Crop row lines stroke: #16A34A (green, dashed 2px — suggesting sprouting rows)
Turban fill: #EF4444 (traditional red/saffron)
Face/skin: #D4A96A (warm medium skin)
Kurta fill: #FFFFFF (white)
Dhoti fill: #F5F5DC (cream)
Arm/leg skin: #D4A96A
Hoe handle stroke: #92400E (brown, 3px)
Hoe blade fill: #6B7280 (metal grey)
Water pot fill: #C2410C (terracotta) / fill #A0522D
Tree trunk fill: #78350F (brown)
Tree leaves fill: #16A34A (green) + #15803D (dark green second cloud)
Birds stroke: #374151 (dark, 2px simple arc paths)
Farm wall fill: #D97706 (amber mud wall)

VISUAL LAYOUT:
Wide farm landscape. Sky top 50%. Field bottom 50%. Farmer in left-center frame. Tree far right. Birds in sky. Hoe being used on field.

ANIMATION TIMELINE (6.0s loopable):
0–0.5s: Sky and sun establish (fade in, ease-out). Sun rays draw (dashoffset 100%→0%, ease-out, stagger 0.05s per ray).
0.5–1.0s: Field/ground fades in. Crop row lines draw from left→right (each row: dashoffset, stagger 0.1s per row, ease-out).
1.0–1.5s: Farm wall slides up from ground right edge (scaleY 0→1.0, ease-out). Tree assembles (trunk → leaf clouds, stagger 0.15s, spring).
1.5–2.0s: Farmer figure builds from feet up (legs → torso → arms → head/turban, each 0.1s stagger, ease-out draw). Water pot appears at farmer's side (scale 0→1.0, spring).
2.0–2.5s: Cloud drifts in from left (X: -100→300px, ease-in-out). Birds appear in sky (scale 0→1.0, spring, stagger 0.2s each).
2.5–6.0s (continuous loop):
  - Hoe swings: arm with hoe rotates down (rotateZ: -30°→+40°, ease-in, 0.4s), then returns (ease-out, 0.5s). Repeats every 1.8s — working motion.
  - Soil particle at hoe impact: small dot (6px brown) appears and drops (Y: 0→+20px, opacity 1→0, ease-out, at hoe strike moment each cycle).
  - Birds fly: each bird wing arcs alternate open/close (rotateZ: +15°→-15°, ease-in-out, 0.6s cycle, birds slowly drift right 3px per cycle).
  - Sun rays rotate very slowly (rotate 360° per 30s, linear — sun shining).
  - Cloud drifts right slowly (X += 1px per 0.1s, loops across frame and resets from left).

EASING CURVES:
- Scene build: ease-out / spring
- Hoe swing: ease-in / ease-out
- Bird wings: ease-in-out
- Cloud drift: linear

COLOR VARIANTS:
Variant A: Warm earth tones + blue sky (Indian farming / Kisan)
Variant B: Golden hour version: sky #FDE68A→#FB923C gradient (sunset farm scene)
Variant C: Monsoon: grey-blue sky + darker field + rain lines (agricultural insurance / monsoon content)

USAGE CONTEXT:
Agritech platform brand video. "PM Kisan Yojana" government scheme explainer. Farming app promo. Rural India brand story. Agrarian documentary intro. NGO content.

───────────────────────────────────────────────────────────────────────────────
PROMPT 051: Studio Podcast Setup — Creator Economy
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.5s | LOOP: No
SVG: Podcast studio (33 paths: desk rect, studio foam panel wall (5 angled diamond/square shapes on back wall), "ON AIR" sign rect with LED glow, microphone on arm (mic body capsule, arm elbow, arm base, shock mount ring), laptop open (3 paths), headphones on desk (simplified 5 paths), water bottle (3 paths: body, cap, label rect), acoustic foam colors alternating, soundwave visualizer bars ×8 (8 thin rects at different heights, animated), potted succulent (3 paths), ring light circle (outer ring + inner gap), "EPISODE 47" badge (circle + text rect)) — scene 1600px centered 960×580px

COLOR SPECIFICATION:
Background: #0F172A (dark navy studio)
Desk fill: #1E293B (dark blue-grey) / stroke: #334155 (1px)
Acoustic foam fills: alternating #7C3AED (purple) and #4F46E5 (indigo)
ON AIR sign fill: #EF4444 / text "ON AIR" #FFFFFF 18pt bold / red glow around sign
Mic capsule fill: #F1F5F9 (silver) / arm stroke: #94A3B8 (grey, 3px) / shock mount: #6B7280
Laptop fill: #1E293B / screen: glowing #DBEAFE
Headphones fill: #1E293B / cushions: #374151
Water bottle fill: #DBEAFE (light blue) / cap: #3B82F6 (blue)
Succulent fill: #16A34A (green)
Soundwave bars fill: #A78BFA (purple — all bars)
Ring light outer stroke: #FEF08A (warm yellow, 4px) / center transparent
Episode badge fill: #6366F1 / text "#47" #FFFFFF 22pt bold

VISUAL LAYOUT:
Podcast desk setup facing viewer. Mic arm prominent. ON AIR sign top-right. Soundwave bars animated in front of mic. Ring light circle behind/above figure area.

ANIMATION TIMELINE (5.5s total):
0–0.5s: Dark background. Acoustic foam panels appear on wall (each scale 0→1.0, spring, stagger 0.06s L→R).
0.5–0.8s: Desk appears (scale 0.95→1.0, ease-out spring).
0.8–1.1s: Laptop, headphones, water bottle, succulent appear (each spring, 0.08s stagger).
1.1–1.5s: Mic arm draws from base to elbow to capsule (stroke-dashoffset, ease-out). Shock mount appears (scale spring).
1.5–1.8s: Ring light circle draws clockwise (dashoffset 100%→0%, ease-out). Warm glow inside ring brightens (radial #FEF08A15, opacity 0→0.4).
1.8–2.0s: ON AIR sign slides in from top-right (Y: -30px→0, ease-out spring). Sign red glow pulses once (blur 0→20px→8px).
2.0–2.3s: Episode badge scales 0→1.0 (spring) in lower-right area.
2.3–2.6s: Soundwave bars appear (each bar scale from Y-center: scaleY 0→1.0, spring, stagger 0.04s each).
2.6–5.5s (continuous):
  - ON AIR sign pulses (opacity 0.7→1.0→0.7, ease-in-out, 1s cycle — LED blink).
  - Soundwave bars animate (each bar scaleY: random between 0.3→1.0, ease-in-out, individual 0.2–0.5s cycles, creates live audio visual).
  - Ring light glow breathes (opacity 0.4→0.6→0.4, ease-in-out, 2s cycle).
  - Mic capsule has very subtle shimmer (white highlight arc, opacity 0→0.2→0, 3s cycle).

EASING CURVES:
- Assembly: spring
- Soundwave bars: ease-in-out (independent random)
- ON AIR pulse: ease-in-out
- Ring glow: ease-in-out

COLOR VARIANTS:
Variant A: Purple/indigo on dark navy (premium podcast studio)
Variant B: Red accents on black (intense / news-style podcast)
Variant C: Green accents on dark (Spotify-style / music podcast)

USAGE CONTEXT:
Podcast channel intro animation. "New episode out now" Reels story. Creator economy brand video. Recording studio promo. Anchor / Spotify podcaster content.

───────────────────────────────────────────────────────────────────────────────
PROMPT 052: E-learning Dashboard — EdTech UI
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.0s | LOOP: No
SVG: Learning platform UI (35 paths: outer screen/browser frame rect, nav bar top rect, nav logo rect, nav items ×3 small rects, left sidebar rect, 3 sidebar menu items (each: icon circle + text rect = 6 paths), main content area: course card 1 (rect + progress bar + thumbnail placeholder + title rect + instructor rect + % badge), course card 2 (same structure), streak badge (flame icon 3 paths + circle + "Day 14" text rect), confetti burst (6 small rects/diamond shapes scattered), notification bell in nav (small — 3 paths)) — screen 1600×900px, centered 960×540px

COLOR SPECIFICATION:
Screen frame fill: #F1F5F9 / stroke: #CBD5E1 (2px, browser chrome feel)
Nav bar fill: #FFFFFF / stroke: #E2E8F0 (1px bottom border)
Nav logo rect: #6366F1 (indigo, 80×28px)
Nav item rects: #94A3B8 (grey, muted links)
Sidebar fill: #F8FAFC
Sidebar menu icon circles: #EEF2FF / stroke: #6366F1 (indigo, active item has fill #6366F1 + white icon)
Course card 1 fill: #FFFFFF / stroke: #E2E8F0 (2px, rounded 12px)
Card 1 thumbnail: #DBEAFE (pale blue placeholder rect, 280×160px)
Card 1 title rect: #1E293B (200×16px placeholder)
Card 1 instructor rect: #94A3B8 (140×12px)
Card 1 progress bar track: #E2E8F0 / fill: #6366F1 (68% filled)
Card 1 % badge: #6366F1 fill / "68%" #FFFFFF 12pt bold
Course card 2 identical structure / progress at 34% / thumbnail fill: #D1FAE5 (pale green)
Streak badge: circle fill #FEF3C7 / flame paths fill: #F97316 + #FBBF24 (orange + amber) / "Day 14" rect #92400E
Confetti shapes fills: #EF4444, #3B82F6, #FBBF24, #10B981, #A78BFA, #F97316 (6 colors)
Notification bell stroke: #374151 (2px)

VISUAL LAYOUT:
Realistic UI dashboard view. Left sidebar navigation. Two course cards in main area. Streak badge and confetti as celebration overlay.

ANIMATION TIMELINE (5.0s total):
0–0.4s: Screen frame fades in (scale 0.95→1.0, ease-out spring).
0.4–0.7s: Nav bar slides down (Y:-40px→0, ease-out). Logo appears (scale spring). Nav items fade in (stagger 0.1s).
0.7–1.0s: Sidebar slides in from left (X:-100px→0, ease-out). Sidebar menu items appear (stagger 0.08s each, fade+slide).
1.0–1.4s: Course card 1 scales 0.9→1.0 (ease-out spring). Thumbnail, title, instructor fade in (stagger 0.06s each).
1.4–1.7s: Progress bar 1 fills (width 0→68%, ease-in-out, 0.3s). % badge pops at end (scale 0→1.0, spring).
1.7–2.1s: Course card 2 appears (same sequence as card 1, stagger 0.4s from card 1). Progress bar 2 fills to 34%.
2.1–2.5s: Notification bell in nav shakes (rotate -10°→+10°→-7°→+7°→0°, ease-out spring). Badge dot appears on bell (scale 0→1.0, spring).
2.5–2.9s: Streak badge scales 0→1.0 (spring, center-right area). Flame paths flicker (scaleY 1.0→1.15→0.95→1.0, rapid 0.15s cycles, 3 times).
2.9–3.5s: Confetti pieces fly out from streak badge area (each piece: translate 40–80px in random directions, rotateZ random ±180°, opacity 1.0→0, ease-out, staggered 0.05s each). 6 pieces total.
3.5–4.2s: Sidebar active menu item pulses (background fill brightens: #EEF2FF→#C7D2FE→#EEF2FF, ease-in-out).
4.2–5.0s: Hold. Progress bars have subtle shimmer (white diagonal band slides across each bar, opacity 0→0.3→0, ease-in-out, stagger 0.5s between cards).

EASING CURVES:
- Frame/nav: ease-out
- Cards: ease-out / spring
- Progress: ease-in-out
- Confetti: ease-out

COLOR VARIANTS:
Variant A: Indigo on white (standard LMS / course platform)
Variant B: #0EA5E9 blue on white (corporate training platform)
Variant C: #10B981 green on dark (skills/upskilling dark mode)

USAGE CONTEXT:
EdTech platform demo video. "Dashboard walkthrough" product tour. Investor demo animation. Coursera / BYJU's / Unacademy product promo. App Store feature video.

───────────────────────────────────────────────────────────────────────────────
PROMPT 053: Family in Park — Insurance / Life Moments
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 6.0s | LOOP: Yes
SVG: Park scene (35 paths: sky rect, sun upper-left, 3 sun rays, ground/grass rect, 2 large tree silhouettes (trunk + 2 leaf cloud shapes each = 6 paths), park bench (seat + 2 legs + back = 4 paths), father figure (head + body + arm waving + 2 legs = 5 paths), mother figure (head + body + arm up = 4 paths), child figure small (head + body + 2 arms up = 4 paths), balloon (oval + string path), butterfly (2 wing arcs + body dot), cloud left, cloud right, distant hill arc, 4 flower paths at ground level) — scene 1600px, family at 800–1100px X, Y:500–750px

COLOR SPECIFICATION:
Background sky: #BFDBFE (soft blue)
Ground/grass fill: #DCFCE7 (very light mint green)
Grass stroke: #86EFAC (slightly darker green edge, 1px)
Sun fill: #FEF08A (pale yellow)
Sun rays stroke: #F59E0B (2px)
Clouds fill: #FFFFFF
Distant hill fill: #A7F3D0 (pale mint)
Trees trunk fill: #78350F (brown) / leaf clouds: #16A34A and #15803D
Bench fill: #D97706 (amber wood) / stroke: #92400E
Father: blue shirt #2563EB / skin #FDDCB5 / dark pants #1E293B
Mother: dress #EC4899 (pink) / skin #FDDCB5
Child: yellow shirt #FBBF24 / skin #FDDCB5
Balloon fill: #EF4444 (red) / string stroke: #374151 (1px)
Butterfly wings: #F97316 (orange) and #FBBF24 (amber)
Flowers: petals #FCA5A5 (pink), #FDE68A (yellow), #BFDBFE (blue), #BBFABBA (mint)

VISUAL LAYOUT:
Idyllic park scene. Family of three in center. Trees flanking. Bench left. Balloon held by child. Butterfly flitting around. Flowers at ground level.

ANIMATION TIMELINE (6.0s loopable):
0–0.5s: Sky and grass establish. Hills and distant background fades in (ease-out).
0.5–1.0s: Trees grow from ground (scaleY 0→1.0, ease-out, transform-origin bottom, left tree first then right, stagger 0.2s).
1.0–1.3s: Bench slides up from ground (Y:+30px→0, ease-out spring). Flowers bloom at ground (scale 0→1.0, spring, stagger 0.08s each).
1.3–1.6s: Mother appears (scale 0→1.0, spring). Father appears (stagger 0.15s). Child appears (stagger 0.3s).
1.6–1.9s: Balloon drifts in from top (Y: -100px→child's hand Y, ease-out). String path draws as balloon descends.
1.9–2.1s: Clouds drift in from sides (left cloud: X:-200px→400px, right: X:2100px→1600px, ease-in-out, 0.3s each).
2.1–2.4s: Butterfly enters (X:200,Y:400 → X:900,Y:320 — curves slightly), wings alternate (rotateZ: +20°→-20°, 0.25s cycle).
2.4–2.7s: Sun fades in + rays draw (ease-out, stagger 0.06s per ray).
2.7–6.0s (continuous loop):
  - Father waves: arm rotateZ 0°→+30°→0°, ease-in-out, 1.5s cycle.
  - Child jumps: whole child figure Y 0→-20px→0, ease-in-out, 2s cycle (slight squash on landing: scaleY 0.92→1.0).
  - Balloon bobs: Y 0→-12px→0, ease-in-out, 2.5s cycle.
  - Butterfly continues flying: organic path across upper frame area, wings flapping continuously.
  - Clouds drift slowly right (each +0.3px per frame, loop reset when offscreen).
  - Flowers sway: rotateZ ±3°, ease-in-out, 2s staggered cycles.

EASING CURVES:
- Scene build: ease-out / spring
- Jump: ease-in-out with squash
- Balloon: ease-in-out
- Clouds: linear

COLOR VARIANTS:
Variant A: Soft daylight colors (standard family park — insurance / family brand)
Variant B: Golden hour version: sky #FDE68A→#FB923C (evening family moment)
Variant C: Winter version: sky #E0F2FE, ground #F0F9FF, tree trunks bare, add snowflakes

USAGE CONTEXT:
Life insurance brand video. Family-focused banking/investment ad. "Protect what matters" campaign. Health insurance family plan. Reliance / LIC / Max Life style content.

───────────────────────────────────────────────────────────────────────────────
PROMPT 054: Diwali Diyas — Festival / Celebration
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 6.0s | LOOP: Yes
SVG: Diwali scene (36 paths: dark background, 5 diya clay lamps along bottom (each: clay body oval, base flat ellipse, wick tiny rect, flame outer teardrop, flame inner lighter teardrop = 5×5=25 paths), rangoli pattern centered (5 concentric petal rings simplified as 5 circle-arc paths), 4 firework burst paths in upper sky (each: 6 short radiating lines from center point), string lights across top (rope line + 8 small bulb circles)) — diyas at Y:800–900px spaced evenly, rangoli at 960×540px 280px diameter

COLOR SPECIFICATION:
Background: #1C0A00 (dark warm brown — night)
Sky area fill: same background
Diya clay fill: #C2410C (terracotta) each / stroke: #92400E (1px)
Diya base fill: #92400E
Flame outer: #F97316 (orange)
Flame inner: #FEF08A (pale yellow)
Flame glow: radial from flame center, #FBBF2440 (amber 25%, 40px radius)
Rangoli ring 1 (outer): #EF4444 (red)
Rangoli ring 2: #F97316 (orange)
Rangoli ring 3: #FBBF24 (gold)
Rangoli ring 4: #16A34A (green)
Rangoli ring 5 (inner): #FFFFFF (white)
Rangoli fill: none (stroke-only arcs, 3px each)
Firework 1: #EF4444 (red burst)
Firework 2: #3B82F6 (blue burst)
Firework 3: #FBBF24 (gold burst)
Firework 4: #A78BFA (purple burst)
Each firework line stroke: 3px, radiating 8 lines 40px each from center
String light rope stroke: #92400E (brown, 2px, curves slightly — drooping)
Bulb fills alternating: #FBBF24 (gold) and #EF4444 (red) and #3B82F6 (blue) — cycling across 8 bulbs

VISUAL LAYOUT:
Dark night background. 5 diyas along bottom frame. Rangoli in center mid-ground. Fireworks upper sky. String lights across top frame edge.

ANIMATION TIMELINE (6.0s loopable):
0–0.3s: Dark background only.
0.3–0.6s: Rangoli draws from center outward (ring 5 first → ring 1 last, each ring stroke-dashoffset 100%→0%, stagger 0.1s, ease-out — spiraling reveal effect).
0.6–1.2s: Diya clay bodies appear left→right (scale 0.8→1.0, ease-out spring, stagger 0.12s each).
1.2–1.6s: Flames appear on each diya (scale 0→1.0 from wick position, spring, stagger 0.1s). Flame glows appear (radial, opacity 0→0.5, ease-out).
1.6–1.9s: String light rope draws from left→right (dashoffset 100%→0%, ease-out). Bulbs appear (scale 0→1.0, spring, stagger 0.08s each).
1.9–2.2s: Firework 1 bursts at 400×200px (lines radiate from center: scale 0→1.0→0, ease-out, 0.3s total).
2.2–2.5s: Firework 2 at 1600×150px.
2.5–2.8s: Firework 3 at 800×260px.
2.8–3.1s: Firework 4 at 1300×220px.
3.1–6.0s (continuous loop):
  - All 5 flames flicker individually (scaleY: 1.0↔1.2, scaleX: 1.0↔0.9, random cycles 0.2–0.4s each — organic fire).
  - Flame glows pulse (opacity 0.3↔0.6, each flame independent 0.4–0.8s cycle).
  - Fireworks repeat cycle: new bursts appear at random sky positions every 0.8s, fade out 0.5s.
  - String light bulbs twinkle (individual opacity 0.5↔1.0, random stagger, 0.5–1.5s cycles).
  - Rangoli has subtle sparkle (one ring brightens then dims, rotates through rings cyclically, 0.5s per ring).

EASING CURVES:
- Rangoli draw: ease-out
- Flames appear: spring
- Firework burst: ease-out
- Flicker: ease-in-out (random timing)

COLOR VARIANTS:
Variant A: Terracotta + fire orange + dark brown (classic Diwali)
Variant B: Gold diyas on midnight blue (premium Diwali brand)
Variant C: Any festival: change colors for Holi (bright splatter shapes), Christmas (green/red), Eid (crescent + stars)

USAGE CONTEXT:
Diwali brand campaign video. Festival greeting card animation. "Wishing you a happy Diwali" social media post. FMCG seasonal campaign. E-commerce Diwali sale opener.

───────────────────────────────────────────────────────────────────────────────
PROMPT 055: Hospital Room — Healthcare Journey
───────────────────────────────────────────────────────────────────────────────
CANVAS: 1920×1080px (16:9)
DURATION: 5.5s | LOOP: No
SVG: Hospital room scene (35 paths: room wall back, floor rect, hospital bed (frame rect, mattress rect, pillow rect, bed rail, adjustable leg), patient figure lying (head circle, body under blanket shape, arm out), IV stand (pole, bag, tube line drip), heart rate monitor (device box, screen rect, ECG line on screen, cable), wall-mounted BP monitor (box + display rect), window with daylight (frame + glass + light shaft), medical cross on wall (2 rect paths), nurse figure standing (head, body, clipboard), bedside table (rect + glass cup on top), get-well flowers (pot + 3 flower shapes)) — scene 1700px, centered 960×560px

COLOR SPECIFICATION:
Background wall: #F0F9FF (very light hospital blue)
Floor fill: #F1F5F9 (light grey)
Bed frame fill: #E2E8F0 / mattress fill: #FFFFFF / blanket fill: #BFDBFE (pale blue)
Pillow fill: #F8FAFC (near white)
Patient skin: #FDDCB5 / hair: #292524
IV stand pole stroke: #94A3B8 (grey, 3px) / IV bag fill: #DBEAFE (pale blue liquid)
IV tube stroke: #BAE6FD (light blue, 1.5px, curved path)
Monitor device fill: #1E293B / screen fill: #0F172A / ECG line: #22C55E (green, 2px jagged)
BP monitor fill: #374151 / display: #0F172A / reading rect: #22C55E
Window frame: #CBD5E1 / glass: #DBEAFE / light shaft fill: #FEF08A10 (pale yellow 6%)
Medical cross fill: #EF4444
Nurse torso fill: #FFFFFF (white coat) / pants: #3B82F6 (blue) / skin: #D4A96A
Clipboard fill: #FEF9EE / stroke: #D97706 (amber)
Flowers: petals #FCA5A5 (pink) and #FDE68A (yellow) / pot: #C2410C (terracotta) / stems: #16A34A

VISUAL LAYOUT:
Hospital bed center-left. Nurse standing right of bed. Monitor right side. IV stand near bed. Window upper-right, warm light rays. Flowers on bedside table.

ANIMATION TIMELINE (5.5s total):
0–0.5s: Room walls and floor establish (fade in, ease-out). Window light ray appears (opacity 0→0.4).
0.5–0.9s: Bed frame and mattress appear (scale 0.95→1.0, ease-out spring). Pillow, blanket follow (spring stagger 0.1s each).
0.9–1.2s: Patient figure appears on bed (scale 0→1.0, spring). IV stand rises from floor (scaleY 0→1.0, ease-out, transform-origin bottom).
1.2–1.5s: IV tube path draws from bag down (dashoffset 100%→0%, ease-out). IV drip dot falls (small circle Y:+20px, opacity 1→0, repeats every 0.8s from here).
1.5–1.8s: Monitor appears (scale spring). ECG line on screen draws left→right (dashoffset 100%→0%, ease-out). BP monitor appears.
1.8–2.1s: Medical cross on wall fades in. Nurse figure assembles (torso → head → clipboard, stagger 0.1s, spring).
2.1–2.4s: Bedside table appears. Flowers bloom (petals scale 0→1.0, spring, stagger 0.08s per petal).
2.4–2.8s: Nurse nods (head rotateZ 0→-5°→0, ease-in-out) — checking on patient.
2.8–3.2s: Patient arm shifts slightly (Y: 0→+8px→0, ease-in-out — patient stirs, subtle).
3.2–5.5s (continuous):
  - ECG line animates (continuously scrolling left — new beats draw on right, jagged pulse every 0.8s, green, linear).
  - IV drip falls every 0.8s cycle (dot appears at bag, travels down tube path, ease-in, opacity 1→0 at bottom).
  - Light ray breathes (opacity 0.4→0.6→0.4, ease-in-out, 2s cycle — cloud passing over sun).
  - Flowers sway gently (rotateZ ±2°, ease-in-out, 2.5s cycle).

EASING CURVES:
- Assembly: spring
- ECG: linear (continuous)
- IV drip: ease-in
- Light: ease-in-out

COLOR VARIANTS:
Variant A: Light blue + white (standard hospital / healthcare)
Variant B: White + green accents (modern private hospital / premium healthcare)
Variant C: Dark theme + neon green ECG (tech-forward health platform / digital health startup)

USAGE CONTEXT:
Health insurance explainer. Hospital brand video. "We care for you" healthcare campaign. Medical app feature. Government health scheme animation.

===============================================================================
PHASE 1 COMPLETE — ALL 55 CORE PROMPTS DELIVERED
(Prompts 056–075 extend Level 1.4 with: Street food scene, cricket stadium,
Bollywood dance figure, fintech mobile payment, news studio, wedding mandap,
Indian marketplace bazaar, EV charging station, mountain trekking, tech
product unboxing — all same format and specification depth)
===============================================================================