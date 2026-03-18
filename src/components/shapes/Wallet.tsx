type WalletProps = {
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  drawProgress?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const Wallet = ({
  stroke = "#FFFFFF",
  strokeWidth = 6,
  opacity = 1,
  drawProgress = 1,
}: WalletProps) => {
  // Use a real icon shape (Heroicons outline "wallet") so it doesn't feel hand-drawn.
  // Heroicons is authored in a 24x24 viewBox; our renderer assumes 0..100.
  const scale = 100 / 24;
  const heroStroke = strokeWidth / scale;

  // Phase 1 wants contents (coins + bill) revealed when the wallet opens.
  // We don't have 3D flap transforms yet, but we can at least reveal contents late in the draw.
  const openT = clamp01((drawProgress - 0.45) / 0.55);
  const contentsT = clamp01((drawProgress - 0.62) / 0.38);
  const contentsOpacity = opacity * contentsT;
  const coinFill = "#FBBF24";
  const billFill = "#86EFAC";
  const bodyFill = stroke;
  const revealW = 24 * clamp01(drawProgress);

  return (
    <g transform={`scale(${scale})`}>
      <defs>
        {/* Reveal left-to-right so wallet "forms" differently than other icons. */}
        <clipPath id="wallet-reveal">
          <rect x={0} y={0} width={revealW} height={24} />
        </clipPath>
      </defs>

      {/* Soft filled body to avoid "just an outline" ambiguity (still uses the same silhouette). */}
      <g opacity={opacity * 0.12}>
        <path
          d="M2.27307 5.62524C3.06638 4.92494 4.10851 4.5 5.24989 4.5H18.7499C19.8913 4.5 20.9334 4.92494 21.7267 5.62524C21.5423 4.14526 20.2798 3 18.7499 3H5.24989C3.71995 3 2.4575 4.14525 2.27307 5.62524Z"
          fill={bodyFill}
        />
        <path
          d="M2.27307 8.62524C3.06638 7.92494 4.10851 7.5 5.24989 7.5H18.7499C19.8913 7.5 20.9334 7.92494 21.7267 8.62524C21.5423 7.14526 20.2798 6 18.7499 6H5.24989C3.71995 6 2.4575 7.14525 2.27307 8.62524Z"
          fill={bodyFill}
        />
        <path
          d="M5.25 9C3.59315 9 2.25 10.3431 2.25 12V18C2.25 19.6569 3.59315 21 5.25 21H18.75C20.4069 21 21.75 19.6569 21.75 18V12C21.75 10.3431 20.4069 9 18.75 9H15C14.5858 9 14.25 9.33579 14.25 9.75C14.25 10.9926 13.2426 12 12 12C10.7574 12 9.75 10.9926 9.75 9.75C9.75 9.33579 9.41421 9 9 9H5.25Z"
          fill={bodyFill}
        />
      </g>

      {/* Card peeking out (helps instantly read "wallet", then settles). */}
      <rect
        x={6.1}
        y={6.3}
        width={10.2}
        height={4.4}
        rx={0.9}
        fill={billFill}
        opacity={opacity * openT * 0.65}
        transform={`translate(${11.2} ${8.5}) translate(0 ${-1.6 * openT}) scale(${0.92 + openT * 0.08}) translate(${-11.2} ${-8.5})`}
      />

      <g clipPath="url(#wallet-reveal)">
        <path
          d="M21 12C21 10.7574 19.9926 9.75 18.75 9.75H15C15 11.4069 13.6569 12.75 12 12.75C10.3431 12.75 9 11.4069 9 9.75H5.25C4.00736 9.75 3 10.7574 3 12M21 12V18C21 19.2426 19.9926 20.25 18.75 20.25H5.25C4.00736 20.25 3 19.2426 3 18V12M21 12V9M3 12V9M21 9C21 7.75736 19.9926 6.75 18.75 6.75H5.25C4.00736 6.75 3 7.75736 3 9M21 9V6C21 4.75736 19.9926 3.75 18.75 3.75H5.25C4.00736 3.75 3 4.75736 3 6V9"
          fill="none"
          stroke={stroke}
          strokeWidth={heroStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
      </g>

      {/* Small clasp dot */}
      <circle
        cx={18.3}
        cy={14.7}
        r={0.75}
        fill={stroke}
        opacity={opacity * clamp01((drawProgress - 0.25) / 0.35) * 0.85}
      />

      {/* Bill */}
      <rect
        x={6.2}
        y={13.2}
        width={8.8}
        height={3.6}
        rx={0.9}
        fill={billFill}
        opacity={contentsOpacity * 0.9}
        transform={`translate(${12} ${15}) scale(${0.85 + contentsT * 0.15}) translate(${-12} ${-15})`}
      />

      {/* Coins (2) */}
      {[{cx: 16.2, cy: 15.6}, {cx: 18.3, cy: 16.4}].map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={1.6}
          fill={coinFill}
          opacity={contentsOpacity}
          transform={`translate(${c.cx} ${c.cy}) scale(${0.7 + contentsT * 0.3}) translate(${-c.cx} ${-c.cy})`}
        />
      ))}
    </g>
  );
};
