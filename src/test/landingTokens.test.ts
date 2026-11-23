import { readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-022 (ADR-002, RNF-MANT-003): los colores salen de los tokens, nunca escritos a mano. Un `rgba(…)` o un hex en un
// módulo no cambia con el tema de la sucursal (ADR-010, BR-104), así que la regla vale para todo el CSS de la app.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Los tokens son el único lugar donde un color se escribe. */
const TOKENS_DIR = "styles/tokens/";
/** Código muerto: no se importa en ningún lado y lo retira BR-025, no este ticket. */
const DEAD = ["App.css", "index.css", "components/common/Button/Button.module.css"];
/** Una segunda fuente de tokens (define `--color-*` con hex): la unifica BR-021. */
const OTHER_TOKEN_SOURCES = ["styles/variables.css"];

const posix = (file: string) => file.split("\\").join("/");
const STYLESHEETS = readdirSync(src, { recursive: true, encoding: "utf8" })
  .map(posix)
  .filter((file) => file.endsWith(".css") && !file.startsWith(TOKENS_DIR) && !DEAD.includes(file) && !OTHER_TOKEN_SOURCES.includes(file))
  .sort();

// Sin comentarios: un hex citado en un comentario no es un color en uso. Las URL de datos (el grano SVG) tampoco.
const withoutNoise = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/url\("data:[^"]*"\)/g, "");
const code = (file: string) => withoutNoise(readFileSync(resolve(src, file), "utf8"));

const LITERAL = /#[0-9a-fA-F]{3,8}\b|(?:rgba?|hsla?)\([^)]*\)/g;

describe("BR-022: colores de todo el CSS desde tokens", () => {
  it("encuentra las hojas de estilo de la app (la lista no queda vacía por un cambio de carpeta)", () => {
    expect(STYLESHEETS.length).toBeGreaterThan(40);
    expect(STYLESHEETS).toContain("components/sections/Hero/Hero.module.css");
    expect(STYLESHEETS).not.toContain("styles/tokens/colors.css");
  });

  it.each(STYLESHEETS)("%s no tiene hex, rgb(), rgba() ni hsl() escritos a mano", (file) => {
    expect(code(file).match(LITERAL) ?? []).toEqual([]);
  });

  it("el detector sí ve un hex, un rgba y un hsl, y no confunde un comentario con un color", () => {
    expect(withoutNoise("a{color:#fff}").match(LITERAL)).toEqual(["#fff"]);
    expect(withoutNoise("a{background:rgba(0, 0, 0, .5)}").match(LITERAL)).toEqual(["rgba(0, 0, 0, .5)"]);
    expect(withoutNoise("a{color:hsl(10 20% 30%)}").match(LITERAL)).toEqual(["hsl(10 20% 30%)"]);
    expect(withoutNoise("/* #d52323 */ a{color:var(--color-brand-primary)}").match(LITERAL)).toBeNull();
  });
});

describe("BR-022: estilos inline de color", () => {
  const INLINE = ["components/ui/ScrollProgressBar/ScrollProgressBar.tsx"];

  it.each(INLINE)("%s no escribe colores a mano", (file) => {
    const text = readFileSync(resolve(src, file), "utf8");
    expect(withoutNoise(text).match(LITERAL) ?? [], relative(src, resolve(src, file))).toEqual([]);
  });
});
