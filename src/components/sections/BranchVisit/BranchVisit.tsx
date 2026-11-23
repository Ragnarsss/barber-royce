import { trackReserve } from "@/analytics/track";
import { useBookingUrl } from "@/branch/useBookingUrl";
import { useBranchLocation } from "@/branch/useBranchLocation";
import type { Branch } from "@/config/branches";
import styles from "./BranchVisit.module.css";

/**
 * El bloque de una sucursal en su portada (BR-106): dirección, horario y el botón para reservar. Los datos salen de la
 * fila de `sucursales` (`useSiteContent`), nunca escritos aquí (RNF-DATOS-001). Sin esa fila no hay nada que mostrar.
 */
export function BranchVisit({ branch }: { branch: Branch }) {
  const location = useBranchLocation(branch);
  const bookingUrl = useBookingUrl();
  if (!location) return null;

  return (
    <section className={styles.visit} aria-labelledby={`visit-${branch}`}>
      <div className={styles.inner}>
        <h2 id={`visit-${branch}`} className={styles.title}>
          Visítanos
        </h2>
        <p className={styles.address}>
          {location.address}
          <br />
          {location.city}
        </p>
        <dl className={styles.schedule}>
          {location.schedule.map(({ day, hours }) => (
            <div key={day} className={styles.row}>
              <dt>{day}</dt>
              <dd>{hours}</dd>
            </div>
          ))}
        </dl>
        <a className={styles.book} href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={trackReserve("portada")}>
          Reservar hora
        </a>
      </div>
    </section>
  );
}
