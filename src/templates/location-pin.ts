import {defineAnimationSpec} from "../engine/types";
import {getCanvasByFormat, mergeElement} from "./shared";
import type {AnimationTemplate} from "./template-types";

export const locationPinTemplate: AnimationTemplate = {
  id: "location-pin",
  title: "Location Pin",
  keywords: ["pin", "location", "map", "place", "store", "marker"],
  defaultPrompt: "A red location pin dropping onto a light map background",
  build: (options) => {
    const canvas = getCanvasByFormat(
      options?.canvasFormat ?? "landscape",
      options?.background ?? "#E8F4FD",
    );
    const size = 140;
    return defineAnimationSpec({
      id: "location-pin",
      title: options?.title ?? "Location Pin Drop",
      duration: options?.duration ?? 2.5,
      fps: 30,
      loop: options?.loop ?? false,
      canvas,
      elements: [
        mergeElement(
          {
            id: "pin",
            type: "pin",
            x: (canvas.width - size) / 2,
            y: (canvas.height - size) / 2 - 20,
            width: size,
            height: size,
            fill: options?.fill ?? "#EF4444",
            stroke: options?.stroke ?? "#B91C1C",
            strokeWidth: 4,
            animations: [
              {start: 0, end: 0.3, property: "translateY", from: -120, to: 0, easing: "easeIn"},
              {start: 0.3, end: 0.48, property: "scale", from: 1, to: 0.9, easing: "spring"},
              {start: 0.48, end: 0.7, property: "scale", from: 0.9, to: 1, easing: "easeOut"},
            ],
          },
          options?.elementOverrides,
        ),
      ],
    });
  },
};
