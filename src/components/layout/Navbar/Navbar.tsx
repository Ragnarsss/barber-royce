import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo46w from "@/assets/optimized/royce-barber-logo_46w.webp";
import logo92w from "@/assets/optimized/royce-barber-logo_92w.webp";
import logoAvif from "@/assets/optimized/royce-barber-logo_46w.avif";
import logo from "@/assets/royce-barber-logo.png";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { useLenisInstance } from "@/contexts/LenisContext";
import { getNavRoutes } from "@/config/routes";

export const Navbar = () => {
  const { isScrolled } = useNavbarScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const lenis = useLenisInstance();

  // Cerrar menú móvil automáticamente cuando se cambia a resolución desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    setIsMobileMenuOpen(false);

    // Solo interceptar si ya estamos en "/" para hacer scroll suave al top.
    // Si estamos en otra página, dejamos que Link navegue normalmente
    // y ScrollToTop se encarga del scroll (sin race condition ni setTimeout).
    if (location.pathname === "/") {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }

  const navLinks = getNavRoutes();

  return (
    <nav
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={handleLogoClick} aria-label="Ir a la página de inicio">
          <picture>
            <source
              srcSet={`${logo46w} 1x, ${logo92w} 2x`}
              type="image/webp"
            />
            <source
              srcSet={logoAvif}
              type="image/avif"
            />
            <img src={logo} alt="Barber Royce" className={styles.logoImage} width="46" height="56" />
          </picture>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link, index) => (
            <div key={link.path} style={{ display: "contents" }}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                {link.label}
              </NavLink>
              {index < navLinks.length - 1 && (
                <span className={styles.separator}>|</span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <a
            className={styles.ctaButton}
            href="https://barberiaroyc.site.agendapro.com/cl/sucursal/400965"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar Sesión
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""
          }`}
        role="menu"
        aria-label="Menú de navegación móvil"
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.active : ""}`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <a
          href="https://barberiaroyc.site.agendapro.com/cl/sucursal/400965"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaButton}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Agendar Sesión
        </a>
      </div>
    </nav >
  );
};
