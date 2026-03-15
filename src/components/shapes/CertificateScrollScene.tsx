type CertificateScrollSceneProps = {
  // 0..1 over the whole scene duration.
  t?: number;
  // Used to namespace SVG <defs> ids to avoid collisions when multiple instances render.
  idPrefix?: string;
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

export const CertificateScrollScene = ({t = 0, idPrefix}: CertificateScrollSceneProps) => {
  // Phase 1 Prompt 040: 4.5s, play once.
  const time = clamp01(t);
  const sec = time * 4.5;

  // Timeline (Phase 1):
  // 0-0.5: unfurl (scaleY: 0.02->1)
  // 0.5-0.8: body fill in
  // 0.8-1.0: outer border draw
  // 1.0-1.2: inner border draw
  // 1.2-1.4: corner flourishes
  // 1.4-1.7: banner slides down + text fade
  // 1.7-2.0: seal pop + ring draw + emblem
  // 2.0-2.3: ribbons slide in
  // 2.3-3.2: text lines 1/2/3 stagger
  // 3.2-3.7: shimmer sweep
  // 3.7-4.0: seal pulse + glow
  // 4.0-4.5: hold + breathe

  const pUnfurl = easeOut(range(sec, 0, 0.5));
  const pBody = easeOut(range(sec, 0.5, 0.8));
  const pOuter = easeOut(range(sec, 0.8, 1.0));
  const pInner = easeOut(range(sec, 1.0, 1.2));
  const pFlourish = range(sec, 1.2, 1.4);
  const pBanner = springy(range(sec, 1.4, 1.7));
  const pSeal = springy(range(sec, 1.7, 2.0));
  const pRibbons = easeOut(range(sec, 2.0, 2.3));
  const pLine1 = easeOut(range(sec, 2.3, 2.6));
  const pLine2 = easeOut(range(sec, 2.6, 2.9));
  const pLine3 = easeOut(range(sec, 2.9, 3.2));
  const pShimmer = range(sec, 3.2, 3.7);
  const pSealPulse = range(sec, 3.7, 4.0);
  const pBreathe = sec >= 4.0 ? easeInOut(range(sec, 4.0, 4.5)) : 0;

  // Scene coordinate system: 160x90.
  const cx = 80;
  const cy = 45;

  // Certificate dims within 160x90.
  const certW = 86;
  const certH = 60;
  const certX = cx - certW / 2;
  const certY = cy - certH / 2 + 1;
  const r = 6;
  const prefix = (idPrefix && idPrefix.trim().length > 0 ? idPrefix : "cert").replace(/[^a-zA-Z0-9_-]/g, "-");
  const shimmerId = `${prefix}-shimmer`;
  const clipId = `${prefix}-clip`;

  // Colors (Phase 1).
  const bodyFill = "#FFFBEB";
  const frameFill = "#D97706";
  const innerStroke = "#92400E";
  const bannerFill = "#D97706";
  const bannerText = "#1C1917";
  const ribbonRed = "#EF4444";
  const sealOuter = "#D97706";
  const sealInner = "#92400E";
  const emblemGold = "#FBBF24";
  const lineTitle = "#1C1917";
  const lineName = "#374151";
  const lineDate = "#6B7280";

  const unfurlScaleY = lerp(0.02, 1, pUnfurl);
  const breatheScale = sec < 4.0 ? 1 : 1 + 0.01 * Math.sin(pBreathe * Math.PI);

  const sealPulseScale =
    pSealPulse <= 0 ? 1 : 1 + 0.08 * Math.sin(clamp01(pSealPulse) * Math.PI);

  // Shimmer band movement across the certificate.
  const shimmerX = lerp(certX - 40, certX + certW + 40, easeInOut(pShimmer));
  const shimmerOpacity = pShimmer <= 0 ? 0 : 0.4 * Math.sin(pShimmer * Math.PI);

  const cornerScale = (idx: number) => {
    const delay = idx * 0.05;
    return springy(clamp01((pFlourish - delay) / (1 - delay)));
  };

  const line = (y: number, w: number, color: string, p: number) => {
    const slide = lerp(10, 0, p);
    return (
      <rect
        x={cx - w / 2}
        y={y + slide}
        width={w}
        height={3}
        rx={1.5}
        fill={color}
        opacity={p}
      />
    );
  };

  return (
    <g>
      <defs>
        <linearGradient id={shimmerId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={certX} y={certY} width={certW} height={certH} rx={r} />
        </clipPath>
      </defs>

      {/* Center group: unfurl + breathe */}
      <g
        transform={`translate(${cx} ${cy}) scale(${breatheScale} ${breatheScale}) scale(1 ${unfurlScaleY}) translate(${-cx} ${-cy})`}
      >
        {/* Outer gold frame */}
        <rect x={certX} y={certY} width={certW} height={certH} rx={r} fill={frameFill} opacity={1} />

        {/* Body */}
        <rect
          x={certX + 3.5}
          y={certY + 3.5}
          width={certW - 7}
          height={certH - 7}
          rx={r - 2}
          fill={bodyFill}
          opacity={pBody}
        />

        {/* Outer border draw (stroke on top of frame) */}
        <rect
          x={certX + 0.9}
          y={certY + 0.9}
          width={certW - 1.8}
          height={certH - 1.8}
          rx={r - 0.8}
          fill="none"
          stroke={frameFill}
          strokeWidth={2.2}
          strokeDasharray={2 * (certW + certH)}
          strokeDashoffset={(2 * (certW + certH)) * (1 - pOuter)}
          opacity={pOuter}
        />

        {/* Inner border draw */}
        <rect
          x={certX + 5.2}
          y={certY + 5.2}
          width={certW - 10.4}
          height={certH - 10.4}
          rx={r - 2.4}
          fill="none"
          stroke={innerStroke}
          strokeWidth={1.2}
          strokeDasharray={2 * (certW + certH)}
          strokeDashoffset={(2 * (certW + certH)) * (1 - pInner)}
          opacity={pInner}
        />

        {/* Corner flourishes (simple arcs) */}
        {[
          {x: certX + 10, y: certY + 10, rot: 0},
          {x: certX + certW - 10, y: certY + 10, rot: 90},
          {x: certX + 10, y: certY + certH - 10, rot: -90},
          {x: certX + certW - 10, y: certY + certH - 10, rot: 180},
        ].map((c, idx) => {
          const s = cornerScale(idx);
          return (
            <g
              key={idx}
              transform={`translate(${c.x} ${c.y}) scale(${s}) rotate(${c.rot}) translate(${-c.x} ${-c.y})`}
              opacity={s}
            >
              <path
                d={`M${c.x - 6} ${c.y} C ${c.x - 2} ${c.y - 6}, ${c.x + 2} ${c.y - 6}, ${c.x + 6} ${c.y}`}
                fill="none"
                stroke={frameFill}
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.9}
              />
              <path
                d={`M${c.x - 5} ${c.y + 3} C ${c.x - 2} ${c.y - 2}, ${c.x + 2} ${c.y - 2}, ${c.x + 5} ${c.y + 3}`}
                fill="none"
                stroke={frameFill}
                strokeWidth={1.2}
                strokeLinecap="round"
                opacity={0.65}
              />
            </g>
          );
        })}

        {/* Banner */}
        <g opacity={pBanner}>
          <g transform={`translate(0 ${lerp(-10, 0, pBanner)})`}>
            <rect
              x={cx - 30}
              y={certY + 7}
              width={60}
              height={10}
              rx={3}
              fill={bannerFill}
            />
            <path d={`M${cx - 30} ${certY + 12} L ${cx - 24} ${certY + 17} L ${cx - 30} ${certY + 17} Z`} fill={bannerFill} />
            <path d={`M${cx + 30} ${certY + 12} L ${cx + 24} ${certY + 17} L ${cx + 30} ${certY + 17} Z`} fill={bannerFill} />

            {/* Banner "text" as a light strip */}
            <rect
              x={cx - 24}
              y={certY + 11}
              width={48}
              height={3}
              rx={1.5}
              fill={bannerText}
              opacity={0.9}
            />
          </g>
        </g>

        {/* Seal */}
        <g
          transform={`translate(${cx} ${certY + certH - 10}) scale(${pSeal * sealPulseScale}) translate(${-cx} ${-(certY + certH - 10)})`}
          opacity={pSeal}
        >
          <circle cx={cx} cy={certY + certH - 10} r={7.5} fill={sealOuter} />
          <circle cx={cx} cy={certY + certH - 10} r={5.2} fill={sealInner} opacity={0.95} />
          {/* Seal ring draw */}
          <circle
            cx={cx}
            cy={certY + certH - 10}
            r={6.3}
            fill="none"
            stroke={sealOuter}
            strokeWidth={1.2}
            strokeDasharray={40}
            strokeDashoffset={40 * (1 - pSeal)}
            opacity={0.95}
          />
          {/* Emblem star */}
          <path
            d={`M${cx} ${certY + certH - 15} l 1.6 3.5 3.8.3-2.9 2.4.9 3.7-3.4-2-3.4 2 .9-3.7-2.9-2.4 3.8-.3z`}
            fill={emblemGold}
            opacity={clamp01((pSeal - 0.25) / 0.75)}
          />

          {/* Seal glow pulse */}
          {pSealPulse > 0 ? (
            <circle
              cx={cx}
              cy={certY + certH - 10}
              r={10.5}
              fill="none"
              stroke={sealOuter}
              strokeWidth={4.5}
              opacity={0.12 * Math.sin(pSealPulse * Math.PI)}
            />
          ) : null}
        </g>

        {/* Ribbons */}
        <g opacity={pRibbons}>
          <path
            d={`M${certX + 10} ${certY + certH - 6} L ${certX + 2 + lerp(-18, 0, pRibbons)} ${certY + certH + 10} L ${certX + 10} ${certY + certH + 6} Z`}
            fill={ribbonRed}
          />
          <path
            d={`M${certX + certW - 10} ${certY + certH - 6} L ${certX + certW - 2 + lerp(18, 0, pRibbons)} ${certY + certH + 10} L ${certX + certW - 10} ${certY + certH + 6} Z`}
            fill={ribbonRed}
          />
        </g>

        {/* Text lines */}
        {line(certY + 24, 42, lineTitle, pLine1)}
        {line(certY + 31, 32, lineName, pLine2)}
        {line(certY + 38, 22, lineDate, pLine3)}

        {/* Shimmer sweep */}
        <g clipPath={`url(#${clipId})`} opacity={shimmerOpacity}>
          <rect
            x={shimmerX}
            y={certY - 40}
            width={4}
            height={certH + 80}
            fill={`url(#${shimmerId})`}
            transform={`rotate(35 ${shimmerX + 2} ${cy})`}
          />
        </g>
      </g>
    </g>
  );
};
