type HeadphonesProps = {
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

export const Headphones = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: HeadphonesProps) => {
  const arcLen = 220;
  const cupLen = 90;

  return (
    <>
      <path
        d="M24 54c0-16 12-28 26-28s26 12 26 28"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(arcLen, drawProgress)}
      />
      <path
        d="M24 54v18c0 4 4 8 8 8h4V54h-4c-4 0-8 4-8 8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(cupLen, drawProgress)}
      />
      <path
        d="M76 54v18c0 4-4 8-8 8h-4V54h4c4 0 8 4 8 8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(cupLen, drawProgress)}
      />
    </>
  );
};

