type SolarPanelSceneProps = {
  // 0..1 over the whole scene duration. If the spec loops, this will loop too.
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

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const SolarPanelScene = ({t = 0}: SolarPanelSceneProps) => {
  const time = clamp01(t);

  // Prompt 035 timeline is 5.0s and loopable.
  // We implement the "build" in the first ~45% and then a steady energy-flow loop.
  const pGround = easeOut(range(time, 0.0, 0.10));
  const pHouse = easeOut(range(time, 0.10, 0.16));
  const pPanel = easeOut(range(time, 0.16, 0.22));
  const pCells = range(time, 0.22, 0.30);
  const pSun = easeOut(range(time, 0.30, 0.36));
  const pRays = easeOut(range(time, 0.36, 0.42));
  const pEnergy = range(time, 0.42, 1.0);

  const steady = time >= 0.42 ? 1 : 0;
  const sunPulse = steady ? 1 + 0.025 * Math.sin(time * Math.PI * 6) : 1;
  const boltDashOffset = steady ? -220 * (time - 0.42) : 0;

  // Make the loop seamless by fading to the same "empty" state at the end.
  const fadeOut = easeInOut(range(time, 0.90, 1.0));
  const globalAlpha = 1 - fadeOut;

  // Scene coordinate system: 160x90.
  const groundY = 66;

  // Nudge content a bit larger/closer so it fills the frame more like Phase 1.
  const panel = {x: 60, y: 34, w: 36, h: 22};
  const house = {x: 110, y: 50};

  // Phase 1 reads "upper-center" sun, not far-right.
  const sun = {x: 80, y: 14, r: 8};
  const contentScale = 1.12;
  const contentAnchor = {x: 86, y: 52};

  const cells = Array.from({length: 12}).map((_, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const x = panel.x + 6 + col * 7.2;
    const y = panel.y + 5 + row * 5.2;
    return {x, y, w: 6, h: 4.2, idx};
  });

  const cellProgress = (idx: number) => {
    const stagger = idx * 0.04;
    return easeOut(clamp01((pCells - stagger) / (1 - stagger)));
  };

  // Cloud drift (optional in spec): subtle and behind the sun.
  const cloudX = lerp(-30, 190, (time * 0.55) % 1);

  return (
    <g>
      {/* Ground */}
      <rect x={0} y={groundY} width={160} height={24} fill="#D1FAE5" opacity={pGround * globalAlpha} />
      <path d={`M0 ${groundY}H160`} stroke="#A7F3D0" strokeWidth="2" opacity={pGround * 0.6 * globalAlpha} />

      {/* Cloud */}
      <g opacity={0.18 * pGround * globalAlpha} transform={`translate(${cloudX} 0)`}>
        <path
          d="M20 18c0-4 4-8 9-7c1-4 6-7 10-5c3-4 10-3 12 2c5-1 10 2 10 7c0 5-4 8-9 8H28c-5 0-8-3-8-7Z"
          fill="#FFFFFF"
        />
      </g>

      {/* House */}
      <g transform={`translate(${contentAnchor.x} ${contentAnchor.y}) scale(${contentScale}) translate(${-contentAnchor.x} ${-contentAnchor.y})`}>
        {/* House */}
        <g
          opacity={pHouse * globalAlpha}
          transform={`translate(${house.x} ${house.y + (1 - pHouse) * 6})`}
        >
          <path d="M0 0h22v16H0V0Z" fill="#F59E0B" opacity={0.95} />
          <path d="M-2 0L11 -10L24 0H-2Z" fill="#B45309" opacity={0.95} />
          <rect x={9} y={8} width={4} height={8} rx={1} fill="#92400E" opacity={0.9} />
          <rect x={3} y={4} width={5} height={4} rx={1} fill="#FEF3C7" opacity={0.72} />
          <rect x={14} y={4} width={5} height={4} rx={1} fill="#FEF3C7" opacity={0.72} />
        </g>

        {/* Solar panel + mount */}
        <g
          opacity={pPanel * globalAlpha}
          transform={`translate(${panel.x + panel.w / 2} ${panel.y + panel.h / 2}) rotate(-8) scale(${pPanel}) translate(${-(
            panel.x +
            panel.w / 2
          )} ${-(panel.y + panel.h / 2)})`}
        >
          {/* Panel shadow */}
          <rect
            x={panel.x + 2}
            y={panel.y + 2}
            width={panel.w}
            height={panel.h}
            rx={2}
            fill="#0F172A"
            opacity={0.12}
          />
          {/* Mount */}
          <rect x={panel.x + 16} y={panel.y + 22} width={4} height={14} rx={2} fill="#6B7280" opacity={0.9} />
          <rect x={panel.x + 10} y={panel.y + 36} width={16} height={4} rx={2} fill="#6B7280" opacity={0.9} />

          {/* Frame */}
          <rect x={panel.x} y={panel.y} width={panel.w} height={panel.h} rx={2} fill="#374151" opacity={0.95} />

          {/* Cells (reveal one by one) */}
          {cells.map((c) => {
            const p = cellProgress(c.idx);
            const scale = p;
            const cx = c.x + c.w / 2;
            const cy = c.y + c.h / 2;
            const fill = p > 0.001 ? "#1D4ED8" : "#DBEAFE";
            const shimmer = steady ? 0.12 * Math.max(0, Math.sin((time * 10 + c.idx * 0.7))) : 0;
            return (
              <rect
                key={c.idx}
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                rx={0.8}
                fill={fill}
                opacity={(0.35 + p * 0.65 + shimmer) * globalAlpha}
                transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
              />
            );
          })}

          {/* Soft highlight sweep */}
          <path
            d={`M${panel.x + 3} ${panel.y + 3}L${panel.x + panel.w - 4} ${panel.y + 3}L${panel.x + panel.w - 10} ${panel.y + panel.h - 3}L${panel.x + 1} ${panel.y + panel.h - 3}Z`}
            fill="#FFFFFF"
            opacity={(steady ? 0.05 + 0.03 * Math.sin(time * Math.PI * 8) : 0.04) * globalAlpha}
          />
        </g>

        {/* Energy bolt (panel -> house) */}
        <g opacity={(pEnergy > 0 ? 1 : 0) * globalAlpha}>
          {/* Glow underlay */}
          <path
            d={`M${panel.x + panel.w + 3} ${panel.y + 10} C ${panel.x + panel.w + 16} ${panel.y + 8}, ${house.x - 8} ${house.y - 2}, ${house.x} ${house.y + 4}`}
            fill="none"
            stroke="#FDE68A"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="14 14"
            strokeDashoffset={boltDashOffset * 0.9}
            opacity={0.12 + 0.22 * easeInOut(pEnergy)}
          />
          <path
            d={`M${panel.x + panel.w + 3} ${panel.y + 10} C ${panel.x + panel.w + 16} ${panel.y + 8}, ${house.x - 8} ${house.y - 2}, ${house.x} ${house.y + 4}`}
            fill="none"
            stroke="#FBBF24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 8"
            strokeDashoffset={boltDashOffset}
            opacity={0.35 + 0.65 * easeInOut(pEnergy)}
          />
        </g>
      </g>

      {/* Sun */}
      <g
        opacity={pSun * globalAlpha}
        transform={`translate(${sun.x} ${sun.y}) scale(${lerp(0.8, 1, pSun) * sunPulse}) translate(${-sun.x} ${-sun.y})`}
      >
        <circle cx={sun.x} cy={sun.y} r={sun.r} fill="#FBBF24" opacity={0.9} />
        <circle cx={sun.x} cy={sun.y} r={sun.r} fill="none" stroke="#F59E0B" strokeWidth="3" opacity={0.85} />

        {Array.from({length: 8}).map((_, i) => {
          const stagger = i * 0.035;
          const p = easeOut(clamp01((pRays - stagger) / (1 - stagger)));
          const angle = (i / 8) * Math.PI * 2;
          const inner = sun.r + 3;
          const outer = inner + 9;
          const x1 = sun.x + Math.cos(angle) * inner;
          const y1 = sun.y + Math.sin(angle) * inner;
          const x2 = sun.x + Math.cos(angle) * outer;
          const y2 = sun.y + Math.sin(angle) * outer;
          const breathe = steady ? 0.08 * Math.sin(time * Math.PI * 6 + i) : 0;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={(p * pSun + breathe) * globalAlpha}
              {...dash(30, p)}
            />
          );
        })}
      </g>
    </g>
  );
};
