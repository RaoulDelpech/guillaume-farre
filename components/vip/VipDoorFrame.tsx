"use client";

import { motion, AnimatePresence } from "framer-motion";
import DoorPanel from "./DoorPanel";

/**
 * Encadrement de porte d'atelier en pierre/bois sombre, avec les deux
 * battants qui pivotent vers l'exterieur quand `doorsOpen` passe a true,
 * une lumiere chaude qui filtre entre les battants pendant l'ouverture,
 * et un seuil de porte en bas. Largeur/hauteur fluides (clamp viewport).
 *
 * Le shake (rejet code) est passe aux DoorPanel via leur prop `shake`.
 *
 * @author Lalou
 */

const DOOR_OPEN_ROTATION_DEG = 85;
const DOOR_OPEN_DURATION_S = 2.5;
const DOOR_OPEN_DELAY_S = 0.3;

interface VipDoorFrameProps {
  doorsOpen: boolean;
  shake: boolean;
}

export default function VipDoorFrame({ doorsOpen, shake }: VipDoorFrameProps) {
  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      <div
        className="relative px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5 rounded-t-lg"
        style={{
          background:
            "linear-gradient(180deg, #3d3228 0%, #2e261f 50%, #251f19 100%)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.35), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-3 sm:h-4 rounded-t-lg"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        />
        <div
          className="relative overflow-hidden rounded-sm"
          style={{
            boxShadow:
              "inset 0 0 15px rgba(0,0,0,0.5), inset 0 0 3px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="relative flex"
            style={{
              width: "min(80vw, 520px)",
              height: "min(65vh, 580px)",
            }}
          >
            <motion.div
              className="relative w-1/2 h-full origin-left"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: doorsOpen ? -DOOR_OPEN_ROTATION_DEG : 0 }}
              transition={{
                duration: DOOR_OPEN_DURATION_S,
                ease: [0.25, 0.1, 0.25, 1],
                delay: doorsOpen ? DOOR_OPEN_DELAY_S : 0,
              }}
            >
              <DoorPanel side="left" shake={shake} />
            </motion.div>
            <motion.div
              className="relative w-1/2 h-full origin-right"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: doorsOpen ? DOOR_OPEN_ROTATION_DEG : 0 }}
              transition={{
                duration: DOOR_OPEN_DURATION_S,
                ease: [0.25, 0.1, 0.25, 1],
                delay: doorsOpen ? DOOR_OPEN_DELAY_S : 0,
              }}
            >
              <DoorPanel side="right" shake={shake} />
            </motion.div>
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(60,45,30,0.6) 0%, rgba(40,30,20,0.8) 50%, rgba(60,45,30,0.6) 100%)",
              }}
              animate={{ opacity: doorsOpen ? 0 : 1 }}
              transition={{ duration: 1 }}
            />
            <AnimatePresence>
              {doorsOpen && (
                <motion.div
                  className="absolute inset-0 z-[5]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255,215,130,0.7) 0%, rgba(255,195,100,0.3) 40%, transparent 65%)",
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-4 sm:h-5"
          style={{
            background:
              "linear-gradient(180deg, #2e261f 0%, #3d3228 60%, #4a3d32 100%)",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        />
      </div>
    </div>
  );
}
