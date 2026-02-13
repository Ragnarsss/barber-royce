import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar/ScrollProgressBar";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <ScrollProgressBar />
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
