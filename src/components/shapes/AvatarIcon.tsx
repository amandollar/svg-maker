type AvatarIconProps = {
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

export const AvatarIcon = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: AvatarIconProps) => {
  const headLen = 2 * Math.PI * 16;
  const bodyLen = 160;

  return (
    <>
      <circle
        cx="50"
        cy="40"
        r="16"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(headLen, drawProgress)}
      />
      <path
        d="M22 82c6-14 16-22 28-22s22 8 28 22"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(bodyLen, drawProgress)}
      />
    </>
  );
};

