# Test Prompts (Current System)

This file contains prompts that the current `animate-svg` system can generate reliably.

## Quick Start

1. Generate a spec from a prompt:

```powershell
cd C:\Users\LENOVO\Desktop\animate-svg
npm.cmd run generate -- "YOUR PROMPT HERE"
```

2. Preview in Remotion Studio:

```powershell
npm.cmd run dev
```

Tip: Most of the prompts below are also in the QA regression suite (see `npm.cmd run qa:generate`).

## Core Icons / Motions

### Hearts

```powershell
npm.cmd run generate -- "A soft dreamy pink heart centered on a pale peach square background, 2.8 seconds, seamless loop, gentle glow, romantic pulse animation"
```

```powershell
npm.cmd run generate -- "A bold red heart centered on a cream square background, 2.4 seconds, seamless loop, high-contrast social media like animation"
```

### Checkmark / Success

```powershell
npm.cmd run generate -- "A green success checkmark centered on a very light mint landscape background, 1.8 seconds, play once, clean SaaS completion animation with draw reveal and finish bounce"
```

### Bell / Notification

```powershell
npm.cmd run generate -- "A neon gold notification bell centered on a deep navy vertical background, 2 seconds, seamless loop, glowing swing animation"
```

### CTA Arrow (Swipe Up)

```powershell
npm.cmd run generate -- "A white upward arrow centered on a dark vertical background, 1.6 seconds, seamless loop, swipe up CTA animation"
```

### Star Burst

```powershell
npm.cmd run generate -- "A premium gold star centered on a dark landscape background, 2.2 seconds, play once, rating reveal animation with burst sparkle"
```

### Location Pin Drop

```powershell
npm.cmd run generate -- "A red location pin centered on a light map-style landscape background, 2.5 seconds, play once, energetic pin drop animation with landing ripple"
```

### Video Play Reveal

```powershell
npm.cmd run generate -- "A white play button centered on a dark landscape background, 2 seconds, play once, video intro reveal animation"
```

### WiFi Build

```powershell
npm.cmd run generate -- "A white wifi signal centered on a dark square background, 2.2 seconds, seamless loop, connectivity building animation"
```

### Lock Secure

```powershell
npm.cmd run generate -- "A white lock icon centered on a deep navy square background, 2 seconds, play once, security confirmation animation"
```

### Cart Add

```powershell
npm.cmd run generate -- "A white shopping cart icon centered on a dark landscape background, 2.3 seconds, play once, add to cart confirmation animation"
```

### Search Load

```powershell
npm.cmd run generate -- "A white search icon centered on a dark square background, 2.1 seconds, seamless loop, query loading animation"
```

## Phase 1 Scenes (Deterministic Templates)

### Rocket Launch (031)

```powershell
npm.cmd run generate -- "Rocket launch on background #0B1120, 1920x1080 (16:9) landscape, 4.5 seconds, play once, stars fade in then rocket launches upward with flame flicker and particles, startup launch day animation"
```

### Growing Plant (032)

```powershell
npm.cmd run generate -- "Growing plant on background #ECFDF5, 1920x1080 (16:9) landscape, 5 seconds, play once, terracotta pot appears, roots draw, stem grows upward, leaves unfurl left and right, soil particles float, sun fades in with rays, gentle sway"
```

### Delivery Truck (033)

```powershell
npm.cmd run generate -- "Delivery truck on background #EFF6FF, 1920x1080 (16:9) landscape, 4 seconds, play once, truck drives in from left with speed lines and rotating wheels, road line scrolls, decelerates and brake rocks, lights flash twice, cargo door opens slightly, exhaust puff at the end"
```

### Doctor Medical (034)

```powershell
npm.cmd run generate -- "Doctor medical scene on background #F0FDF4, 1920x1080 (16:9) landscape, 4 seconds, play once, friendly doctor with clipboard and stethoscope, coat fills in, stethoscope draws, clipboard slides in and lines draw, pocket cross pulses, subtle nod"
```

### Solar Energy (035)

```powershell
npm.cmd run generate -- "Solar panel + sun clean energy scene on background #EFF6FF, 1920x1080 (16:9) landscape, 5 seconds, seamless loop, ground and house appear, solar panel reveals, cells fill in, sun fades in with rays, energy bolt flows from panel to house"
```

### Notification Stack (036)

```powershell
npm.cmd run generate -- "Notification stack on background #0F172A, 1080x1920 (9:16) vertical, 4 seconds, play once, four notification cards stacked, each slides in from the right with staggered icon/text/badge, accent bars pulse, badge numbers count up, first card shakes then highlights, subtle accent glow at the end"
```

### Globe Network (037)

```powershell
npm.cmd run generate -- "Globe network on background #030712, 1920x1080 (16:9) landscape, 5 seconds, seamless loop, stylized dark globe with blue grid lines, continents fade in, orbit rings draw, pins pop with ripples, connection arcs animate with dashed flow, subtle edge glow pulse"
```

### Person At Desk (038)

```powershell
npm.cmd run generate -- "Person at desk productive work scene on background #FEF9EE, 1920x1080 (16:9) landscape, 5 seconds, seamless loop, warm cozy workspace: desk and chair spring in, person pops in, laptop/mug/plant stagger in, lamp appears and light cone extends, sticky notes drop, clock hands appear, then idle loop with head nod, steam rising, cursor blink, minute hand subtle advance"
```

### Rupee Badge (039)

```powershell
npm.cmd run generate -- "₹ rupee symbol in a gold circular frame on background #FFFBEB, 1080x1080 (1:1) square, 3 seconds, play once: outer circle draws clockwise, inner dashed ring fades in, 4 diamond ornaments pop N/E/S/W, rupee strokes draw in sequence, then a confidence pulse and a diagonal shimmer sweep, subtle circle rotate at the end"
```

### Certificate Scroll (040)

```powershell
npm.cmd run generate -- "Certificate of completion on background #1C1917, 1920x1080 (16:9) landscape, 4.5 seconds, play once: certificate unfurls from a thin horizontal line, cream body fades in, outer gold border draws, inner decorative border draws, corner flourishes pop in, banner slides down and title appears, seal pops in and ring draws, star emblem appears, red ribbon strips slide in, three text lines appear with stagger, diagonal shimmer sweep across the certificate, seal pulses with warm glow, subtle breathe hold at the end"
```
