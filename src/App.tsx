import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout/Layout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { Loading } from "./components/common/Loading/Loading";
import { useLenis } from "./hooks/useLenis";
import { LenisProvider } from "./contexts/LenisContext";
import { ErrorBoundary, ErrorFallback, CatastrophicError } from "./components/common/ErrorBoundary";
import "./styles/global.css";
import "./styles/variables.css";

// ✅ React 19: Lazy loading optimizado con code splitting
// Suspense maneja el estado de carga automáticamente sin necesidad de useTransition
const LocationPage = lazy(() => import("./pages/LocationPage").then(m => ({ default: m.LocationPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then(m => ({ default: m.ProductsPage })));
const ServicesPage = lazy(() => import("./pages/ServicesPage").then(m => ({ default: m.ServicesPage })));
const TeamPage = lazy(() => import("./pages/TeamPage").then(m => ({ default: m.TeamPage })));

function App() {
  // Inicializar Lenis smooth scroll globalmente
  const lenis = useLenis();

  return (
    // 🛡️ NIVEL 1: Error Boundary Global
    // Captura errores catastróficos (Lenis, Router, core libraries)
    // Último recurso si ningún otro boundary los captura
    <ErrorBoundary fallback={<CatastrophicError />}>
      <LenisProvider lenis={lenis}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* HomePage: Sin boundary (data estática, bajo riesgo) */}
              <Route index element={<HomePage />} />

              {/* 🛡️ NIVEL 2: Boundaries por ruta lazy */}
              {/* Captura errores de chunk loading y componentes de página */}

              <Route
                path="servicios"
                element={
                  <ErrorBoundary fallback={<ErrorFallback pageName="Servicios" />}>
                    <Suspense fallback={<Loading />}>
                      <ServicesPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path="productos"
                element={
                  <ErrorBoundary fallback={<ErrorFallback pageName="Productos" />}>
                    <Suspense fallback={<Loading />}>
                      <ProductsPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path="equipo"
                element={
                  <ErrorBoundary fallback={<ErrorFallback pageName="Equipo" />}>
                    <Suspense fallback={<Loading />}>
                      <TeamPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />

              <Route
                path="ubicacion"
                element={
                  <ErrorBoundary fallback={<ErrorFallback pageName="Ubicación" />}>
                    <Suspense fallback={<Loading />}>
                      <LocationPage />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </LenisProvider>
    </ErrorBoundary>
  );
}

export default App;
