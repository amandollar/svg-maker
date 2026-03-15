type SmartphoneProps = {
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

export const Smartphone = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: SmartphoneProps) => {
  const outlineLen = 300;
  const speakerP = clamp01((drawProgress - 0.45) / 0.35);
  const homeP = clamp01((drawProgress - 0.72) / 0.28);

  return (
    <>
      <path
        d="M34 18h32c4 0 8 4 8 8v48c0 4-4 8-8 8H34c-4 0-8-4-8-8V26c0-4 4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(outlineLen, drawProgress)}
      />
      <path
        d="M42 28h16"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity * speakerP}
        {...dash(40, speakerP)}
      />
      <circle
        cx="50"
        cy="74"
        r="3"
        fill={stroke}
        opacity={opacity * homeP}
        transform={`translate(50 74) scale(${homeP}) translate(-50 -74)`}
      />
    </>
  );
};
