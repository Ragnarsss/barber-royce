import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-059: los enlaces de la navbar se iluminan como neón blanco al pasar el cursor o con foco de teclado.
const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "Navbar.module.css"), "utf8");
const ruleFor = (selector: RegExp) => css.match(new RegExp(`\\n${selector.source}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("navbar: resplandor de neón (BR-059, HU-EXP-004 CA-11)", () => {
  it("CA-11: hover y foco de teclado comparten el resplandor: texto blanco y sombra de luz", () => {
    const rule = ruleFor(/\.navLink:hover,\s*\n?\.navLink:focus-visible/);

    expect(rule).toMatch(/color:\s*var\(--color-brand-white\)/);
    expect(rule).toMatch(/text-shadow:/);
  });

  it("CA-11: en el menú móvil, el foco de teclado también se ilumina", () => {
    expect(ruleFor(/\.mobileNavLink:focus-visible/)).toMatch(/text-shadow:/);
  });

  it("ADR-002: el resplandor sale de los tokens, sin colores escritos a mano", () => {
    const glow = css.match(/--nav-glow[^;]*;/g)?.join("") ?? "";

    expect(glow.length).toBeGreaterThan(0);
    expect(glow).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });

  it("CP-A11Y-003: con reducir movimiento, sin transición", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.navLink[^{]*\{[^}]*transition:\s*none/);
  });
});
