import {Easing} from "remotion";
import type {EasingFunction} from "remotion";
import type {EasingName} from "./types";

const bezier = (x1: number, y1: number, x2: number, y2: number): EasingFunction =>
  Easing.bezier(x1, y1, x2, y2);

export const easingMap: Record<EasingName, EasingFunction> = {
  linear: Easing.linear,
  easeIn: Easing.ease,
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  snapUp: bezier(0.4, 0, 0.6, 1),
  spring: bezier(0.34, 1.56, 0.64, 1),
  elastic: bezier(0.2, 1.2, 0.2, 1),
};
