import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { TeamHoneycomb } from "@/components/team/TeamHoneycomb";
import { ROUTES } from "@/config/routes";
import { useSiteContent } from "@/content/useSiteContent";
import styles from "./TeamPage.module.css";

/**
 * Página del equipo (BR-060): título compacto y el panal de hexágonos sobre las diagonales roja y charcoal del
 * hero. El título compacto reemplaza a la banda de PageHero por decisión del usuario (2026-10-14).
 */
export const TeamPage = () => {
  const team = useSiteContent().team;

  return (
    <div className={styles.page}>
      <SEOHelmet route={ROUTES.team} />
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.shadeTriangle} />
        <span className={styles.redTriangle} />
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Nuestro equipo</h1>
          <p className={styles.subtitle}>Profesionales apasionados por su oficio</p>
        </header>
        <TeamHoneycomb team={team} />
      </div>
    </div>
  );
};
