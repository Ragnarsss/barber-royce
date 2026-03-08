import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Button } from "@/components/ui/button";
import logo from "@/assets/royce-barber-logo.png";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { useLenisInstance } from "@/contexts/LenisContext";
import { getNavRoutes } from "@/config/routes";

export const Navbar = () => {
  const { isScrolled } = useNavbarScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const lenis = useLenisInstance();

  // Cerrar menú móvil automáticamente cuando se cambia a resolución desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Cerrar menú móvil cuando se cambia de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    // Si ya estamos en el home, solo hacer scroll to top
    if (location.pathname === "/") {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5, immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Si estamos en otra página, navegar al home y luego scroll to top
      navigate("/");
      setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.5, immediate: false });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
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
          <img src={logo} alt="Barber Royce" className={styles.logoImage} />
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
          <Button className={styles.ctaButton} size="lg">
            Agendar Sesión
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        <Button className={styles.ctaButton} size="lg">
          Agendar Sesión
        </Button>
      </div>
    </nav>
  );
};
