import { CardCarousel } from "@/components/common/CardCarousel/CardCarousel";
import { PageHero } from "@/components/common/PageHero/PageHero";
import type { TeamMember } from "@/types/team.types";
import type { TeamViewProps } from "./teamView";
import styles from "./TeamCarouselLaSerena.module.css";

/** Lo que va bajo el nombre: las especialidades, o el cargo si el dueño no las escribió. */
const subtitleOf = ({ specialties, role }: TeamMember) => (specialties.length > 0 ? specialties.slice(0, 3).join(" · ") : role);

/**
 * La vista del equipo de La Serena (BR-107, HU-SUC-002 CA-05): un carrusel de tarjetas rectangulares sobre `CardCarousel`
 * (scroll-snap, arrastre, teclado, botones y puntos). La tarjeta que se ve va a escala completa y las demás, más chicas y
 * tenues; ese estado lo marca el `IntersectionObserver` del carrusel, no el scroll (sin `setState` por evento). El
 * diálogo de la ficha es el mismo de Coquimbo.
 */
export default function TeamCarouselLaSerena({ team, onSelect }: TeamViewProps) {
  return (
    <div className={styles.page}>
      <PageHero title="Nuestro equipo" subtitle="Profesionales apasionados por su oficio" animated={false} />
      <section className={styles.section}>
        <CardCarousel label="Equipo de La Serena" desktopVisible={3} glass>
          {/* data-lenis-prevent: el arrastre horizontal es de la fila, no del scroll suave de la página */}
          <div className={styles.track} data-lenis-prevent>
            {team.map((member, index) => (
              <div
                key={member.name}
                className={styles.slide}
                role="group"
                aria-roledescription="diapositiva"
                aria-label={`Barbero ${index + 1} de ${team.length}`}
              >
                <button type="button" className={styles.card} onClick={() => onSelect(member)} aria-label={`${member.name}, ${member.role}`}>
                  <img
                    className={styles.photo}
                    src={member.image}
                    alt=""
                    width={480}
                    height={640}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                  <span className={styles.band}>
                    <span className={styles.name}>{member.name}</span>
                    <span className={styles.specialty}>{subtitleOf(member)}</span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </CardCarousel>
      </section>
    </div>
  );
}
