/**
 * Tipos para Service (Servicios)
 * Single source of truth para estructura de servicios
 */

export interface Service {
    name: string;
    description: string;
    price: string;
    duration: string;
    includes: string;
    image: string;
    category: string;
}

export type ServiceCategory = "Todos" | "Corte de Cabello" | "Barba" | "Colorimetría" | "Otros";

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
    "Todos",
    "Corte de Cabello",
    "Barba",
    "Colorimetría",
    "Otros"
] as const;
