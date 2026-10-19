import type { ReactNode } from "react";
import { PageBackdrop } from "@/components/common/PageBackdrop/PageBackdrop";
import styles from "./HoneycombPage.module.css";

interface HoneycombPageProps {
  title: string;
  subtitle: string;
  /**
   * Las diagonales ocupan solo la primera pantalla y el resto de la página va liso: para catálogos largos, donde la
   * página crece al cargar más. Con alto fijo, el fondo no se mueve cuando cambia el alto del contenido (CLS).
   */
  band?: boolean;
  children: ReactNode;
}

/**
 * Página con un panal (BR-060, BR-067): fondo con las diagonales roja y charcoal del hero y un título compacto en
 * Anton, que reemplaza a la banda de `PageHero` (decisión del usuario, 2026-10-14). El título es el `<h1>`.
 */
export const HoneycombPage = ({ title, subtitle, band, children }: HoneycombPageProps) => (
  <div className={band ? `${styles.page} ${styles.band}` : styles.page}>
    <PageBackdrop className={band ? styles.bandBackdrop : undefined} />

    <div className={styles.content}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>
      {children}
    </div>
  </div>
);
