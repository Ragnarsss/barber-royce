import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { useBranch } from "@/branch/useBranch";
import type { Branch } from "@/config/branches";
import styles from "./BranchVines.module.css";

/**
 * Qué decoración lateral tiene cada sucursal (ADR-010 nivel 3). Coquimbo no tiene: ni se renderiza ni se descarga, porque
 * el trozo de código de La Serena solo se pide cuando esa sucursal está activa (BR-108, HU-SUC-002 CA-07).
 */
const VINES: Record<Branch, ComponentType<{ side: "left" | "right" }> | null> = {
  coquimbo: null,
  "la-serena": lazy(() => import("./SideVines/SideVines")),
};

interface BranchVinesProps {
  /** De qué lado(s) del contenido van las enredaderas. */
  sides: "left" | "right" | "both";
  /** La sección que las lleva: es el contenedor sobre el que crecen. */
  children: ReactNode;
}

/**
 * Envuelve una sección y le suma las enredaderas de la sucursal activa a sus costados (BR-108). Sin enredaderas para la
 * sucursal, deja la sección tal cual, dentro de un contenedor sin estilos propios.
 */
export function BranchVines({ sides, children }: BranchVinesProps) {
  const Vines = VINES[useBranch().branch];
  if (!Vines) return <>{children}</>;

  return (
    <div className={styles.host}>
      {children}
      {/* Después de la sección y por encima de su fondo; no reciben clics y caben en el margen lateral */}
      <Suspense fallback={null}>
        {sides !== "right" && <Vines side="left" />}
        {sides !== "left" && <Vines side="right" />}
      </Suspense>
    </div>
  );
}
