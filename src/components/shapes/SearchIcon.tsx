type SearchIconProps = {
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

export const SearchIcon = ({
  stroke = "#FFFFFF",
  strokeWidth = 5,
  opacity = 1,
  drawProgress = 1,
}: SearchIconProps) => {
  const radius = 23;
  const circleLen = 2 * Math.PI * radius;
  const handleLen = 30;

  return (
    <>
      <circle
        cx="42"
        cy="42"
        r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(circleLen, drawProgress)}
      />
      <path
        d="M58 58 79 79"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(handleLen, drawProgress)}
      />
    </>
  );
};
