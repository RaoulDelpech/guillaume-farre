import Image from "next/image";
import type { Toile } from "./types";

interface TimelineNavProps {
  toiles: Toile[];
  activeIdx: number;
  onSelect: (i: number) => void;
}

/**
 * Timeline nav — courbe subtile (parabole douce).
 * Adapte pour fond ivoire clair.
 */
export default function TimelineNav({ toiles, activeIdx, onSelect }: TimelineNavProps) {
  return (
    <nav
      className="fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-start gap-px"
      aria-label="Navigation tableaux"
    >
      {toiles.map((toile, i) => {
        const isActive = i === activeIdx;
        const distance = Math.abs(i - activeIdx);
        const arcX = Math.sqrt(distance) * 0.5;
        const opacity = Math.max(0.25, 1 - distance * 0.08);

        return (
          <button
            key={toile.id}
            onClick={() => onSelect(i)}
            className="flex items-center gap-2.5 cursor-pointer"
            style={{
              height: 24,
              transform: `translateX(${Math.round(arcX)}px)`,
              opacity,
              transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease',
            }}
            aria-label={toile.name}
          >
            {toile.image ? (
              <div
                className="rounded-sm overflow-hidden flex-shrink-0"
                style={{
                  width: isActive ? 44 : distance <= 2 ? 22 : 10,
                  height: isActive ? 44 : distance <= 2 ? 22 : 10,
                  borderRadius: distance > 3 ? '50%' : 2,
                  transition: 'width 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 0.5s ease',
                  boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                <Image
                  src={toile.image}
                  alt={toile.name}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <span
                className="rounded-full flex-shrink-0"
                style={{
                  width: isActive ? 8 : 5,
                  height: isActive ? 8 : 5,
                  background: isActive ? '#8c6e32' : 'rgba(0,0,0,0.15)',
                  transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
              />
            )}

            {isActive && (
              <span
                className="block whitespace-nowrap overflow-hidden text-ellipsis"
                style={{
                  fontSize: 11,
                  color: '#8c6e32',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  maxWidth: 110,
                }}
              >
                {toile.name}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
