type RocketLaunchProps = {
  // 0..1 over the whole scene duration.
  t?: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 2);
const easeIn = (t: number) => Math.pow(clamp01(t), 2);

const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

const rocketShakeX = (t: number) => {
  // 1.5s-1.8s in a 4.5s timeline => 0.333..0.4
  const p = range(t, 0.333, 0.4);
  if (p <= 0) return 0;
  if (p >= 1) return 0;
  const steps = [0, 4, -4, 3, -3, 0];
  const idx = Math.min(steps.length - 2, Math.floor(p * (steps.length - 1)));
  const local = p * (steps.length - 1) - idx;
  return lerp(steps[idx]!, steps[idx + 1]!, local);
};

const particleBurst = (t: number, seed: number) => {
  // A simple deterministic "random" based on sine hashing.
  const r = (x: number) => {
    const v = Math.sin(x * 999.7 + seed * 13.37) * 43758.5453;
    return v - Math.floor(v);
  };

  // Flicker/burst is active 1.0s-3.8s => 0.222..0.844
  const active = t >= 0.222 && t <= 0.844;
  if (!active) {
    return {x: 0, y: 0, opacity: 0, scale: 1};
  }

  // Repeating cycle around the nozzle.
  const cycle = 0.3 / 4.5; // 0.3s normalized
  const local = (t - 0.222) % cycle;
  const p = clamp01(local / cycle);
  const angle = r(seed + 1) * Math.PI * 2;
  const dist = lerp(0, 7 + r(seed + 2) * 6, easeOut(p));
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist + 2,
    opacity: (1 - p) * 0.9,
    scale: 0.9 + r(seed + 3) * 0.4,
  };
};

