/**
 * Tipos para Location (Ubicaciones)
 * Single source of truth para estructura de ubicaciones
 */

export interface ScheduleItem {
    day: string;
    hours: string;
}

export interface Location {
    /** Identificador de la fila en la pestaña `sucursales`; el equipo lo usa para decir dónde atiende (BR-063). */
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    whatsapp: string;
    mapUrl: string;
    schedule: ScheduleItem[];
}
