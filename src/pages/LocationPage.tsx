import { ROUTES } from "@/config/routes";
import styles from "./LocationPage.module.css";
import { locationsList } from "@/data/locationsData";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { LocationTabs } from "@/components/sections/Location/LocationTabs";

/**
 * Pagina de ubicacion y horarios.
 *
 * Compone el SEO de la ruta, el hero de pagina y el bloque de tabs
 * con el detalle de cada sucursal.
 *
 * @returns Contenido principal de la pagina de ubicacion.
 */
export const LocationPage = () => {
  const route = ROUTES.location;

  return (
    <div className={styles.page}>
      <SEOHelmet route={route} />

      <PageHero
        title="Ubicación y Horarios"
        subtitle="Encuéntranos en nuestras sucursales"
      />

      <div className={styles.content}>
        <div className={styles.container}>
          <LocationTabs locations={locationsList} />
        </div>
      </div>
    </div>
  );
};
