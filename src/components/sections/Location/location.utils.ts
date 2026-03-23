import type { Location } from "@/types/location.types";

/**
 * Representa un item de tabs asociado a una sucursal.
 */
export interface LocationTabItem {
  location: Location;
  value: string;
}

/**
 * Convierte un texto en un slug URL-safe.
 *
 * @param value - Texto de entrada.
 * @returns Texto normalizado en formato slug.
 */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Mapea ubicaciones a items listos para usar en el sistema de tabs.
 *
 * @param locations - Lista de sucursales.
 * @returns Lista de items con valor unico por tab.
 */
export const toLocationTabItems = (locations: Location[]): LocationTabItem[] =>
  locations.map((location, index) => {
    const slug = slugify(location.name);

    return {
      location,
      value: slug.length > 0 ? `${slug}-${index}` : `location-${index}`,
    };
  });
