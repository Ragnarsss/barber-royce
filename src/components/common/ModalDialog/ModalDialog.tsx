import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLenisInstance } from "@/hooks/useLenisContext";
import styles from "./ModalDialog.module.css";

interface ModalDialogProps {
  onClose: () => void;
  /** `id` del título del diálogo (nombre accesible). */
  titleId: string;
  /** `id` del texto que lo describe, si lo hay. */
  descriptionId?: string;
  /** Diseño dividido: foto a un tercio y texto (usa `ModalSplit` dentro). */
  split?: boolean;
  /** Clase con más diseño interior. */
  className?: string;
  children: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const ENTER = { opacity: 0, y: 24, scale: 0.98 };
const SHOWN = { opacity: 1, y: 0, scale: 1 };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Diálogo modal accesible (BR-063, BR-067): el de las fichas del barbero y del producto. El foco queda dentro; Tab y
 * Mayús+Tab dan la vuelta; Escape, el botón de cerrar o el fondo lo cierran; el foco vuelve a quien lo abrió; y la
 * página no se desplaza mientras está abierto (Lenis se detiene y `html` queda sin desbordamiento). Se usa dentro de
 * `AnimatePresence` para animar la salida; con reducir movimiento aparece y se va sin animación.
 */
export const ModalDialog = ({ onClose, titleId, descriptionId, split, className, children }: ModalDialogProps) => {
  const reducedMotion = useReducedMotion() ?? false;
  const lenis = useLenisInstance();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    closeRef.current?.focus();
    lenis?.stop();
    root.style.overflow = "hidden";
    return () => {
      lenis?.start();
      root.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [lenis]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.35, ease: EASE };

  return createPortal(
    <>
      <motion.div
        className={styles.backdrop}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
        data-testid="dialog-backdrop"
      />
      <motion.div
        ref={dialogRef}
        className={[styles.dialog, split && styles.split, className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onKeyDown={handleKeyDown}
        initial={reducedMotion ? false : ENTER}
        animate={SHOWN}
        exit={reducedMotion ? undefined : ENTER}
        transition={transition}
      >
        {children}
        <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Cerrar ficha">
          <X aria-hidden="true" />
        </button>
      </motion.div>
    </>,
    document.body,
  );
};

interface ModalSplitProps {
  image: string;
  alt: string;
  /** Alto de la foto original, para reservar su proporción (el ancho es siempre 400). */
  imageHeight?: number;
  children: ReactNode;
}

/**
 * Las dos mitades del diseño dividido: la foto con su degradado y el cuerpo, que se desplaza solo (sin Lenis). Si la
 * foto falta o su dirección falla, queda el fondo liso en vez de un cuadro con el texto alternativo.
 */
export const ModalSplit = ({ image, alt, imageHeight = 400, children }: ModalSplitProps) => {
  const [broken, setBroken] = useState(false);

  return (
    <>
      <div className={styles.splitPhoto}>
        {image && !broken && <img src={image} alt={alt} width="400" height={imageHeight} onError={() => setBroken(true)} />}
      </div>
      <div className={styles.splitBody} data-lenis-prevent>
        {children}
      </div>
    </>
  );
};
