type PlantGrowingProps = {
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
  // Light overshoot without doing a full physics sim.
  return 1 + Math.sin(p * Math.PI) * 0.06 * (1 - p);
};

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

const leafTransform = (x: number, y: number, scale: number, rotDeg: number) => {
  return `translate(${x} ${y}) rotate(${rotDeg}) scale(${scale}) translate(${-x} ${-y})`;
};

export const PlantGrowing = ({t = 0}: PlantGrowingProps) => {
  const time = clamp01(t);

  // Prompt 032 timeline is 5.0s. We work in normalized time fractions:
  // 0-0.5 => 0-0.10
  // 0.5-0.8 => 0.10-0.16
  // 0.8-1.5 => 0.16-0.30
  // 1.5-1.8 => 0.30-0.36
  // 1.9-2.2 => 0.38-0.44
  // 2.2-2.7 => 0.44-0.54
  // 2.7-3.1 => 0.54-0.62
  // 3.1-3.7 => 0.62-0.74
  // 3.7-4.0 => 0.74-0.80
  // 4.0-4.3 => 0.80-0.86
  // 4.3-4.7 => 0.86-0.94

  const potP = easeOut(range(time, 0, 0.10));
  const rootsP = easeOut(range(time, 0.10, 0.16));
  const stemP = easeOut(range(time, 0.16, 0.30));

  const leafSmallL = easeOut(range(time, 0.30, 0.36));
  const leafSmallR = easeOut(range(time, 0.38, 0.44));
  const leafMedL = easeOut(range(time, 0.44, 0.54));
  const leafMedR = easeOut(range(time, 0.54, 0.62));
  const leafLarge = easeOut(range(time, 0.62, 0.74));

  const soilP = range(time, 0.74, 0.80);
  const sunP = easeOut(range(time, 0.80, 0.86));
  const swayP = range(time, 0.86, 0.94);

  const potScale = lerp(0.8, 1, potP) * springy(potP);
  const potOpacity = potP > 0 ? 1 : 0;

  const baseX = 80;
  const potY = 72;
  const stemBaseY = 62;
  const stemTopY = lerp(stemBaseY, 26, stemP);

  const swayRot =
    swayP <= 0
      ? 0
      : 2 * Math.sin(easeInOut(swayP) * Math.PI * 2); // 0 -> +2 -> -2 -> 0-ish

  // Sun position: upper-right.
  // Phase 1 spec places it around 1520x180 in a 1920x1080 frame (~126.7, 15.0 in 160x90).
  // Nudged slightly up/right and a bit smaller so it reads as "background accent", not the subject.
  const sunX = 134;
  const sunY = 14;
  const sunR = 8;

  return (
    <g>
      {/* Plant assembly group (sway around the pot/stem base) */}
      <g transform={`translate(${baseX} ${stemBaseY}) rotate(${swayRot}) translate(${-baseX} ${-stemBaseY})`}>
        {/* Pot + soil */}
        <g
          opacity={potOpacity}
          transform={`translate(${baseX} ${potY}) scale(${potScale}) translate(${-baseX} ${-potY})`}
        >
          {/* Pot body */}
          <path
            d="M62 62h36l-4 22c-1 5-5 8-10 8H76c-5 0-9-3-10-8l-4-22Z"
            fill="#C2410C"
            stroke="#9A3412"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Rim */}
          <path
            d="M60 58h40c2 0 4 2 4 4v2H56v-2c0-2 2-4 4-4Z"
            fill="#C2410C"
            stroke="#9A3412"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Soil */}
          <path d="M60 64h40v6H60v-6Z" fill="#78350F" opacity={0.95} />
        </g>

        {/* Roots (dashed draw) */}
        <g opacity={rootsP > 0 ? 1 : 0}>
          {[
            {d: `M80 70c-4 6-10 10-14 14`, delay: 0},
            {d: `M80 70c4 6 10 10 14 14`, delay: 0.12},
          ].map((root, i) => {
            const p = easeOut(clamp01((rootsP - root.delay) / (1 - root.delay)));
            return (
              <g key={i} opacity={p * 0.95}>
                {/* Reveal stroke */}
                <path
                  d={root.d}
                  fill="none"
                  stroke="#92400E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  {...dash(60, p)}
                  opacity={0.55}
                />
                {/* Dashed final look */}
                <path
                  d={root.d}
                  fill="none"
                  stroke="#92400E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  opacity={0.85}
                />
              </g>
            );
          })}
        </g>

        {/* Stem (draw upward) */}
        <path
          d={`M${baseX} ${stemBaseY} C ${baseX} 56, ${baseX} 44, ${baseX} ${stemTopY}`}
          fill="none"
          stroke="#15803D"
          strokeWidth="5"
          strokeLinecap="round"
          {...dash(120, stemP)}
          opacity={stemP > 0 ? 1 : 0}
        />

        {/* Branch stubs */}
        <g opacity={stemP > 0.25 ? 0.9 : 0} transform="translate(0 -2)">
          <path d="M80 46c-6 2-9 4-12 7" stroke="#15803D" strokeWidth="4" strokeLinecap="round" opacity={0.65} />
          <path d="M80 42c6 2 9 4 12 7" stroke="#15803D" strokeWidth="4" strokeLinecap="round" opacity={0.65} />
        </g>

        {/* Leaves */}
        {/* Small left */}
        <path
          d="M70 52c-10 0-14-8-10-14c4-6 14-6 20 0c6 6 0 14-10 14Z"
          fill="#22C55E"
          opacity={leafSmallL}
          transform={leafTransform(72, 46, leafSmallL, lerp(-90, 0, leafSmallL))}
        />
        {/* Small right */}
        <path
          d="M90 52c10 0 14-8 10-14c-4-6-14-6-20 0c-6 6 0 14 10 14Z"
          fill="#22C55E"
          opacity={leafSmallR}
          transform={leafTransform(88, 46, leafSmallR, lerp(90, 0, leafSmallR))}
        />

        {/* Medium left */}
        <path
          d="M62 44c-14 0-20-10-14-18c6-8 20-8 28 0c8 8 0 18-14 18Z"
          fill="#16A34A"
          opacity={leafMedL}
          transform={leafTransform(66, 34, leafMedL, lerp(-75, 0, leafMedL))}
        />
        {/* Medium right */}
        <path
          d="M98 44c14 0 20-10 14-18c-6-8-20-8-28 0c-8 8 0 18 14 18Z"
          fill="#16A34A"
          opacity={leafMedR}
          transform={leafTransform(94, 34, leafMedR, lerp(75, 0, leafMedR))}
        />

        {/* Large leaf (center/top) */}
        <path
          d="M80 36c-18 0-26-14-18-24c8-10 26-10 36 0c10 10 0 24-18 24Z"
          fill="#166534"
          opacity={leafLarge}
          transform={leafTransform(80, 22, leafLarge * springy(leafLarge), lerp(-35, 0, leafLarge))}
        />
        {/* Veins (appear with large leaf) */}
        <g opacity={leafLarge * 0.9}>
          <path d="M80 14v18" stroke="#FFFFFF" strokeWidth="1" opacity={0.3} strokeLinecap="round" />
          <path d="M80 18c-6 4-10 8-12 12" stroke="#FFFFFF" strokeWidth="1" opacity={0.3} strokeLinecap="round" />
          <path d="M80 18c6 4 10 8 12 12" stroke="#FFFFFF" strokeWidth="1" opacity={0.3} strokeLinecap="round" />
        </g>

        {/* Soil particles (float up) */}
        {[0, 1, 2].map((i) => {
          const phase = (i * 0.12) % 1;
          const p = clamp01((soilP - phase) / (1 - phase));
          const y = lerp(68, 56, easeOut(p)) + 4 * Math.sin(p * Math.PI);
          const o = lerp(1, 0.4, easeOut(p));
          return (
            <circle
              key={i}
              cx={baseX + (i - 1) * 10}
              cy={y}
              r={3}
              fill="#78350F"
              opacity={soilP > 0 ? o : 0}
            />
          );
        })}
      </g>

      {/* Sun + rays (upper-right) */}
      <g opacity={sunP} transform={`translate(${sunX} ${sunY}) scale(${lerp(0.8, 1, sunP)}) translate(${-sunX} ${-sunY})`}>
        <circle cx={sunX} cy={sunY} r={sunR} fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
        {Array.from({length: 8}).map((_, i) => {
          const stagger = i * 0.03;
          const p = easeOut(clamp01((sunP - stagger) / (1 - stagger)));
          const angle = (i / 8) * Math.PI * 2;
          const inner = sunR + 2;
          const outer = inner + 8; // 8px rays per Phase 1
          const x1 = sunX + Math.cos(angle) * inner;
          const y1 = sunY + Math.sin(angle) * inner;
          const x2 = sunX + Math.cos(angle) * outer;
          const y2 = sunY + Math.sin(angle) * outer;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              opacity={p}
              {...dash(20, p)}
            />
          );
        })}
      </g>
    </g>
  );
};
