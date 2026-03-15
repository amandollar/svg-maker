type DoctorSceneProps = {
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
  return 1 + Math.sin(p * Math.PI) * 0.07 * (1 - p);
};

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const DoctorScene = ({t = 0}: DoctorSceneProps) => {
  const time = clamp01(t);

  // Prompt 034 timeline is 4.0s total.
  // 0-0.5: silhouette fade/scale in
  // 0.5-0.8: coat fill
  // 0.8-1.0: head/hair/skin
  // 1.0-1.3: coat details stagger
  // 1.3-1.6: stethoscope draw
  // 1.6-1.9: clipboard slide in
  // 1.9-2.2: clipboard lines draw
  // 2.2-2.6: pocket cross pulse
  // 2.6-3.2: friendly nod
  // 3.2-4.0: hold

  // Normalized fractions (divide by 4):
  const pSil = easeOut(range(time, 0, 0.125));
  const pCoat = easeOut(range(time, 0.125, 0.2));
  const pHead = easeOut(range(time, 0.2, 0.25));
  const pDetails = range(time, 0.25, 0.325);
  const pStetho = easeOut(range(time, 0.325, 0.4));
  const pClip = easeOut(range(time, 0.4, 0.475));
  const pLines = easeOut(range(time, 0.475, 0.55));
  const pCrossPulse = range(time, 0.55, 0.65);
  const pNod = range(time, 0.65, 0.8);

  const centerX = 80;
  const centerY = 45;

  const baseScale = lerp(0.9, 1, pSil) * springy(pSil);

  // Slight friendly tilt (+3deg) baseline.
  const baseTilt = 3;
  const nodRot = pNod > 0 ? 3 * Math.sin(easeInOut(pNod) * Math.PI * 2) : 0; // 0 -> -3 -> +3 -> 0-ish
  const rot = baseTilt + nodRot;

  // Cross pulse: scale 1 -> 1.2 -> 1
  const crossScale = pCrossPulse > 0 ? 1 + 0.2 * Math.sin(pCrossPulse * Math.PI) : 1;
  const crossGlow = pCrossPulse > 0 ? 0.18 * Math.sin(pCrossPulse * Math.PI) : 0;

  const detail = (delay: number) => clamp01((pDetails - delay) / (1 - delay));

  // Clipboard slide from +40px in full-res. In our 160x90, use ~+10.
  const clipX = lerp(10, 0, pClip);

  return (
    <g>
      {/* Background panel with medical cross */}
      <g opacity={pSil} transform={`translate(${centerX} ${centerY}) scale(${baseScale}) rotate(${rot}) translate(${-centerX} ${-centerY})`}>
        <rect
          x={48}
          y={18}
          width={64}
          height={54}
          rx={6}
          fill="#FFFFFF"
          opacity={0.3}
          stroke="#E2E8F0"
          strokeWidth={2}
        />
        <g opacity={lerp(0, 1, easeOut(range(time, 0.05, 0.18)))}>
          <rect x={76} y={30} width={8} height={24} rx={2} fill="#EF4444" opacity={0.9} />
          <rect x={68} y={38} width={24} height={8} rx={2} fill="#EF4444" opacity={0.9} />
        </g>

        {/* Silhouette */}
        <g opacity={pSil}>
          <path
            d="M68 70c0-8 5-14 12-14h0c7 0 12 6 12 14v6H68v-6Z"
            fill="#0F172A"
            opacity={0.18}
          />
        </g>

        {/* Coat body */}
        <g opacity={pCoat}>
          <path
            d="M64 76V56c0-8 7-14 16-14s16 6 16 14v20H64Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Collar */}
          <path
            d="M72 50l8 8l8-8"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="6"
            strokeLinecap="round"
            opacity={0.9}
          />
        </g>

        {/* Head / hair / neck */}
        <g opacity={pHead}>
          <rect x={76} y={42} width={8} height={10} rx={3} fill="#FDDCB5" />
          <circle cx={80} cy={34} r={10} fill="#FDDCB5" />
          <path
            d="M70 34c2-8 18-10 20 0c-4-3-8-4-10-4s-6 1-10 4Z"
            fill="#292524"
            opacity={0.95}
          />
          <path
            d="M73 30c4-4 10-5 14-2"
            fill="none"
            stroke="#292524"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.75}
          />
        </g>

        {/* Hands */}
        <g opacity={pCoat}>
          <circle cx={64} cy={74} r={4} fill="#FDDCB5" />
          <circle cx={96} cy={74} r={4} fill="#FDDCB5" />
        </g>

        {/* Coat details stagger */}
        <g opacity={pCoat}>
          {/* Pocket */}
          <rect
            x={86}
            y={64}
            width={12}
            height={10}
            rx={2}
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="2"
            opacity={easeOut(detail(0.0))}
          />
          {/* Pocket cross emblem */}
          <g
            opacity={easeOut(detail(0.12))}
            transform={`translate(92 69) scale(${crossScale}) translate(-92 -69)`}
          >
            <rect x={91} y={66} width={2} height={8} rx={1} fill="#EF4444" />
            <rect x={88} y={69} width={8} height={2} rx={1} fill="#EF4444" />
            {crossGlow > 0 ? (
              <circle cx={92} cy={69} r={7} fill="#EF4444" opacity={crossGlow} />
            ) : null}
          </g>
          {/* Button / detail */}
          <circle cx={80} cy={64} r={1.5} fill="#CBD5E1" opacity={easeOut(detail(0.24))} />
        </g>

        {/* Stethoscope draw */}
        <g opacity={pStetho > 0 ? 1 : 0}>
          <path
            d="M70 52c0 10 4 16 10 18s10-8 10-18"
            fill="none"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
            {...dash(90, pStetho)}
          />
          {/* Earpiece dots */}
          <circle cx={70} cy={52} r={2} fill="#374151" opacity={pStetho} />
          <circle cx={90} cy={52} r={2} fill="#374151" opacity={pStetho} />
          {/* Chest piece */}
          <circle cx={80} cy={72} r={3} fill="#6B7280" opacity={pStetho} />
        </g>

        {/* Clipboard */}
        <g opacity={pClip} transform={`translate(${clipX} 0)`}>
          <rect
            x={54}
            y={60}
            width={18}
            height={22}
            rx={2}
            fill="#FEF9EE"
            stroke="#D97706"
            strokeWidth="2"
          />
          <rect x={58} y={58} width={10} height={4} rx={1.2} fill="#D97706" opacity={0.85} />

          {/* Clipboard lines */}
          {[
            {y: 68, d: 0.0},
            {y: 73, d: 0.12},
            {y: 78, d: 0.24},
          ].map((line, i) => {
            const p = clamp01((pLines - line.d) / (1 - line.d));
            return (
              <path
                key={i}
                d={`M58 ${line.y}H70`}
                stroke="#92400E"
                strokeWidth="2"
                strokeLinecap="round"
                opacity={p}
                {...dash(20, p)}
              />
            );
          })}
        </g>
      </g>
    </g>
  );
};
