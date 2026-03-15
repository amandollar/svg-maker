type ArrowProps = {
  stroke?: string;
  strokeWidth?: number;
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

export const Arrow = ({
  stroke = "#FFFFFF",
  strokeWidth = 8,
  opacity = 1,
  drawProgress = 1,
}: ArrowProps) => {
  const stemLen = 58;
  const headLen = 52;
  return (
    <>
      <path
        d="M50 82V24"
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(stemLen, drawProgress)}
      />
      <path
        d="M28 46 50 24 72 46"
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(headLen, Math.max(0, Math.min(1, (drawProgress - 0.1) / 0.9)))}
      />
    </>
  );
};
