import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./CardCarousel.module.css";

/** Mismo punto de corte que el resto del sitio para «móvil». */
const MOBILE_QUERY = "(max-width: 768px)";

/** Fracción de una tarjeta que debe verse para darla por visible. */
const ACTIVE_RATIO = 0.6;

interface CardCarouselProps {
  /** Nombre de la región para los lectores de pantalla (p. ej. «Reseñas de clientes»). */
  label: string;
  /** Un único elemento: la grilla de tarjetas. En móvil pasa a ser una fila con snap; en escritorio no cambia. */
  children: ReactNode;
  /**
   * Si se indica, el carrusel también existe en escritorio y muestra tantas tarjetas a la vez (BR-073). Sin él, en
   * escritorio no monta nada y la grilla queda como estaba.
   */
  desktopVisible?: number;
}

const matchesMobile = () => typeof window !== "undefined" && window.matchMedia?.(MOBILE_QUERY).matches === true;

/**
 * Carrusel con snap (BR-070, HU-EXP-004 CA-21; escritorio, BR-073, CA-24). Envuelve la grilla de tarjetas de una
 * sección: el CSS (`CardCarousel.module.css`) la convierte en una fila desplazable; este componente le agrega lo que el
 * CSS no puede: la región enfocable con nombre, los puntos y las flechas para cambiar de tarjeta sin arrastrar y, en
 * escritorio, el arrastre con el ratón.
 *
 * Qué tarjetas se ven lo decide un `IntersectionObserver`, no el scroll: el estado cambia solo cuando una tarjeta entra
 * o sale de la vista, no en cada evento de desplazamiento (regla 6 de CLAUDE.md; mismo patrón que el centinela de
 * BR-068). La tarjeta «actual» es la primera de las visibles.
 */
export function CardCarousel({ label, children, desktopVisible }: CardCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(matchesMobile);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  const desktopMode = desktopVisible !== undefined && desktopVisible > 0;
  const enabled = isMobile || desktopMode;
  // Tarjetas que caben a la vez: una en móvil; en escritorio, las que se pidieron
  const visible = isMobile ? 1 : (desktopVisible ?? 1);
  // Posiciones a las que puede llegar la fila: con 5 tarjetas y 3 visibles, 3
  const stops = Math.max(1, count - visible + 1);

  useEffect(() => {
    const query = window.matchMedia?.(MOBILE_QUERY);
    if (!query) return;
    const update = () => setIsMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const track = wrapperRef.current?.firstElementChild as HTMLElement | null;
    if (!enabled || !track) return;
    const cards = Array.from(track.children) as HTMLElement[];

    // La fila se recorre con las flechas del teclado y tiene nombre para quien usa lector de pantalla.
    track.tabIndex = 0;
    track.setAttribute("role", "region");
    track.setAttribute("aria-label", label);
    track.setAttribute("aria-roledescription", "carrusel");

    const shown = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        // El observador avisa de todas las tarjetas apenas empieza a observar: ahí se sabe cuántas hay
        setCount(cards.length);
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          const index = cards.indexOf(card);
          card.dataset.active = String(entry.isIntersecting);
          if (entry.isIntersecting) shown.add(index);
          else shown.delete(index);
        }
        if (shown.size > 0) setActive(Math.min(...shown));
      },
      { root: track, threshold: ACTIVE_RATIO },
    );
    cards.forEach((card) => observer.observe(card));

    // Arrastre con el ratón, solo en escritorio: el táctil y el trackpad ya desplazan la fila por sí solos.
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (event: PointerEvent) => {
      if (isMobile || event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      startX = event.clientX;
      startLeft = track.scrollLeft;
      track.style.scrollSnapType = "none"; // sin snap mientras se arrastra: lo asienta al soltar
      track.dataset.dragging = "true";
      track.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (dragging) track.scrollLeft = startLeft - (event.clientX - startX);
    };
    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      track.style.scrollSnapType = "";
      delete track.dataset.dragging;
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    };
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);

    return () => {
      observer.disconnect();
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      track.style.scrollSnapType = "";
      delete track.dataset.dragging;
      cards.forEach((card) => delete card.dataset.active);
      track.removeAttribute("tabindex");
      track.removeAttribute("role");
      track.removeAttribute("aria-label");
      track.removeAttribute("aria-roledescription");
    };
  }, [enabled, isMobile, label]);

  const goTo = (index: number) => {
    const track = wrapperRef.current?.firstElementChild as HTMLElement | null | undefined;
    const card = track?.children[index];
    if (!track || !card) return;
    // Se mueve solo la fila. Con `scrollIntoView` también se desplazaba la sección (tiene `overflow: hidden` y la fila
    // se sale a propósito hasta el borde de la pantalla) y todo se corría de lado. Sin desplazamiento suave si se
    // pidió reducir el movimiento.
    const paddingStart = Number.parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    const delta = card.getBoundingClientRect().left - track.getBoundingClientRect().left - paddingStart;
    track.scrollBy({ left: delta, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const showControls = enabled && stops > 1;
  const dotLabel = (index: number) =>
    visible > 1 ? `Ver las tarjetas ${index + 1} a ${index + visible} de ${count}` : `Ir a la tarjeta ${index + 1} de ${count}`;

  return (
    <div
      ref={wrapperRef}
      className={`${styles.carousel} ${desktopMode ? styles.desktop : ""}`}
      style={desktopMode ? ({ "--carousel-visible": desktopVisible } as CSSProperties) : undefined}
    >
      {children}
      {showControls && !isMobile && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            aria-label="Tarjeta anterior"
            disabled={active <= 0}
            onClick={() => goTo(Math.max(0, active - 1))}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            aria-label="Tarjeta siguiente"
            disabled={active >= stops - 1}
            onClick={() => goTo(Math.min(stops - 1, active + 1))}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </>
      )}
      {showControls && (
        <div className={styles.dots}>
          {Array.from({ length: stops }, (_, index) => (
            <button
              key={index}
              type="button"
              className={styles.dot}
              aria-label={dotLabel(index)}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
