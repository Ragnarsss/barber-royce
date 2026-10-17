/**
 * Carga progresiva del catálogo (BR-068). El lote y el relleno son múltiplos de 6 para que las filas queden completas
 * tanto en escritorio (3 por fila) como en móvil (2 por fila): al llegar al final, el relleno se reemplaza por
 * productos sin que ninguna fila quede a medias.
 */
export const PRODUCTS_PER_BATCH = 12;

/** Hexágonos grises de relleno que se ven mientras quedan productos por mostrar: dos filas de escritorio, tres de móvil. */
export const PLACEHOLDER_COUNT = 6;

/**
 * Se pide el siguiente lote cuando el final del relleno entra en pantalla, no antes: así se alcanzan a ver los
 * hexágonos grises (el diseño los muestra) y se reemplazan por productos a la vista. Con un margen mayor, el lote
 * llegaría antes de que el relleno asomara y nunca se vería.
 */
export const LOAD_MARGIN = "0px";
