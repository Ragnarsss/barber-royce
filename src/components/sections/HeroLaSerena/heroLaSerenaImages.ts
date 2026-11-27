import laSerena874w from "@/assets/optimized/branch_la_serena_874w.webp";

/**
 * Fotos de los carruseles laterales del hero de La Serena (BR-114). Pendiente del dueño (BR-114): hoy hay una sola foto
 * del local, así que cada tarjeta es un encuadre distinto de la misma. Cuando lleguen las fotos (8 a 12), se reemplaza esta
 * lista y nada más: el componente no sabe cuántas son.
 */
export interface RailImage {
  src: string;
  /** Encuadre de la foto dentro de la tarjeta (`object-position`). */
  position: string;
}

export const RAIL_IMAGES: readonly RailImage[] = [
  { src: laSerena874w, position: "8% 45%" },
  { src: laSerena874w, position: "42% 30%" },
  { src: laSerena874w, position: "72% 60%" },
  { src: laSerena874w, position: "25% 85%" },
  { src: laSerena874w, position: "90% 35%" },
  { src: laSerena874w, position: "55% 70%" },
];
