import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import { MotionConfig } from "framer-motion";
import { Layout } from "./components/layout/Layout/Layout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { useLenis } from "./hooks/useLenis";
import { LenisProvider } from "./contexts/LenisContext";
import { CatastrophicError, reportError } from "./components/common/ErrorBoundary";
import { analyticsEnabled } from "./analytics/enabled";
import "./styles/global.css";
import "./styles/variables.css";

// Lazy loading optimizado con code splitting
const LocationPage = lazy(() => import("./pages/LocationPage").then(m => ({ default: m.LocationPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then(m => ({ default: m.ProductsPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then(m => ({ default: m.ServicesPage })));
const TeamPage = lazy(() => import("./pages/TeamPage").then(m => ({ default: m.TeamPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const FAQPage = lazy(() => import("./pages/FAQPage").then(m => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

function App() {
  const lenis = useLenis();

  return (
    // Último recurso: errores fuera de las páginas (router, Lenis, layout).
    // Los errores de una página los contiene RouteErrorBoundary dentro del Layout (BR-019).
    <ErrorBoundary fallback={<CatastrophicError />} onError={reportError}>
      <HelmetProvider>
        {/* Con "reducir movimiento" framer-motion omite las animaciones de transformación (BR-017) */}
        <MotionConfig reducedMotion="user">
        <LenisProvider lenis={lenis}>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
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
          </BrowserRouter>
        </LenisProvider>
        </MotionConfig>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