export const RocketLaunch = ({t = 0}: RocketLaunchProps) => {
  const time = clamp01(t);

  // Timeline fractions for 4.5s:
  // 0-0.5s => 0-0.111, 0.5-1.0 => 0.111-0.222, 1.0-1.5 => 0.222-0.333
  // 1.5-1.8 => 0.333-0.4, 1.8-2.8 => 0.4-0.622, 3.2-3.8 => 0.711-0.844, 3.8-4.5 => 0.844-1

  const starsIn = range(time, 0, 0.111);
  const entry = range(time, 0.111, 0.222);
  const flicker = range(time, 0.222, 0.333);
  const launch = range(time, 0.4, 0.622);
  const afterExit = range(time, 0.622, 0.711);
  const disperse = range(time, 0.711, 0.844);
  const twinkle = range(time, 0.844, 1);

  const rocketScale = lerp(0.9, 1, easeOut(entry));
  const rocketOpacity = entry > 0 ? 1 : 0;

  const flameFlicker =
    flicker > 0 && flicker < 1
      ? 0.75 + 0.25 * Math.sin(time * 4.5 * 28)
      : 1;

  const launchY = -120 * easeIn(launch); // take off out of frame
  const flameStretch = lerp(1, 2.5, easeIn(launch));
  const rocketXShake = rocketShakeX(time);

  const rocketGone = afterExit >= 0.8;
  const rocketVisibleOpacity = rocketGone ? 0 : rocketOpacity;

  // Scene coordinate system: 160x90 (16:9)
  const cx = 80;
  const baseY = 70;

  // Platform
  const platformY = 74;

  // Stars positions in a zone above platform.
  const stars = [
    {x: 32, y: 18, d: 0.02},
    {x: 52, y: 12, d: 0.08},
    {x: 70, y: 20, d: 0.04},
    {x: 92, y: 14, d: 0.12},
    {x: 112, y: 22, d: 0.06},
    {x: 44, y: 28, d: 0.16},
    {x: 84, y: 30, d: 0.1},
    {x: 118, y: 30, d: 0.18},
  ];

  return (
    <g>
      {/* Stars (static positions, fade in + subtle twinkle near the end) */}
      {stars.map((s, i) => {
        const p = easeOut(range(time, s.d * 0.111, s.d * 0.111 + 0.08));
        const base = lerp(0, 0.7, p);
        const tw = twinkle > 0 ? 0.25 * Math.sin((time * 4.5 + i) * 7.2) : 0;
        const o = Math.max(0, Math.min(0.75, base + tw));
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={i % 3 === 0 ? 2.2 : 1.6}
            fill="#FFFFFF"
            opacity={o}
          />
        );
      })}

      {/* Ground line */}
      <path d={`M20 ${platformY + 8}H140`} stroke="#1E293B" strokeWidth="2" opacity={0.9} />

      {/* Platform base */}
      <rect
        x={cx - 22}
        y={platformY}
        width={44}
        height={10}
        rx={3}
        fill="#334155"
        opacity={easeOut(entry)}
      />

      {/* Rocket group */}
      <g
        opacity={rocketVisibleOpacity}
        transform={`translate(${cx + rocketXShake} ${baseY + launchY}) scale(${rocketScale})`}
      >
        {/* Flame tongues */}
        <g transform={`translate(0 18) scale(1 ${flameFlicker * flameStretch})`}>
          <path
            d="M0 0c-6 6-6 14 0 20c6-6 6-14 0-20Z"
            fill="#F97316"
            opacity={time >= 0.222 ? 1 : 0}
            transform="translate(0 8)"
          />
          <path
            d="M0 0c-4 4-4 10 0 14c4-4 4-10 0-14Z"
            fill="#FBBF24"
            opacity={time >= 0.222 ? 1 : 0}
            transform="translate(0 12)"
          />
          <path
            d="M0 0c-2 3-2 7 0 10c2-3 2-7 0-10Z"
            fill="#FEF08A"
            opacity={time >= 0.222 ? 1 : 0}
            transform="translate(0 16)"
          />
        </g>

        {/* Rocket body */}
        <g transform="translate(0 -8)">
          {/* Body */}
          <rect x={-8} y={-18} width={16} height={32} rx={8} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          {/* Nose cone */}
          <path d="M0 -30L-8 -18H8L0 -30Z" fill="#EF4444" />
          {/* Fins */}
          <path d="M-8 2L-16 12L-8 12Z" fill="#94A3B8" />
          <path d="M8 2L16 12L8 12Z" fill="#94A3B8" />
          {/* Nozzles */}
          <rect x={-7} y={12} width={6} height={6} rx={2} fill="#64748B" />
          <rect x={1} y={12} width={6} height={6} rx={2} fill="#64748B" />
          {/* Porthole */}
          <circle cx={0} cy={-6} r={5} fill="#DBEAFE" stroke="#CBD5E1" strokeWidth="2" />
          {/* Reflection arc */}
          <path d="M1 -9c2 1 3 3 3 5" stroke="#FFFFFF" strokeWidth="2" opacity={0.3} strokeLinecap="round" />
        </g>
      </g>

      {/* Particles around the nozzle (repeat burst) */}
      {[0, 1, 2, 3].map((seed) => {
        const p = particleBurst(time, seed + 3);
        const px = cx + p.x;
        const py = baseY + 20 + p.y + launchY;
        return (
          <circle
            key={seed}
            cx={px}
            cy={py}
            r={seed % 2 === 0 ? 2.6 : 2.1}
            fill="#F97316"
            opacity={p.opacity}
            transform={`translate(${px} ${py}) scale(${p.scale}) translate(${-px} ${-py})`}
          />
        );
      })}

      {/* Dispersing particle cloud after exit */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const seed = i + 10;
        const r = (x: number) => {
          const v = Math.sin(x * 999.7 + seed * 13.37) * 43758.5453;
          return v - Math.floor(v);
        };

        const a = r(seed + 1) * Math.PI * 2;
        const dist = lerp(0, 26, easeOut(disperse));
        const px = cx + Math.cos(a) * dist;
        const py = platformY - 2 + Math.sin(a) * dist;
        const o = disperse > 0 ? lerp(0.9, 0, easeOut(disperse)) : 0;
        return (
          <circle
            key={`cloud-${i}`}
            cx={px}
            cy={py}
            r={2 + r(seed + 2) * 2}
            fill="#F97316"
            opacity={o * 0.9}
          />
        );
      })}

      {/* Flame trail fade below top (simple fade after exit) */}
      {time >= 0.622 && time <= 0.711 ? (
        <rect
          x={cx - 8}
          y={12}
          width={16}
          height={46}
          fill="#F97316"
          opacity={lerp(0.25, 0, easeOut(afterExit))}
          rx={8}
        />
      ) : null}
    </g>
  );
};

