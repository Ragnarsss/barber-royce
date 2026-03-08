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
import { getFooterRoutes } from "@/config/routes";
import { CONTACT, SCHEDULE, SOCIAL_MEDIA } from "@/config/constants";

export const Footer = () => {
  const footerRoutes = getFooterRoutes();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Columna principal */}
          <div className={styles.column}>
            <div className={styles.brand}>
              <h3 className={styles.title}>Barber Royce</h3>
              <div className={styles.logoIcon}>BR</div>
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
                <a href={CONTACT.phone.link}>{CONTACT.phone.display}</a>
              </li>
              <li className={styles.contactItem}>
                <EmailIcon className={styles.contactIcon} />
                <a href={CONTACT.email.link}>{CONTACT.email.display}</a>
              </li>
              <li className={styles.contactItem}>
                <ClockIcon className={styles.contactIcon} />
                <span>{SCHEDULE.display}</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Síguenos</h4>
            <div className={styles.social}>
              <a
                href={SOCIAL_MEDIA.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_MEDIA.instagram.label}
                className={styles.socialLink}
              >
                <InstagramIcon />
              </a>
              <a
                href={SOCIAL_MEDIA.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_MEDIA.facebook.label}
                className={styles.socialLink}
              >
                <FacebookIcon />
              </a>
              <a
                href={SOCIAL_MEDIA.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={SOCIAL_MEDIA.tiktok.label}
                className={styles.socialLink}
              >
                <TikTokIcon />
              </a>
              <a
                href={CONTACT.whatsapp.link}
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
          <p>&copy; 2026 Barber Royce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
