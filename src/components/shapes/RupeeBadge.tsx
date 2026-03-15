type RupeeBadgeProps = {
  // 0..1 over the whole animation duration (3.0s).
  t?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 2);
const easeInOut = (t: number) => {
  const p = clamp01(t);
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
};

const springy = (t: number) => {
  const p = clamp01(t);
  return p + Math.sin(p * Math.PI) * 0.16 * (1 - p);
};

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const RupeeBadge = ({t = 0}: RupeeBadgeProps) => {
  // Phase 1 Prompt 039: 3.0s, play once.
  const time = clamp01(t);
  const sec = time * 3.0;

  const pOuter = easeOut(range(sec, 0.0, 0.4));
  const pInner = easeOut(range(sec, 0.4, 0.6));
  const pRupeeV = easeOut(range(sec, 0.6, 1.0));
  const pRupeeTop = easeOut(range(sec, 1.0, 1.2));
  const pRupeeMid = easeOut(range(sec, 1.2, 1.35));
  const pRupeeDiag = easeOut(range(sec, 1.35, 1.5));
  const pRupeeMain = easeOut(range(sec, 0.6, 1.5));
  const pPulse = range(sec, 1.5, 1.9);
  const pShimmer = range(sec, 1.9, 2.3);
  const pRotate = easeInOut(range(sec, 2.3, 2.7));

  const pulseScale =
    pPulse <= 0
      ? 1
      : 1 + 0.08 * Math.sin(clamp01(pPulse) * Math.PI); // 1.0->1.08->1.0

  const rot = 15 * pRotate;

  // Colors (from Phase 1).
  const bgCenter = "#FEF3C7";
  const bgEdge = "#FDE68A";
  const rupeeFill = "#D97706";
  const rupeeStroke = "#92400E";
  const outerStroke = "#D97706";
  const innerStroke = "#FCD34D";

  // Geometry in 100x100.
  const cx = 50;
  const cy = 50;
  const rOuter = 40;
  const rInner = 37.5;
  const cOuter = 2 * Math.PI * rOuter;

  const diamond = (x: number, y: number, s: number) =>
    `M${x} ${y - s} L${x + s} ${y} L${x} ${y + s} L${x - s} ${y} Z`;

  const diamondScale = (idx: number) => {
    // Stagger N -> E -> S -> W by 0.05s over the 0.4-0.6s window.
    const delay = idx * 0.05;
    const local = clamp01((sec - 0.4 - delay) / 0.2);
    return springy(local);
  };

  // Shimmer band travel (diagonal).
  const shimmerX = lerp(-40, 120, easeInOut(pShimmer));
  const shimmerOpacity = pShimmer <= 0 ? 0 : 0.5 * Math.sin(pShimmer * Math.PI);

  // Rupee strokes: use a known-good rupee symbol outline (Heroicons "currency-rupee")
  // and animate its segments to match the Phase 1 choreography.
  const rupeeGroup = (
    <g transform={`translate(${cx} ${cy}) scale(${pulseScale}) rotate(${rot}) translate(${-cx} ${-cy})`}>
      {(() => {
        const rupeeScale = 2.35; // 24 * 2.35 ~= 56 units in our 100x100 viewBox.
        const rupeeX = cx - (24 * rupeeScale) / 2;
        const rupeeY = cy - (24 * rupeeScale) / 2 + 1.2;

        const sw = 1.9; // in 24-viewBox units
        const cap = "round" as const;

        return (
          <g transform={`translate(${rupeeX} ${rupeeY}) scale(${rupeeScale})`}>
            {/* Stem (helps read as ₹) */}
            <path
              d="M9 7.75V14.25"
              fill="none"
              stroke={rupeeStroke}
              strokeWidth={sw}
              strokeLinecap={cap}
              {...dash(7, pRupeeV)}
            />

            {/* Top bar */}
            <path
              d="M15 8.25H9"
              fill="none"
              stroke={rupeeStroke}
              strokeWidth={sw}
              strokeLinecap={cap}
              {...dash(6, pRupeeTop)}
            />

            {/* Second bar */}
            <path
              d="M15 11.25H9"
              fill="none"
              stroke={rupeeStroke}
              strokeWidth={sw}
              strokeLinecap={cap}
              {...dash(6, pRupeeMid)}
            />

            {/* Curved leg + diagonal (Heroicons currency-rupee) */}
            <path
              d="M12 17.25l-3-3h1.5a3 3 0 1 0 0-6"
              fill="none"
              stroke={rupeeStroke}
              strokeWidth={sw}
              strokeLinecap={cap}
              strokeLinejoin="round"
              {...dash(14, pRupeeMain)}
              opacity={0.95}
            />

            {/* Extra diagonal emphasis (matches Phase 1 final stroke beat) */}
            <path
              d="M12 17.25l-3-3"
              fill="none"
              stroke={rupeeStroke}
              strokeWidth={sw}
              strokeLinecap={cap}
              {...dash(4.3, pRupeeDiag)}
              opacity={0.98}
            />

            {/* Subtle amber accent */}
            <g opacity={0.22}>
              <path d="M9 7.75V14.25" stroke={rupeeFill} strokeWidth={1.1} strokeLinecap={cap} />
              <path d="M15 8.25H9" stroke={rupeeFill} strokeWidth={1.1} strokeLinecap={cap} />
              <path d="M15 11.25H9" stroke={rupeeFill} strokeWidth={1.1} strokeLinecap={cap} />
              <path
                d="M12 17.25l-3-3h1.5a3 3 0 1 0 0-6"
                stroke={rupeeFill}
                strokeWidth={1.1}
                strokeLinecap={cap}
                strokeLinejoin="round"
              />
            </g>
          </g>
        );
      })()}
    </g>
  );

  return (
    <g>
      <defs>
        <radialGradient id="rupee-bg" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor={bgCenter} />
          <stop offset="100%" stopColor={bgEdge} />
        </radialGradient>
        <linearGradient id="rupee-shimmer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="rupee-clip">
          <circle cx={cx} cy={cy} r={rOuter + 1} />
        </clipPath>
      </defs>

      {/* Soft radial fill INSIDE the badge (avoid a square-looking block) */}
      <circle cx={cx} cy={cy} r={rOuter - 1.5} fill="url(#rupee-bg)" opacity={0.5} />

      {/* Outer circle draw */}
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="none"
        stroke={outerStroke}
        strokeWidth={3}
        strokeLinecap="round"
        {...dash(cOuter, pOuter)}
      />

      {/* Inner dashed ring + ornaments */}
      <g opacity={pInner}>
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="none"
          stroke={innerStroke}
          strokeWidth={2}
          strokeDasharray="8 8"
          opacity={0.95}
        />
        {[
          {x: cx, y: cy - rOuter},
          {x: cx + rOuter, y: cy},
          {x: cx, y: cy + rOuter},
          {x: cx - rOuter, y: cy},
        ].map((p, idx) => {
          const s = diamondScale(idx);
          return (
            <path
              key={idx}
              d={diamond(p.x, p.y, 3.2)}
              fill={outerStroke}
              opacity={0.95}
              transform={`translate(${p.x} ${p.y}) scale(${s}) translate(${-p.x} ${-p.y})`}
            />
          );
        })}
      </g>

      {/* Rupee strokes */}
      {rupeeGroup}

      {/* Shimmer sweep */}
      <g clipPath="url(#rupee-clip)" opacity={shimmerOpacity}>
        <rect
          x={shimmerX}
          y={-20}
          width={12}
          height={160}
          fill="url(#rupee-shimmer)"
          transform={`rotate(25 ${shimmerX + 6} 50)`}
        />
      </g>
    </g>
  );
};
