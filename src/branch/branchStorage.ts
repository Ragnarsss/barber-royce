import { BRANCH_STORAGE_KEY, isBranch, type Branch } from "@/config/branches";

/**
 * La elección guardada del visitante. `localStorage` puede estar bloqueado (navegación privada estricta, política del
 * navegador) o traer un valor ajeno: en esos casos no se recuerda nada y el sitio funciona igual (HU-SUC-001 CA-09).
 */
export function readStoredBranch(): Branch | null {
  try {
    const value = localStorage.getItem(BRANCH_STORAGE_KEY);
    return isBranch(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredBranch(branch: Branch): void {
  try {
    localStorage.setItem(BRANCH_STORAGE_KEY, branch);
  } catch {
    // Sin almacenamiento no se recuerda la elección; no es un error.
  }
}
