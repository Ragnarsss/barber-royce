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
    /** Especialidades para los chips de la ficha (BR-063); vacía si el dueño no las escribió. */
    specialties: string[];
    /** Descripción de la ficha (BR-063); vacía si el dueño no la escribió. */
    description: string;
}
