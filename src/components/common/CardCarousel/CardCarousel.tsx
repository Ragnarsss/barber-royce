import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./CardCarousel.module.css";

/** Mismo punto de corte que el resto del sitio para «móvil». */
const MOBILE_QUERY = "(max-width: 768px)";

/** Fracción de una tarjeta que debe verse para darla por la actual. */
const ACTIVE_RATIO = 0.6;

interface CardCarouselProps {
  /** Nombre de la región para los lectores de pantalla (p. ej. «Reseñas de clientes»). */
  label: string;
  /** Un único elemento: la grilla de tarjetas. En móvil pasa a ser una fila con snap; en escritorio no cambia. */
  children: ReactNode;
}

const matchesMobile = () => typeof window !== "undefined" && window.matchMedia?.(MOBILE_QUERY).matches === true;

/**
 * Carrusel con snap solo en móvil (BR-070, HU-EXP-004 CA-21). Envuelve la grilla de tarjetas de una sección: el CSS
 * (`CardCarousel.module.css`) la convierte en una fila desplazable; este componente le agrega lo que el CSS no puede:
 * la región enfocable con nombre, la tarjeta actual y los puntos para cambiar de tarjeta sin arrastrar.
 *
 * La tarjeta actual la decide un `IntersectionObserver`, no el scroll: el estado cambia solo cuando otra tarjeta pasa
 * a verse, no en cada evento de desplazamiento (regla 6 de CLAUDE.md; mismo patrón que el centinela de BR-068).
 * En escritorio no monta nada: el envoltorio es `display: contents`.
 */
export function CardCarousel({ label, children }: CardCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(matchesMobile);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const query = window.matchMedia?.(MOBILE_QUERY);
    if (!query) return;
    const update = () => setIsMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const track = wrapperRef.current?.firstElementChild as HTMLElement | null;
    if (!isMobile || !track) return;
    const cards = Array.from(track.children) as HTMLElement[];

    // La fila se recorre con las flechas del teclado y tiene nombre para quien usa lector de pantalla.
    track.tabIndex = 0;
    track.setAttribute("role", "region");
    track.setAttribute("aria-label", label);
    track.setAttribute("aria-roledescription", "carrusel");

    const observer = new IntersectionObserver(
      (entries) => {
        // El observador avisa de todas las tarjetas apenas empieza a observar: ahí se sabe cuántas hay
        setCount(cards.length);
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          card.dataset.active = String(entry.isIntersecting);
          if (entry.isIntersecting) setActive(cards.indexOf(card));
        }
      },
      { root: track, threshold: ACTIVE_RATIO },
    );
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      cards.forEach((card) => delete card.dataset.active);
      track.removeAttribute("tabindex");
      track.removeAttribute("role");
      track.removeAttribute("aria-label");
      track.removeAttribute("aria-roledescription");
    };
  }, [isMobile, label]);

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

  return (
    <div ref={wrapperRef} className={styles.carousel}>
      {children}
      {isMobile && count > 1 && (
        <div className={styles.dots}>
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              type="button"
              className={styles.dot}
              aria-label={`Ir a la tarjeta ${index + 1} de ${count}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
