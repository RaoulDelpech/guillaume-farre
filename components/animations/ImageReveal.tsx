"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImageRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ImageReveal({
  children,
  delay = 0,
  className = "",
}: ImageRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const image = imageRef.current;
    if (!wrapper || !image) return;

    // Respecter prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      gsap.set(wrapper, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(image, { scale: 1 });
      return;
    }

    // Animation GSAP avec ScrollTrigger
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Reveal par clip-path
      tl.fromTo(
        wrapper,
        {
          clipPath: "inset(50% 50% 50% 50%)",
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          delay,
          ease: "power4.inOut",
        }
      );

      // Zoom out subtil simultané sur l'image
      tl.fromTo(
        image,
        {
          scale: 1.15,
        },
        {
          scale: 1,
          duration: 1.4,
          ease: "power4.inOut",
        },
        0 // Démarre en même temps que le clip-path
      );
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === wrapper) {
          trigger.kill();
        }
      });
    };
  }, [delay]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        overflow: "hidden",
        clipPath: "inset(50% 50% 50% 50%)",
      }}
    >
      <div ref={imageRef} style={{ transform: "scale(1.15)" }}>
        {children}
      </div>
    </div>
  );
}
