type GearIconProps = {
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

export const GearIcon = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: GearIconProps) => {
  const circleLen = 2 * Math.PI * 18;
  const tickLen = 12;
  const ticks = [
    {x1: 50, y1: 18, x2: 50, y2: 10},
    {x1: 50, y1: 90, x2: 50, y2: 82},
    {x1: 18, y1: 50, x2: 10, y2: 50},
    {x1: 90, y1: 50, x2: 82, y2: 50},
    {x1: 26, y1: 26, x2: 20, y2: 20},
    {x1: 74, y1: 74, x2: 80, y2: 80},
    {x1: 74, y1: 26, x2: 80, y2: 20},
    {x1: 26, y1: 74, x2: 20, y2: 80},
  ];

  return (
    <>
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(circleLen, drawProgress)}
      />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={opacity}
          {...dash(tickLen, Math.max(0, drawProgress - i * 0.04))}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill="none" stroke={stroke} strokeWidth={strokeWidth} opacity={opacity * 0.9} />
    </>
  );
};

