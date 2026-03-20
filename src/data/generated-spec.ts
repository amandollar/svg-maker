import type {AnimationSpec} from "../engine/types";

export const GENERATED_SPEC: AnimationSpec = {
  "id": "find-the-right-match",
  "title": "Find The Right Match",
  "duration": 4.2,
  "fps": 30,
  "loop": false,
  "canvas": {
    "width": 1080,
    "height": 1080,
    "background": "#F5EFE6"
  },
  "elements": [
    {
      "id": "backdrop-product-sheet-a",
      "type": "panel",
      "layer": "background",
      "x": 690,
      "y": 124,
      "width": 250,
      "height": 360,
      "fill": "#d4d9e7",
      "opacity": 0,
      "cornerRadius": 42,
      "animations": [
        {
          "start": 0.02,
          "end": 0.48,
          "property": "opacity",
          "from": 0,
          "to": 0.42,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "backdrop-product-sheet-b",
      "type": "panel",
      "layer": "background",
      "x": 780,
      "y": 190,
      "width": 180,
      "height": 270,
      "fill": "#a6bae8",
      "opacity": 0,
      "cornerRadius": 36,
      "animations": [
        {
          "start": 0.08,
          "end": 0.54,
          "property": "opacity",
          "from": 0,
          "to": 0.3,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "backdrop-product-ring",
      "type": "ring",
      "layer": "background",
      "x": 96,
      "y": 110,
      "width": 180,
      "height": 180,
      "stroke": "#2051bc",
      "strokeWidth": 5,
      "opacity": 0,
      "animations": [
        {
          "start": 0.1,
          "end": 0.82,
          "property": "opacity",
          "from": 0,
          "to": 0.34,
          "easing": "easeOut"
        },
        {
          "start": 0.1,
          "end": 0.82,
          "property": "draw",
          "from": 0,
          "to": 1,
          "easing": "easeInOut"
        }
      ]
    },
    {
      "id": "search-frame",
      "type": "panel",
      "layer": "background",
      "x": 92,
      "y": 144,
      "width": 896,
      "height": 880,
      "fill": "#e3ded7",
      "opacity": 0,
      "cornerRadius": 52,
      "animations": [
        {
          "start": 0,
          "end": 0.42,
          "property": "opacity",
          "from": 0,
          "to": 0.96,
          "easing": "easeOut"
        },
        {
          "start": 0,
          "end": 0.42,
          "property": "scale",
          "from": 0.94,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-top-rule",
      "type": "panel",
      "layer": "background",
      "x": 428,
      "y": 170,
      "width": 224,
      "height": 8,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.02,
          "end": 0.36,
          "property": "opacity",
          "from": 0,
          "to": 0.7,
          "easing": "easeOut"
        },
        {
          "start": 0.02,
          "end": 0.36,
          "property": "scale",
          "from": 0.24,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-query-stage",
      "type": "panel",
      "layer": "background",
      "x": 128,
      "y": 200,
      "width": 824,
      "height": 140,
      "fill": "#e3ded7",
      "stroke": "#2563EB",
      "strokeWidth": 3,
      "opacity": 0,
      "cornerRadius": 38,
      "animations": [
        {
          "start": 0.03,
          "end": 0.46,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.03,
          "end": 0.46,
          "property": "scale",
          "from": 0.92,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-query-stage-glass",
      "type": "panel",
      "layer": "background",
      "x": 152,
      "y": 208,
      "width": 776,
      "height": 30,
      "fill": "#dde1ec",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.06,
          "end": 0.52,
          "property": "opacity",
          "from": 0,
          "to": 0.42,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-chrome-dot-0",
      "type": "panel",
      "layer": "background",
      "x": 164,
      "y": 214,
      "width": 12,
      "height": 12,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.08,
          "end": 0.56,
          "property": "opacity",
          "from": 0,
          "to": 0.84,
          "easing": "easeOut"
        },
        {
          "start": 0.08,
          "end": 0.56,
          "property": "scale",
          "from": 0.5,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-chrome-dot-1",
      "type": "panel",
      "layer": "background",
      "x": 194,
      "y": 214,
      "width": 12,
      "height": 12,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.11,
          "end": 0.5800000000000001,
          "property": "opacity",
          "from": 0,
          "to": 0.5,
          "easing": "easeOut"
        },
        {
          "start": 0.11,
          "end": 0.5800000000000001,
          "property": "scale",
          "from": 0.5,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-chrome-dot-2",
      "type": "panel",
      "layer": "background",
      "x": 224,
      "y": 214,
      "width": 12,
      "height": 12,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.14,
          "end": 0.6000000000000001,
          "property": "opacity",
          "from": 0,
          "to": 0.5,
          "easing": "easeOut"
        },
        {
          "start": 0.14,
          "end": 0.6000000000000001,
          "property": "scale",
          "from": 0.5,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-bar",
      "type": "panel",
      "layer": "foreground",
      "x": 140,
      "y": 218,
      "width": 800,
      "height": 94,
      "fill": "#d4d9e7",
      "stroke": "#2051bc",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.04,
          "end": 0.46,
          "property": "opacity",
          "from": 0,
          "to": 0.88,
          "easing": "easeOut"
        },
        {
          "start": 0.04,
          "end": 0.46,
          "property": "scale",
          "from": 0.9,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-glow",
      "type": "glow",
      "layer": "background",
      "x": 80,
      "y": 174,
      "width": 220,
      "height": 220,
      "fill": "#2563EB",
      "opacity": 0,
      "glowColor": "#2563EB",
      "glowStrength": 0.7,
      "animations": [
        {
          "start": 0.06,
          "end": 0.56,
          "property": "opacity",
          "from": 0,
          "to": 0.1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-icon",
      "type": "search",
      "layer": "foreground",
      "x": 158,
      "y": 230,
      "width": 180,
      "height": 180,
      "stroke": "#2563EB",
      "strokeWidth": 6,
      "opacity": 0,
      "offsetX": 0,
      "offsetY": 0,
      "animations": [
        {
          "start": 0,
          "end": 0.34,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        },
        {
          "start": 0,
          "end": 0.46,
          "property": "scale",
          "from": 0.78,
          "to": 1,
          "easing": "spring"
        },
        {
          "start": 0,
          "end": 0.76,
          "property": "draw",
          "from": 0,
          "to": 1,
          "easing": "easeInOut"
        },
        {
          "start": 1.05,
          "end": 1.8,
          "property": "translateY",
          "from": 0,
          "to": -10,
          "easing": "easeInOut"
        },
        {
          "start": 1.8,
          "end": 2.7,
          "property": "translateY",
          "from": -10,
          "to": 0,
          "easing": "easeInOut"
        }
      ]
    },
    {
      "id": "search-query",
      "type": "text",
      "layer": "main",
      "x": 260,
      "y": 246,
      "width": 646,
      "height": 102,
      "fill": "#111827",
      "opacity": 0,
      "text": "Find The Right\nMatch",
      "fontSize": 38,
      "fontWeight": 900,
      "fontFamily": "'Arial Black', 'Segoe UI', sans-serif",
      "textAlign": "left",
      "letterSpacing": -1.1,
      "lineHeight": 1.02,
      "animations": [
        {
          "start": 0.12,
          "end": 0.78,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        },
        {
          "start": 0.12,
          "end": 0.78,
          "property": "translateY",
          "from": 12,
          "to": 0,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-caret",
      "type": "panel",
      "layer": "foreground",
      "x": 886,
      "y": 242,
      "width": 6,
      "height": 38,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.18,
          "end": 0.82,
          "property": "opacity",
          "from": 0,
          "to": 0.72,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-chip-0",
      "type": "panel",
      "layer": "foreground",
      "x": 285,
      "y": 354,
      "width": 158,
      "height": 48,
      "fill": "#d4d9e7",
      "stroke": "#2051bc",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.16,
          "end": 0.8,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.16,
          "end": 0.8,
          "property": "scale",
          "from": 0.84,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-chip-1",
      "type": "panel",
      "layer": "foreground",
      "x": 461,
      "y": 354,
      "width": 158,
      "height": 48,
      "fill": "#a6bae8",
      "stroke": "#2051bc",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.2,
          "end": 0.8400000000000001,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.2,
          "end": 0.8400000000000001,
          "property": "scale",
          "from": 0.84,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-chip-2",
      "type": "panel",
      "layer": "foreground",
      "x": 637,
      "y": 354,
      "width": 158,
      "height": 48,
      "fill": "#d4d9e7",
      "stroke": "#2051bc",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.24,
          "end": 0.88,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.24,
          "end": 0.88,
          "property": "scale",
          "from": 0.84,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-chip-text-0",
      "type": "text",
      "layer": "foreground",
      "x": 307,
      "y": 368,
      "width": 114,
      "height": 20,
      "fill": "#2563EB",
      "opacity": 0,
      "text": "FAST MATCH",
      "fontSize": 16,
      "fontWeight": 800,
      "fontFamily": "'Segoe UI', Arial, sans-serif",
      "textAlign": "left",
      "letterSpacing": 1,
      "lineHeight": 1,
      "animations": [
        {
          "start": 0.2,
          "end": 0.84,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-chip-text-1",
      "type": "text",
      "layer": "foreground",
      "x": 483,
      "y": 368,
      "width": 114,
      "height": 20,
      "fill": "#111827",
      "opacity": 0,
      "text": "UI CUES",
      "fontSize": 16,
      "fontWeight": 800,
      "fontFamily": "'Segoe UI', Arial, sans-serif",
      "textAlign": "left",
      "letterSpacing": 1,
      "lineHeight": 1,
      "animations": [
        {
          "start": 0.24000000000000002,
          "end": 0.88,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-chip-text-2",
      "type": "text",
      "layer": "foreground",
      "x": 659,
      "y": 368,
      "width": 114,
      "height": 20,
      "fill": "#2563EB",
      "opacity": 0,
      "text": "RANKED",
      "fontSize": 16,
      "fontWeight": 800,
      "fontFamily": "'Segoe UI', Arial, sans-serif",
      "textAlign": "left",
      "letterSpacing": 1,
      "lineHeight": 1,
      "animations": [
        {
          "start": 0.28,
          "end": 0.9199999999999999,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-0",
      "type": "panel",
      "layer": "background",
      "x": 140,
      "y": 450,
      "width": 800,
      "height": 92,
      "fill": "#d4d9e7",
      "stroke": "#2051bc",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 30,
      "animations": [
        {
          "start": 0.18,
          "end": 0.9,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.18,
          "end": 0.9,
          "property": "translateY",
          "from": 18,
          "to": 0,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-rail-0",
      "type": "panel",
      "layer": "foreground",
      "x": 150,
      "y": 462,
      "width": 8,
      "height": 68,
      "fill": "#81a5f3",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.2,
          "end": 0.92,
          "property": "opacity",
          "from": 0,
          "to": 0.48,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-highlight-0",
      "type": "panel",
      "layer": "background",
      "x": 158,
      "y": 464,
      "width": 128,
      "height": 6,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.22,
          "end": 0.94,
          "property": "opacity",
          "from": 0,
          "to": 0.44,
          "easing": "easeOut"
        },
        {
          "start": 0.22,
          "end": 0.94,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-dot-0",
      "type": "panel",
      "layer": "foreground",
      "x": 166,
      "y": 474,
      "width": 18,
      "height": 18,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.2,
          "end": 0.92,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.2,
          "end": 0.92,
          "property": "scale",
          "from": 0.4,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-line-0",
      "type": "panel",
      "layer": "foreground",
      "x": 198,
      "y": 478,
      "width": 448,
      "height": 12,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.24,
          "end": 0.96,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.24,
          "end": 0.96,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-line-sub-0",
      "type": "panel",
      "layer": "foreground",
      "x": 198,
      "y": 506,
      "width": 305,
      "height": 10,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.28,
          "end": 1.02,
          "property": "opacity",
          "from": 0,
          "to": 0.54,
          "easing": "easeOut"
        },
        {
          "start": 0.28,
          "end": 1.02,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-1",
      "type": "panel",
      "layer": "background",
      "x": 140,
      "y": 570,
      "width": 800,
      "height": 92,
      "fill": "#a6bae8",
      "stroke": "#2051bc",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 30,
      "animations": [
        {
          "start": 0.28,
          "end": 0.98,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.28,
          "end": 0.98,
          "property": "translateY",
          "from": 18,
          "to": 0,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-rail-1",
      "type": "panel",
      "layer": "foreground",
      "x": 150,
      "y": 582,
      "width": 8,
      "height": 68,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.30000000000000004,
          "end": 1,
          "property": "opacity",
          "from": 0,
          "to": 0.82,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-highlight-1",
      "type": "panel",
      "layer": "background",
      "x": 158,
      "y": 584,
      "width": 176,
      "height": 6,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.32,
          "end": 1.02,
          "property": "opacity",
          "from": 0,
          "to": 0.74,
          "easing": "easeOut"
        },
        {
          "start": 0.32,
          "end": 1.02,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-dot-1",
      "type": "panel",
      "layer": "foreground",
      "x": 166,
      "y": 594,
      "width": 18,
      "height": 18,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.30000000000000004,
          "end": 1,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.30000000000000004,
          "end": 1,
          "property": "scale",
          "from": 0.4,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-line-1",
      "type": "panel",
      "layer": "foreground",
      "x": 198,
      "y": 598,
      "width": 336,
      "height": 12,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.33999999999999997,
          "end": 1.04,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.33999999999999997,
          "end": 1.04,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-line-sub-1",
      "type": "panel",
      "layer": "foreground",
      "x": 198,
      "y": 626,
      "width": 228,
      "height": 10,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.38,
          "end": 1.1,
          "property": "opacity",
          "from": 0,
          "to": 0.54,
          "easing": "easeOut"
        },
        {
          "start": 0.38,
          "end": 1.1,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-2",
      "type": "panel",
      "layer": "background",
      "x": 140,
      "y": 690,
      "width": 800,
      "height": 92,
      "fill": "#d4d9e7",
      "stroke": "#2051bc",
      "strokeWidth": 2,
      "opacity": 0,
      "cornerRadius": 30,
      "animations": [
        {
          "start": 0.38,
          "end": 1.06,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.38,
          "end": 1.06,
          "property": "translateY",
          "from": 18,
          "to": 0,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-rail-2",
      "type": "panel",
      "layer": "foreground",
      "x": 150,
      "y": 702,
      "width": 8,
      "height": 68,
      "fill": "#81a5f3",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.4,
          "end": 1.08,
          "property": "opacity",
          "from": 0,
          "to": 0.48,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-result-highlight-2",
      "type": "panel",
      "layer": "background",
      "x": 158,
      "y": 704,
      "width": 128,
      "height": 6,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.42000000000000004,
          "end": 1.0999999999999999,
          "property": "opacity",
          "from": 0,
          "to": 0.44,
          "easing": "easeOut"
        },
        {
          "start": 0.42000000000000004,
          "end": 1.0999999999999999,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-dot-2",
      "type": "panel",
      "layer": "foreground",
      "x": 166,
      "y": 714,
      "width": 18,
      "height": 18,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.4,
          "end": 1.08,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.4,
          "end": 1.08,
          "property": "scale",
          "from": 0.4,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-line-2",
      "type": "panel",
      "layer": "foreground",
      "x": 198,
      "y": 718,
      "width": 544,
      "height": 12,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.44,
          "end": 1.1199999999999999,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.44,
          "end": 1.1199999999999999,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-line-sub-2",
      "type": "panel",
      "layer": "foreground",
      "x": 198,
      "y": 746,
      "width": 370,
      "height": 10,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.48000000000000004,
          "end": 1.18,
          "property": "opacity",
          "from": 0,
          "to": 0.54,
          "easing": "easeOut"
        },
        {
          "start": 0.48000000000000004,
          "end": 1.18,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-inspector",
      "type": "panel",
      "layer": "background",
      "x": 140,
      "y": 822,
      "width": 800,
      "height": 150,
      "fill": "#dddcde",
      "stroke": "#2563EB",
      "strokeWidth": 3,
      "opacity": 0,
      "cornerRadius": 34,
      "animations": [
        {
          "start": 0.22,
          "end": 0.98,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.22,
          "end": 0.98,
          "property": "scale",
          "from": 0.9,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-inspector-glass",
      "type": "panel",
      "layer": "background",
      "x": 158,
      "y": 840,
      "width": 764,
      "height": 56,
      "fill": "#dbdfeb",
      "opacity": 0,
      "cornerRadius": 22,
      "animations": [
        {
          "start": 0.24,
          "end": 1,
          "property": "opacity",
          "from": 0,
          "to": 0.34,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-inspector-badge",
      "type": "panel",
      "layer": "foreground",
      "x": 464,
      "y": 848,
      "width": 152,
      "height": 46,
      "fill": "#d4d9e7",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.24,
          "end": 1,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.24,
          "end": 1,
          "property": "scale",
          "from": 0.8,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "search-inspector-title",
      "type": "text",
      "layer": "foreground",
      "x": 164,
      "y": 862,
      "width": 752,
      "height": 24,
      "fill": "#2563EB",
      "opacity": 0,
      "text": "SEARCH SCORE",
      "fontSize": 18,
      "fontWeight": 800,
      "fontFamily": "'Segoe UI', Arial, sans-serif",
      "textAlign": "center",
      "letterSpacing": 1.2,
      "lineHeight": 1,
      "animations": [
        {
          "start": 0.28,
          "end": 1.04,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-score-track",
      "type": "panel",
      "layer": "background",
      "x": 168,
      "y": 912,
      "width": 744,
      "height": 16,
      "fill": "#8b8b8d",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.3,
          "end": 1.06,
          "property": "opacity",
          "from": 0,
          "to": 0.84,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-score-fill",
      "type": "panel",
      "layer": "foreground",
      "x": 168,
      "y": 912,
      "width": 551,
      "height": 16,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.34,
          "end": 1.16,
          "property": "opacity",
          "from": 0,
          "to": 0.94,
          "easing": "easeOut"
        },
        {
          "start": 0.34,
          "end": 1.16,
          "property": "scale",
          "from": 0.24,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-inspector-row-0",
      "type": "panel",
      "layer": "foreground",
      "x": 168,
      "y": 942,
      "width": 670,
      "height": 12,
      "fill": "#111827",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.4,
          "end": 1.2,
          "property": "opacity",
          "from": 0,
          "to": 0.22,
          "easing": "easeOut"
        },
        {
          "start": 0.4,
          "end": 1.2,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-inspector-row-1",
      "type": "panel",
      "layer": "foreground",
      "x": 168,
      "y": 998,
      "width": 536,
      "height": 12,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.46,
          "end": 1.24,
          "property": "opacity",
          "from": 0,
          "to": 0.56,
          "easing": "easeOut"
        },
        {
          "start": 0.46,
          "end": 1.24,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-inspector-row-2",
      "type": "panel",
      "layer": "foreground",
      "x": 168,
      "y": 1054,
      "width": 402,
      "height": 12,
      "fill": "#2051bc",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.52,
          "end": 1.28,
          "property": "opacity",
          "from": 0,
          "to": 0.56,
          "easing": "easeOut"
        },
        {
          "start": 0.52,
          "end": 1.28,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "search-subheadline",
      "type": "text",
      "layer": "foreground",
      "x": 140,
      "y": 998,
      "width": 800,
      "height": 88,
      "fill": "#475569",
      "opacity": 0,
      "text": "A stronger SVG search scene with query input and result rows",
      "fontSize": 24,
      "fontWeight": 600,
      "fontFamily": "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      "textAlign": "center",
      "letterSpacing": -0.2,
      "lineHeight": 1.16,
      "animations": [
        {
          "start": 0.34,
          "end": 1.24,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        },
        {
          "start": 0.34,
          "end": 1.24,
          "property": "translateY",
          "from": 18,
          "to": 0,
          "easing": "easeOut"
        }
      ]
    }
  ]
};
