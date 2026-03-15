import {defineAnimationSpec} from "../engine/types";
import {getCanvasByFormat, mergeElement} from "./shared";
import type {AnimationTemplate} from "./template-types";

export const arrowSwipeTemplate: AnimationTemplate = {
  id: "arrow-swipe",
  title: "Arrow Swipe",
  keywords: ["arrow", "swipe", "up", "cta", "scroll"],
  defaultPrompt: "A white upward arrow CTA on a vertical transparent-style layout",
  build: (options) => {
    const canvas = getCanvasByFormat(
      options?.canvasFormat ?? "portrait",
      options?.background ?? "#111111",
    );
    const size = 120;
    return defineAnimationSpec({
      id: "arrow-swipe",
      title: options?.title ?? "Arrow - Swipe Up CTA",
      duration: options?.duration ?? 1.6,
      fps: 30,
      loop: options?.loop ?? true,
      canvas,
      elements: [
        mergeElement(
          {
            id: "arrow",
            type: "arrow",
            x: (canvas.width - size) / 2,
            y: canvas.height * 0.76,
            width: size,
            height: size,
            stroke: options?.stroke ?? "#FFFFFF",
            strokeWidth: 8,
            animations: [
              {start: 0, end: 0.35, property: "opacity", from: 0, to: 1, easing: "easeOut"},
              {start: 0.35, end: 0.9, property: "translateY", from: 12, to: -18, easing: "easeInOut"},
              {start: 1.0, end: 1.3, property: "opacity", from: 1, to: 0, easing: "easeIn"},
            ],
          },
          options?.elementOverrides,
        ),
      ],
    });
  },
};
