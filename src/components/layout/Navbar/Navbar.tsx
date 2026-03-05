import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Button } from "@/components/ui/button";
import logo from "@/assets/royce-barber-logo.png";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Si ya estamos en el home, solo hacer scroll to top
    if (location.pathname === "/") {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.5, immediate: false });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Si estamos en otra página, navegar al home y luego scroll to top
      navigate("/");
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.5, immediate: false });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    }
  };

  const navLinks = [
    { to: "/equipo", label: "TEAM" },
    { to: "/productos", label: "PRODUCTOS" },
    { to: "/servicios", label: "SERVICIOS" },
    { to: "/ubicacion", label: "UBICACIÓN Y HORARIOS" },
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={handleLogoClick}>
          <img src={logo} alt="Barber Royce" className={styles.logoImage} />
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link, index) => (
            <div key={link.to} style={{ display: "contents" }}>
              <NavLink
                to={link.to}
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
          aria-label="Toggle menu"
        >
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
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
