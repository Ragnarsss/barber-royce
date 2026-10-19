import type { ReactNode } from "react";
import { PageHero } from "@/components/common/PageHero/PageHero";
import styles from "./HoneycombPage.module.css";

interface HoneycombPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Página con un panal (BR-060, BR-067, BR-088): la cabecera de todo el sitio (`PageHero`, con las diagonales del hero
 * acotadas a la franja) y debajo el contenido sobre un fondo liso. Antes las diagonales ocupaban la pantalla entera y
 * una variante en banda las acotaba a una pantalla (decisión del 2026-10-14, reemplazada el 2026-10-19). El título es
 * el `<h1>`.
 */
export const HoneycombPage = ({ title, subtitle, children }: HoneycombPageProps) => (
  <div className={styles.page}>
    <PageHero title={title} subtitle={subtitle} animated={false} />
    <div className={styles.content}>{children}</div>
  </div>
);
