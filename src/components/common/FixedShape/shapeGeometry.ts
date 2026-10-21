/** Figura de fondo con geometría fija (BR-091): su caja de referencia y sus puntos en coordenadas de esa caja. */
export interface FixedShapeGeometry {
  width: number;
  height: number;
  points: string;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Convierte un `polygon()` en porcentajes en puntos fijos sobre la caja en que se diseñó (BR-091). Con porcentajes, cada
 * eje se estira por separado y la figura cambia con la proporción de la ventana; con un `viewBox` fijo solo se escala.
 */
export function fixedShape(width: number, height: number, percents: ReadonlyArray<readonly [number, number]>): FixedShapeGeometry {
  return {
    width,
    height,
    points: percents.map(([x, y]) => `${round((x * width) / 100)},${round((y * height) / 100)}`).join(" "),
  };
}
