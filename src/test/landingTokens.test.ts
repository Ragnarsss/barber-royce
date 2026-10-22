import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-022, tramo de la landing (ADR-002): los colores de la portada salen de los tokens, nunca escritos a mano.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MODULES = [
  "components/sections/Hero/Hero.module.css",
  "components/sections/Reviews/Reviews.module.css",
  "components/sections/CTA2/CTA2.module.css",
  "components/layout/Navbar/Navbar.module.css",
];

// Sin comentarios: un hex citado en un comentario no es un color en uso. Las URL de datos (el grano SVG) tampoco.
const code = (file: string) =>
  readFileSync(resolve(src, file), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/url\("data:[^"]*"\)/g, "");

describe("BR-022: colores de la landing desde tokens", () => {
  it.each(MODULES)("%s no tiene hex ni rgb()/rgba() escritos a mano", (file) => {
    const literals = code(file).match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) ?? [];
    expect(literals).toEqual([]);
  });
});
