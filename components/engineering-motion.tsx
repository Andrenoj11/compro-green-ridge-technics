"use client";

import { useMotionPreference } from "./motion-preference";

import { useEffect, useRef } from "react";
import { inView } from "motion";
import { animate, createScope, createTimeline, stagger, svg } from "animejs";

// Anime.js owns these decorative SVGs; Motion owns their enclosing UI.
export function useEngineeringMotion() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  useEffect(() => {
    if (!root.current || reduced !== false) return;
    const scope = createScope({ root });
    const stop = inView(root.current, () => {
      scope.add(() => {
        const lines = svg.createDrawable(".engineering-line");
        const timeline = createTimeline({ defaults: { ease: "inOut(3)" } });
        if (lines.length) timeline.add(lines, { draw: ["0 0", "0 1"], duration: 1500, delay: stagger(120) });
        timeline.add(".engineering-node", { opacity: [.3, 1], scale: [.65, 1], duration: 650, delay: stagger(110) }, "-=700");
        animate(".engineering-signal", { opacity: [.3, 1, .5], duration: 2400, delay: stagger(180), alternate: true, loop: 2 });
      });
    }, { amount: .2 });
    return () => { stop(); scope.revert(); };
  }, [reduced]);
  return root;
}

export function EngineeringAccent({ variant = "system" }: { variant?: "system" | "documents" | "measurement" }) {
  const root = useEngineeringMotion();
  return <div ref={root} className={`engineering-accent engineering-accent-${variant}`} aria-hidden="true">
    <svg viewBox="0 0 260 90" fill="none">
      <path className="engineering-grid" d="M0 22H260M0 45H260M0 68H260M32 0V90M65 0V90M98 0V90M130 0V90M162 0V90M195 0V90M228 0V90" />
      {variant === "documents" ? <>
        <path className="engineering-line" d="M20 45H65M95 45H130M160 45H205M65 22H95V68H65ZM130 22H160V68H130ZM205 22H235V68H205Z" />
        <path className="engineering-line engineering-signal" d="M71 44L78 51L89 36M136 44L143 51L154 36M211 44L218 51L229 36" />
      </> : variant === "measurement" ? <>
        <path className="engineering-line" d="M15 68H245M35 64V48M65 64V54M95 64V48M125 64V54M155 64V48M185 64V54M215 64V48" />
        <path className="engineering-line engineering-signal" d="M15 40L50 40L70 15L95 53L120 27L145 40H180L200 18L220 40H245" />
      </> : <>
        <path className="engineering-line" d="M15 65L65 35L115 65L165 35L215 65L245 48M65 35V14H165V35M115 65V83H215V65" />
        <path className="engineering-line engineering-signal" d="M15 65L65 35L115 65L165 35L215 65" />
      </>}
      <circle className="engineering-node" cx="20" cy="45" r="3" /><circle className="engineering-node" cx="245" cy="48" r="3" />
    </svg>
  </div>;
}
