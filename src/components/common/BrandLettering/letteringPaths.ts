import source from "@/assets/lettering.svg?raw";

/**
 * El lettering «Barbería Royce» del dueño, leído de `src/assets/lettering.svg` (Inkscape) para el hero de las dos sucursales
 * y el pie (BR-114, BR-122). **El archivo es la única fuente:** para cambiar el lettering se reemplaza ese SVG y listo, sin
 * copiar nada a mano. Se espera lo que exporta Inkscape: dos capas (`<g>`), la primera «Barbería» y la segunda «Royce», con un
 * `<path>` por letra, y un `translate` en la capa que mueve el dibujo a la página.
 *
 * Cada letra va en su propio `<path>`: las curvas del archivo son relativas, y unidas en uno solo se arrastran de una letra
 * a la siguiente. Los trazos rojos y la opacidad de calco del archivo no se usan: el color lo pone quien dibuja la marca. Al
 * ser un dibujo y no texto, se pinta sin esperar a ninguna fuente, cada letra se puede trazar con `pathLength` y las
 * partículas salen de sus contornos.
 *
 * El texto de abajo debe decir lo mismo que `SITE.brand` (lo comprueba BrandLettering.test.tsx).
 */
export const LETTERING_PREFIX_TEXT = "Barbería";
export const LETTERING_NAME_TEXT = "Royce";

const [prefixLayer = "", nameLayer = ""] = source.split("</g>");
const pathsOf = (layer: string): readonly string[] => [...layer.matchAll(/<path d="([^"]+)"/g)].map((match) => match[1].replace(/\s+/g, " ").trim());

/** «Barbería»: un trazado por letra (y uno para el acento de la í). */
export const LETTERING_PREFIX_PATHS: readonly string[] = pathsOf(prefixLayer);

/** «Royce»: un trazado por letra o grupo de letras unidas en el archivo. */
export const LETTERING_NAME_PATHS: readonly string[] = pathsOf(nameLayer);

/**
 * La página del archivo: el `viewBox` de Inkscape y el `translate` de la capa (`translate(-x -y)` mueve el dibujo a la
 * página, así que el origen del `viewBox` es `x y`). Con esto no hace falta un `transform` dentro del SVG que se dibuja.
 */
const page = source.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)\s*"/);
const [pageWidth, pageHeight] = page ? [page[1], page[2]] : ["0", "0"];
const shift = source.match(/<g transform="translate\((-?[\d.]+)[ ,]+(-?[\d.]+)\)"/);
const [originX, originY] = shift ? [-Number(shift[1]), -Number(shift[2])] : [0, 0];

export const LETTERING_VIEWBOX = `${originX} ${originY} ${pageWidth} ${pageHeight}`;
