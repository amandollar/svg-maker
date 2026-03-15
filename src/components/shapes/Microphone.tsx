type MicrophoneProps = {
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

export const Microphone = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: MicrophoneProps) => {
  const capsuleLen = 180;
  const stemLen = 70;
  const baseLen = 70;

  return (
    <>
      <path
        d="M50 18c10 0 18 8 18 18v16c0 10-8 18-18 18s-18-8-18-18V36c0-10 8-18 18-18Z"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
        {...dash(capsuleLen, drawProgress)}
      />
      <path
        d="M28 52c0 12 10 22 22 22s22-10 22-22"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(baseLen, drawProgress)}
      />
      <path
        d="M50 74v12"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
        {...dash(stemLen, drawProgress)}
      />
      <path
        d="M38 86h24"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
    </>
  );
};

