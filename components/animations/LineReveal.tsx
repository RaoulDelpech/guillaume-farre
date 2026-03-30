"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LineRevealProps {
  color?: string;
  width?: string;
  delay?: number;
  className?: string;
}

export default function LineReveal({
  color = "rgba(196,165,112,0.4)",
  width = "12rem",
  delay = 0,
  className = "",
}: LineRevealProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = lineRef.current;
    if (!element) return;

    // Respecter prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      gsap.set(element, { scaleX: 1 });
      return;
    }

    // Animation GSAP avec ScrollTrigger
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 1.2,
          delay,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, lineRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [delay]);

  return (
    <div
      ref={lineRef}
      className={className}
      style={{
        height: "1px",
        width,
        backgroundColor: color,
        transformOrigin: "center",
        transform: "scaleX(0)",
      }}
    />
  );
}
