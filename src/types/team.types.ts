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
    /** Enlace de reserva propio del barbero (BR-063); vacío = el enlace general de AgendaPro. */
    bookingUrl: string;
    /** Instagram del barbero (BR-063); vacío = no se muestra. */
    instagram: string;
    /** Hasta 3 fotos de sus trabajos (BR-063). */
    works: string[];
    /** Frase corta del barbero para la ficha (BR-063). */
    quote: string;
    /** Días que atiende, de 0 (lunes) a 6 (domingo) (BR-063); vacío = no se muestra. */
    workDays: number[];
    /** Ids de las sucursales (pestaña `sucursales`) donde atiende (BR-063). */
    branchIds: string[];
}
