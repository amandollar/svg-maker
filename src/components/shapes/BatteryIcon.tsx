type BatteryIconProps = {
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  drawProgress?: number;
  fill?: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const BatteryIcon = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
  fill,
}: BatteryIconProps) => {
  const len = 240;
  return (
    <>
      <path
        d="M22 38h52c4 0 8 4 8 8v20c0 4-4 8-8 8H22c-4 0-8-4-8-8V46c0-4 4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(len, drawProgress)}
      />
      <path
        d="M82 50h6c2 0 4 2 4 4v4c0 2-2 4-4 4h-6"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
      {fill ? (
        <rect
          x="18"
          y="42"
          width="56"
          height="28"
          rx="6"
          fill={fill}
          opacity={opacity * 0.2}
        />
      ) : null}
    </>
  );
};

