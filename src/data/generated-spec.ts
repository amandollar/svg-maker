import type {AnimationSpec} from "../engine/types";

export const GENERATED_SPEC: AnimationSpec = {
  "id": "premium-course-completion-certificate-on-background-1c1917-1",
  "title": "Premium course completion certificate on background #1C1917, 1920x1080 landscape, 4.5 seconds, play once: certificate scroll unfurls from a thin line, gold frame draws, inner border draws, corner flourishes pop, banner slides down, seal pops with a warm glow pulse, red ribbon strips slide in, title/name/date lines reveal with stagger, diagonal shimmer sweep across the whole certificate, gentle breathing at the end",
  "duration": 4.5,
  "fps": 30,
  "loop": false,
  "canvas": {
    "width": 1920,
    "height": 1080,
    "background": "#1c1917"
  },
  "elements": [
    {
      "id": "certificate-1",
      "type": "certificate",
      "layer": "main",
      "x": 0,
      "y": 0,
      "width": 1920,
      "height": 1080,
      "viewBoxWidth": 160,
      "viewBoxHeight": 90,
      "stroke": "#FF2D55",
      "strokeWidth": 10,
      "opacity": 1,
      "offsetX": 0,
      "offsetY": 0,
      "animations": [
        {
          "start": 0,
          "end": 4.5,
          "property": "draw",
          "from": 0,
          "to": 1,
          "easing": "linear"
        }
      ]
    }
  ]
};
