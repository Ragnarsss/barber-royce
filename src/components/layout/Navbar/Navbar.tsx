import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../../common/Button";
import styles from "./Navbar.module.css";

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
    { to: "/", label: "Inicio" },
    { to: "/servicios", label: "Servicios" },
    { to: "/productos", label: "Productos" },
    { to: "/equipo", label: "Equipo" },
    { to: "/ubicacion", label: "Ubicación" },
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>BR</span>
          <span className={styles.logoText}>ROYCE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" size="medium">
            Agendar Ahora
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
        <Button fullWidth size="large">
          Reservar Cita
        </Button>
      </div>
    </nav>
  );
};
