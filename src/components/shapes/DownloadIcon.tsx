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
  // Use a real icon shape (Heroicons outline "arrow-down-tray") so it doesn't feel hand-drawn.
  // Heroicons is authored in a 24x24 viewBox; our renderer assumes 0..100.
  // Scale up geometry and compensate strokeWidth so the visual weight matches our system.
  const scale = 100 / 24;
  const heroStroke = strokeWidth / scale;

  const shaftLen = 24;
  const headLen = 18;
  const trayLen = 40;

  return (
    <g transform={`scale(${scale})`}>
      {/* Tray */}
      <path
        d="M3 16.5V18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V16.5"
        fill="none"
        stroke={stroke}
        strokeWidth={heroStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(trayLen, drawProgress)}
      />
      {/* Arrow head */}
      <path
        d="M16.5 12L12 16.5M12 16.5L7.5 12"
        fill="none"
        stroke={stroke}
        strokeWidth={heroStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(headLen, Math.max(0, drawProgress - 0.08))}
      />
      {/* Arrow shaft */}
      <path
        d="M12 16.5V3"
        fill="none"
        stroke={stroke}
        strokeWidth={heroStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(shaftLen, Math.max(0, drawProgress - 0.14))}
      />
    </g>
  );
};
