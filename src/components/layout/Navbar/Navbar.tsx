import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/equipo", label: "TEAM" },
    { to: "/productos", label: "PRODUCTOS" },
    { to: "/servicios", label: "SERVICIOS" },
    { to: "/ubicacion", label: "UBICACIÓN Y HORARIOS" },
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <span className={styles.logoR}>R</span>
            <span className={styles.logoR}>R</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link, index) => (
            <>
              <NavLink
                key={link.to}
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
            </>
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
