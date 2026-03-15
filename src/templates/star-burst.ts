import {defineAnimationSpec} from "../engine/types";
import {getCanvasByFormat, mergeElement} from "./shared";
import type {AnimationTemplate} from "./template-types";

export const starBurstTemplate: AnimationTemplate = {
  id: "star-burst",
  title: "Star Burst",
  keywords: ["star", "rating", "favorite", "highlight", "review"],
  defaultPrompt: "A gold rating star on a dark landscape background",
  build: (options) => {
    const canvas = getCanvasByFormat(
      options?.canvasFormat ?? "landscape",
      options?.background ?? "#111827",
    );
    const size = 160;
    return defineAnimationSpec({
      id: "star-burst",
      title: options?.title ?? "Star Burst - Rating Reveal",
      duration: options?.duration ?? 2.2,
      fps: 30,
      loop: options?.loop ?? false,
      canvas,
      elements: [
        mergeElement(
          {
            id: "star",
            type: "star",
            x: (canvas.width - size) / 2,
            y: (canvas.height - size) / 2,
            width: size,
            height: size,
            fill: options?.fill ?? "#FBBF24",
            animations: [
              {start: 0, end: 0.3, property: "scale", from: 0.6, to: 1, easing: "easeOut"},
              {start: 0.3, end: 0.55, property: "scale", from: 1, to: 1.2, easing: "spring"},
              {start: 0.55, end: 0.9, property: "scale", from: 1.2, to: 1, easing: "easeOut"},
            ],
          },
          options?.elementOverrides,
        ),
      ],
    });
  },
};
