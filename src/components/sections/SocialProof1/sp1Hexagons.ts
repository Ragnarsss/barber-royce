import { fixedShape } from "@/components/common/FixedShape/shapeGeometry";

/** Capa de parallax de cada hexágono: decide su movimiento y su aspecto (relleno, borde y brillo). */
export type Sp1HexagonLayer = "background" | "middle" | "foreground" | "small";

/** Hexágono de lados planos arriba y abajo, el mismo `clip-path` de antes (BR-092), sobre una caja cuadrada. */
export const SP1_HEXAGON_SHAPE = fixedShape(100, 100, [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]]);

/**
 * Los 14 hexágonos de fondo de «Respaldados por los mejores» (BR-092), en el orden en que se pintan. La rotación es la de
 * su diseño: antes iba en un `transform` del CSS que framer pisaba con el suyo y no se veía. Ahora va en la propiedad
 * `rotate`, que se suma al transform de framer. Su posición, tamaño y opacidad siguen en el CSS de la sección.
 */
export const SP1_HEXAGONS = {
  hexagonBackground1: { layer: "background", rotate: 12 },
  hexagonBackground2: { layer: "background", rotate: -8 },
  hexagonBackground3: { layer: "background", rotate: 35 },
  hexagonBackground4: { layer: "background", rotate: -25 },
  hexagonMiddle1: { layer: "middle", rotate: 20 },
  hexagonMiddle2: { layer: "middle", rotate: -15 },
  hexagonMiddle3: { layer: "middle", rotate: 40 },
  hexagonMiddle4: { layer: "middle", rotate: -35 },
  hexagonForeground1: { layer: "foreground", rotate: 30 },
  hexagonForeground2: { layer: "foreground", rotate: -40 },
  hexagonSmall1: { layer: "small", rotate: 45 },
  hexagonSmall2: { layer: "small", rotate: -30 },
  hexagonSmall3: { layer: "small", rotate: 60 },
  hexagonSmall4: { layer: "small", rotate: -50 },
} as const satisfies Record<string, { layer: Sp1HexagonLayer; rotate: number }>;

export type Sp1HexagonName = keyof typeof SP1_HEXAGONS;
