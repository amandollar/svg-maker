import type {AnimationSpec} from "../engine/types";

export const GENERATED_SPEC: AnimationSpec = {
  "id": "prompt-018-microphone-recording-live-canvas-1080-1920px-9-16",
  "title": "Microphone Recording Live",
  "duration": 3,
  "fps": 30,
  "loop": true,
  "canvas": {
    "width": 1080,
    "height": 1920,
    "background": "#0A0A0A"
  },
  "elements": [
    {
      "id": "mic-1",
      "type": "mic",
      "layer": "main",
      "x": 440,
      "y": 860,
      "width": 200,
      "height": 200,
      "stroke": "#FF2D55",
      "strokeWidth": 6,
      "opacity": 1,
      "offsetX": 0,
      "offsetY": 0,
      "animations": [
        {
          "start": 0,
          "end": 0.22,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        },
        {
          "start": 0,
          "end": 0.55,
          "property": "translateY",
          "from": 18,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 0,
          "end": 0.85,
          "property": "draw",
          "from": 0,
          "to": 1,
          "easing": "easeInOut"
        },
        {
          "start": 0.85,
          "end": 1.1,
          "property": "scale",
          "from": 1,
          "to": 1.1,
          "easing": "spring"
        },
        {
          "start": 1.1,
          "end": 1.35,
          "property": "scale",
          "from": 1.1,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "mic-1-wave-left-inner",
      "type": "wave",
      "layer": "background",
      "x": 364,
      "y": 884,
      "width": 180,
      "height": 180,
      "stroke": "#FF2D55",
      "strokeWidth": 4,
      "opacity": 0,
      "glowColor": "#FF2D55",
      "glowStrength": 0.65,
      "animations": [
        {
          "start": 0.7,
          "end": 0.76,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 0.76,
          "end": 1.2999999999999998,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 0.7,
          "end": 1.2999999999999998,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        },
        {
          "start": 1.2999999999999998,
          "end": 1.3599999999999999,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 1.3599999999999999,
          "end": 1.9,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.2999999999999998,
          "end": 1.9,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        },
        {
          "start": 1.9,
          "end": 1.96,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 1.96,
          "end": 2.5,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.9,
          "end": 2.5,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        },
        {
          "start": 2.5,
          "end": 2.56,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 2.56,
          "end": 3,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 2.5,
          "end": 3,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "mic-1-wave-right-inner",
      "type": "wave",
      "layer": "background",
      "x": 516,
      "y": 884,
      "width": 180,
      "height": 180,
      "stroke": "#FF2D55",
      "strokeWidth": 4,
      "opacity": 0,
      "glowColor": "#FF2D55",
      "glowStrength": 0.65,
      "animations": [
        {
          "start": 0.72,
          "end": 0.78,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 0.78,
          "end": 1.3199999999999998,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 0.72,
          "end": 1.3199999999999998,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        },
        {
          "start": 1.3199999999999998,
          "end": 1.38,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 1.38,
          "end": 1.92,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.3199999999999998,
          "end": 1.92,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        },
        {
          "start": 1.92,
          "end": 1.98,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 1.98,
          "end": 2.52,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.92,
          "end": 2.52,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        },
        {
          "start": 2.52,
          "end": 2.58,
          "property": "opacity",
          "from": 0,
          "to": 0.16,
          "easing": "easeOut"
        },
        {
          "start": 2.58,
          "end": 3.02,
          "property": "opacity",
          "from": 0.16,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 2.52,
          "end": 3.02,
          "property": "scale",
          "from": 1,
          "to": 1.4,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "mic-1-wave-left-outer",
      "type": "wave",
      "layer": "background",
      "x": 340,
      "y": 876,
      "width": 210,
      "height": 210,
      "stroke": "#FF2D55",
      "strokeWidth": 3,
      "opacity": 0,
      "glowColor": "#FF2D55",
      "glowStrength": 0.72,
      "animations": [
        {
          "start": 1,
          "end": 1.06,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 1.06,
          "end": 1.6,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1,
          "end": 1.6,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        },
        {
          "start": 1.6,
          "end": 1.6600000000000001,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 1.6600000000000001,
          "end": 2.2,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.6,
          "end": 2.2,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        },
        {
          "start": 2.2,
          "end": 2.2600000000000002,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 2.2600000000000002,
          "end": 2.8000000000000003,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 2.2,
          "end": 2.8000000000000003,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        },
        {
          "start": 2.8000000000000003,
          "end": 2.8600000000000003,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 2.8600000000000003,
          "end": 3,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 2.8000000000000003,
          "end": 3,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "mic-1-wave-right-outer",
      "type": "wave",
      "layer": "background",
      "x": 540,
      "y": 876,
      "width": 210,
      "height": 210,
      "stroke": "#FF2D55",
      "strokeWidth": 3,
      "opacity": 0,
      "glowColor": "#FF2D55",
      "glowStrength": 0.72,
      "animations": [
        {
          "start": 1.02,
          "end": 1.08,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 1.08,
          "end": 1.62,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.02,
          "end": 1.62,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        },
        {
          "start": 1.62,
          "end": 1.6800000000000002,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 1.6800000000000002,
          "end": 2.22,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 1.62,
          "end": 2.22,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        },
        {
          "start": 2.22,
          "end": 2.2800000000000002,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 2.2800000000000002,
          "end": 2.8200000000000003,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 2.22,
          "end": 2.8200000000000003,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        },
        {
          "start": 2.8200000000000003,
          "end": 2.8800000000000003,
          "property": "opacity",
          "from": 0,
          "to": 0.128,
          "easing": "easeOut"
        },
        {
          "start": 2.8800000000000003,
          "end": 3.02,
          "property": "opacity",
          "from": 0.128,
          "to": 0,
          "easing": "easeOut"
        },
        {
          "start": 2.8200000000000003,
          "end": 3.02,
          "property": "scale",
          "from": 1,
          "to": 1.55,
          "easing": "easeOut"
        }
      ]
    },
    {
      "id": "mic-1-rec-dot",
      "type": "glow",
      "layer": "foreground",
      "x": 908,
      "y": 149,
      "width": 20,
      "height": 20,
      "fill": "#FF2D55",
      "opacity": 0,
      "glowColor": "#FF2D55",
      "glowStrength": 0.85,
      "animations": [
        {
          "start": 0.4,
          "end": 0.7,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "spring"
        },
        {
          "start": 0.4,
          "end": 0.7,
          "property": "scale",
          "from": 0.2,
          "to": 1,
          "easing": "spring"
        },
        {
          "start": 0.7,
          "end": 0.9,
          "property": "scale",
          "from": 1,
          "to": 1.3,
          "easing": "easeInOut"
        },
        {
          "start": 0.9,
          "end": 1.1,
          "property": "scale",
          "from": 1.3,
          "to": 1,
          "easing": "easeInOut"
        },
        {
          "start": 1.5,
          "end": 1.7,
          "property": "scale",
          "from": 1,
          "to": 1.3,
          "easing": "easeInOut"
        },
        {
          "start": 1.7,
          "end": 1.9,
          "property": "scale",
          "from": 1.3,
          "to": 1,
          "easing": "easeInOut"
        },
        {
          "start": 2.3,
          "end": 2.5,
          "property": "scale",
          "from": 1,
          "to": 1.3,
          "easing": "easeInOut"
        },
        {
          "start": 2.5,
          "end": 2.7,
          "property": "scale",
          "from": 1.3,
          "to": 1,
          "easing": "easeInOut"
        }
      ]
    },
    {
      "id": "mic-1-rec-text",
      "type": "text",
      "layer": "foreground",
      "x": 936,
      "y": 145,
      "width": 70,
      "height": 28,
      "fill": "#FF2D55",
      "opacity": 0,
      "text": "REC",
      "fontSize": 72,
      "fontWeight": 800,
      "animations": [
        {
          "start": 0.4,
          "end": 0.7,
          "property": "opacity",
          "from": 0,
          "to": 1,
          "easing": "easeOut"
        }
      ]
    }
  ]
};
