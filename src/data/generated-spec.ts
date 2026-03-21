import type {AnimationSpec} from "../engine/types";

export const GENERATED_SPEC: AnimationSpec = {
  "id": "ready-for-launch",
  "title": "Ready For Launch",
  "duration": 4.4,
  "fps": 30,
  "loop": false,
  "canvas": {
    "width": 1080,
    "height": 1080,
    "background": "#0B1020"
  },
  "elements": [
    {
      "id": "hero-frame",
      "type": "panel",
      "layer": "background",
      "x": 72,
      "y": 216,
      "width": 778,
      "height": 414.84000000000003,
      "fill": "#F8FAFC",
      "opacity": 0,
      "cornerRadius": 52,
      "animations": [
        {
          "start": 0,
          "end": 0.52,
          "property": "opacity",
          "from": 0,
          "to": 0.075,
          "easing": "easeOut"
        },
        {
          "start": 0,
          "end": 0.52,
          "property": "scale",
          "from": 0.94,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "hero-rail",
      "type": "panel",
      "layer": "foreground",
      "x": 94,
      "y": 242,
      "width": 12,
      "height": 362.84000000000003,
      "fill": "#38BDF8",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.04,
          "end": 0.4,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.04,
          "end": 0.4,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "text-glow",
      "type": "glow",
      "layer": "background",
      "x": 18,
      "y": 190,
      "width": 560,
      "height": 560,
      "fill": "#38BDF8",
      "opacity": 0,
      "glowColor": "#38BDF8",
      "glowStrength": 0.82,
      "animations": [
        {
          "start": 0,
          "end": 0.7,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 0,
          "end": 0.8,
          "property": "scale",
          "from": 0.72,
          "to": 1,
          "easing": "spring"
        },
        {
          "start": 1.1,
          "end": 2.3,
          "property": "scale",
          "from": 1,
          "to": 1.08,
          "easing": "easeInOut"
        },
        {
          "start": 2.3,
          "end": 3.1,
          "property": "scale",
          "from": 1.08,
          "to": 1,
          "easing": "easeInOut"
        },
        {
          "start": 1.35,
          "end": 2.18,
          "property": "translateY",
          "from": 0,
          "to": -14,
          "easing": "easeInOut"
        },
        {
          "start": 2.18,
          "end": 3.26,
          "property": "translateY",
          "from": -14,
          "to": 0,
          "easing": "easeInOut"
        }
      ]
    },
    {
      "id": "hero-accent-block",
      "type": "panel",
      "layer": "background",
      "x": 106,
      "y": 265,
      "width": 380,
      "height": 155,
      "fill": "#38BDF8",
      "stroke": "#38BDF8",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 34,
      "animations": [
        {
          "start": 0.06,
          "end": 0.48,
          "property": "opacity",
          "from": 0,
          "to": 0.12,
          "easing": "easeOut"
        },
        {
          "start": 0.06,
          "end": 0.48,
          "property": "scale",
          "from": 0.88,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "headline-sweep",
      "type": "panel",
      "layer": "background",
      "x": 134,
      "y": 457.20000000000005,
      "width": 300,
      "height": 20,
      "fill": "#38BDF8",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.18,
          "end": 0.78,
          "property": "opacity",
          "from": 0,
          "to": 0.2,
          "easing": "easeOut"
        },
        {
          "start": 0.18,
          "end": 0.78,
          "property": "translateX",
          "from": -28,
          "to": 34,
          "easing": "easeInOut"
        },
        {
          "start": 1.4,
          "end": 2.28,
          "property": "translateX",
          "from": 18,
          "to": 62,
          "easing": "easeInOut"
        },
        {
          "start": 2.28,
          "end": 3.34,
          "property": "translateX",
          "from": 62,
          "to": 18,
          "easing": "easeInOut"
        },
        {
          "start": 1.4,
          "end": 2.28,
          "property": "opacity",
          "from": 0.16,
          "to": 0.28,
          "easing": "easeInOut"
        },
        {
          "start": 2.28,
          "end": 3.34,
          "property": "opacity",
          "from": 0.28,
          "to": 0.16,
          "easing": "easeInOut"
        }
      ]
    },
    {
      "id": "headline",
      "type": "text",
      "layer": "main",
      "x": 128,
      "y": 300,
      "width": 670,
      "height": 172.20000000000002,
      "fill": "#F8FAFC",
      "opacity": 0,
      "text": "Ready For\nLaunch",
      "fontSize": 84,
      "fontWeight": 900,
      "fontFamily": "'Arial Black', 'Segoe UI', sans-serif",
      "textAlign": "left",
      "letterSpacing": -2.8,
      "lineHeight": 0.9,
      "animations": [
        {
          "start": 0,
          "end": 0.88,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        },
        {
          "start": 0,
          "end": 0.88,
          "property": "translateY",
          "from": 36,
          "to": 0,
          "easing": "spring"
        },
        {
          "start": 0,
          "end": 0.88,
          "property": "scale",
          "from": 0.965,
          "to": 1,
          "easing": "easeOut"
        },
        {
          "start": 1.32,
          "end": 2.12,
          "property": "translateY",
          "from": 0,
          "to": -10,
          "easing": "easeInOut"
        },
        {
          "start": 2.12,
          "end": 3.18,
          "property": "translateY",
          "from": -10,
          "to": 0,
          "easing": "easeInOut"
        },
        {
          "start": 1.32,
          "end": 2.12,
          "property": "scale",
          "from": 1,
          "to": 1.018,
          "easing": "easeInOut"
        },
        {
          "start": 2.12,
          "end": 3.18,
          "property": "scale",
          "from": 1.018,
          "to": 1,
          "easing": "easeInOut"
        }
      ]
    },
    {
      "id": "accent-line",
      "type": "panel",
      "layer": "foreground",
      "x": 128,
      "y": 500.20000000000005,
      "width": 156,
      "height": 7,
      "fill": "#38BDF8",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.14,
          "end": 0.52,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.14,
          "end": 0.52,
          "property": "scale",
          "from": 0.4,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "subheadline",
      "type": "text",
      "layer": "foreground",
      "x": 128,
      "y": 528.2,
      "width": 670,
      "height": 74.63999999999999,
      "fill": "#CBD5E1",
      "opacity": 0,
      "text": "A bold launch moment\nwith upward energy and clear hero framing",
      "fontSize": 27,
      "fontWeight": 600,
      "fontFamily": "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      "textAlign": "left",
      "letterSpacing": -0.35,
      "lineHeight": 1.16,
      "animations": [
        {
          "start": 0.2,
          "end": 1.18,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.2,
          "end": 1.18,
          "property": "translateY",
          "from": 20,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.54,
          "end": 2.42,
          "property": "translateY",
          "from": 0,
          "to": -8,
          "easing": "easeInOut"
        },
        {
          "start": 2.42,
          "end": 3.38,
          "property": "translateY",
          "from": -8,
          "to": 0,
          "easing": "easeInOut"
        }
      ]
    }
  ]
};
