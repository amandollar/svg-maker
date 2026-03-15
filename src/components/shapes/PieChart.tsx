type PieChartProps = {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const PieChart = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  fill = "#3B82F6",
  opacity = 1,
  drawProgress = 1,
}: PieChartProps) => {
  const p = clamp01(drawProgress);
  const r = 30;
  const len = 2 * Math.PI * r;

  return (
    <>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      {/* Slice */}
      <path
        d="M50 50 L50 20 A30 30 0 0 1 76 62 Z"
        fill={fill}
        opacity={opacity * (0.25 + p * 0.75)}
      />
    </>
  );
};

