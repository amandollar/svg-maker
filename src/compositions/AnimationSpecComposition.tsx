import type {AnimationSpec} from "../engine/types";
import {SvgRenderer} from "../renderer/SvgRenderer";

export const AnimationSpecComposition = ({spec}: {spec: AnimationSpec}) => {
  return <SvgRenderer spec={spec} />;
};
