"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  tag?: "h1" | "h2" | "p";
  delay?: number;
  className?: string;
}

export default function TextReveal({
  children,
  tag = "h1",
  delay = 0,
  className = "",
}: TextRevealProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Respecter prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      element.style.opacity = "1";
      return;
    }

    const letters = element.querySelectorAll(".letter");

    // Animation GSAP avec stagger
    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          stagger: 0.03, // 30ms entre chaque lettre
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, elementRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [delay]);

  // Split text en lettres individuelles
  const splitText = children.split("").map((char, index) => {
    if (char === " ") {
      return (
        <span key={index} className="letter" style={{ display: "inline-block" }}>
          &nbsp;
        </span>
      );
    }
    return (
      <span key={index} className="letter" style={{ display: "inline-block" }}>
        {char}
      </span>
    );
  });

  const Tag = tag;

  return (
    <Tag ref={elementRef as any} className={className}>
      {splitText}
    </Tag>
  );
}
