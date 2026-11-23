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

/**
 * Rectángulo de seis puntos (BR-104): el tema de La Serena cambia los hexágonos por cuadrados, y para que framer pueda
 * transformar uno en otro necesitan la misma cantidad de puntos. Va centrado en su caja, ocupa `fill` de su ancho y
 * alto y se gira `deg` grados. Los puntos van en el mismo sentido que los de un hexágono que empieza arriba: mitad del
 * lado de arriba, esquina superior derecha, inferior derecha, mitad del lado de abajo, inferior izquierda y superior izquierda.
 */
export function tiltedRect(width: number, height: number, fill: number, deg: number): FixedShapeGeometry {
  const [hw, hh] = [(width * fill) / 2, (height * fill) / 2];
  const [sin, cos] = [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)];
  const corners: Array<[number, number]> = [[0, -hh], [hw, -hh], [hw, hh], [0, hh], [-hw, hh], [-hw, -hh]];
  return {
    width,
    height,
    points: corners.map(([x, y]) => `${round(width / 2 + x * cos - y * sin)},${round(height / 2 + x * sin + y * cos)}`).join(" "),
  };
}
