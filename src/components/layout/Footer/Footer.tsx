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

export const Footer = () => {
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
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/servicios">Servicios</Link>
              </li>
              <li>
                <Link to="/productos">Productos</Link>
              </li>
              <li>
                <Link to="/equipo">Equipo</Link>
              </li>
              <li>
                <Link to="/ubicacion">Ubicación</Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contacto</h4>
            <ul className={styles.contact}>
              <li className={styles.contactItem}>
                <PhoneIcon className={styles.contactIcon} />
                <a href="tel:+1234567890">(123) 456-7890</a>
              </li>
              <li className={styles.contactItem}>
                <EmailIcon className={styles.contactIcon} />
                <a href="mailto:info@barberroyce.com">info@barberroyce.com</a>
              </li>
              <li className={styles.contactItem}>
                <ClockIcon className={styles.contactIcon} />
                <span>Lun - Sáb: 9:00 - 20:00</span>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Síguenos</h4>
            <div className={styles.social}>
              <a
                href="https://instagram.com/barberroyce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={styles.socialLink}
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com/barberroyce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={styles.socialLink}
              >
                <FacebookIcon />
              </a>
              <a
                href="https://tiktok.com/@barberroyce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={styles.socialLink}
              >
                <TikTokIcon />
              </a>
              <a
                href="https://wa.me/1234567890"
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
