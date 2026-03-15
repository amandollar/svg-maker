type DownloadIconProps = {
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

export const DownloadIcon = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: DownloadIconProps) => {
  const arrowLen = 120;
  const trayLen = 140;

  return (
    <>
      <path
        d="M50 18v38"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(arrowLen, drawProgress)}
      />
      <path
        d="M34 44 50 56 66 44"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(arrowLen, Math.max(0, drawProgress - 0.12))}
      />
      <path
        d="M28 70h44v14c0 4-4 8-8 8H36c-4 0-8-4-8-8V70Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(trayLen, drawProgress)}
      />
    </>
  );
};

