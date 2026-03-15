import {interpolate} from "remotion";
import {easingMap} from "./easing";
import type {AnimatedElement, AnimationProperty} from "./types";

type AnimatedState = {
  scale: number;
  opacity: number;
  translateX: number;
  translateY: number;
  rotate: number;
  draw: number;
};

const defaults: AnimatedState = {
  scale: 1,
  opacity: 1,
  translateX: 0,
  translateY: 0,
  rotate: 0,
  draw: 1,
};

const applyKeyframe = (
  value: number,
  frame: number,
  startFrame: number,
  endFrame: number,
  from: number,
  to: number,
  easingName: keyof typeof easingMap,
) => {
  if (frame < startFrame) {
    return value;
  }

  if (frame >= endFrame) {
    return to;
  }

  return interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easingMap[easingName],
  });
};

export const getAnimatedState = (
  element: AnimatedElement,
  frame: number,
  fps: number,
): AnimatedState => {
  const state: AnimatedState = {
    ...defaults,
    opacity: element.opacity ?? 1,
  };

  for (const keyframe of element.animations) {
    const startFrame = Math.round(keyframe.start * fps);
    const endFrame = Math.round(keyframe.end * fps);
    const property = keyframe.property as AnimationProperty;

    state[property] = applyKeyframe(
      state[property],
      frame,
      startFrame,
      endFrame,
      keyframe.from,
      keyframe.to,
      keyframe.easing,
    );
  }

  return state;
};
