import { BRAND_MARK_PATHS, BRAND_MARK_TRANSFORM, BRAND_MARK_VIEWBOX } from "./brandMarkPaths";

interface BrandMarkProps {
  /** Nombre accesible del logo (sale de `SITE.name`, nunca un literal). */
  title: string;
  className?: string;
}

/**
 * El monograma BR de la marca como SVG en línea. No lleva color propio: toma el del texto (`currentColor`), así cada
 * sucursal lo pinta con su color de marca desde los tokens (HU-SUC-002). Reemplaza al PNG rojo con fondo negro de la
 * barra y del pie: es nítido a cualquier tamaño y no necesita `mix-blend-mode` para ocultar un recuadro.
 */
export function BrandMark({ title, className }: BrandMarkProps) {
  return (
    <svg className={className} viewBox={BRAND_MARK_VIEWBOX} role="img" aria-label={title} focusable="false" fill="currentColor">
      <g transform={BRAND_MARK_TRANSFORM}>
        <path d={BRAND_MARK_PATHS.b} />
        <path d={BRAND_MARK_PATHS.r} />
      </g>
    </svg>
  );
}
