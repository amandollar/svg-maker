type TrendUpProps = {
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const TrendUp = ({
  stroke = "#22C55E",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: TrendUpProps) => {
  const p = clamp01(drawProgress);
  const len = 220;

  return (
    <>
      <path
        d="M22 70 42 56 58 62 78 36"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      <path
        d="M70 36H78V44"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
    </>
  );
};

