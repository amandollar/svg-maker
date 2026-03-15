type PersonAtDeskSceneProps = {
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
  return p + Math.sin(p * Math.PI) * 0.16 * (1 - p);
};

export const PersonAtDeskScene = ({t = 0}: PersonAtDeskSceneProps) => {
  // Phase 1 Prompt 038: 5.0s loopable.
  const time = clamp01(t);
  const sec = time * 5.0;

  // 0.0-0.5: background establish
  // 0.5-1.0: desk + chair in
  // 1.0-1.4: person in
  // 1.4-1.8: laptop + mug + plant in (stagger)
  // 1.8-2.0: lamp + light cone
  // 2.0-2.4: sticky notes drop (stagger)
  // 2.4-2.7: clock hands
  // 2.7-5.0: idle loop (nod/steam/cursor/clock minute hand)

  const pBg = easeOut(range(sec, 0, 0.5));
  const pDesk = springy(range(sec, 0.5, 1.0));
  const pPerson = springy(range(sec, 1.0, 1.4));
  const pItems = range(sec, 1.4, 1.8);
  const pLamp = range(sec, 1.8, 2.0);
  const pNotes = range(sec, 2.0, 2.4);
  const pClock = easeOut(range(sec, 2.4, 2.7));

  // Fade out a bit at the end for a clean restart.
  const pFade = easeInOut(range(sec, 4.7, 5.0));
  const alpha = 1 - pFade;

  // Scene coordinate system: 160x90.
  const cx = 80;
  const baseY = 58; // slightly lower than center (Phase 1: centered ~960x580).

  // Colors from Phase 1.
  const deskFill = "#D97706";
  const deskStroke = "#92400E";
  const chairFill = "#374151";
  const skin = "#FDDCB5";
  const shirt = "#3B82F6";
  const laptopFill = "#1E293B";
  const laptopScreen = "#DBEAFE";
  const mugFill = "#C2410C";
  const steamStroke = "#94A3B8";
  const lampFill = "#FBBF24";
  const plantGreen = "#16A34A";
  const plantPot = "#C2410C";
  const noteYellow = "#FDE68A";
  const noteGreen = "#BBF7D0";
  const clockFace = "#FFFFFF";
  const clockHands = "#1E293B";

  const itemScale = (idx: number) => {
    const delay = idx * 0.08;
    return springy(clamp01((pItems - delay) / (1 - delay)));
  };

  const noteDrop = (idx: number) => {
    const delay = idx * 0.2;
    const p = easeOut(clamp01((pNotes - delay) / (1 - delay)));
    return {
      y: lerp(-8, 0, p),
      opacity: p,
    };
  };

  // Idle loop (2.7-5.0).
  const idle = clamp01((sec - 2.7) / (5.0 - 2.7));
  const idleCycle = (sec - 2.7) / 1.8; // head nod repeats ~1.8s.
  const nod = sec >= 2.7 ? -4 * (0.5 + 0.5 * Math.sin(idleCycle * Math.PI * 2)) : 0;

  const cursor = sec >= 2.7 ? (Math.sin(((sec - 2.7) / 0.8) * Math.PI * 2) > 0 ? 1 : 0) : 0;

  const steamCycle = clamp01(((sec - 2.7) % 0.8) / 0.8);
  const steamY = sec >= 2.7 ? lerp(0, -10, easeOut(steamCycle)) : 0;
  const steamOpacity = sec >= 2.7 ? lerp(0.65, 0, easeOut(steamCycle)) : 0;

  const minuteHandRot = sec >= 2.7 ? lerp(0, 6, easeInOut(clamp01((sec - 2.7) / 3.0))) : 0;

  // 160 viewBox maps to 1920px wide, so 1 unit ~= 12px. Keep strokes tiny.
  const strokeThin = 0.35;
  const strokeMed = 0.55;

  // Layout constants (aim: ~800px wide scene => ~67 units; give some breathing room).
  const sceneW = 72;
  const sceneX = cx - sceneW / 2;

  const wallTop = baseY - 40;
  const windowX = sceneX + 48;
  const windowY = wallTop + 6;
  const clockX = sceneX + 12;
  const clockY = wallTop + 10;

  const deskX = sceneX + 6;
  const deskY = baseY;
  const deskW = 60;
  const deskH = 9;

  const chairX = deskX - 10;
  const chairY = baseY - 18;

  // Seat the person slightly left of the laptop and a bit lower so they feel grounded in the chair.
  const personX = deskX + 16;
  const personY = baseY - 22;

  const mugX = deskX + 10;
  const mugY = baseY - 9.5;

  const laptopX = deskX + 26;
  const laptopY = baseY - 11;

  const plantX = deskX + 52;
  const plantY = baseY - 11;

  const lampX = deskX + 4;
  const lampY = baseY - 26;

  return (
    <g opacity={alpha}>
      {/* Background establish: window + rays + subtle wall tint */}
      <g opacity={pBg}>
        {/* Soft wall backdrop */}
        <rect x={sceneX} y={wallTop} width={sceneW} height={52} rx={6} fill="#FEF9EE" opacity={0.28} />

        {/* Window frame */}
        <g>
          <rect x={windowX} y={windowY} width={24} height={18} rx={3} fill="#E2E8F0" opacity={0.7} />
          <rect x={windowX + 2} y={windowY + 2} width={20} height={14} rx={2} fill="#DBEAFE" opacity={0.85} />
          <path
            d={`M${windowX + 12} ${windowY + 2}V${windowY + 16}`}
            stroke="#CBD5E1"
            strokeWidth={strokeThin}
          />
          <path
            d={`M${windowX + 2} ${windowY + 9}H${windowX + 22}`}
            stroke="#CBD5E1"
            strokeWidth={strokeThin}
          />
        </g>

        {/* Light rays (diagonal) */}
        {[0, 1, 2].map((i) => {
          const drift = Math.sin((sec / 5) * Math.PI * 2) * 0.6; // subtle shimmer
          return (
            <path
              key={i}
              d={`M${windowX - 2 + i * 4} ${windowY + 2} l ${16 + drift} ${12 + i * 1.5}`}
              stroke="#FEF08A"
              strokeWidth={0.9}
              opacity={0.12 + 0.04 * Math.sin((sec + i) * 1.6)}
              strokeLinecap="round"
            />
          );
        })}

        {/* Clock face (no hands until later) */}
        <circle cx={clockX} cy={clockY} r={6} fill={clockFace} opacity={0.95} />
      </g>

      {/* Desk + chair */}
      <g
        transform={`translate(${cx} ${baseY}) scale(${lerp(0.92, 1, pDesk)}) translate(${-cx} ${-baseY})`}
        opacity={pDesk}
      >
        {/* Chair */}
        <g>
          <rect x={chairX + 2} y={chairY + 2} width={16} height={14} rx={5} fill={chairFill} opacity={0.92} />
          <rect x={chairX + 4} y={chairY + 14} width={16} height={8} rx={3} fill={chairFill} opacity={0.95} />
        </g>

        {/* Desk */}
        <g>
          <rect
            x={deskX}
            y={deskY}
            width={deskW}
            height={deskH}
            rx={3}
            fill={deskFill}
            stroke={deskStroke}
            strokeWidth={strokeMed}
          />
          {/* Front leg */}
          <rect x={deskX + 6} y={deskY + deskH} width={6} height={18} rx={2} fill={deskStroke} opacity={0.7} />
          {/* Back leg */}
          <rect x={deskX + deskW - 12} y={deskY + deskH} width={6} height={18} rx={2} fill={deskStroke} opacity={0.55} />
        </g>
      </g>

      {/* Person */}
      <g
        transform={`translate(${personX + 10} ${personY + 18}) scale(${pPerson}) rotate(${nod} ${personX + 10} ${personY + 18}) translate(${-personX - 10} ${-personY - 18})`}
        opacity={pPerson}
      >
        {/* Head */}
        <circle cx={personX + 10} cy={personY + 6} r={6} fill={skin} />
        {/* Torso */}
        <rect x={personX + 4} y={personY + 12} width={12} height={16} rx={4} fill={shirt} />
        {/* Arms */}
        <path
          d={`M${personX + 5} ${personY + 18} C ${personX + 0} ${personY + 20}, ${personX + 2} ${personY + 26}, ${personX + 8} ${personY + 26}`}
          fill="none"
          stroke={shirt}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <path
          d={`M${personX + 15} ${personY + 18} C ${personX + 22} ${personY + 20}, ${personX + 20} ${personY + 26}, ${personX + 14} ${personY + 26}`}
          fill="none"
          stroke={shirt}
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </g>

      {/* Laptop, mug, plant (stagger) */}
      <g opacity={alpha}>
        {/* Laptop */}
        <g
          transform={`translate(${laptopX + 12} ${laptopY + 8}) scale(${itemScale(0)}) translate(${-laptopX - 12} ${-laptopY - 8})`}
          opacity={itemScale(0)}
        >
          <rect x={laptopX} y={laptopY} width={24} height={14} rx={2} fill={laptopFill} />
          <rect x={laptopX + 2} y={laptopY + 2} width={20} height={10} rx={1.5} fill={laptopScreen} opacity={0.95} />
          {/* Cursor blink */}
          {sec >= 2.7 ? (
            <rect x={laptopX + 16} y={laptopY + 5} width={1.8} height={6} rx={0.8} fill={laptopFill} opacity={cursor ? 0.9 : 0} />
          ) : null}
          <rect x={laptopX + 2} y={laptopY + 14} width={20} height={3.5} rx={1.8} fill={laptopFill} opacity={0.85} />
        </g>

        {/* Mug */}
        <g
          transform={`translate(${mugX + 6} ${mugY + 6}) scale(${itemScale(1)}) translate(${-mugX - 6} ${-mugY - 6})`}
          opacity={itemScale(1)}
        >
          <rect x={mugX} y={mugY} width={10} height={10} rx={2} fill={mugFill} />
          <path
            d={`M${mugX + 10} ${mugY + 3} c4 0 4 6 0 6`}
            fill="none"
            stroke={mugFill}
            strokeWidth={strokeMed}
            strokeLinecap="round"
          />
          <rect x={mugX + 2} y={mugY + 2} width={6} height={2} rx={1} fill="#FFFFFF" opacity={0.15} />
          {/* Steam */}
          {sec >= 2.7 ? (
            <path
              d={`M${mugX + 5} ${mugY - 2 + steamY} c-3-3-3-7 0-10 c3-3 3-7 0-10`}
              fill="none"
              stroke={steamStroke}
              strokeWidth={strokeMed}
              strokeLinecap="round"
              opacity={steamOpacity}
            />
          ) : null}
        </g>

        {/* Plant */}
        <g
          transform={`translate(${plantX + 6} ${plantY + 10}) scale(${itemScale(2)}) translate(${-plantX - 6} ${-plantY - 10})`}
          opacity={itemScale(2)}
        >
          <rect x={plantX} y={plantY + 10} width={12} height={8} rx={2} fill={plantPot} />
          <path
            d={`M${plantX + 6} ${plantY + 10} c-1-5 1-8 0-10`}
            stroke="#15803D"
            strokeWidth={strokeMed}
            strokeLinecap="round"
            fill="none"
          />
          <path d={`M${plantX + 6} ${plantY + 4} c-5-2-6 2-2 5 c2 1 3 0 4-1`} fill={plantGreen} opacity={0.95} />
          <path d={`M${plantX + 6} ${plantY + 4} c5-2 6 2 2 5 c-2 1-3 0-4-1`} fill={plantGreen} opacity={0.9} />
        </g>
      </g>

      {/* Lamp + light cone */}
      <g opacity={alpha}>
        <g
          transform={`translate(${lampX + 8} ${lampY + 18}) scale(${springy(pLamp)}) translate(${-lampX - 8} ${-lampY - 18})`}
          opacity={springy(pLamp)}
        >
          <rect x={lampX} y={lampY + 18} width={10} height={3} rx={1.5} fill={lampFill} opacity={0.95} />
          <rect x={lampX + 4} y={lampY + 8} width={2} height={12} rx={1} fill={lampFill} opacity={0.9} />
          <path
            d={`M${lampX + 5} ${lampY + 10} L ${lampX + 12} ${lampY + 6}`}
            stroke={lampFill}
            strokeWidth={strokeMed}
            strokeLinecap="round"
          />
          <path
            d={`M${lampX + 12} ${lampY + 6} l 8 4 l -8 6 z`}
            fill={lampFill}
            opacity={0.85}
          />
          {/* Light cone */}
          <g
            transform={`translate(${lampX + 16} ${lampY + 10}) scale(1 ${easeOut(pLamp)}) translate(${-lampX - 16} ${-lampY - 10})`}
            opacity={0.12 * easeOut(pLamp)}
          >
            <path
              d={`M${lampX + 16} ${lampY + 10} L ${lampX + 34} ${lampY + 34} L ${lampX + 6} ${lampY + 34} Z`}
              fill={lampFill}
            />
          </g>
        </g>
      </g>

      {/* Sticky notes (drop) */}
      <g opacity={alpha}>
        {[0, 1].map((idx) => {
          const drop = noteDrop(idx);
          const nx = sceneX + 36 + idx * 10;
          const ny = wallTop + 12;
          const fill = idx === 0 ? noteYellow : noteGreen;
          return (
            <rect
              key={idx}
              x={nx}
              y={ny + drop.y}
              width={8}
              height={7}
              rx={1.5}
              fill={fill}
              opacity={drop.opacity}
            />
          );
        })}
      </g>

      {/* Clock hands */}
      <g opacity={alpha * pClock}>
        {/* Hour hand at ~10 o'clock */}
        <path
          d={`M${clockX} ${clockY} L ${clockX - 2.8} ${clockY - 2.2}`}
          stroke={clockHands}
          strokeWidth={strokeMed}
          strokeLinecap="round"
        />
        {/* Minute hand at ~2 o'clock + subtle advance */}
        <path
          d={`M${clockX} ${clockY} L ${clockX + 3.2} ${clockY - 3.4}`}
          stroke={clockHands}
          strokeWidth={strokeMed}
          strokeLinecap="round"
          transform={`rotate(${minuteHandRot} ${clockX} ${clockY})`}
        />
        <circle cx={clockX} cy={clockY} r={0.9} fill={clockHands} opacity={0.9} />
      </g>

      {/* Subtle floor shadow */}
      <ellipse
        cx={cx}
        cy={baseY + 28}
        rx={sceneW * 0.34}
        ry={3.6}
        fill="#000000"
        opacity={0.06 * pDesk}
      />
    </g>
  );
};
