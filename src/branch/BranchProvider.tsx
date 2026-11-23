import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Branch } from "@/config/branches";
import { BranchContext } from "./BranchContext";
import { readStoredBranch, writeStoredBranch } from "./branchStorage";
import { branchFromPath, resolveBranch, swapBranchInPath } from "./resolveBranch";

/**
 * Decide cuál es la sucursal activa y la deja en `<html data-branch>`, de donde los tokens CSS toman su tema (ADR-010,
 * BR-103). Va dentro del router porque lee la URL y puede navegar.
 */
export function BranchProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [stored, setStored] = useState<Branch | null>(readStoredBranch);
  const { branch, source } = resolveBranch(pathname, stored);

  // Una portada con prefijo pasa a ser la elección recordada: así `/servicios` la conserva. Se ajusta durante el render
  // (patrón de React para estado derivado de una prop) y se escribe en el navegador en un efecto.
  const fromPath = branchFromPath(pathname);
  if (fromPath && fromPath !== stored) setStored(fromPath);
  useEffect(() => {
    if (fromPath) writeStoredBranch(fromPath);
  }, [fromPath]);

  // Antes de pintar, para que el tema nunca llegue un cuadro tarde.
  useLayoutEffect(() => {
    document.documentElement.dataset.branch = branch;
  }, [branch]);

  const setBranch = useCallback(
    (next: Branch) => {
      if (next === branch) return;
      if (source === "url") {
        navigate(swapBranchInPath(pathname, next));
      } else {
        setStored(next);
        writeStoredBranch(next);
      }
    },
    [branch, source, pathname, navigate],
  );

  const value = useMemo(() => ({ branch, source, setBranch }), [branch, source, setBranch]);
  return <BranchContext value={value}>{children}</BranchContext>;
}
