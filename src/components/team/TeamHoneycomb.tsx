import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { TeamMember } from "@/types/team.types";
import { defaultViewport, scaleIn } from "@/config/animations.config";
import { buildHoneycomb, type CellPlacement } from "./honeycomb";
import styles from "./TeamHoneycomb.module.css";

interface TeamHoneycombProps {
  team: TeamMember[];
  /** Se llama al activar un barbero (clic, Enter o Espacio). */
  onSelect?: (member: TeamMember) => void;
}

const ENTRANCE_STAGGER = 0.08;

/** Variables de posición de la celda; el CSS usa las de móvil o las de escritorio según el ancho. */
const placementVars = (desktop: CellPlacement, mobile: CellPlacement) =>
  ({
    "--d-col": desktop.col,
    "--d-row": desktop.row,
    "--d-cols": desktop.cols,
    "--d-rows": desktop.rows,
    "--m-col": mobile.col,
    "--m-row": mobile.row,
    "--m-cols": mobile.cols,
    "--m-rows": mobile.rows,
  }) as CSSProperties;

/**
 * Panal de hexágonos del equipo (BR-060, HU-EXP-004 CA-12): el líder más grande y con marco rojo, el resto con
 * marco blanco. Al pasar el cursor o enfocar un hexágono se ve el nombre y el marco se enciende como un tubo de neón.
 */
export const TeamHoneycomb = ({ team, onSelect }: TeamHoneycombProps) => {
  const reducedMotion = useReducedMotion() ?? false;
  const { cells, desktop, mobile } = buildHoneycomb(team);
  const gridVars = {
    "--d-grid-cols": desktop.cols,
    "--d-grid-rows": desktop.rows,
    "--m-grid-cols": mobile.cols,
    "--m-grid-rows": mobile.rows,
  } as CSSProperties;

  return (
    <ul className={styles.honeycomb} style={gridVars}>
      {cells.map(({ member, isLead, desktop: d, mobile: m }, index) => (
        <motion.li
          key={member.name}
          className={`${styles.cell} ${isLead ? styles.lead : ""}`}
          style={placementVars(d, m)}
          variants={scaleIn}
          // La foto del líder es el LCP de la página: aparece sin animación de entrada (con opacidad 0 Chrome no la
          // cuenta hasta que termina) y se pide con prioridad alta. El resto entra escalonado.
          initial={reducedMotion || isLead ? false : "hidden"}
          whileInView="visible"
          viewport={defaultViewport}
          transition={{ delay: index * ENTRANCE_STAGGER }}
          data-lead={isLead || undefined}
        >
          <button type="button" className={styles.hex} onClick={() => onSelect?.(member)} aria-label={`${member.name}, ${member.role}`}>
            <span className={styles.frame} aria-hidden="true">
              <span className={styles.photo}>
                <img
                  src={member.image}
                  alt={member.name}
                  width="400"
                  height="400"
                  loading={isLead ? "eager" : "lazy"}
                  fetchPriority={isLead ? "high" : "auto"}
                  decoding={isLead ? "sync" : "async"}
                />
              </span>
              <span className={styles.caption}>
                <span className={styles.name}>{member.name}</span>
                <span className={styles.role}>{member.role}</span>
              </span>
            </span>
          </button>
        </motion.li>
      ))}
    </ul>
  );
};
