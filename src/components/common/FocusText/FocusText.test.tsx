import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import { motionValue } from "framer-motion";
import { describe, expect, it } from "vitest";
import { FocusText } from "./FocusText";

// BR-074 (HU-EXP-004 CA-25): texto que se enfoca con el scroll, con una copia desenfocada y no con un blur animado.
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "FocusText.module.css"), "utf8");
const source = readFileSync(resolve(here, "FocusText.tsx"), "utf8");

describe("FocusText (BR-074, HU-EXP-004 CA-25)", () => {
  it("pinta el texto nítido y una copia desenfocada decorativa (aria-hidden)", () => {
    const { container } = render(
      <FocusText as="h2" progress={motionValue(0)} enabled>
        Estilo que te acompaña
      </FocusText>,
    );

    const heading = container.querySelector("h2")!;
    const copy = heading.querySelector("[data-focus-blur]")!;
    expect(copy.getAttribute("aria-hidden")).toBe("true");
    expect(copy.textContent).toBe("Estilo que te acompaña");
    // Los lectores de pantalla encuentran el título una sola vez
    expect(screen.getAllByRole("heading", { name: "Estilo que te acompaña" })).toHaveLength(1);
  });

  it("al comienzo del scroll se ve la copia desenfocada y no el texto nítido", () => {
    const { container } = render(
      <FocusText progress={motionValue(0)} enabled>
        Texto
      </FocusText>,
    );

    expect(container.querySelector("[data-focus-blur]")?.getAttribute("style")).toMatch(/opacity:\s*1/);
    expect(container.querySelector("span > span:first-child")?.getAttribute("style")).toMatch(/opacity:\s*0/);
  });

  it("al final del scroll queda solo el texto nítido", () => {
    const { container } = render(
      <FocusText progress={motionValue(1)} enabled>
        Texto
      </FocusText>,
    );

    expect(container.querySelector("[data-focus-blur]")?.getAttribute("style")).toMatch(/opacity:\s*0/);
    expect(container.querySelector("span > span:first-child")?.getAttribute("style")).toMatch(/opacity:\s*1/);
  });

  it("CP-A11Y-003: con el efecto desactivado (reducir movimiento) pinta solo el texto, sin copia ni capas", () => {
    const { container } = render(
      <FocusText as="p" className="sub" progress={motionValue(0)} enabled={false}>
        Texto
      </FocusText>,
    );

    expect(container.querySelector("[data-focus-blur]")).toBeNull();
    expect(container.querySelector("p.sub")?.textContent).toBe("Texto");
    expect(container.querySelector("p.sub span")).toBeNull();
  });

  it("el radio del desenfoque es configurable y fijo (una variable CSS), no se anima", () => {
    const { container } = render(
      <FocusText progress={motionValue(0)} blurPx={5} enabled>
        Texto
      </FocusText>,
    );

    expect(container.querySelector("span")?.getAttribute("style")).toMatch(/--focus-blur:\s*5px/);
    expect(css).toMatch(/\.blur\s*\{[^}]*filter:\s*blur\(var\(--focus-blur/);
    expect(css).not.toMatch(/transition:[^;]*filter|animation/);
  });

  it("la opacidad va por una función y no por rangos: los rangos los acelera la API de animaciones web, que jsdom no trae", () => {
    expect(source).toMatch(/useTransform\(progress,\s*\(value\)\s*=>/);
    expect(source).not.toMatch(/useTransform\(progress,\s*\[/);
  });

  it("ADR-002: sin colores escritos a mano", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});
