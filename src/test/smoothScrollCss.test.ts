import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-049: con Lenis activo el navegador no debe suavizar por su cuenta el mismo desplazamiento
// (`scroll-behavior: smooth`), y Lenis necesita su hoja de estilos base. Sin Lenis (reducir
// movimiento) el scroll es nativo y sin suavizado. Se vigila leyendo el texto, como en BR-045.
const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("smooth scroll solo lo hace Lenis (BR-049)", () => {
  it("ninguna hoja de estilos fija scroll-behavior: smooth", () => {
    const sheets = (readdirSync(srcDir, { recursive: true }) as string[]).filter((file) => file.endsWith(".css"));

    expect(sheets.length).toBeGreaterThan(0);
    for (const sheet of sheets) {
      const css = withoutComments(readFileSync(resolve(srcDir, sheet), "utf8"));
      expect(css, sheet).not.toMatch(/scroll-behavior:\s*smooth/);
    }
  });

  it("la app importa la hoja de estilos base de Lenis", () => {
    const app = readFileSync(resolve(srcDir, "App.tsx"), "utf8");

    expect(app).toMatch(/import\s+["']lenis\/dist\/lenis\.css["']/);
  });
});
