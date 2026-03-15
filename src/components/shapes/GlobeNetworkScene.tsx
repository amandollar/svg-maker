type GlobeNetworkSceneProps = {
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
  // A light overshoot spring (good enough for Phase 1 feel).
  return p + Math.sin(p * Math.PI) * 0.14 * (1 - p);
};

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const GlobeNetworkScene = ({t = 0}: GlobeNetworkSceneProps) => {
  const time = clamp01(t);
  const sec = time * 5.0;

  // Timeline (5.0s, loopable but with reset prep at the end):
  // 0-0.5: globe scale-in, grid fade-in
  // 0.5-1.0: continents stagger in
  // 1.0-1.4: orbit rings draw in, begin subtle rotation sim
  // 1.4-1.8: location pins appear + ripple
  // 1.8-3.5: connection arc dashes + satellite travel
  // 3.5-4.5: hold + edge glow pulse
  // 4.5-5.0: fade out for clean loop restart

  const pEntry = range(sec, 0, 0.5);
  const pGrid = easeOut(range(sec, 0, 0.5));
  const pContinents = range(sec, 0.5, 1.0);
  const pOrbits = range(sec, 1.0, 1.4);
  const pPins = range(sec, 1.4, 1.8);
  const pConnect = range(sec, 1.8, 3.5);
  const pGlow = range(sec, 3.5, 4.5);
  const pFade = easeInOut(range(sec, 4.5, 5.0));

  const globalAlpha = 1 - pFade;
  const globeScale = springy(pEntry);

  // Scene coordinate system: 160x90.
  const cx = 80;
  const cy = 45;
  const r = 18;

  // Subtle "rotation sim": drift content right by ~2px/s in 1920px.
  // In our 160-space: 2/1920*160 ~ 0.166 units/s.
  const drift = sec >= 1.0 ? (sec - 1.0) * 0.16 : 0;

  const orbit1 = {rx: 26, ry: 12, rot: 30};
  const orbit2 = {rx: 24, ry: 10, rot: -30};

  // Satellite travels orbit 1 at 3s per full revolution.
  const satVisible = sec >= 1.8 ? 1 : 0;
  const satFadeOut = sec >= 4.5 ? 1 - easeOut(range(sec, 4.5, 5.0)) : 1;
  const satAlpha = satVisible * satFadeOut * globalAlpha;
  const satAngle = ((sec - 1.8) / 3.0) * Math.PI * 2;
  const satX =
    cx +
    Math.cos(satAngle) * orbit1.rx * Math.cos((orbit1.rot * Math.PI) / 180) -
    Math.sin(satAngle) * orbit1.ry * Math.sin((orbit1.rot * Math.PI) / 180);
  const satY =
    cy +
    Math.cos(satAngle) * orbit1.rx * Math.sin((orbit1.rot * Math.PI) / 180) +
    Math.sin(satAngle) * orbit1.ry * Math.cos((orbit1.rot * Math.PI) / 180);

  const pins = [
    {x: cx - 6, y: cy - 2},
    {x: cx + 10, y: cy - 6},
    {x: cx + 4, y: cy + 8},
    {x: cx - 12, y: cy + 6},
  ];

  const arcs = [
    {a: 0, b: 1, d: 0.0},
    {a: 1, b: 2, d: 0.3},
    {a: 2, b: 3, d: 0.6},
    {a: 3, b: 0, d: 0.9},
  ];

  const edgeGlow = pGlow > 0 ? 0.12 + 0.22 * (0.5 + 0.5 * Math.sin(pGlow * Math.PI * 2)) : 0;

  const drawOrbit = (idx: number) => {
    const delay = idx * 0.2;
    return easeOut(clamp01((pOrbits - delay) / (1 - delay)));
  };

  const pinScale = (idx: number) => {
    const delay = idx * 0.12;
    return springy(clamp01((pPins - delay) / (1 - delay)));
  };

  const ripple = (idx: number) => {
    const delay = idx * 0.15;
    const p = clamp01((pPins - delay) / (1 - delay));
    const radius = lerp(4, 14, easeOut(p));
    const opacity = lerp(0.6, 0, easeOut(p));
    return {radius, opacity};
  };

  const arcOpacity = easeOut(pConnect) * globalAlpha;
  const dashOffsets = arcs.map((arc, i) => {
    // 1.2s per arc, staggered.
    const local = Math.max(0, sec - 1.8 - arc.d);
    return -80 * (local / 1.2);
  });

  return (
    <g opacity={globalAlpha}>
      {/* Globe group */}
      <g transform={`translate(${cx} ${cy}) scale(${globeScale}) translate(${-cx} ${-cy})`}>
        {/* Base sphere */}
        <circle cx={cx} cy={cy} r={r} fill="#0B1120" stroke="#1E40AF" strokeWidth="2" />

        {/* Edge glow pulse */}
        {sec >= 3.5 ? (
          <circle
            cx={cx}
            cy={cy}
            r={r + 1.5}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="5"
            opacity={edgeGlow}
          />
        ) : null}

        {/* Grid lines */}
        <g opacity={0.3 * pGrid}>
          {/* Longitude arcs */}
          <path
            d={`M${cx} ${cy - r} C ${cx - 8 + drift} ${cy - 10}, ${cx - 8 + drift} ${cy + 10}, ${cx} ${cy + r}`}
            fill="none"
            stroke="#1E40AF"
            strokeWidth="1"
            opacity={0.9}
          />
          <path
            d={`M${cx} ${cy - r} C ${cx + drift} ${cy - 12}, ${cx + drift} ${cy + 12}, ${cx} ${cy + r}`}
            fill="none"
            stroke="#1E40AF"
            strokeWidth="1"
            opacity={0.7}
          />
          <path
            d={`M${cx} ${cy - r} C ${cx + 8 + drift} ${cy - 10}, ${cx + 8 + drift} ${cy + 10}, ${cx} ${cy + r}`}
            fill="none"
            stroke="#1E40AF"
            strokeWidth="1"
            opacity={0.9}
          />

          {/* Latitude arcs */}
          <path
            d={`M${cx - r} ${cy - 6} C ${cx - 6 + drift} ${cy - 12}, ${cx + 6 + drift} ${cy - 12}, ${cx + r} ${cy - 6}`}
            fill="none"
            stroke="#1E40AF"
            strokeWidth="1"
            opacity={0.75}
          />
          <path
            d={`M${cx - r} ${cy} C ${cx - 8 + drift} ${cy - 2}, ${cx + 8 + drift} ${cy - 2}, ${cx + r} ${cy}`}
            fill="none"
            stroke="#1E40AF"
            strokeWidth="1"
            opacity={0.6}
          />
          <path
            d={`M${cx - r} ${cy + 6} C ${cx - 6 + drift} ${cy + 12}, ${cx + 6 + drift} ${cy + 12}, ${cx + r} ${cy + 6}`}
            fill="none"
            stroke="#1E40AF"
            strokeWidth="1"
            opacity={0.75}
          />
        </g>

        {/* Continents (simple blobs, staggered) */}
        {[
          {path: `M${cx - 7} ${cy - 3}c-4-2-5-6-2-8c4-3 10 0 9 5c-1 4-4 5-7 3Z`, d: 0.0},
          {path: `M${cx + 2} ${cy - 8}c-2-2-1-5 2-6c3-1 6 1 6 4c0 3-4 5-8 2Z`, d: 0.08},
          {path: `M${cx + 8} ${cy - 2}c-3-2-3-6 1-7c4-1 7 3 5 6c-2 3-4 3-6 1Z`, d: 0.16},
          {path: `M${cx + 6} ${cy + 7}c-3-1-4-4-2-6c3-3 9 0 7 4c-1 3-3 4-5 2Z`, d: 0.24},
          {path: `M${cx - 10} ${cy + 6}c-2-2-1-5 2-6c4-1 8 2 6 5c-2 4-6 4-8 1Z`, d: 0.32},
        ].map((c, i) => {
          const p = springy(clamp01((pContinents - c.d) / (1 - c.d)));
          return (
            <path
              key={i}
              d={c.path}
              fill="#1D4ED8"
              opacity={0.6 * p}
              transform={`translate(${cx} ${cy}) scale(${p}) translate(${-cx} ${-cy}) translate(${drift} 0)`}
            />
          );
        })}
      </g>

      {/* Orbit rings draw in */}
      <g opacity={globalAlpha}>
        {[orbit1, orbit2].map((o, idx) => {
          const p = drawOrbit(idx);
          const stroke = idx === 0 ? "#3B82F6" : "#2563EB";
          const sw = idx === 0 ? 1.5 : 1.2;
          const len = 180;
          return (
            <ellipse
              key={idx}
              cx={cx}
              cy={cy}
              rx={o.rx}
              ry={o.ry}
              fill="none"
              stroke={stroke}
              strokeWidth={sw}
              opacity={0.5 * p}
              transform={`rotate(${o.rot} ${cx} ${cy})`}
              {...dash(len, p)}
            />
          );
        })}
      </g>

      {/* Pins + ripples */}
      {pins.map((p, idx) => {
        const s = pinScale(idx);
        const rip = ripple(idx);
        return (
          <g key={idx} opacity={globalAlpha}>
            <circle
              cx={p.x}
              cy={p.y}
              r={3.2}
              fill="#60A5FA"
              opacity={s}
              transform={`translate(${p.x} ${p.y}) scale(${s}) translate(${-p.x} ${-p.y})`}
            />
            {pPins > 0 ? (
              <circle
                cx={p.x}
                cy={p.y}
                r={rip.radius}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="1.5"
                opacity={rip.opacity}
              />
            ) : null}
          </g>
        );
      })}

      {/* Connection arcs (dashed flow) */}
      {arcs.map((arc, i) => {
        const a = pins[arc.a];
        const b = pins[arc.b];
        const midX = (a.x + b.x) / 2;
        const midY = Math.min(a.y, b.y) - 10;
        return (
          <path
            key={i}
            d={`M${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`}
            fill="none"
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeDashoffset={dashOffsets[i]}
            opacity={arcOpacity}
            strokeLinecap="round"
          />
        );
      })}

      {/* Satellite dot */}
      {satAlpha > 0 ? (
        <circle cx={satX} cy={satY} r={3} fill="#FBBF24" opacity={satAlpha} />
      ) : null}
    </g>
  );
};

