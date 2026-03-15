import type {AnimationSpec, AnimatedElement} from "../engine/types";
import type {CanvasFormat} from "../engine/request";

export type AnimationTemplate = {
  id: string;
  title: string;
  keywords: string[];
  defaultPrompt: string;
  build: (options?: TemplateBuildOptions) => AnimationSpec;
};

export type TemplateBuildOptions = {
  title?: string;
  canvasFormat?: CanvasFormat;
  loop?: boolean;
  duration?: number;
  background?: string;
  fill?: string;
  stroke?: string;
  elementOverrides?: Partial<AnimatedElement>;
};
