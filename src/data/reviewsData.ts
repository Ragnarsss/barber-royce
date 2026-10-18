import type { Review } from "@/types/review.types";

/**
 * Reseñas de ejemplo, provisorias: ninguna es real. `BR-052` las reemplaza por las de Google (como máximo 5). Las dos
 * últimas se agregaron el 2026-10-17, a pedido del usuario, para ver el carrusel de escritorio con 5 (`BR-073`).
 * No se agrega `aggregateRating` al JSON-LD con estos datos.
 */
export const reviewsList: Review[] = [
  {
    name: "Carlos M.",
    rating: 5,
    comment:
      "Excelente servicio, siempre salgo satisfecho. El mejor lugar para un corte profesional.",
  },
  {
    name: "Miguel R.",
    rating: 5,
    comment:
      "Ambiente increíble y barberos expertos. Totalmente recomendado.",
  },
  {
    name: "Juan P.",
    rating: 5,
    comment:
      "Llevo años viniendo aquí y nunca me ha decepcionado. La atención es de primera.",
  },
  {
    name: "Andrés V.",
    rating: 5,
    comment:
      "Me atendieron puntual y con mucho detalle. Salí con el corte que quería y un trato que se agradece.",
  },
  {
    name: "Felipe S.",
    rating: 5,
    comment:
      "Un lugar cuidado, con buena música y barberos que te asesoran de verdad. Ya agendé mi próxima hora.",
  },
];
