/**
 * Con "reducir movimiento" activo, un rango de salida de parallax se aplana
 * al valor inicial: la capa no se desplaza, no escala y no rota (BR-017,
 * RNF-A11Y-003). Se aplana el rango en vez de omitir el hook para respetar
 * la regla de los hooks y no cambiar la forma de lo que devuelven.
 */
export function calmRange<T>(range: readonly T[], reduced: boolean): T[] {
  return reduced ? range.map(() => range[0]) : [...range];
}
