import laSerena874w from "@/assets/optimized/branch_la_serena_874w.webp";

/**
 * Fotos del local de La Serena para los carruseles: los laterales del hero (BR-114) y la franja de Beneficios (BR-117).
 * Pendiente del dueño (BR-121): hoy hay una sola foto del local, así que cada tarjeta es un encuadre distinto de la misma.
 * Cuando lleguen las fotos (8 a 12), se reemplaza esta lista y nada más: los componentes no saben cuántas son.
 */
export interface LaSerenaPhoto {
  src: string;
  /** Encuadre de la foto dentro de la tarjeta (`object-position`). */
  position: string;
}

export const LA_SERENA_PHOTOS: readonly LaSerenaPhoto[] = [
  { src: laSerena874w, position: "8% 45%" },
  { src: laSerena874w, position: "42% 30%" },
  { src: laSerena874w, position: "72% 60%" },
  { src: laSerena874w, position: "25% 85%" },
  { src: laSerena874w, position: "90% 35%" },
  { src: laSerena874w, position: "55% 70%" },
];
