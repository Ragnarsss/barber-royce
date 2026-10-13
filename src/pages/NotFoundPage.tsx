import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CalendarCheck, Home } from "lucide-react";
import { BOOKING, SITE } from "@/config/constants";
import { trackReserve } from "@/analytics/track";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <section className={styles.container} aria-labelledby="not-found-title">
      <Helmet>
        <title>{`Página no encontrada | ${SITE.name}`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className={styles.content}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 id="not-found-title" className={styles.title}>
          Esta página no existe
        </h1>
        <p className={styles.description}>
          Puede que el enlace esté mal escrito o que la página se haya movido.
          Vuelve al inicio o reserva tu hora directamente.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryAction}>
            <Home size={20} aria-hidden="true" />
            Volver al inicio
          </Link>
          <a
            href={BOOKING.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryAction}
            onClick={trackReserve("404")}
          >
            <CalendarCheck size={20} aria-hidden="true" />
            {BOOKING.label}
            <span className={styles.srOnly}> (se abre en una pestaña nueva)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
