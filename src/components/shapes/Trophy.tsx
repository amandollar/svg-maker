type TrophyProps = {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
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

export const Trophy = ({
  stroke = "#FBBF24",
  strokeWidth = 6,
  fill,
  opacity = 1,
  drawProgress = 1,
}: TrophyProps) => {
  const len = 340;
  return (
    <>
      <path
        d="M32 26h36v16c0 12-8 22-18 22s-18-10-18-22V26Z"
        fill={fill ?? "none"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(len, drawProgress)}
      />
      <path
        d="M32 30H20c0 12 6 18 12 18"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(len, drawProgress)}
      />
      <path
        d="M68 30H80c0 12-6 18-12 18"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(len, drawProgress)}
      />
      <path
        d="M44 64v8h12v-8"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(len, drawProgress)}
      />
      <path
        d="M38 72h24v10c0 4-4 8-8 8H46c-4 0-8-4-8-8V72Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(len, drawProgress)}
      />
    </>
  );
};

