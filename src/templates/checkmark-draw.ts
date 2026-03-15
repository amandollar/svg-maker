import {defineAnimationSpec} from "../engine/types";
import {getCanvasByFormat, mergeElement} from "./shared";
import type {AnimationTemplate} from "./template-types";

export const checkmarkDrawTemplate: AnimationTemplate = {
  id: "checkmark-draw",
  title: "Checkmark Draw",
  keywords: ["check", "checkmark", "success", "complete", "done", "task"],
  defaultPrompt: "A green success checkmark animation on a light background",
  build: (options) => {
    const canvas = getCanvasByFormat(
      options?.canvasFormat ?? "landscape",
      options?.background ?? "#F0FFF4",
    );
    const iconSize = 200;

    return defineAnimationSpec({
      id: "checkmark-draw",
      title: options?.title ?? "Checkmark Draw - Task Complete",
      duration: options?.duration ?? 1.8,
      fps: 30,
      loop: options?.loop ?? false,
      canvas,
      elements: [
        mergeElement(
          {
            id: "checkmark",
            type: "checkmark",
            x: (canvas.width - iconSize) / 2,
            y: (canvas.height - iconSize) / 2,
            width: iconSize,
            height: iconSize,
            stroke: options?.stroke ?? "#22C55E",
            strokeWidth: 10,
            animations: [
              {start: 0, end: 0.7, property: "opacity", from: 0, to: 1, easing: "easeOut"},
              {start: 0.7, end: 0.85, property: "scale", from: 1, to: 1.12, easing: "spring"},
              {start: 0.85, end: 1.0, property: "scale", from: 1.12, to: 1, easing: "easeOut"},
            ],
          },
          options?.elementOverrides,
        ),
      ],
    });
  },
};
