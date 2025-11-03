"use client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scaleIn" | "rotateIn";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedSection({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  className = "",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });

  const getAnimationClass = () => {
    const baseClass = "transition-all";
    const durationClass = `duration-[${duration}ms]`;
    const delayClass = delay > 0 ? `delay-[${delay}ms]` : "";

    if (!isVisible) {
      switch (animation) {
        case "fadeIn":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0`;
        case "slideUp":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 translate-y-10`;
        case "slideLeft":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 translate-x-10`;
        case "slideRight":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 -translate-x-10`;
        case "scaleIn":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 scale-95`;
        case "rotateIn":
          return `${baseClass} ${durationClass} ${delayClass} opacity-0 -rotate-3 scale-95`;
        default:
          return `${baseClass} ${durationClass} ${delayClass} opacity-0`;
      }
    }

    return `${baseClass} ${durationClass} ${delayClass} opacity-100`;
  };

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
}

// Composant pour animer un nombre avec CountUp
export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5, triggerOnce: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(value * easeOutQuad(progress));

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// Hook pour useState (besoin d'importer)
import { useEffect, useState } from "react";
