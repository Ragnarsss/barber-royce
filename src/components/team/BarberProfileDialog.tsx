import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { TeamMember } from "@/types/team.types";
import { useLenisInstance } from "@/hooks/useLenisContext";
import styles from "./BarberProfileDialog.module.css";

interface BarberProfileDialogProps {
  member: TeamMember;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const ENTER = { opacity: 0, y: 24, scale: 0.98 };
const SHOWN = { opacity: 1, y: 0, scale: 1 };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Ficha de un barbero (BR-063, HU-INFO-003 CA-07, HU-EXP-004 CA-15): la foto ocupa un tercio y se funde hacia el
 * negro donde van el nombre, las especialidades y la descripción. Diálogo modal: el foco queda dentro, Escape o el
 * fondo lo cierran, el foco vuelve a quien lo abrió y la página no se desplaza mientras está abierto (Lenis se
 * detiene). Va con `AnimatePresence` para animar la salida; con reducir movimiento aparece y se va sin animación.
 */
export const BarberProfileDialog = ({ member, onClose }: BarberProfileDialogProps) => {
  const reducedMotion = useReducedMotion() ?? false;
  const lenis = useLenisInstance();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

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
        data-testid="barber-dialog-backdrop"
      />
      <motion.div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={member.description ? descriptionId : undefined}
        onKeyDown={handleKeyDown}
        initial={reducedMotion ? false : ENTER}
        animate={SHOWN}
        exit={reducedMotion ? undefined : ENTER}
        transition={transition}
      >
        <div className={styles.photo}>
          <img src={member.image} alt={member.name} width="400" height="400" />
        </div>

        <div className={styles.body} data-lenis-prevent>
          <p className={styles.role}>
            {member.role}
            {member.experience && <span className={styles.experience}> · {member.experience}</span>}
          </p>
          <h2 id={titleId} className={styles.name}>
            {member.name}
          </h2>
          {member.specialties.length > 0 && (
            <ul className={styles.chips} aria-label="Especialidades">
              {member.specialties.map((specialty) => (
                <li key={specialty} className={styles.chip}>
                  {specialty}
                </li>
              ))}
            </ul>
          )}
          {member.description && (
            <p id={descriptionId} className={styles.description}>
              {member.description}
            </p>
          )}
        </div>

        <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Cerrar ficha">
          <X aria-hidden="true" />
        </button>
      </motion.div>
    </>,
    document.body,
  );
};
