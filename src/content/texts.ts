/**
 * Textos editables desde la pestaña `textos` de la hoja (BR-042, HU-CNT-002, ADR-008).
 *
 * Cada texto tiene una clave, el texto que se usa si la hoja no lo define (el que estaba escrito en el
 * componente) y un largo máximo, para que un título larguísimo no rompa el diseño. Son **texto plano**: nunca se
 * interpretan como HTML. Un salto de línea en la celda (Alt+Enter) es un salto de línea en la página: los títulos
 * que lo usan llevan `white-space: pre-line` en su CSS.
 *
 * Quedan fuera los textos que mezclan formato dentro de la frase (negritas, enlaces): por ejemplo el subtítulo
 * del Hero y el de `CTA2`.
 */
const TITLE = 120;
const SUBTITLE = 400;

export const TEXTS = {
  // Solo el lema: la marca del hero sale de `SITE.brand` (BR-050).
  "hero.lema": { default: "Profesionalismo, pasión y arte.", max: 60 },

  "cta1.titulo": { default: "Reserva tu\nExperiencia\nPremium Hoy.", max: TITLE },
  "cta1.subtitulo": {
    default: "¿Listo para un cambio que te defina? Agenda tu cita y descubre por qué somos la barbería de elección para quienes buscan lo mejor.",
    max: SUBTITLE,
  },

  "socialproof1.titulo": { default: "Respaldados por los mejores", max: TITLE },
  "socialproof1.subtitulo": {
    default:
      "Sabemos lo importante que es el cuidado e imagen para quienes viven de ella. Desde hace años somos casa de destacados Artistas musicales y Deportistas, quienes nos eligen por nuestro talento y elogian la calidad y profesionalismo de nuestro servicio",
    max: SUBTITLE,
  },

  "benefits.titulo": { default: "Estilo que te acompaña, donde sea que vayas", max: TITLE },

  "reviews.titulo": { default: "Lo Que Dicen Nuestros Clientes", max: TITLE },
  "reviews.subtitulo": { default: "Testimonios reales de quienes confían en nosotros", max: SUBTITLE },

  "features.titulo": { default: "Innovación y Calidad en Cada Detalle.", max: TITLE },
  "features.subtitulo": { default: "Combinamos la tradición con la vanguardia para ofrecerte:", max: SUBTITLE },

  "socialproof2.titulo": { default: "Clientes Felices,\nEstilos Impecables.", max: TITLE },
  "socialproof2.subtitulo": {
    default: "El trabajo realizado y la felicidad en nuestros clientes es el verdadero pago. Tu satisfacción es nuestra mejor carta de presentación.",
    max: SUBTITLE,
  },

  "cta2.titulo": { default: "¿Ya te decidiste a andar con el flow?", max: TITLE },

  // Modal de bienvenida (BR-100). `promo.activa` es el interruptor: solo «SI» la enciende (ver `src/promo`).
  "promo.activa": { default: "SI", max: 3 },
  "promo.titulo": { default: "Mascarilla facial\ngratis", max: TITLE },
  "promo.frase": { default: "Royce web", max: 30 },
  "promo.condiciones": {
    default: "Con cualquier servicio pagado, en cualquiera de nuestras sucursales. Una por persona.",
    max: SUBTITLE,
  },
} as const satisfies Record<string, { default: string; max: number }>;

export type TextKey = keyof typeof TEXTS;

/** ¿Es una clave que el sitio sabe usar? Una clave desconocida de la hoja (un error de escritura) se ignora con un aviso. */
export const isTextKey = (key: string): key is TextKey => Object.hasOwn(TEXTS, key);

/** El texto de la hoja si existe; si no, el que trae el código. */
export function textOf(texts: Record<string, string>, key: TextKey): string {
  return texts[key] ?? TEXTS[key].default;
}
