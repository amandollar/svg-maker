type MicrophoneProps = {
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const Microphone = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: MicrophoneProps) => {
  // Use the real Heroicons outline `microphone` path for a more "designed" look.
  // Heroicons is authored in a 24x24 viewBox; our renderer assumes 0..100.
  const scale = 100 / 24;
  const heroStroke = strokeWidth / scale;

  // Add a subtle internal grill that fades in late (adds richness without changing silhouette).
  const grillT = clamp01((drawProgress - 0.65) / 0.35);
  const revealH = 24 * clamp01(drawProgress);
  const revealY = 24 - revealH;

  return (
    <g transform={`scale(${scale})`}>
      <defs>
        {/* Reveal bottom-up so "forming" feels different from other outline icons. */}
        <clipPath id="mic-reveal">
          <rect x={0} y={revealY} width={24} height={revealH} />
        </clipPath>
      </defs>

      <g clipPath="url(#mic-reveal)">
        <path
          d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z"
          fill="none"
          stroke={stroke}
          strokeWidth={heroStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />

        {[7.7, 9.2, 10.7].map((y, i) => (
          <path
            key={i}
            d={`M10.2 ${y}H13.8`}
            fill="none"
            stroke={stroke}
            strokeWidth={heroStroke * 0.9}
            strokeLinecap="round"
            opacity={opacity * grillT * 0.6}
          />
        ))}
      </g>

    </g>
  );
};
