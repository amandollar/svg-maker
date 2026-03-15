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
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: SearchIconProps) => {
  const circleLen = 2 * Math.PI * 26;
  const handleLen = 26;

  return (
    <>
      <circle
        cx="44"
        cy="44"
        r="26"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(circleLen, drawProgress)}
      />
      <path
        d="M60 60 78 78"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(handleLen, drawProgress)}
      />
    </>
  );
};

