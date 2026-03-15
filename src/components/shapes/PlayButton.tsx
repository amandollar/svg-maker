type PlayButtonProps = {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const PlayButton = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  fill = "#FFFFFF",
  opacity = 1,
  drawProgress = 1,
}: PlayButtonProps) => {
  const circleLen = 2 * Math.PI * 42;

  return (
    <>
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(circleLen, drawProgress)}
      />
      <path
        d="M44 36 68 50 44 64Z"
        fill={fill}
        opacity={opacity}
      />
    </>
  );
};

