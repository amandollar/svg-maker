type CartProps = {
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

export const Cart = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: CartProps) => {
  const cartLen = 220;

  return (
    <>
      <path
        d="M22 28h10l6 36c1 6 6 10 12 10h20c6 0 11-4 12-10l4-22H36"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(cartLen, drawProgress)}
      />
      <circle cx="44" cy="80" r="5" fill={stroke} opacity={opacity} />
      <circle cx="72" cy="80" r="5" fill={stroke} opacity={opacity} />
    </>
  );
};

