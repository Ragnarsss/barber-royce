import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { TEXTS, type TextKey } from "../content/texts";

// BR-042: los textos editables son texto plano; un salto de línea de la celda de la hoja solo se ve como salto en la
// página si el título lleva `white-space: pre-line`. Sin esto, «Línea uno\nLínea dos» se mostraría en una sola línea.
const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Clave de texto con salto de línea → CSS del componente que la muestra. */
const MULTILINE: Partial<Record<TextKey, string>> = {
  "hero.titulo": "components/sections/Hero/Hero.module.css",
  "cta1.titulo": "components/sections/CTA1/CTA1.module.css",
  "socialproof2.titulo": "components/sections/SocialProof2/SocialProof2.module.css",
};

describe("títulos de varias líneas (BR-042)", () => {
  it("todo texto por defecto con salto de línea está en la lista de abajo (y solo esos)", () => {
    const withBreak = (Object.keys(TEXTS) as TextKey[]).filter((key) => TEXTS[key].default.includes("\n"));

    expect(withBreak.sort()).toEqual(Object.keys(MULTILINE).sort());
  });

  it.each(Object.entries(MULTILINE))("%s: su `.title` lleva white-space: pre-line", (_key, file) => {
    const css = readFileSync(resolve(srcDir, file as string), "utf8");
    const rule = css.match(/\n\.title\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(rule).toMatch(/white-space:\s*pre-line/);
  });
});
