type WifiProps = {
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

export const Wifi = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: WifiProps) => {
  // Approx lengths; good enough for consistent reveal.
  const outerLen = 120;
  const midLen = 90;
  const innerLen = 60;

  return (
    <>
      <path
        d="M20 44c17-17 43-17 60 0"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(outerLen, drawProgress)}
      />
      <path
        d="M30 56c11-11 29-11 40 0"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(midLen, drawProgress)}
      />
      <path
        d="M40 68c6-6 14-6 20 0"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(innerLen, drawProgress)}
      />
      <circle cx="50" cy="78" r="5" fill={stroke} opacity={opacity} />
    </>
  );
};

