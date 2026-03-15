import {defineAnimationSpec} from "../engine/types";
import {getCanvasByFormat, mergeElement} from "./shared";
import type {AnimationTemplate} from "./template-types";

export const heartPulseTemplate: AnimationTemplate = {
  id: "heart-pulse",
  title: "Heart Pulse",
  keywords: ["heart", "love", "like", "pulse", "instagram"],
  defaultPrompt: "A pulsing red heart on a dark square background",
  build: (options) => {
    const canvas = getCanvasByFormat(
      options?.canvasFormat ?? "square",
      options?.background ?? "#1A1A1A",
    );

    const heartSize = options?.canvasFormat === "landscape" ? 180 : 160;
    const centerX = (canvas.width - heartSize) / 2;
    const centerY = (canvas.height - heartSize) / 2;

    return defineAnimationSpec({
      id: "heart-pulse",
      title: options?.title ?? "Heart Pulse - Like Notification",
      duration: options?.duration ?? 2.5,
      fps: 30,
      loop: options?.loop ?? true,
      canvas,
      elements: [
        mergeElement(
          {
            id: "heart",
            type: "heart",
            x: centerX,
            y: centerY,
            width: heartSize,
            height: heartSize,
            fill: options?.fill ?? "#FF2D55",
            opacity: 0.92,
            animations: [
              {start: 0, end: 0.1, property: "scale", from: 1, to: 1.35, easing: "snapUp"},
              {start: 0.1, end: 0.3, property: "scale", from: 1.35, to: 0.9, easing: "spring"},
              {start: 0.3, end: 0.55, property: "scale", from: 0.9, to: 1, easing: "easeOut"},
              {start: 0.8, end: 1.4, property: "scale", from: 1, to: 1.04, easing: "easeInOut"},
              {start: 1.4, end: 2, property: "scale", from: 1.04, to: 1, easing: "easeInOut"},
            ],
          },
          options?.elementOverrides,
        ),
      ],
    });
  },
};
