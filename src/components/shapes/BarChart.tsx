type BarChartProps = {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

// Smoothstep (0->1) for less "poppy" reveals.
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};

export const BarChart = ({
  stroke = "#334155",
  strokeWidth = 4,
  fill = "#3B82F6",
  opacity = 1,
  drawProgress = 1,
}: BarChartProps) => {
  const p = clamp01(drawProgress);
  const axisLen = 180;

  // Phase-1 style reveal: axes first, then staggered bars.
  const pAxes = smooth(clamp01(p / 0.28));
  const pBars = smooth(clamp01((p - 0.28) / 0.72));

  const barHeights = [26, 38, 32, 52, 42];

  return (
    <g transform="translate(-4 -2)">
      {/* Y axis */}
      <path
        d="M22 20V84"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        strokeDasharray={axisLen}
        strokeDashoffset={axisLen * (1 - pAxes)}
      />
      {/* Baseline */}
      <path
        d="M22 84H86"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        strokeDasharray={axisLen}
        strokeDashoffset={axisLen * (1 - pAxes)}
      />

      {/* Bars */}
      {barHeights.map((h, i) => {
        const stagger = i * 0.12;
        const local = smooth(clamp01((pBars - stagger) / (1 - stagger)));
        const x = 30 + i * 12;
        const y = 84 - h * local;
        const height = h * local;
        const color = i === 3 ? "#6366F1" : fill;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="8"
            height={height}
            rx="2"
            fill={color}
            opacity={opacity * clamp01(local * 1.25)}
          />
        );
      })}
    </g>
  );
};
