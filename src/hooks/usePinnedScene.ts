import { useRef } from "react";
import { useReducedMotion, useScroll, type MotionValue } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA } from "@/config/breakpoints";

/**
 * Escena fija ligada al scroll (BR-074, BR-075): en escritorio, una sección queda pegada arriba (`position: sticky`
 * dentro de un contenedor alto) mientras el scroll avanza su secuencia, en vez de subir y quedar cortada. Devuelve la
 * referencia del contenedor alto, si la escena está fija y el avance de 0 (se pega) a 1 (se suelta). En móvil y con
 * reducir movimiento no se fija: `pinned` es `false` y cada sección usa su avance de siempre.
 */
export function usePinnedScene(): { pinRef: React.RefObject<HTMLDivElement | null>; pinned: boolean; progress: MotionValue<number> } {
  const reducedMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery(MEDIA.desktop);
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  return { pinRef, pinned: isDesktop && !reducedMotion, progress: scrollYProgress };
}
