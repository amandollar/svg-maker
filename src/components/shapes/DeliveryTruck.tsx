type DeliveryTruckProps = {
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

const dash = (length: number, progress: number) => {
  const p = clamp01(progress);
  return {
    strokeDasharray: length,
    strokeDashoffset: length * (1 - p),
  } as const;
};

export const DeliveryTruck = ({t = 0}: DeliveryTruckProps) => {
  const time = clamp01(t);

  // Prompt 033 timeline is 4.0s total.
  // 0.0-0.1: invisible off-screen
  // 0.1-0.3: fade in
  // 0.3-1.8: drive to center
  // 1.8-2.2: decelerate to right
  // 2.2-2.5: brake rock (squash)
  // 2.5-2.8: lights flash (twice)
  // 2.8-3.3: door open slightly
  // 3.3-4.0: hold + exhaust puff

  const fadeIn = range(time, 0.025, 0.075);
  const drive = easeInOut(range(time, 0.075, 0.45));
  const decel = easeOut(range(time, 0.45, 0.55));
  const stopHold = time >= 0.55 ? 1 : 0;

  const xStart = -33; // off-screen left (approx scaled from -400px)
  const xCenter = 80;
  const xPark = 92; // center-right (approx scaled from 1100px)

  const xPos = time < 0.075
    ? xStart
    : time < 0.45
      ? lerp(xStart, xCenter, drive)
      : time < 0.55
        ? lerp(xCenter, xPark, decel)
        : xPark;

  // Speed lines visible while moving, fade during deceleration.
  const speedVisible = time >= 0.075 && time <= 0.55;
  const speedFade = time < 0.45 ? 1 : lerp(1, 0, easeOut(range(time, 0.45, 0.55)));

  // Wheel rotation: faster during drive, slower during decel, then stops.
  const rotDrive = -360 * 3.2 * range(time, 0.075, 0.45);
  const rotDecel = -360 * 0.8 * range(time, 0.45, 0.55);
  const wheelRot = time < 0.45 ? rotDrive : time < 0.55 ? rotDrive + rotDecel : rotDrive + rotDecel;

  // Road scroll: dash offset moves while truck moves.
  const roadScroll = -220 * range(time, 0.075, 0.55);

  // Brake rock squash.
  const brakeP = range(time, 0.55, 0.625);
  const squashX = brakeP > 0 ? 1 - 0.04 * Math.sin(Math.PI * brakeP) : 1;

  // Lights flash twice between 2.5-2.8s => 0.625-0.7
  const flashP = range(time, 0.625, 0.7);
  const flashWave = flashP > 0 ? Math.abs(Math.sin(flashP * Math.PI * 4)) : 0;
  const lightOpacity = flashP > 0 ? lerp(1, 0.2, flashWave) : 1;

  // Door opens slightly 2.8-3.3s => 0.7-0.825
  const doorP = easeOut(range(time, 0.7, 0.825));
  const doorRot = lerp(0, -10, doorP);
  const doorShift = lerp(0, 2, doorP);

  // Exhaust puff at ~3.3s, once.
  const puffP = range(time, 0.825, 0.95);
  const puffOpacity = puffP > 0 ? lerp(0.0, 0.35, easeOut(Math.min(1, puffP / 0.3))) * (1 - puffP) : 0;
  const puffR = puffP > 0 ? lerp(2, 10, easeOut(puffP)) : 0;
  const puffX = puffP > 0 ? lerp(0, -10, easeOut(puffP)) : 0;
  const puffY = puffP > 0 ? lerp(0, -6, easeOut(puffP)) : 0;

  const opacity = time < 0.025 ? 0 : time < 0.075 ? easeOut(fadeIn) : 1;

  // Truck dimensions in 160x90:
  const truckW = 58;
  const truckH = 22;
  const truckY = 56;
  const left = xPos - truckW / 2;
  const top = truckY - truckH / 2;

  const wheelFront = {x: left + 45, y: top + 19};
  const wheelRear = {x: left + 14, y: top + 19};

  return (
    <g>
      {/* Road line */}
      <line
        x1={0}
        y1={74}
        x2={160}
        y2={74}
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeDasharray="10 10"
        strokeDashoffset={roadScroll}
        opacity={0.9}
      />

      {/* Truck group */}
      <g
        opacity={opacity}
        transform={`translate(${xPos} ${truckY}) scale(${squashX} 1) translate(${-xPos} ${-truckY})`}
      >
        {/* Shadow */}
        <ellipse
          cx={xPos + 2}
          cy={truckY + 14}
          rx={30}
          ry={5.5}
          fill="#1D4ED8"
          opacity={0.08}
        />

        {/* Speed lines */}
        {speedVisible ? (
          <g opacity={0.9 * speedFade}>
            {[0, 1, 2].map((i) => {
              const y = top + 6 + i * 5;
              const len = 16 + i * 6;
              const start = left - (10 + i * 8);
              const end = start - len - 10 * (time < 0.45 ? drive : 1);
              return (
                <line
                  key={i}
                  x1={start}
                  y1={y}
                  x2={end}
                  y2={y}
                  stroke="#93C5FD"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  opacity={0.9 - i * 0.18}
                />
              );
            })}
          </g>
        ) : null}

        {/* Cargo box */}
        <rect
          x={left + 10}
          y={top + 4}
          width={34}
          height={14}
          rx={2}
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="2"
        />

        {/* Company panel */}
        <rect
          x={left + 16}
          y={top + 7}
          width={18}
          height={6}
          rx={1.2}
          fill="#1D4ED8"
          opacity={0.95}
        />
        <text
          x={left + 25}
          y={top + 12}
          textAnchor="middle"
          fontSize="4"
          fontWeight="700"
          fill="#FFFFFF"
          style={{fontFamily: "Arial, sans-serif"}}
        >
          EXPRESS
        </text>

        {/* Cargo door (right edge swings a bit) */}
        <rect
          x={left + 42}
          y={top + 5}
          width={2}
          height={12}
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="2"
          transform={`translate(${left + 44} ${top + 11}) rotate(${doorRot}) translate(${-(left + 44)} ${-(top + 11)}) translate(${doorShift} 0)`}
          opacity={stopHold ? 1 : 0}
        />

        {/* Cab */}
        <path
          d={`M${left + 44} ${top + 18}H${left + 56}V${top + 10}c0-2-1-4-3-4h-5l-4 4h-0Z`}
          fill="#1D4ED8"
          stroke="#1E40AF"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Windshield */}
        <path
          d={`M${left + 47} ${top + 10}h5c1 0 2 1 2 2v3h-9v-3c0-1 1-2 2-2Z`}
          fill="#BAE6FD"
          opacity={0.95}
        />
        {/* Door window */}
        <rect x={left + 46} y={top + 14} width={7} height={4} rx={1} fill="#BAE6FD" opacity={0.85} />
        {/* Side mirror */}
        <circle cx={left + 55.5} cy={top + 13} r={1.2} fill="#1E40AF" />

        {/* Bumper */}
        <rect x={left + 54} y={top + 18} width={4} height={3} rx={1} fill="#1E40AF" opacity={0.9} />

        {/* Grille */}
        <rect x={left + 50} y={top + 19} width={4} height={2} rx={0.6} fill="#1E40AF" opacity={0.9} />

        {/* Lights (front + rear) */}
        <circle cx={left + 56} cy={top + 20} r={1.6} fill="#FBBF24" opacity={lightOpacity} />
        <circle cx={left + 12} cy={top + 20} r={1.4} fill="#FBBF24" opacity={lightOpacity} />

        {/* Wheels */}
        {[wheelRear, wheelFront].map((w, idx) => (
          <g key={idx} transform={`translate(${w.x} ${w.y}) rotate(${wheelRot}) translate(${-w.x} ${-w.y})`}>
            <circle cx={w.x} cy={w.y} r={4.4} fill="#1E293B" />
            <circle cx={w.x} cy={w.y} r={2.2} fill="#94A3B8" />
            <path
              d={`M${w.x - 2.2} ${w.y}H${w.x + 2.2}`}
              stroke="#64748B"
              strokeWidth="1"
              strokeLinecap="round"
              opacity={0.8}
            />
          </g>
        ))}

        {/* Exhaust pipe */}
        <path
          d={`M${left + 44} ${top + 20}h-4v-3`}
          stroke="#1E40AF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.9}
        />

        {/* Exhaust puff */}
        {puffP > 0 ? (
          <circle
            cx={left + 38 + puffX}
            cy={top + 18 + puffY}
            r={puffR}
            fill="#FFFFFF"
            opacity={puffOpacity}
          />
        ) : null}
      </g>
    </g>
  );
};

