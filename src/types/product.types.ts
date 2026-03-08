/**
 * Tipos para Product (Productos)
 * Single source of truth para estructura de productos
 */

export interface Product {
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
