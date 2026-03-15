import type {AnimationSpec, AnimatedElement} from "../engine/types";
import type {CanvasFormat} from "../engine/request";

export const getCanvasByFormat = (
  format: CanvasFormat,
  background: string,
): AnimationSpec["canvas"] => {
  switch (format) {
    case "portrait":
      return {width: 1080, height: 1920, background};
    case "landscape":
      return {width: 1920, height: 1080, background};
    case "square":
    default:
      return {width: 1080, height: 1080, background};
  }
};

export const mergeElement = (
  base: AnimatedElement,
  overrides?: Partial<AnimatedElement>,
): AnimatedElement => {
  if (!overrides) {
    return base;
  }

  return {
    ...base,
    ...overrides,
    animations: overrides.animations ?? base.animations,
  };
};
