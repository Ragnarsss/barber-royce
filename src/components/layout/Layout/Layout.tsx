import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar/ScrollProgressBar";
import { SkipLink } from "@/components/common/SkipLink/SkipLink";
import { RouteErrorBoundary } from "@/components/common/ErrorBoundary";

// Google Analytics y su aviso de consentimiento solo existen si hay un ID de medición (BR-037).
// Con la variable ausente la condición es constante en el build: ni este código ni el de Google
// llegan al sitio (RNF-PRIV-001).
const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const AnalyticsRoot = gaMeasurementId
  ? lazy(() => import("@/analytics/AnalyticsRoot").then((m) => ({ default: m.AnalyticsRoot })))
  : null;

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <SkipLink />
      {AnalyticsRoot && gaMeasurementId && (
        <Suspense fallback={null}>
          <AnalyticsRoot measurementId={gaMeasurementId} />
        </Suspense>
      )}
      <ScrollProgressBar />
      <Navbar />
      <main id="main-content" role="main" tabIndex={-1} className={styles.main}>
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
