import { motion, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { useAssembleStyle, type AssembleOffsets } from "./ctaAssemble";

interface AssemblePieceProps {
  /** Avance del ensamble de 0 (la pieza está en su desfase) a 1 (en su sitio). */
  progress: MotionValue<number>;
  from: AssembleOffsets;
  children: ReactNode;
}

/**
 * Contenedor interior de un hexágono de CTA1 que lo trae desde su desfase hasta su sitio (BR-097). Va dentro de la capa
 * que lleva el parallax, no en ella: framer escribe un solo `transform` por elemento, y así los dos movimientos se
 * suman en lugar de pisarse. Solo existe en escritorio y con movimiento: en móvil y con «reducir movimiento» no se monta.
 */
export function AssemblePiece({ progress, from, children }: AssemblePieceProps) {
  const style = useAssembleStyle(progress, from);
  return (
    <motion.div style={style} data-assemble>
      {children}
    </motion.div>
  );
}
