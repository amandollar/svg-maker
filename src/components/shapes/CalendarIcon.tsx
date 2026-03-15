type CalendarIconProps = {
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

export const CalendarIcon = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: CalendarIconProps) => {
  const frameLen = 260;
  const barLen = 120;

  return (
    <>
      <path
        d="M26 30h48c4 0 8 4 8 8v44c0 4-4 8-8 8H26c-4 0-8-4-8-8V38c0-4 4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(frameLen, drawProgress)}
      />
      <path
        d="M18 44h64"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(barLen, drawProgress)}
      />
      <path
        d="M34 22v12M66 22v12"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
      <circle cx="38" cy="60" r="4" fill={stroke} opacity={opacity * 0.9} />
      <circle cx="54" cy="60" r="4" fill={stroke} opacity={opacity * 0.9} />
      <circle cx="70" cy="60" r="4" fill={stroke} opacity={opacity * 0.9} />
    </>
  );
};

