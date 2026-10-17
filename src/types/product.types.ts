/**
 * Tipos para Product (Productos)
 * Single source of truth para estructura de productos
 */

export interface Product {
    /** Identificador de la fila en la pestaña `productos` (único aunque el nombre se repita; BR-067). */
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: ProductCategory;
}

export type ProductCategory = "Todos" | "Styling" | "Barba" | "Cuidado" | "Kits";

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
    "Todos",
    "Styling",
    "Barba",
    "Cuidado",
    "Kits"
] as const;
