/**
 * Hardware d'une porte d'atelier : poignee en laiton + charnieres.
 * Rendu purement visuel (pas d'animation). Reutilise par `DoorPanel`.
 *
 * @author Lalou
 */

const HINGE_POSITIONS_PERCENT = [15, 50, 85] as const;

interface DoorHardwareProps {
  side: "left" | "right";
}

function HandleScrew({ topPercent }: { topPercent: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${topPercent}%`,
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "4px",
        height: "4px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #7a6528 0%, #6a5822 100%)",
        boxShadow:
          "inset 0 0.5px 1px rgba(0,0,0,0.3), 0 0.5px 0 rgba(255,220,150,0.15)",
      }}
    />
  );
}

function Hinge({ side, topPercent }: { side: "left" | "right"; topPercent: number }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute z-10"
      style={{
        top: `${topPercent}%`,
        [isLeft ? "left" : "right"]: "-1px",
        transform: "translateY(-50%)",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "clamp(24px, 3.5vw, 32px)",
          borderRadius: "1px",
          background:
            "linear-gradient(180deg, #c4a55a 0%, #a88d40 40%, #8c7535 100%)",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,220,150,0.25)",
          border: "1px solid rgba(140,110,50,0.4)",
          position: "relative",
        }}
      >
        <HandleScrew topPercent={25} />
        <HandleScrew topPercent={75} />
      </div>
    </div>
  );
}

function BrassHandle({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 z-10"
      style={{ [isLeft ? "right" : "left"]: "10%" }}
    >
      <div
        className="relative"
        style={{
          width: "clamp(32px, 5vw, 44px)",
          height: "clamp(32px, 5vw, 44px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, #d4b06a 0%, #b8943e 30%, #8c6e32 60%, #705828 100%)",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,220,150,0.3), inset 0 -1px 2px rgba(0,0,0,0.15)",
          border: "1px solid rgba(140,110,50,0.5)",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-[1px]">
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #3a2a15 0%, #2a1d0f 100%)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
            }}
          />
          <div
            style={{
              width: "3px",
              height: "6px",
              borderRadius: "0 0 1px 1px",
              background: "linear-gradient(180deg, #3a2a15 0%, #2a1d0f 100%)",
              boxShadow: "inset 0 1px 1px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function DoorHardware({ side }: DoorHardwareProps) {
  return (
    <>
      <BrassHandle side={side} />
      {HINGE_POSITIONS_PERCENT.map((top) => (
        <Hinge key={top} side={side} topPercent={top} />
      ))}
    </>
  );
}
