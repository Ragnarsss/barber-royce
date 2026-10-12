import { Suspense, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Loading } from "@/components/common/Loading/Loading";
import { PageError } from "./PageError";
import { reportError } from "./reportError";

/**
 * Boundary de las páginas (BR-019). Envuelve el <Outlet /> del Layout, así
 * cubre todas las rutas —incluida la home— con un solo boundary, y un error
 * no se lleva consigo el navbar ni el footer.
 * Se reinicia solo al cambiar de ruta (resetKeys): navegar a otra página
 * después de un error la muestra normalmente.
 */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary FallbackComponent={PageError} onError={reportError} resetKeys={[pathname]}>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
