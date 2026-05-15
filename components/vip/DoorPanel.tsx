"use client";

import { motion } from "framer-motion";
import DoorHardware from "./DoorHardware";

/**
 * Panneau de porte en bois avec moulures, grain et hardware (poignee +
 * charnieres). Anime via Framer Motion : shake quand un code est rejete.
 * La rotation des battants (rotateY 85deg lors de l'ouverture) reste sur
 * le conteneur appelant.
 *
 * @author Lalou
 */

const SHAKE_KEYFRAMES = [0, -4, 4, -3, 3, -1, 1, 0];
const SHAKE_DURATION_S = 0.5;

interface DoorPanelProps {
  side: "left" | "right";
  shake: boolean;
}

const woodBackground = (side: "left" | "right") =>
  side === "left"
    ? "linear-gradient(165deg, #b08450 0%, #9a7040 25%, #8a6235 50%, #7d5830 75%, #6e4d28 100%)"
    : "linear-gradient(195deg, #b08450 0%, #9a7040 25%, #8a6235 50%, #7d5830 75%, #6e4d28 100%)";

const woodGrainImage = (side: "left" | "right") => `
  repeating-linear-gradient(
    ${side === "left" ? "178deg" : "182deg"},
    transparent,
    transparent 5px,
    rgba(90,55,25,0.12) 5px,
    rgba(90,55,25,0.12) 6px,
    transparent 6px,
    transparent 17px,
    rgba(70,42,18,0.08) 17px,
    rgba(70,42,18,0.08) 18px
  ),
  repeating-linear-gradient(
    ${side === "left" ? "176deg" : "184deg"},
    transparent,
    transparent 29px,
    rgba(110,70,30,0.06) 29px,
    rgba(110,70,30,0.06) 30px,
    transparent 30px,
    transparent 47px,
    rgba(80,50,20,0.04) 47px,
    rgba(80,50,20,0.04) 48px
  )
`;

const lightReflection = (side: "left" | "right") =>
  side === "left"
    ? "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.04) 100%)"
    : "linear-gradient(60deg, rgba(0,0,0,0.04) 0%, transparent 60%, rgba(255,255,255,0.06) 100%)";

const interiorShadow = (side: "left" | "right") =>
  side === "left"
    ? "inset -4px 0 12px rgba(0,0,0,0.15), inset 0 4px 8px rgba(0,0,0,0.05), inset 0 -4px 8px rgba(0,0,0,0.05)"
    : "inset 4px 0 12px rgba(0,0,0,0.15), inset 0 4px 8px rgba(0,0,0,0.05), inset 0 -4px 8px rgba(0,0,0,0.05)";

function WoodKnots({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <>
      <div
        className="absolute hidden sm:block"
        style={{
          top: isLeft ? "22%" : "65%",
          left: isLeft ? "35%" : "55%",
          width: "30px",
          height: "18px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(70,40,15,0.15) 0%, rgba(90,55,25,0.08) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute hidden sm:block"
        style={{
          top: isLeft ? "72%" : "28%",
          left: isLeft ? "60%" : "30%",
          width: "22px",
          height: "14px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(70,40,15,0.1) 0%, rgba(90,55,25,0.05) 50%, transparent 70%)",
        }}
      />
    </>
  );
}

function CenterMolding() {
  return (
    <div
      className="absolute"
      style={{ top: "8%", left: "12%", right: "12%", bottom: "8%" }}
    >
      <div
        className="absolute inset-0 rounded-[1px]"
        style={{
          border: "2px solid rgba(80,50,25,0.2)",
          boxShadow:
            "inset 2px 2px 4px rgba(0,0,0,0.1), inset -1px -1px 2px rgba(255,255,255,0.08), 1px 1px 3px rgba(0,0,0,0.06)",
        }}
      />
      <div
        className="absolute rounded-[1px]"
        style={{
          top: "6px",
          left: "6px",
          right: "6px",
          bottom: "6px",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.04) 100%)",
          boxShadow:
            "inset 1px 1px 3px rgba(0,0,0,0.06), inset -1px -1px 2px rgba(255,255,255,0.05)",
        }}
      />
      <div
        className="absolute left-[6px] right-[6px]"
        style={{
          top: "48%",
          height: "5px",
          background:
            "linear-gradient(180deg, rgba(80,50,25,0.15) 0%, rgba(60,38,18,0.2) 50%, rgba(80,50,25,0.15) 100%)",
          boxShadow:
            "0 1px 1px rgba(255,255,255,0.06), 0 -1px 1px rgba(0,0,0,0.06)",
        }}
      />
    </div>
  );
}

export default function DoorPanel({ side, shake }: DoorPanelProps) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={shake ? { x: SHAKE_KEYFRAMES } : { x: 0 }}
      transition={
        shake ? { duration: SHAKE_DURATION_S, ease: "easeInOut" } : {}
      }
    >
      <div className="absolute inset-0" style={{ background: woodBackground(side) }}>
        <div
          className="absolute inset-0"
          style={{ backgroundImage: woodGrainImage(side) }}
        />
        <WoodKnots side={side} />
        <div
          className="absolute inset-0"
          style={{ background: lightReflection(side) }}
        />
        <CenterMolding />
        <DoorHardware side={side} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: interiorShadow(side) }}
        />
      </div>
    </motion.div>
  );
}
