import { Link } from "react-router-dom";
import { BRANCHES, BRANCH_LABEL, type Branch } from "@/config/branches";
import { useBranchLocation } from "@/branch/useBranchLocation";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";
import { PICKER_FIGURES } from "./pickerFigures";
import styles from "./BranchPicker.module.css";

/** Lo que dice cada mitad además del nombre: una línea sobre cómo es el local. */
const TAGLINE = {
  coquimbo: "Estilo clásico, cuero y luz roja.",
  "la-serena": "Madera, plantas y luz de neón.",
} as const satisfies Record<Branch, string>;

function Half({ branch }: { branch: Branch }) {
  const location = useBranchLocation(branch);
  return (
    <Link to={`/${branch}`} className={`${styles.half} ${styles[branch]}`}>
      <span className={styles.figures} aria-hidden="true">
        {PICKER_FIGURES[branch].map((shape, index) => (
          <span key={index} className={styles.figure}>
            <FixedShape shape={shape} />
          </span>
        ))}
      </span>
      <span className={styles.body}>
        <span className={styles.kicker}>Sucursal</span>
        <h2 className={styles.name}>{BRANCH_LABEL[branch]}</h2>
        <span className={styles.tagline}>{TAGLINE[branch]}</span>
        {location && <span className={styles.address}>{location.address}</span>}
        <span className={styles.enter}>Entrar</span>
      </span>
    </Link>
  );
}

/**
 * Portada partida de `/` (BR-106, HU-SUC-001 CA-01): una mitad por sucursal, cada una con su identidad y un enlace real a
 * su portada. Los colores de cada mitad son los de su paleta fija, no los de la sucursal activa.
 */
export function BranchPicker() {
  return (
    <section className={styles.picker} aria-labelledby="branch-picker-title">
      <h1 id="branch-picker-title" className={styles.title}>
        Royce Barbería: elige tu sucursal
      </h1>
      <div className={styles.halves}>
        {BRANCHES.map((branch) => (
          <Half key={branch} branch={branch} />
        ))}
      </div>
    </section>
  );
}
