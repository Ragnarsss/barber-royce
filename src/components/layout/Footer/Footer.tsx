import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.title}>Barber Royce</h3>
            <p className={styles.description}>
              Estilo y elegancia para el hombre moderno
            </p>
          </div>

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

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contacto</h4>
            <ul className={styles.contact}>
              <li>Tel: (123) 456-7890</li>
              <li>Email: info@barberroyce.com</li>
              <li>Lun - Sáb: 9:00 - 20:00</li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Síguenos</h4>
            <div className={styles.social}>
              <a href="#" aria-label="Instagram">
                IG
              </a>
              <a href="#" aria-label="Facebook">
                FB
              </a>
              <a href="#" aria-label="TikTok">
                TT
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2026 Barber Royce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
