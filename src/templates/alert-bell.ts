import {defineAnimationSpec} from "../engine/types";
import {getCanvasByFormat, mergeElement} from "./shared";
import type {AnimationTemplate} from "./template-types";

export const alertBellTemplate: AnimationTemplate = {
  id: "alert-bell",
  title: "Alert Bell",
  keywords: ["bell", "notification", "notify", "alert", "subscribe"],
  defaultPrompt: "A ringing gold notification bell on a navy background",
  build: (options) => {
    const canvas = getCanvasByFormat(
      options?.canvasFormat ?? "portrait",
      options?.background ?? "#0F172A",
    );
    const bellSize = 130;

    return defineAnimationSpec({
      id: "alert-bell",
      title: options?.title ?? "Alert Bell - Notification Ring",
      duration: options?.duration ?? 2,
      fps: 30,
      loop: options?.loop ?? true,
      canvas,
      elements: [
        mergeElement(
          {
            id: "bell",
            type: "bell",
            x: (canvas.width - bellSize) / 2,
            y: canvas.height * 0.44,
            width: bellSize,
            height: bellSize,
            stroke: options?.stroke ?? "#FACC15",
            strokeWidth: 6,
            animations: [
              {start: 0, end: 0.08, property: "rotate", from: 0, to: 18, easing: "easeIn"},
              {start: 0.08, end: 0.18, property: "rotate", from: 18, to: -22, easing: "spring"},
              {start: 0.18, end: 0.3, property: "rotate", from: -22, to: 15, easing: "spring"},
              {start: 0.3, end: 0.42, property: "rotate", from: 15, to: -10, easing: "spring"},
              {start: 0.42, end: 0.55, property: "rotate", from: -10, to: 0, easing: "easeOut"},
            ],
          },
          options?.elementOverrides,
        ),
      ],
    });
  },
};
