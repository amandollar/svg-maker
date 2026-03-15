type BellProps = {
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

export const Bell = ({
  stroke = "#FACC15",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: BellProps) => {
  const bodyLen = 220;
  const baseLen = 70;
  return (
    <>
      <path
        d="M50 14c-11 0-20 9-20 20v10c0 6-2 12-6 17l-4 5h60l-4-5c-4-5-6-11-6-17V34c0-11-9-20-20-20Z"
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(bodyLen, drawProgress)}
      />
      <path
        d="M40 78c2 5 6 8 10 8s8-3 10-8"
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(baseLen, Math.max(0, Math.min(1, (drawProgress - 0.15) / 0.85)))}
      />
      <circle cx="50" cy="25" r="3" fill={stroke} opacity={opacity} />
    </>
  );
};
