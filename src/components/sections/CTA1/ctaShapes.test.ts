import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CTA_SHAPES } from "./ctaShapes";

// BR-091: las figuras de CTA1 tienen geometría fija, tomada de cómo se ven a 1920×1080 (decisión del usuario, 2026-10-21).
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "CTA1.module.css"), "utf8");
const shapeSource = readFileSync(resolve(here, "../../common/FixedShape/FixedShape.tsx"), "utf8");
const desktop = css.slice(css.indexOf("@media (min-width: 769px)"));
const rule = (name: string) => css.match(new RegExp(`\\n\\.${name}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("BR-091: figuras de CTA1 con geometría fija", () => {
  it("CA-34: cada hexágono conserva la caja que tenía a 1920×1080", () => {
    // 40vw × 80vh, 45vw × 90vh y 30vw × 60vh medidos en una ventana de 1920 × 1080; el de la foto, el 62 % de 960 × 1080
    expect([CTA_SHAPES.textHexagon.width, CTA_SHAPES.textHexagon.height]).toEqual([768, 864]);
    expect([CTA_SHAPES.textHexagonBackground.width, CTA_SHAPES.textHexagonBackground.height]).toEqual([864, 972]);
    expect([CTA_SHAPES.textHexagonForeground.width, CTA_SHAPES.textHexagonForeground.height]).toEqual([576, 648]);
    expect([CTA_SHAPES.imageHexagonForeground.width, CTA_SHAPES.imageHexagonForeground.height]).toEqual([595.2, 669.6]);
  });

  it("CA-34: los puntos son los del polígono de diseño, irregulares, en coordenadas de esa caja", () => {
    expect(CTA_SHAPES.textHexagon.points).toBe("384,0 691.2,172.8 768,604.8 537.6,864 153.6,691.2 76.8,259.2");
    expect(CTA_SHAPES.imageHexagonForeground.points).toBe("148.8,0 446.4,0 595.2,334.8 446.4,669.6 148.8,669.6 0,334.8");
  });

  it("criterio 5: ningún hexágono se recorta con porcentajes sobre una caja en vw × vh", () => {
    for (const name of ["textHexagon", "textHexagonBackground", "textHexagonForeground", "imageHexagonForeground"]) {
      expect(rule(name), name).not.toMatch(/clip-path/);
      expect(rule(name), name).not.toMatch(/height:/);
    }
  });

  it("criterio 5: los paneles que llenan el alto llevan la punta en vh, no en porcentajes del ancho", () => {
    const figure = desktop.match(/\n {2}\.imageHexagon\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(figure).toMatch(/clip-path:\s*polygon\(26\.67vh 0,/);
    expect(rule("imageHexagonBackground")).toMatch(/clip-path:\s*polygon\(24\.44vh 0,/);
  });

  it("criterio 2: los hexágonos del texto se anclan al bloque de texto con las mismas medidas que lo ubican", () => {
    expect(rule("textHexagon")).toMatch(/left:\s*var\(--cta-text-x\)/);
    expect(rule("textHexagon")).toMatch(/width:\s*var\(--cta-hex-w\)/);
    expect(desktop).toMatch(/\.content\s*\{\s*padding:\s*60px var\(--cta-gutter\)/);
    expect(desktop).toMatch(/\.textContent\s*\{[^}]*max-width:\s*var\(--cta-text-max\)/);
    expect(rule("container")).toMatch(/max-width:\s*var\(--cta-max-width\)/);
  });

  it("svg-workflow: la figura es un SVG decorativo con viewBox y sin colores escritos", () => {
    expect(shapeSource).toMatch(/viewBox=\{`0 0 \$\{shape\.width\} \$\{shape\.height\}`\}/);
    expect(shapeSource).toMatch(/aria-hidden="true"/);
    expect(shapeSource).not.toMatch(/fill="|stroke="/);
  });
});
