import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { SITE } from "@/config/constants";
import { BrandLettering } from "./BrandLettering";
import { LETTERING_NAME_PATHS, LETTERING_NAME_TEXT, LETTERING_PREFIX_PATHS, LETTERING_PREFIX_TEXT, LETTERING_VIEWBOX } from "./letteringPaths";

const here = dirname(fileURLToPath(import.meta.url));

// BR-114, BR-122 (HU-SUC-002 CA-12, RF-SUC-011): el lettering del dueño es un SVG decorativo con un trazado por letra.
describe("BrandLettering (BR-122)", () => {
  it("es un SVG decorativo con un trazado por letra, «Barbería» primero y «Royce» después", () => {
    const { container } = render(<BrandLettering />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", LETTERING_VIEWBOX);
    const paths = [...container.querySelectorAll("path")].map((path) => path.getAttribute("d"));
    expect(paths).toEqual([...LETTERING_PREFIX_PATHS, ...LETTERING_NAME_PATHS]);
    expect(LETTERING_PREFIX_PATHS).toHaveLength(9);
  });

  it("dice lo mismo que SITE.brand (RNF-DATOS-001)", () => {
    expect(LETTERING_PREFIX_TEXT).toBe(SITE.brand.prefix);
    expect(LETTERING_NAME_TEXT).toBe(SITE.brand.name);
  });

  it("deja pasar el className y los atributos al SVG (el hero marca el suyo para las partículas)", () => {
    const { container } = render(<BrandLettering className="mi-clase" data-particle-path />);

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("mi-clase");
    expect(svg).toHaveAttribute("data-particle-path");
  });

  it("el destello es opcional: sin `shine` no hay nada que cruce las letras; con `shine` se recorta a «Royce»", () => {
    const quiet = render(<BrandLettering />).container;
    expect(quiet.querySelector("[data-shine]")).toBeNull();

    const shining = render(<BrandLettering shine />).container;
    const shine = shining.querySelector("[data-shine]");
    expect(shine).not.toBeNull();
    expect(shine?.querySelectorAll("clipPath path")).toHaveLength(LETTERING_NAME_PATHS.length);
  });

  it("el destello se apaga también por CSS cuando el sistema pide reducir el movimiento (RNF-A11Y-003)", () => {
    const css = readFileSync(resolve(here, "BrandLettering.module.css"), "utf8");

    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[^{]*\{[^@]*\.shineBar[^{]*\{[^}]*animation:\s*none/);
  });

  it("cada letra va en su propio trazado: ningún trazado contiene un «m» minúscula a media cadena que la arrastre", () => {
    // Las curvas del archivo son relativas: unir letras en un solo `d` las desplaza (BR-114). Cada `d` empieza con su propio `m`.
    for (const d of [...LETTERING_PREFIX_PATHS, ...LETTERING_NAME_PATHS]) expect(d.startsWith("m")).toBe(true);
  });

  it("los colores salen de variables con respaldo en los tokens, no de un literal (ADR-002)", () => {
    const css = readFileSync(resolve(here, "BrandLettering.module.css"), "utf8");

    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).toMatch(/--lettering-prefix-color/);
    expect(css).toMatch(/--lettering-name-color/);
  });
});
