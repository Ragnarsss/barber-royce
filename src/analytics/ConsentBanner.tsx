import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { consumeFocusRequest } from "./consent";
import styles from "./ConsentBanner.module.css";

interface ConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

/**
 * Aviso de consentimiento (BR-037, HU-MED-003). "Aceptar" y "Rechazar" son botones idénticos
 * (mismo tamaño, color y peso): rechazar no puede costar más que aceptar.
 * Es fijo, así que no empuja el contenido (CLS 0), y no roba el foco al cargar la página;
 * solo lo toma cuando el visitante lo reabre a propósito desde "Preferencias de privacidad".
 */
export function ConsentBanner({ onAccept, onReject }: ConsentBannerProps) {
  const rejectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (consumeFocusRequest()) rejectRef.current?.focus();
  }, []);

  return (
    <section className={styles.banner} role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <h2 id="consent-title" className={styles.title}>
        Tu privacidad
      </h2>
      <p className={styles.text}>
        Usamos un servicio de medición para saber cuántas personas visitan el sitio y qué botones tocan. No guardamos tu nombre
        ni tu teléfono. ¿Aceptas la medición?{" "}
        <Link to={ROUTES.privacy.path} className={styles.link}>
          Más información
        </Link>
      </p>
      <div className={styles.actions}>
        <button type="button" ref={rejectRef} className={styles.button} onClick={onReject}>
          Rechazar
        </button>
        <button type="button" className={styles.button} onClick={onAccept}>
          Aceptar
        </button>
      </div>
    </section>
  );
}
