"use client";

import { useState, useEffect, type ReactNode } from "react";

interface GarageShutterProps {
  children: ReactNode;
  /** Duree de l'animation d'ouverture en ms */
  duration?: number;
  /** Delai avant le debut de l'animation en ms */
  delay?: number;
}

const SLAT_HEIGHT = 28;

export default function GarageShutter({
  children,
  duration = 3500,
  delay = 800,
}: GarageShutterProps) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");

  useEffect(() => {
    if (phase !== "open") {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    const delayTimer = setTimeout(() => setPhase("opening"), delay);
    const openTimer = setTimeout(
      () => setPhase("open"),
      delay + duration + 200
    );

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(openTimer);
    };
  }, [delay, duration]);

  if (phase === "open") return <>{children}</>;

  return (
    <>
      {children}

      <div className="fixed inset-0 z-[9999]" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform:
              phase === "opening" ? "translateY(-100%)" : "translateY(0)",
            transitionProperty: "transform",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: phase === "closed" ? "transform" : undefined,
          }}
        >
          {/* Lamelles metalliques — degrade repete */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  to bottom,
                  #2e2e2e 0px,
                  #3a3a3a 1px,
                  #333333 3px,
                  #2a2a2a ${SLAT_HEIGHT * 0.4}px,
                  #232323 ${SLAT_HEIGHT * 0.7}px,
                  #1c1c1c ${SLAT_HEIGHT - 3}px,
                  #141414 ${SLAT_HEIGHT - 1}px,
                  #0f0f0f ${SLAT_HEIGHT}px
                )
              `,
            }}
          />

          {/* Reflet metallique — bande de lumiere en haut de chaque lamelle */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0.08) 0px,
                  rgba(255, 255, 255, 0.04) 2px,
                  rgba(255, 255, 255, 0.01) ${Math.round(SLAT_HEIGHT * 0.35)}px,
                  transparent ${Math.round(SLAT_HEIGHT * 0.5)}px,
                  transparent ${SLAT_HEIGHT - 3}px,
                  rgba(0, 0, 0, 0.12) ${SLAT_HEIGHT - 1}px,
                  rgba(0, 0, 0, 0.2) ${SLAT_HEIGHT}px
                )
              `,
            }}
          />

          {/* Texture metal brosse — lignes verticales tres subtiles */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 1px,
                  rgba(255, 255, 255, 0.5) 1px,
                  rgba(255, 255, 255, 0.5) 2px
                )
              `,
            }}
          />

          {/* Rail gauche */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: "28px",
              background:
                "linear-gradient(to right, #161616 0%, #1e1e1e 40%, #252525 75%, transparent 100%)",
              borderRight: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          />

          {/* Rail droit */}
          <div
            className="absolute top-0 right-0 h-full"
            style={{
              width: "28px",
              background:
                "linear-gradient(to left, #161616 0%, #1e1e1e 40%, #252525 75%, transparent 100%)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          />

          {/* Barre de poignee en bas */}
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
            style={{
              height: "36px",
              background: "linear-gradient(to bottom, #363636, #282828)",
              borderTop: "1px solid rgba(255, 255, 255, 0.06)",
              boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "5px",
                borderRadius: "2.5px",
                background: "linear-gradient(to bottom, #555, #484848)",
                boxShadow:
                  "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
