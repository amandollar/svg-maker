import {Composition} from "remotion";
import {AnimationSpecComposition} from "./compositions/AnimationSpecComposition";
import {GENERATED_SPEC} from "./data/generated-spec";
import {animationTemplates} from "./templates";

export const Root = () => {
  return (
    <>
      <Composition
        id="generated-prompt"
        component={AnimationSpecComposition}
        durationInFrames={Math.round(GENERATED_SPEC.duration * GENERATED_SPEC.fps)}
        fps={GENERATED_SPEC.fps}
        width={GENERATED_SPEC.canvas.width}
        height={GENERATED_SPEC.canvas.height}
        defaultProps={{spec: GENERATED_SPEC}}
      />
      {animationTemplates.map((template) => {
        const spec = template.build();

        return (
          <Composition
            key={template.id}
            id={`template-${template.id}`}
            component={AnimationSpecComposition}
            durationInFrames={Math.round(spec.duration * spec.fps)}
            fps={spec.fps}
            width={spec.canvas.width}
            height={spec.canvas.height}
            defaultProps={{spec}}
          />
        );
      })}
    </>
  );
};
