import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandMark } from "./BrandMark";
import { BRAND_MARK_PATHS, BRAND_MARK_TRANSFORM, BRAND_MARK_VIEWBOX } from "./brandMarkPaths";

const source = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../../../assets/logo-RB.svg"), "utf8");

// BR-115 (HU-EXP-002): el monograma BR en SVG reemplaza al PNG rojo; los trazados son los del archivo del dueño.
describe("BrandMark (BR-115)", () => {
  it("los trazados, el viewBox y la traslación son los de src/assets/logo-RB.svg (si el archivo cambia, se regenera brandMarkPaths.ts)", () => {
    expect(source).toContain(`d="${BRAND_MARK_PATHS.b}"`);
    expect(source).toContain(`d="${BRAND_MARK_PATHS.r}"`);
    expect(source).toContain(`viewBox="${BRAND_MARK_VIEWBOX}"`);
    expect(source).toContain(`transform="${BRAND_MARK_TRANSFORM}"`);
  });

  it("es una imagen con nombre accesible, sin color propio y sin un hex escrito", () => {
    const { container } = render(<BrandMark title="Logo de Prueba" className="mark" />);

    const svg = screen.getByRole("img", { name: "Logo de Prueba" });
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveClass("mark");
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });
});
