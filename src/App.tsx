import { lazy, type ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import { MotionConfig } from "framer-motion";
import { Layout } from "./components/layout/Layout/Layout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { BranchPickerPage } from "./pages/BranchPickerPage";
import { useCreateLenis } from "./hooks/useCreateLenis";
import { LenisContext } from "./contexts/lenisContextValue";
import { CatastrophicError, reportError } from "./components/common/ErrorBoundary";
import { analyticsEnabled } from "./analytics/enabled";
import { ContentProvider } from "./content/ContentProvider";
import { BranchProvider } from "./branch/BranchProvider";
import { BRANCHES, type Branch } from "./config/branches";
import "lenis/dist/lenis.css";
import "./styles/global.css";
import "./styles/variables.css";

// Lazy loading optimizado con code splitting
// La portada de La Serena es otra página y otro trozo de código: con Coquimbo no se descarga (BR-106).
const LaSerenaPage = lazy(() => import("./pages/LaSerenaPage").then(m => ({ default: m.LaSerenaPage })));
const LocationPage = lazy(() => import("./pages/LocationPage").then(m => ({ default: m.LocationPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then(m => ({ default: m.ProductsPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then(m => ({ default: m.ServicesPage })));
const TeamPage = lazy(() => import("./pages/TeamPage").then(m => ({ default: m.TeamPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const FAQPage = lazy(() => import("./pages/FAQPage").then(m => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

/** Qué página es la portada de cada sucursal (ADR-010 nivel 4: la composición de la página). */
const COVER_PAGE: Record<Branch, ReactElement> = {
  coquimbo: <HomePage />,
  "la-serena": <LaSerenaPage />,
};

function App() {
  const lenis = useCreateLenis();

  return (
    // Último recurso: errores fuera de las páginas (router, Lenis, layout).
    // Los errores de una página los contiene RouteErrorBoundary dentro del Layout (BR-019).
    <ErrorBoundary fallback={<CatastrophicError />} onError={reportError}>
      <HelmetProvider>
        <ContentProvider>
        {/* Con "reducir movimiento" framer-motion omite las animaciones de transformación (BR-017) */}
        <MotionConfig reducedMotion="user">
          <LenisContext value={lenis}>
            <BrowserRouter>
              <BranchProvider>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<BranchPickerPage />} />
                  {/* Una portada por sucursal (ADR-010, BR-103). Distinguen mayúsculas: /LA-SERENA no es una sucursal. */}
                  {BRANCHES.map((branch) => (
                    <Route key={branch} path={branch} caseSensitive element={COVER_PAGE[branch]} />
                  ))}
                  <Route path="servicios" element={<ServicesPage />} />
                  <Route path="productos" element={<ProductsPage />} />
                  <Route path="equipo" element={<TeamPage />} />
                  <Route path="ubicacion" element={<LocationPage />} />
                  <Route path="nosotros" element={<AboutPage />} />
                  <Route path="preguntas-frecuentes" element={<FAQPage />} />
                  {/* Solo existe si hay analítica configurada: es un borrador legal por validar (BR-044) */}
                  {analyticsEnabled() && <Route path="privacidad" element={<PrivacyPage />} />}
                  {/* Cualquier ruta inexistente (BR-003) */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
              </BranchProvider>
            </BrowserRouter>
          </LenisContext>
        </MotionConfig>
        </ContentProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
