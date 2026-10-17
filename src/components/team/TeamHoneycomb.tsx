import type { TeamMember } from "@/types/team.types";
import { Honeycomb } from "@/components/common/Honeycomb/Honeycomb";
import { buildHoneycomb } from "@/components/common/Honeycomb/honeycombLayout";

interface TeamHoneycombProps {
  team: TeamMember[];
  /** Se llama al activar un barbero (clic, Enter o Espacio). */
  onSelect?: (member: TeamMember) => void;
}

/**
 * Panal del equipo (BR-060, HU-EXP-004 CA-12): el líder más grande y con marco rojo, el resto con marco blanco. Al
 * pasar el cursor o enfocar un hexágono se ve el nombre y el cargo. La foto del líder es el LCP de la página.
 */
export const TeamHoneycomb = ({ team, onSelect }: TeamHoneycombProps) => {
  const { cells, desktop, mobile } = buildHoneycomb(team);

  return (
    <Honeycomb
      desktop={desktop}
      mobile={mobile}
      items={cells.map(({ member, isLead, desktop: d, mobile: m }) => ({
        key: member.name,
        image: member.image,
        imageAlt: member.name,
        label: `${member.name}, ${member.role}`,
        title: member.name,
        subtitle: member.role,
        isLead,
        eager: isLead,
        desktop: d,
        mobile: m,
        onSelect: () => onSelect?.(member),
      }))}
    />
  );
};
