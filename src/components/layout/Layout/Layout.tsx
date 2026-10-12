import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar/ScrollProgressBar";
import { SkipLink } from "@/components/common/SkipLink/SkipLink";
import { RouteErrorBoundary } from "@/components/common/ErrorBoundary";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <SkipLink />
      <ScrollProgressBar />
      <Navbar />
      <main id="main-content" role="main" className={styles.main}>
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
