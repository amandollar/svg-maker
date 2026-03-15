type CheckmarkProps = {
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

export const Checkmark = ({
  stroke = "#22C55E",
  strokeWidth = 10,
  opacity = 1,
  drawProgress = 1,
}: CheckmarkProps) => {
  const checkLen = 90;

  return (
    <>
      <path
        d="M28 51 43 66 73 36"
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(checkLen, drawProgress)}
      />
    </>
  );
};
