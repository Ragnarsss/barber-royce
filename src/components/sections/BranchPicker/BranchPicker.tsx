import { Link } from "react-router-dom";
import { BRANCHES, BRANCH_LABEL, type Branch } from "@/config/branches";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";
import coquimboPhoto from "@/assets/optimized/branch_coquimbo_697w.webp";
import laSerenaPhoto from "@/assets/optimized/branch_la_serena_874w.webp";
import { PICKER_FIGURES } from "./pickerFigures";
import styles from "./BranchPicker.module.css";

/** La foto del local de cada mitad, con su tamaño real (evita saltos de diseño). */
const PHOTO = {
  coquimbo: { src: coquimboPhoto, width: 697, height: 615 },
  "la-serena": { src: laSerenaPhoto, width: 874, height: 583 },
} as const satisfies Record<Branch, { src: string; width: number; height: number }>;

function Half({ branch }: { branch: Branch }) {
  const { src, width, height } = PHOTO[branch];
  return (
    <Link to={`/${branch}`} className={`${styles.half} ${styles[branch]}`}>
      <img className={styles.photo} src={src} width={width} height={height} alt="" decoding="async" />
      <span className={styles.figures} aria-hidden="true">
        {PICKER_FIGURES[branch].map((shape, index) => (
          <span key={index} className={styles.figure}>
            <FixedShape shape={shape} />
          </span>
        ))}
      </span>
      <h2 className={styles.name}>{BRANCH_LABEL[branch]}</h2>
    </Link>
  );
}

/**
 * Portada partida de `/` (BR-106, HU-SUC-001 CA-01): una mitad por sucursal con la foto de su local y un enlace real a su
 * portada. Las fotos van en escala de grises y se iluminan con sus colores solo con el cursor encima o el foco. Se muestra
 * solo hasta que el visitante elige: después, `/` lo lleva a su portada (BranchPickerPage) y el cambio se hace con el control.
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
