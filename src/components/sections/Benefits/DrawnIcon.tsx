import { motion } from "framer-motion";
import type { BenefitIconName } from "@/data/benefitsData";
import { iconDraw } from "@/config/animations.config";

/**
 * Íconos de los beneficios que se dibujan con un trazo al entrar la tarjeta (BR-064).
 *
 * Grilla de 24 × 24 y trazo como lucide, para que convivan con el resto del sitio. La tijera y la persona vienen de
 * lucide (licencia ISC); la silla de barbero y la estrella son propias, porque lucide no las tiene. Cada trazo es un
 * `motion.path`/`motion.circle`: hereda «hidden»/«visible» de la tarjeta y anima su `pathLength`.
 */
type Shape = { kind: "path"; d: string } | { kind: "circle"; cx: number; cy: number; r: number };

const ICONS: Record<BenefitIconName, Shape[]> = {
  scissors: [
    { kind: "circle", cx: 6, cy: 6, r: 3 },
    { kind: "path", d: "M8.12 8.12 12 12" },
    { kind: "path", d: "M20 4 8.12 15.88" },
    { kind: "circle", cx: 6, cy: 18, r: 3 },
    { kind: "path", d: "M14.8 14.8 20 20" },
  ],
  barberChair: [
    { kind: "path", d: "M10 2h4" },
    { kind: "path", d: "M9 4h6a1 1 0 0 1 1 1v6H8V5a1 1 0 0 1 1-1z" },
    { kind: "path", d: "M5 9v4h14V9" },
    { kind: "path", d: "M12 13v6" },
    { kind: "path", d: "M12 16H7.5v1.5" },
    { kind: "path", d: "M7.5 21h9" },
  ],
  userStar: [
    { kind: "path", d: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" },
    { kind: "circle", cx: 10, cy: 7, r: 4 },
    { kind: "path", d: "M19.5 9l.9 2 2.1.9-2.1.9-.9 2-.9-2-2.1-.9 2.1-.9z" },
  ],
};

export function DrawnIcon({ name, animate }: { name: BenefitIconName; animate: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name].map((shape, index) => {
        const motionProps = animate ? { variants: iconDraw } : {};
        return shape.kind === "path" ? (
          <motion.path key={index} d={shape.d} {...motionProps} data-stroke />
        ) : (
          <motion.circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} {...motionProps} data-stroke />
        );
      })}
    </svg>
  );
}
