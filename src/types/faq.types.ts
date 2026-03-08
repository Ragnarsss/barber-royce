/**
 * Tipos para FAQ (Preguntas Frecuentes)
 * Single source of truth para estructura de FAQs
 */

export interface FAQ {
    question: string;
    answer: string;
    category: FAQCategory;
}

export type FAQCategory = "Reservas y Horarios" | "Servicios" | "Precios y Pagos" | "Otros";

export const FAQ_CATEGORIES: readonly FAQCategory[] = [
    "Reservas y Horarios",
    "Servicios",
    "Precios y Pagos",
    "Otros"
] as const;
