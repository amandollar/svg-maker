import type {CSSProperties} from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {getAnimatedState} from "../engine/animation-player";
import type {AnimatedElement, AnimationSpec} from "../engine/types";
import {Arrow} from "../components/shapes/Arrow";
import {BarChart} from "../components/shapes/BarChart";
import {Bell} from "../components/shapes/Bell";
import {BatteryIcon} from "../components/shapes/BatteryIcon";
import {AvatarIcon} from "../components/shapes/AvatarIcon";
import {CalendarIcon} from "../components/shapes/CalendarIcon";
import {Burger} from "../components/shapes/Burger";
import {Camera} from "../components/shapes/Camera";
import {Cart} from "../components/shapes/Cart";
import {Checkmark} from "../components/shapes/Checkmark";
import {CoffeeCup} from "../components/shapes/CoffeeCup";
import {DoctorScene} from "../components/shapes/DoctorScene";
import {DownloadIcon} from "../components/shapes/DownloadIcon";
import {DeliveryTruck} from "../components/shapes/DeliveryTruck";
import {GearIcon} from "../components/shapes/GearIcon";
import {GlobeNetworkScene} from "../components/shapes/GlobeNetworkScene";
import {Heart} from "../components/shapes/Heart";
import {SolarPanelScene} from "../components/shapes/SolarPanelScene";
import {Headphones} from "../components/shapes/Headphones";
import {HomeIcon} from "../components/shapes/HomeIcon";
import {Laptop} from "../components/shapes/Laptop";
import {Lock} from "../components/shapes/Lock";
import {Microphone} from "../components/shapes/Microphone";
import {PersonAtDeskScene} from "../components/shapes/PersonAtDeskScene";
import {PaperPlane} from "../components/shapes/PaperPlane";
import {PlantGrowing} from "../components/shapes/PlantGrowing";
import {PieChart} from "../components/shapes/PieChart";
import {Pin} from "../components/shapes/Pin";
import {PlayButton} from "../components/shapes/PlayButton";
import {RupeeBadge} from "../components/shapes/RupeeBadge";
import {NotificationStackScene} from "../components/shapes/NotificationStackScene";
import {RocketLaunch} from "../components/shapes/RocketLaunch";
import {SearchIcon} from "../components/shapes/SearchIcon";
import {Smartphone} from "../components/shapes/Smartphone";
import {Star} from "../components/shapes/Star";
import {TrendUp} from "../components/shapes/TrendUp";
import {Trophy} from "../components/shapes/Trophy";
import {Wallet} from "../components/shapes/Wallet";
import {Wifi} from "../components/shapes/Wifi";
import {CertificateScrollScene} from "../components/shapes/CertificateScrollScene";

