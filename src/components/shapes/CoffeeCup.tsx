type CoffeeCupProps = {
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

export const CoffeeCup = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: CoffeeCupProps) => {
  const bodyLen = 220;
  const handleLen = 70;
  const steamLen = 50;

  return (
    <>
      <path
        d="M30 44h40v22c0 10-8 18-18 18H48c-10 0-18-8-18-18V44Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(bodyLen, drawProgress)}
      />
      <path
        d="M70 52h6c8 0 14 6 14 14s-6 14-14 14h-6"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(handleLen, drawProgress)}
      />
      <path
        d="M30 44h40"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
      {[
        "M40 22c-4 4-4 10 0 14",
        "M52 20c-4 4-4 10 0 14",
        "M64 22c-4 4-4 10 0 14",
      ].map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={Math.max(3, strokeWidth - 2)}
          strokeLinecap="round"
          opacity={opacity * 0.75}
          {...dash(steamLen, Math.max(0, drawProgress - i * 0.12))}
        />
      ))}
    </>
  );
};

