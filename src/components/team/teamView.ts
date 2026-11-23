import type { TeamMember } from "@/types/team.types";

/** Lo que recibe cada vista del equipo (ADR-010 nivel 3: una vista por sucursal). */
export interface TeamViewProps {
  team: TeamMember[];
  /** Se llama al activar un barbero: la página abre su ficha. */
  onSelect: (member: TeamMember) => void;
}
