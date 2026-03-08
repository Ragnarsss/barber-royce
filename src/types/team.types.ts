/**
 * Tipos para TeamMember (Miembros del equipo)
 * Single source of truth para estructura de equipo
 */

export interface TeamMember {
    name: string;
    role: string;
    experience: string;
    image: string;
    isLead: boolean;
}
