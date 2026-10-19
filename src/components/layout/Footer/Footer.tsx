import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import {
  PhoneIcon,
  EmailIcon,
  ClockIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { SITE } from "@/config/constants";
import { getFooterRoutes } from "@/config/routes";
import { useSiteContent } from "@/content/useSiteContent";
import { PrivacyPreferencesButton } from "@/analytics/PrivacyPreferencesButton";
import { trackPhone, trackWhatsApp } from "@/analytics/track";
import logo46w from "@/assets/optimized/royce-barber-logo_46w.webp";
import logo92w from "@/assets/optimized/royce-barber-logo_92w.webp";

export const Footer = () => {
  const { business } = useSiteContent();
  const footerRoutes = getFooterRoutes();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Columna principal */}
          <div className={styles.column}>
            <div className={styles.brand}>
              <h3 className={styles.title}>{SITE.name}</h3>
              <img
                src={logo46w}
                srcSet={`${logo46w} 1x, ${logo92w} 2x`}
                alt="Logo de Barbería Royce"
                className={styles.logoIcon}
                width="48"
                height="48"
                loading="lazy"
              />
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
                <PhoneIcon className={styles.contactIcon} />
                <a href={business.contact.phone.link} onClick={trackPhone("footer")}>
                  {business.contact.phone.display}
                </a>
              </li>
              <li className={styles.contactItem}>
                <EmailIcon className={styles.contactIcon} />
                <a href={business.contact.email.link}>{business.contact.email.display}</a>
              </li>
              <li className={styles.contactItem}>
                <ClockIcon className={styles.contactIcon} />
                <span>{business.schedule.display}</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Síguenos</h4>
            <div className={styles.social}>
              <a
                href={business.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={business.social.instagram.label}
                className={styles.socialLink}
              >
                <InstagramIcon />
              </a>
              <a
                href={business.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={business.social.facebook.label}
                className={styles.socialLink}
              >
                <FacebookIcon />
              </a>
              <a
                href={business.social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={business.social.tiktok.label}
                className={styles.socialLink}
              >
                <TikTokIcon />
              </a>
              <a
                href={business.contact.whatsapp.link}
                onClick={trackWhatsApp("footer")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={styles.socialLink}
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
