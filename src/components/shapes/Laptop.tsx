type LaptopProps = {
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

export const Laptop = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: LaptopProps) => {
  const screenLen = 280;
  const baseLen = 180;

  return (
    <>
      <path
        d="M24 26h52c4 0 8 4 8 8v34c0 4-4 8-8 8H24c-4 0-8-4-8-8V34c0-4 4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(screenLen, drawProgress)}
      />
      <path
        d="M16 74h68l-6 10H22l-6-10Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(baseLen, drawProgress)}
      />
    </>
  );
};

