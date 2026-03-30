"use client";

import { useCallback, useRef } from "react";

/**
 * Hook pour ajouter un effet ripple bronze au clic
 * Usage : const { containerRef, handleClick } = useRipple();
 * <div ref={containerRef} onClick={handleClick} className="relative overflow-hidden">
 *
 * @author Lalou
 */
export function useRipple() {
  const containerRef = useRef<HTMLElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    container.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }, []);

  return { containerRef, handleClick };
}

/**
 * Fonction standalone pour ajouter effet ripple sans ref
 * Utile pour boutons multiples dans une boucle
 * Usage : <button onClick={(e) => addRipple(e)} className="relative overflow-hidden">
 *
 * @author Lalou
 */
export function addRipple(e: React.MouseEvent<HTMLElement>) {
  const container = e.currentTarget;
  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple-effect";
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  container.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}
