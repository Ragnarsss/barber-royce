import { useId } from "react";
import { CalendarCheck, MapPin } from "lucide-react";
import type { TeamMember } from "@/types/team.types";
import { trackReserve } from "@/analytics/track";
import { ModalDialog, ModalSplit } from "@/components/common/ModalDialog/ModalDialog";
import { InstagramIcon } from "@/components/icons";
import { WEEK_DAYS } from "@/content/days";
import { useSiteContent } from "@/content/useSiteContent";
import { experienceHighlight } from "./experience";
import styles from "./BarberProfileDialog.module.css";

interface BarberProfileDialogProps {
  member: TeamMember;
  onClose: () => void;
}

/**
 * Ficha de un barbero (BR-063, HU-INFO-003 CA-07, HU-EXP-004 CA-15): la foto ocupa un tercio y se funde hacia el
 * negro donde van el nombre, su frase, los años de experiencia, las especialidades, la descripción, fotos de sus
 * trabajos y los botones para reservar con él y ver su Instagram. Todo lo opcional que falta no deja hueco.
 * El comportamiento del diálogo (foco, Escape, fondo, Lenis) es el de `ModalDialog`.
 */
export const BarberProfileDialog = ({ member, onClose }: BarberProfileDialogProps) => {
  const { business, locations } = useSiteContent();
  const branches = locations.filter((location) => member.branchIds.includes(location.id));
  const years = experienceHighlight(member.experience);
  const firstName = member.name.split(" ")[0];
  const titleId = useId();
  const descriptionId = useId();

  return (
    <ModalDialog onClose={onClose} titleId={titleId} descriptionId={member.description ? descriptionId : undefined} split>
      <ModalSplit image={member.image} alt={member.name}>
        <p className={styles.role}>
          {member.role}
          {!years && member.experience && <span className={styles.experience}> · {member.experience}</span>}
        </p>
        <h2 id={titleId} className={styles.name}>
          {member.name}
        </h2>
        {member.quote && <p className={styles.quote}>«{member.quote}»</p>}
        <div className="glass-divider" aria-hidden="true" />

        {(years || member.specialties.length > 0) && (
          <div className={styles.facts}>
            {years && (
              <p className={styles.stat}>
                <span className={styles.statValue}>{years.value}</span>
                <span className={styles.statLabel}>{years.label}</span>
              </p>
            )}
            {member.specialties.length > 0 && (
              <ul className={styles.chips} aria-label="Especialidades">
                {member.specialties.map((specialty) => (
                  <li key={specialty} className={styles.chip}>
                    {specialty}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(member.workDays.length > 0 || branches.length > 0) && (
          <div className={styles.availability}>
            {member.workDays.length > 0 && (
              <p className={styles.week}>
                <span className="sr-only">Atiende: {member.workDays.map((day) => WEEK_DAYS[day].long).join(", ")}</span>
                <span className={styles.weekDays} aria-hidden="true">
                  {WEEK_DAYS.map((day, index) => (
                    <span key={day.long} className={styles.weekDay} data-on={member.workDays.includes(index) || undefined} title={day.long}>
                      {day.short}
                    </span>
                  ))}
                </span>
              </p>
            )}
            {branches.length > 0 && (
              <p className={styles.branches}>
                <MapPin aria-hidden="true" />
                <span className="sr-only">Sucursal: </span>
                {branches.map((branch) => branch.name).join(" · ")}
              </p>
            )}
          </div>
        )}

        {member.description && (
          <p id={descriptionId} className={styles.description}>
            {member.description}
          </p>
        )}

        {member.works.length > 0 && (
          <ul className={styles.works} aria-label={`Trabajos de ${member.name}`}>
            {member.works.map((work, index) => (
              <li key={work} className={styles.work}>
                <img src={work} alt={`Trabajo de ${member.name} (${index + 1})`} width="400" height="300" loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <a
            className={styles.reserve}
            href={member.bookingUrl || business.booking.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackReserve("equipo")}
          >
            <CalendarCheck aria-hidden="true" />
            Reservar con {firstName}
          </a>
          {member.instagram && (
            <a className={styles.social} href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram de ${member.name}`}>
              <InstagramIcon size={20} />
              <span aria-hidden="true">Instagram</span>
            </a>
          )}
        </div>
      </ModalSplit>
    </ModalDialog>
  );
};