const getElementLayerRank = (element: AnimatedElement) => {
  const layer = element.layer;

  const inferredLayer =
    element.type === "spark"
      ? "foreground"
      : element.type === "ring" ||
          element.type === "glow" ||
          element.type === "shadow"
        ? "background"
        : "main";

  const effectiveLayer = layer ?? inferredLayer;

  if (effectiveLayer === "background") {
    return 0;
  }

  if (effectiveLayer === "foreground") {
    return 2;
  }

  return 1;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const renderShape = (element: AnimatedElement, drawProgress: number) => {
  switch (element.type) {
    case "heart":
      return <Heart fill={element.fill} />;
    case "checkmark":
      return (
        <Checkmark
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "bell":
      return (
        <Bell
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "arrow":
      return (
        <Arrow
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "star":
      return <Star fill={element.fill} />;
    case "pin":
      return (
        <Pin
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
        />
      );
    case "barchart":
      return (
        <BarChart
          stroke={element.stroke}
          strokeWidth={Math.max(3, element.strokeWidth ?? 4)}
          fill={element.fill ?? "#3B82F6"}
          drawProgress={drawProgress}
        />
      );
    case "trend":
      return (
        <TrendUp
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "wallet":
      return (
        <Wallet
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "trophy":
      return (
        <Trophy
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          fill={element.fill}
          drawProgress={drawProgress}
        />
      );
    case "pie":
      return (
        <PieChart
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          fill={element.fill ?? "#3B82F6"}
          drawProgress={drawProgress}
        />
      );
    case "phone":
      return (
        <Smartphone
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "headphones":
      return (
        <Headphones
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "laptop":
      return (
        <Laptop
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "camera":
      return (
        <Camera
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "burger":
      return <Burger drawProgress={drawProgress} />;
    case "rocket":
      return <RocketLaunch t={drawProgress} />;
    case "plant":
      return <PlantGrowing t={drawProgress} />;
    case "truck":
      return <DeliveryTruck t={drawProgress} />;
    case "doctor":
      return <DoctorScene t={drawProgress} />;
    case "solar":
      return <SolarPanelScene t={drawProgress} />;
    case "notifstack":
      return <NotificationStackScene t={drawProgress} />;
    case "globe":
      return <GlobeNetworkScene t={drawProgress} />;
    case "desk":
      return <PersonAtDeskScene t={drawProgress} />;
    case "rupee":
      return <RupeeBadge t={drawProgress} />;
    case "certificate":
      return <CertificateScrollScene t={drawProgress} />;
    case "coffee":
      return (
        <CoffeeCup
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "home":
      return (
        <HomeIcon
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "battery":
      return (
        <BatteryIcon
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          fill={element.fill}
          drawProgress={drawProgress}
        />
      );
    case "avatar":
      return (
        <AvatarIcon
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "gear":
      return (
        <GearIcon
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "plane":
      return (
        <PaperPlane
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "mic":
      return (
        <Microphone
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "download":
      return (
        <DownloadIcon
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "calendar":
      return (
        <CalendarIcon
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "play":
      return (
        <PlayButton
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          fill={element.fill ?? element.stroke}
          drawProgress={drawProgress}
        />
      );
    case "wifi":
      return (
        <Wifi
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "lock":
      return (
        <Lock
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "cart":
      return (
        <Cart
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "search":
      return (
        <SearchIcon
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          drawProgress={drawProgress}
        />
      );
    case "ring":
      return (() => {
        const p = clamp01(drawProgress);
        const r = 34;
        const len = 2 * Math.PI * r;
        return (
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke={element.stroke ?? "#FFFFFF"}
          strokeWidth={element.strokeWidth ?? 3}
          opacity={element.opacity ?? 1}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - p)}
        />
        );
      })();
    case "glow":
      return (
        <circle
          cx="50"
          cy="50"
          r="32"
          fill={element.fill ?? "#FFFFFF"}
          opacity={element.opacity ?? 0.22}
        />
      );
    case "spark":
      return (
        <>
          <path
            d="M50 18V34"
            stroke={element.stroke ?? "#FFFFFF"}
            strokeWidth={element.strokeWidth ?? 4}
            strokeLinecap="round"
          />
          <path
            d="M50 66V82"
            stroke={element.stroke ?? "#FFFFFF"}
            strokeWidth={element.strokeWidth ?? 4}
            strokeLinecap="round"
          />
          <path
            d="M18 50H34"
            stroke={element.stroke ?? "#FFFFFF"}
            strokeWidth={element.strokeWidth ?? 4}
            strokeLinecap="round"
          />
          <path
            d="M66 50H82"
            stroke={element.stroke ?? "#FFFFFF"}
            strokeWidth={element.strokeWidth ?? 4}
            strokeLinecap="round"
          />
        </>
      );
    case "shadow":
      return (
        <ellipse
          cx="50"
          cy="50"
          rx="28"
          ry="10"
          fill={element.fill ?? "#000000"}
          opacity={element.opacity ?? 0.18}
        />
      );
    case "steam":
      return (() => {
        const p = clamp01(drawProgress);
        const len = 90;
        return (
          <path
            d="M50 86c-10-10-10-24 0-34s10-24 0-34"
            fill="none"
            stroke={element.stroke ?? "#D4D4D8"}
            strokeWidth={element.strokeWidth ?? 4}
            strokeLinecap="round"
            opacity={element.opacity ?? 0.6}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
          />
        );
      })();
    default:
      return null;
  }
};

const getVisualEffectStyle = (element: AnimatedElement): CSSProperties => {
  const filters: string[] = [];

  if (element.glowColor && element.glowStrength) {
    const blur = Math.max(8, 24 * element.glowStrength);
    filters.push(`drop-shadow(0 0 ${blur}px ${element.glowColor})`);
  }

  if (element.shadowColor && element.shadowBlur) {
    filters.push(`drop-shadow(0 ${Math.max(4, element.shadowBlur / 4)}px ${element.shadowBlur}px ${element.shadowColor}55)`);
  }

  return filters.length > 0 ? {filter: filters.join(" ")} : {};
};

const getTransformStyle = (
  element: AnimatedElement,
  state: ReturnType<typeof getAnimatedState>,
): CSSProperties => {
  const offsetX = element.offsetX ?? 0;
  const offsetY = element.offsetY ?? 0;

  return {
    position: "absolute",
    left: element.x + offsetX,
    top: element.y + offsetY,
    width: element.width,
    height: element.height,
    transformOrigin: "center center",
    transform: `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale}) rotate(${state.rotate}deg)`,
    opacity: state.opacity,
    ...getVisualEffectStyle(element),
  };
};

const renderEffectLayer = (
  element: AnimatedElement,
  state: ReturnType<typeof getAnimatedState>,
  frame: number,
  fps: number,
) => {
  if (element.flash && element.type === "checkmark" && state.scale > 1.01) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "999px",
          background: `${element.stroke ?? "#22C55E"}22`,
          transform: `scale(${state.scale * 1.15})`,
          opacity: Math.min(0.58, (state.scale - 1) * 4.2),
        }}
      />
    );
  }

  if (element.ripple && element.type === "pin") {
    return null;
  }

  return null;
};

const renderTrailLayer = (
  element: AnimatedElement,
  state: ReturnType<typeof getAnimatedState>,
) => {
  if (!element.trail) {
    return null;
  }

  if (Math.abs(state.rotate) < 4) {
    return null;
  }

  return (
    <>
      {[1, 2].map((index) => (
        <div
          key={`${element.id}-trail-${index}`}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12 / index,
            transform: `translate(${index * -3}px, 0px) rotate(${state.rotate * (1 - index * 0.18)}deg)`,
            transformOrigin: "center center",
          }}
        >
          <svg width={element.width} height={element.height} viewBox="0 0 100 100" fill="none">
            {renderShape(element, 1)}
          </svg>
        </div>
      ))}
    </>
  );
};

export const SvgRenderer = ({spec}: {spec: AnimationSpec}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const viewBoxWidth = (element: AnimatedElement) => element.viewBoxWidth ?? 100;
  const viewBoxHeight = (element: AnimatedElement) => element.viewBoxHeight ?? 100;
  const sortedElements = spec.elements
    .map((element, index) => ({element, index}))
    .sort((a, b) => {
      const layerDiff = getElementLayerRank(a.element) - getElementLayerRank(b.element);
      return layerDiff !== 0 ? layerDiff : a.index - b.index;
    })
    .map(({element}) => element);

  return (
    <AbsoluteFill style={{backgroundColor: spec.canvas.background}}>
      <svg
        width={spec.canvas.width}
        height={spec.canvas.height}
        viewBox={`0 0 ${spec.canvas.width} ${spec.canvas.height}`}
      >
        {sortedElements.map((element) => {
          const state = getAnimatedState(element, frame, fps);
          return (
          <foreignObject
            key={element.id}
            x={0}
            y={0}
            width={spec.canvas.width}
            height={spec.canvas.height}
          >
            <div style={getTransformStyle(element, state)}>
              {renderEffectLayer(element, state, frame, fps)}
              {renderTrailLayer(element, state)}
              <svg
                width={element.width}
                height={element.height}
                viewBox={`0 0 ${viewBoxWidth(element)} ${viewBoxHeight(element)}`}
                fill="none"
              >
                {renderShape(element, state.draw)}
              </svg>
            </div>
          </foreignObject>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
