type NotificationStackSceneProps = {
  // 0..1 over the whole scene duration.
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
  return p + Math.sin(p * Math.PI) * 0.12 * (1 - p);
};

const cardSlideX = (p: number, from: number) => {
  const s = springy(p);
  return lerp(from, 0, s);
};

const countUp = (target: number, p: number) => {
  const v = Math.round(target * easeOut(p));
  return Math.max(0, Math.min(target, v));
};

export const NotificationStackScene = ({t = 0}: NotificationStackSceneProps) => {
  const time = clamp01(t);
  const sec = time * 4.0;

  // Portrait scene coordinates: 90x160.
  const cx = 45;
  const stackTopY = 34;
  const cardW = 68;
  const cardH = 12;
  const gap = 4;
  const left = cx - cardW / 2;

  const cards = [
    {accent: "#EF4444", badge: 3},
    {accent: "#3B82F6", badge: 12},
    {accent: "#22C55E", badge: 1},
    {accent: "#F59E0B", badge: 5},
  ] as const;

  const slideWindows = [
    {start: 0.2, end: 0.5},
    {start: 0.5, end: 0.8},
    {start: 0.8, end: 1.1},
    {start: 1.1, end: 1.4},
  ] as const;

  const pulseWindow = {start: 1.4, end: 1.8};
  const countWindow = {start: 1.8, end: 2.3};
  const shakeWindow = {start: 2.3, end: 2.8};
  const highlightWindow = {start: 2.8, end: 3.2};
  const glowWindow = {start: 3.2, end: 4.0};

  const shakeX = () => {
    const p = range(sec, shakeWindow.start, shakeWindow.end);
    if (p <= 0 || p >= 1) return 0;
    const wave = Math.sin(p * Math.PI * 4);
    // 5px in 1080px => ~0.42 in 90 units.
    return 0.42 * wave;
  };

  const highlightScale = () => {
    const p = range(sec, highlightWindow.start, highlightWindow.end);
    if (p <= 0 || p >= 1) return 1;
    return 1 + 0.03 * Math.sin(p * Math.PI);
  };

  const elementAppear = (secNow: number, start: number) => easeOut(range(secNow, start, start + 0.12));

  return (
    <g>
      {cards.map((c, i) => {
        const y = stackTopY + i * (cardH + gap);
        const slide = slideWindows[i];
        const pSlide = range(sec, slide.start, slide.end);
        const cardVisible = sec >= slide.start;
        const xOffset = cardSlideX(pSlide, 18);

        // Child element stagger inside each card (icon -> line1 -> line2 -> badge)
        const baseIn = slide.start + 0.05;
        const iconP = elementAppear(sec, baseIn);
        const line1P = elementAppear(sec, baseIn + 0.05);
        const line2P = elementAppear(sec, baseIn + 0.10);
        const badgeP = elementAppear(sec, baseIn + 0.15);

        // Accent pulse
        const pulseP = range(sec, pulseWindow.start + i * 0.1, pulseWindow.end + i * 0.1);
        const accentScaleX = pulseP > 0 && pulseP < 1 ? 1 + 0.3 * Math.sin(pulseP * Math.PI) : 1;

        // Badge count-up
        const countP = range(sec, countWindow.start + i * 0.08, countWindow.start + i * 0.08 + 0.4);
        const badgeValue = sec >= countWindow.start ? countUp(c.badge, countP) : 0;

        // End glow cycle
        const glowP = range(sec, glowWindow.start + i * 0.1, glowWindow.end + i * 0.1);
        const glowCycle = glowP > 0 ? 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(glowP * Math.PI * 2)) : 0;

        const cardShake = i === 0 ? shakeX() : 0;
        const cardScale = i === 0 ? highlightScale() : 1;

        return (
          <g
            key={i}
            opacity={cardVisible ? 1 : 0}
            transform={`translate(${xOffset + cardShake} 0) translate(${cx} ${y + cardH / 2}) scale(${cardScale}) translate(${-cx} ${-(y + cardH / 2)})`}
          >
            {/* Card */}
            <rect
              x={left}
              y={y}
              width={cardW}
              height={cardH}
              rx={3}
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="1.5"
              opacity={sec < 0.2 ? 0 : 1}
            />

            {/* Accent bar */}
            <g transform={`translate(${left + 2} ${y + 2}) scale(${accentScaleX} 1) translate(${-(left + 2)} ${-(y + 2)})`}>
              <rect x={left} y={y} width={3.2} height={cardH} rx={2} fill={c.accent} opacity={0.95} />
              {/* Subtle glow pass late */}
              {sec >= glowWindow.start ? (
                <rect x={left - 0.4} y={y - 0.2} width={4} height={cardH + 0.4} rx={2} fill={c.accent} opacity={0.18 * glowCycle} />
              ) : null}
            </g>

            {/* Icon circle */}
            <circle
              cx={left + 10}
              cy={y + cardH / 2}
              r={3.6}
              fill={c.accent}
              opacity={iconP}
              transform={`translate(${left + 10} ${y + cardH / 2}) scale(${iconP}) translate(${-(
                left + 10
              )} ${-(y + cardH / 2)})`}
            />

            {/* Text placeholders */}
            <rect
              x={left + 17}
              y={y + 3}
              width={24}
              height={2.2}
              rx={1.1}
              fill="#F1F5F9"
              opacity={0.9 * line1P}
              transform={`translate(${left + 17} ${y + 3}) scale(${line1P} 1) translate(${-(left + 17)} ${-(y + 3)})`}
            />
            <rect
              x={left + 17}
              y={y + 7}
              width={16}
              height={2}
              rx={1}
              fill="#94A3B8"
              opacity={0.6 * line2P}
              transform={`translate(${left + 17} ${y + 7}) scale(${line2P} 1) translate(${-(left + 17)} ${-(y + 7)})`}
            />

            {/* Timestamp */}
            <rect
              x={left + 50}
              y={y + 3}
              width={10}
              height={2}
              rx={1}
              fill="#64748B"
              opacity={0.55 * line1P}
              transform={`translate(${left + 50} ${y + 3}) scale(${line1P} 1) translate(${-(left + 50)} ${-(y + 3)})`}
            />

            {/* Badge */}
            <g opacity={badgeP}>
              <circle
                cx={left + cardW - 7}
                cy={y + cardH / 2}
                r={3.8}
                fill={c.accent}
                transform={`translate(${left + cardW - 7} ${y + cardH / 2}) scale(${badgeP}) translate(${-(left + cardW - 7)} ${-(y + cardH / 2)})`}
              />
              <text
                x={left + cardW - 7}
                y={y + cardH / 2 + 1.6}
                textAnchor="middle"
                fontSize="4.2"
                fontWeight="700"
                fill="#FFFFFF"
                style={{fontFamily: "Arial, sans-serif"}}
              >
                {badgeValue}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

