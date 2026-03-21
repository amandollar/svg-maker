import type {AnimationSpec} from "../engine/types";

export const GENERATED_SPEC: AnimationSpec = {
  "id": "archive-ready",
  "title": "Archive Ready",
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
      "fill": "#c7d0e7",
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
      "fill": "#aebfe8",
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
      "stroke": "#2156c8",
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
      "id": "download-stack-frame",
      "type": "panel",
      "layer": "background",
      "x": 92,
      "y": 132,
      "width": 896,
      "height": 900,
      "fill": "#dedad3",
      "opacity": 0,
      "cornerRadius": 54,
      "animations": [
        {
          "start": 0,
          "end": 0.42,
          "property": "opacity",
          "from": 0,
          "to": 0.95,
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
      "id": "download-stack-rail",
      "type": "panel",
      "layer": "foreground",
      "x": 490,
      "y": 174,
      "width": 101,
      "height": 8,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.06,
          "end": 0.38,
          "property": "opacity",
          "from": 0,
          "to": 0.82,
          "easing": "easeOut"
        },
        {
          "start": 0.06,
          "end": 0.38,
          "property": "scale",
          "from": 0.24,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "download-stack-headline",
      "type": "text",
      "layer": "main",
      "x": 360,
      "y": 204,
      "width": 360,
      "height": 73.2,
      "fill": "#111827",
      "opacity": 0,
      "text": "Archive\nReady",
      "fontSize": 30,
      "fontWeight": 900,
      "fontFamily": "'Trebuchet MS', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      "textAlign": "center",
      "letterSpacing": -2,
      "lineHeight": 0.92,
      "animations": [
        {
          "start": 0.08,
          "end": 0.82,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        },
        {
          "start": 0.08,
          "end": 0.82,
          "property": "translateY",
          "from": 20,
          "to": 0,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "download-stack-copy",
      "type": "text",
      "layer": "foreground",
      "x": 360,
      "y": 297.2,
      "width": 360,
      "height": 72,
      "fill": "#475569",
      "opacity": 0,
      "text": "A stronger save-state scene with stacked statuses and archive handoff framing.",
      "fontSize": 22,
      "fontWeight": 600,
      "fontFamily": "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      "textAlign": "center",
      "letterSpacing": -0.2,
      "lineHeight": 1.14,
      "animations": [
        {
          "start": 0.16,
          "end": 0.94,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "download-stack-card-3",
      "type": "panel",
      "layer": "background",
      "x": 376,
      "y": 477.2,
      "width": 328,
      "height": 150,
      "fill": "#c7d0e7",
      "opacity": 0,
      "cornerRadius": 34,
      "animations": [
        {
          "start": 0.18,
          "end": 0.9,
          "property": "opacity",
          "from": 0,
          "to": 0.34,
          "easing": "easeOut"
        },
        {
          "start": 0.18,
          "end": 0.9,
          "property": "translateY",
          "from": 20,
          "to": 0,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "download-stack-card-2",
      "type": "panel",
      "layer": "background",
      "x": 354,
      "y": 423.2,
      "width": 372,
      "height": 168,
      "fill": "#aebfe8",
      "opacity": 0,
      "cornerRadius": 38,
      "animations": [
        {
          "start": 0.2,
          "end": 0.94,
          "property": "opacity",
          "from": 0,
          "to": 0.58,
          "easing": "easeOut"
        },
        {
          "start": 0.2,
          "end": 0.94,
          "property": "translateY",
          "from": 20,
          "to": 0,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "download-stack-card-1",
      "type": "panel",
      "layer": "foreground",
      "x": 336,
      "y": 369.2,
      "width": 408,
      "height": 176,
      "fill": "#c7d0e7",
      "opacity": 0,
      "cornerRadius": 40,
      "animations": [
        {
          "start": 0.22,
          "end": 0.98,
          "property": "opacity",
          "from": 0,
          "to": 0.96,
          "easing": "easeOut"
        },
        {
          "start": 0.22,
          "end": 0.98,
          "property": "translateY",
          "from": 20,
          "to": 0,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "download-stack-icon-badge",
      "type": "panel",
      "layer": "foreground",
      "x": 364,
      "y": 397.2,
      "width": 92,
      "height": 92,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 30,
      "animations": [
        {
          "start": 0.26,
          "end": 1.02,
          "property": "opacity",
          "from": 0,
          "to": 0.76,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "download-stack-icon",
      "type": "download",
      "layer": "foreground",
      "x": 374,
      "y": 407.2,
      "width": 72,
      "height": 72,
      "stroke": "#3b73ed",
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
      "id": "download-stack-line-1",
      "type": "text",
      "layer": "foreground",
      "x": 482,
      "y": 407.2,
      "width": 262,
      "height": 30,
      "fill": "#111827",
      "opacity": 0,
      "text": "Premium Motion Pack",
      "fontSize": 22,
      "fontWeight": 800,
      "fontFamily": "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      "textAlign": "left",
      "letterSpacing": -0.5,
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
      "id": "download-stack-line-2",
      "type": "text",
      "layer": "foreground",
      "x": 482,
      "y": 441.2,
      "width": 262,
      "height": 52,
      "fill": "#475569",
      "opacity": 0,
      "text": "Archive state, handoff tags,\nand cleaner save timing",
      "fontSize": 15,
      "fontWeight": 600,
      "fontFamily": "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      "textAlign": "left",
      "letterSpacing": -0.2,
      "lineHeight": 1.14,
      "animations": [
        {
          "start": 0.3,
          "end": 1.08,
          "property": "opacity",
          "from": 0,
          "to": 0.92,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "download-stack-summary",
      "type": "panel",
      "layer": "background",
      "x": 362,
      "y": 687.2,
      "width": 356,
      "height": 114,
      "fill": "#aebfe8",
      "opacity": 0,
      "cornerRadius": 30,
      "animations": [
        {
          "start": 0.32,
          "end": 1.1,
          "property": "opacity",
          "from": 0,
          "to": 0.9,
          "easing": "easeOut"
        },
        {
          "start": 0.32,
          "end": 1.1,
          "property": "scale",
          "from": 0.9,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "download-stack-summary-track",
      "type": "panel",
      "layer": "background",
      "x": 390,
      "y": 715.2,
      "width": 300,
      "height": 12,
      "fill": "#989899",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.36,
          "end": 1.16,
          "property": "opacity",
          "from": 0,
          "to": 0.74,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "download-stack-summary-fill",
      "type": "panel",
      "layer": "foreground",
      "x": 390,
      "y": 715.2,
      "width": 216,
      "height": 12,
      "fill": "#2563EB",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.4,
          "end": 1.22,
          "property": "opacity",
          "from": 0,
          "to": 0.96,
          "easing": "easeOut"
        },
        {
          "start": 0.4,
          "end": 1.22,
          "property": "scale",
          "from": 0.22,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "download-stack-summary-text",
      "type": "text",
      "layer": "foreground",
      "x": 390,
      "y": 745.2,
      "width": 300,
      "height": 28,
      "fill": "#2156c8",
      "opacity": 0,
      "text": "Archive confidence 72%",
      "fontSize": 24,
      "fontWeight": 700,
      "fontFamily": "'Segoe UI', Arial, sans-serif",
      "textAlign": "center",
      "letterSpacing": -0.2,
      "lineHeight": 1,
      "animations": [
        {
          "start": 0.44,
          "end": 1.26,
          "property": "opacity",
          "from": 0,
          "to": 0.94,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "download-stack-cta",
      "type": "panel",
      "layer": "foreground",
      "x": 400,
      "y": 805.2,
      "width": 280,
      "height": 72,
      "fill": "#aebfe8",
      "opacity": 0,
      "cornerRadius": 999,
      "animations": [
        {
          "start": 0.42,
          "end": 1.24,
          "property": "opacity",
          "from": 0,
          "to": 0.88,
          "easing": "easeOut"
        },
        {
          "start": 0.42,
          "end": 1.24,
          "property": "scale",
          "from": 0.84,
          "to": 1,
          "easing": "spring"
        }
      ]
    },
    {
      "id": "download-stack-cta-text",
      "type": "text",
      "layer": "foreground",
      "x": 400,
      "y": 827.2,
      "width": 280,
      "height": 26,
      "fill": "#2563EB",
      "opacity": 0,
      "text": "ARCHIVE READY",
      "fontSize": 22,
      "fontWeight": 800,
      "fontFamily": "'Segoe UI', Arial, sans-serif",
      "textAlign": "center",
      "letterSpacing": 1.2,
      "lineHeight": 1,
      "animations": [
        {
          "start": 0.46,
          "end": 1.3,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    }
  ]
};
