type LockProps = {
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  if (p >= 0.999) {
    return {} as const;
  }
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const Lock = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: LockProps) => {
  const bodyLen = 160;
  const shackleLen = 110;

  return (
    <>
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
      <path
        d="M30 48h40c4 0 8 4 8 8v26c0 4-4 8-8 8H30c-4 0-8-4-8-8V56c0-4 4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(bodyLen, drawProgress)}
      />
      <circle cx="50" cy="66" r="4" fill={stroke} opacity={opacity} />
      <path
        d="M50 70v8"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
    </>
  );
};
