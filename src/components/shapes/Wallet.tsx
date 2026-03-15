type WalletProps = {
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

export const Wallet = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: WalletProps) => {
  const bodyLen = 260;
  const flapLen = 120;

  return (
    <>
      <path
        d="M20 36h60c4 0 8 4 8 8v30c0 4-4 8-8 8H20c-4 0-8-4-8-8V44c0-4 4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(bodyLen, drawProgress)}
      />
      <path
        d="M60 50h28v16H60c-4 0-8-4-8-8s4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(flapLen, drawProgress)}
      />
      <circle cx="72" cy="58" r="3" fill={stroke} opacity={opacity} />
    </>
  );
};

