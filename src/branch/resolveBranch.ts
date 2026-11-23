import { DEFAULT_BRANCH, isBranch, type Branch } from "@/config/branches";

/** De dónde salió la sucursal activa: el prefijo de la URL, la elección guardada o el valor por defecto. */
export type BranchSource = "url" | "stored" | "default";

/** La sucursal del primer segmento de la URL (`/la-serena/...`), o `null` si no es una portada de sucursal. */
export function branchFromPath(pathname: string): Branch | null {
  const first = pathname.split("/")[1];
  return isBranch(first) ? first : null;
}

/** ADR-010: el prefijo de la URL manda; si no hay, la elección guardada; si no hay, Coquimbo. */
export function resolveBranch(pathname: string, stored: Branch | null): { branch: Branch; source: BranchSource } {
  const fromPath = branchFromPath(pathname);
  if (fromPath) return { branch: fromPath, source: "url" };
  if (stored) return { branch: stored, source: "stored" };
  return { branch: DEFAULT_BRANCH, source: "default" };
}

/** `/coquimbo/algo` → `/la-serena/algo`. Una ruta sin prefijo de sucursal queda igual. */
export function swapBranchInPath(pathname: string, next: Branch): string {
  const current = branchFromPath(pathname);
  if (!current) return pathname;
  return `/${next}${pathname.slice(current.length + 1)}`;
}
