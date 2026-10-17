import type { ReactNode } from "react";
import styles from "./HoneycombPage.module.css";

interface HoneycombPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Página con un panal (BR-060, BR-067): fondo con las diagonales roja y charcoal del hero y un título compacto en
 * Anton, que reemplaza a la banda de `PageHero` (decisión del usuario, 2026-10-14). El título es el `<h1>`.
 */
export const HoneycombPage = ({ title, subtitle, children }: HoneycombPageProps) => (
  <div className={styles.page}>
    <div className={styles.backdrop} aria-hidden="true">
      <span className={styles.shadeTriangle} />
      <span className={styles.redTriangle} />
    </div>

    <div className={styles.content}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>
      {children}
    </div>
  </div>
);
