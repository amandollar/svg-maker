type CameraProps = {
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

export const Camera = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: CameraProps) => {
  const bodyLen = 320;
  const lensLen = 2 * Math.PI * 14;

  return (
    <>
      <path
        d="M22 36h14l6-8h16l6 8h14c4 0 8 4 8 8v30c0 4-4 8-8 8H22c-4 0-8-4-8-8V44c0-4 4-8 8-8Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(bodyLen, drawProgress)}
      />
      <circle
        cx="50"
        cy="58"
        r="14"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        {...dash(lensLen, drawProgress)}
      />
      <circle cx="76" cy="46" r="3" fill={stroke} opacity={opacity} />
    </>
  );
};

