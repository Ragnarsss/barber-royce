import { useContext, useEffect, useId, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from "framer-motion";
import { LenisContext } from "@/contexts/lenisContextValue";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { setHeavyScroll } from "@/utils/heavyScroll";

/**
 * Escena fija ligada al scroll (BR-074, BR-075): en escritorio, una sección queda pegada arriba (`position: sticky`
 * dentro de un contenedor alto) mientras el scroll avanza su secuencia, en vez de subir y quedar cortada. Devuelve la
 * referencia del contenedor alto, si la escena está fija y el avance de 0 (se pega) a 1 (se suelta). En móvil y con
 * reducir movimiento no se fija: `pinned` es `false` y cada sección usa su avance de siempre.
 *
 * Mientras la escena está en pantalla, el scroll de la rueda o el trackpad se vuelve «pesado» (BR-077): con un límite de
 * velocidad, para que una sola pasada no cruce el recorrido sin que se aprecie el efecto. Ver `utils/heavyScroll.ts`.
 */
export function usePinnedScene(): { pinRef: React.RefObject<HTMLDivElement | null>; pinned: boolean; progress: MotionValue<number> } {
  const reducedMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const pinned = isDesktop && !reducedMotion;

  // Sin proveedor (pruebas) o sin Lenis (reducir movimiento), el contexto no trae instancia y no hay nada que pesar
  const lenis = useContext(LenisContext) ?? null;
  const id = useId();
  // Mientras algún tramo del contenedor está en pantalla, desde que asoma por abajo hasta que sale por arriba
  const { scrollYProgress: onScreen } = useScroll({ target: pinRef, offset: ["start end", "end start"] });
  const heavy = useRef(false);
  useMotionValueEvent(onScreen, "change", (value) => {
    const wanted = pinned && value > 0 && value < 1;
    if (wanted === heavy.current) return;
    heavy.current = wanted;
    setHeavyScroll(lenis, id, wanted);
  });
  // Al desmontar o al dejar de estar fija, el límite se retira
  useEffect(
    () => () => {
      heavy.current = false;
      setHeavyScroll(lenis, id, false);
    },
    [lenis, id, pinned],
  );

  return { pinRef, pinned, progress: scrollYProgress };
}
