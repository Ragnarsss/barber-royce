import { createContext } from "react";
import { DEFAULT_BRANCH, type Branch } from "@/config/branches";
import type { BranchSource } from "./resolveBranch";

export interface BranchContextValue {
  /** La sucursal activa: la que define el tema, las figuras y la reserva (ADR-010). */
  branch: Branch;
  /** De dónde salió: prefijo de la URL, elección guardada o valor por defecto. */
  source: BranchSource;
  /** Cambia de sucursal: navega a la otra portada si la URL tiene prefijo; si no, solo guarda la elección. */
  setBranch: (next: Branch) => void;
}

/** Sin provider (un test que monta un componente suelto) el contexto vale Coquimbo, como `ContentContext` vale el respaldo. */
export const BranchContext = createContext<BranchContextValue>({
  branch: DEFAULT_BRANCH,
  source: "default",
  setBranch: () => {},
});
