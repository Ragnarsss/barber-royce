import { useContext } from "react";
import { BranchContext, type BranchContextValue } from "./BranchContext";

/** La sucursal activa y cómo cambiarla (ADR-010). Para decidir qué se renderiza, no para colores: esos son tokens. */
export function useBranch(): BranchContextValue {
  return useContext(BranchContext);
}
