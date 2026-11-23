import { useId, useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { BRANCHES, BRANCH_LABEL } from "@/config/branches";
import { useBranch } from "@/branch/useBranch";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";
import { SP2_HEXAGON_BY_BRANCH } from "@/components/sections/SocialProof2/sp2Shapes";
import styles from "./BranchSwitch.module.css";

/**
 * Control para cambiar de sucursal (BR-105, HU-SUC-001 CA-05 a CA-08): un grupo de dos opciones con los nombres de las
 * sucursales, no un interruptor mudo que se lea como «modo claro u oscuro». Es un `radiogroup` con una sola parada de
 * tabulación y flechas para moverse; elegir una opción llama a `setBranch`, que decide si navega o solo guarda la elección.
 * El fondo de la opción elegida se desliza de una a otra (layoutId de framer) y el indicador de cada opción es la figura
 * del tema activo: pasa de hexágono a cuadrado al cambiar.
 */
interface BranchSwitchProps {
  className?: string;
  /** Con espacio de sobra (el menú móvil): suma el ícono de ubicación y más relleno. En la barra va compacto. */
  roomy?: boolean;
  /** Se llama tras elegir una sucursal con el puntero (el menú móvil se cierra). */
  onSelect?: () => void;
}

export function BranchSwitch({ className = "", roomy = false, onSelect }: BranchSwitchProps) {
  const { branch, setBranch } = useBranch();
  const options = useRef<Array<HTMLButtonElement | null>>([]);
  // Cada control (barra y menú móvil) tiene su propio fondo deslizante: con el mismo `layoutId` se disputarían la animación
  const pillId = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (BRANCHES.indexOf(branch) + step + BRANCHES.length) % BRANCHES.length;
    setBranch(BRANCHES[next]);
    options.current[next]?.focus();
  }

  return (
    <div role="radiogroup" aria-label="Sucursal" className={`${styles.group} ${roomy ? styles.roomy : ""} ${className}`} onKeyDown={handleKeyDown}>
      <MapPin className={styles.pin} size={16} aria-hidden="true" />
      {BRANCHES.map((option, index) => {
        const checked = option === branch;
        return (
          <button
            key={option}
            ref={(element) => {
              options.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className={`${styles.option} ${checked ? styles.checked : ""}`}
            onClick={() => {
              setBranch(option);
              onSelect?.();
            }}
          >
            {/* El fondo de la opción elegida se desliza de una a otra (con «reducir movimiento», salta) */}
            {checked && <motion.span layoutId={pillId} className={styles.pill} transition={{ type: "spring", stiffness: 360, damping: 32 }} />}
            <span className={styles.content}>
              <span className={styles.marker} aria-hidden="true">
                <FixedShape shape={SP2_HEXAGON_BY_BRANCH[branch]} />
              </span>
              {BRANCH_LABEL[option]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
