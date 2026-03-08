/**
 * Tipos para Location (Ubicaciones)
 * Single source of truth para estructura de ubicaciones
 */

export interface ScheduleItem {
    day: string;
    hours: string;
}

export interface Location {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    whatsapp: string;
    mapUrl: string;
    schedule: ScheduleItem[];
}
