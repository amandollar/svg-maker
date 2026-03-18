type LockBodyProps = {
  fill?: string;
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

export const LockBody = ({
  fill = "#64748B",
  stroke,
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: LockBodyProps) => {
  const bodyLen = 160;

  return (
    <path
      d="M30 48h40c4 0 8 4 8 8v26c0 4-4 8-8 8H30c-4 0-8-4-8-8V56c0-4 4-8 8-8Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={stroke ? strokeWidth : undefined}
      strokeLinejoin="round"
      opacity={opacity}
      {...(stroke ? dash(bodyLen, drawProgress) : {})}
    />
  );
};

