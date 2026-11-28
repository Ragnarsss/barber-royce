import { Link, useLocation } from "react-router-dom";
import styles from "./Footer.module.css";
import { PageBackdrop } from "@/components/common/PageBackdrop/PageBackdrop";
import { Clock, Mail, Phone } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { SITE } from "@/config/constants";
import { getFooterRoutes, ROUTES } from "@/config/routes";
import { useSiteContent } from "@/content/useSiteContent";
import { useBookingUrl } from "@/branch/useBookingUrl";
import { branchFromPath } from "@/branch/resolveBranch";
import { PrivacyPreferencesButton } from "@/analytics/PrivacyPreferencesButton";
import { trackPhone, trackReserve, trackWhatsApp } from "@/analytics/track";
import { BrandLettering } from "@/components/common/BrandLettering/BrandLettering";
import { BrandMark } from "@/components/common/BrandMark/BrandMark";

/**
 * Pie de página (BR-084, BR-098): divisoria roja, franja de cierre con el llamado a agendar (en todas las rutas salvo
 * la portada, que ya termina con `CTA2`), y las columnas de marca, navegación, contacto y redes.
 */
export const Footer = () => {
  const { business } = useSiteContent();
  const bookingUrl = useBookingUrl();
  const footerRoutes = getFooterRoutes();
  const { pathname } = useLocation();
  // Las portadas (`/` y la de cada sucursal) ya terminan con CTA2: la franja de cierre no va ahí (BR-098, BR-103).
  const showClosing = pathname !== ROUTES.home.path && branchFromPath(pathname) === null;

  return (
    <footer className={styles.footer}>
      <div className={`glass-divider ${styles.divider}`} aria-hidden="true" />

      {showClosing && (
        <section className={styles.closing} aria-labelledby="footer-closing-title">
          <PageBackdrop className={styles.closingBackdrop} />
          <div className={styles.closingContent}>
            <h2 id="footer-closing-title" className={styles.closingTitle}>
              Reserva tu sesión
            </h2>
            <a
              className={styles.closingButton}
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackReserve("footer")}
            >
              Agendar Sesión
            </a>
          </div>
        </section>
      )}

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Columna principal */}
          <div className={`${styles.column} ${styles.columnWide}`}>
            <div className={styles.brand}>
              <BrandMark title={`Logo de ${SITE.name}`} className={styles.logoIcon} />
              <h3 className={styles.title}>
                {/* El lettering del dueño (BR-122): dibujo decorativo; el nombre queda en texto para el lector de pantalla */}
                <BrandLettering className={styles.lettering} />
                <span className="sr-only">{SITE.name}</span>
              </h3>
            </div>
            <p className={styles.description}>
              Estilo y elegancia para el hombre moderno. Más de 10 años de experiencia creando los mejores looks.
            </p>
          </div>

          {/* Navegación */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Navegación</h4>
            <ul className={styles.links}>
              {footerRoutes.map((route) => (
                <li key={route.path}>
                  <Link to={route.path}>{route.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contacto</h4>
            <ul className={styles.contact}>
              <li className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <a href={business.contact.phone.link} onClick={trackPhone("footer")}>
                  {business.contact.phone.display}
                </a>
              </li>
              <li className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <a href={business.contact.email.link}>{business.contact.email.display}</a>
              </li>
              <li className={styles.contactItem}>
                <Clock className={styles.contactIcon} />
                <span>{business.schedule.display}</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className={`${styles.column} ${styles.columnWide}`}>
            <h4 className={styles.columnTitle}>Síguenos</h4>
            <div className={styles.social}>
              <a
                href={business.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={business.social.instagram.label}
                className={`glass-chip ${styles.socialLink}`}
              >
                <InstagramIcon />
              </a>
              <a
                href={business.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={business.social.facebook.label}
                className={`glass-chip ${styles.socialLink}`}
              >
                <FacebookIcon />
              </a>
              <a
                href={business.social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={business.social.tiktok.label}
                className={`glass-chip ${styles.socialLink}`}
              >
                <TikTokIcon />
              </a>
              <a
                href={business.contact.whatsapp.link}
                onClick={trackWhatsApp("footer")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={`glass-chip ${styles.socialLink}`}
              >
                <WhatsAppIcon />
              </a>
            </div>
            <p className={styles.socialText}>Compártenos en tus redes</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2026 {SITE.name}. Todos los derechos reservados.</p>
          {import.meta.env.VITE_GA_MEASUREMENT_ID && <PrivacyPreferencesButton className={styles.privacyButton} />}
        </div>
      </div>
    </footer>
  );
};
