type HomeIconProps = {
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

export const HomeIcon = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: HomeIconProps) => {
  const len = 240;
  return (
    <path
      d="M22 54 50 28 78 54v26c0 4-4 8-8 8H30c-4 0-8-4-8-8V54Z"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      opacity={opacity}
      {...dash(len, drawProgress)}
    />
  );
};

