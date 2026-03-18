import {Composition} from "remotion";
import {AnimationSpecComposition} from "./compositions/AnimationSpecComposition";
import {GENERATED_SPEC} from "./data/generated-spec";
import {animationTemplates} from "./templates";

const getPreviewDurationInFrames = (duration: number, fps: number, loop: boolean) => {
  const base = Math.max(1, Math.round(duration * fps));
  // For looped specs, give Studio a longer timeline so playback doesn't feel like it "stops".
  // This doesn't change the loop behavior; it just previews multiple cycles.
  return loop ? base * 4 : base;
};

export const Root = () => {
  return (
    <>
      <Composition
        id="generated-prompt"
        component={AnimationSpecComposition}
        durationInFrames={getPreviewDurationInFrames(
          GENERATED_SPEC.duration,
          GENERATED_SPEC.fps,
          GENERATED_SPEC.loop,
        )}
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
            durationInFrames={getPreviewDurationInFrames(spec.duration, spec.fps, spec.loop)}
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
