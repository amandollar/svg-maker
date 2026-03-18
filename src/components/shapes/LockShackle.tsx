type LockShackleProps = {
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

export const LockShackle = ({
  stroke = "#94A3B8",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: LockShackleProps) => {
  const shackleLen = 110;

  return (
    <path
      d="M34 48v-6c0-10 8-18 16-18h0c8 0 16 8 16 18v6"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      {...dash(shackleLen, drawProgress)}
    />
  );
};

