import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Lee el código fuente de todos los componentes (sin ejecutarlos) para proteger dos
// reglas de rendimiento de imágenes (BR-011, BR-012, RNF-PERF-002, RNF-PERF-004).
// Se lee con fs y no con import.meta.glob("?raw"): ese import hace que Vitest cuente
// cada archivo como cubierto y la cobertura del proyecto queda inflada.
// (Sin `new URL(ruta, import.meta.url)`: Vite lo reescribe como si fuera un asset.)
const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const files = (readdirSync(srcDir, { recursive: true }) as string[])
  .filter((file) => file.endsWith(".tsx") && !file.endsWith(".test.tsx"))
  .map((file) => [file.replaceAll("\\", "/"), readFileSync(resolve(srcDir, file), "utf8")] as const);

describe("imágenes del sitio (BR-012)", () => {
  it("encuentra el código de los componentes", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("RNF-PERF-002: toda <img> declara width y height (evita saltos de diseño)", () => {
    const missing: string[] = [];
    for (const [file, code] of files) {
      for (const tag of code.matchAll(/<(?:motion\.)?img\b[\s\S]*?\/>/g)) {
        if (!/\bwidth=/.test(tag[0]) || !/\bheight=/.test(tag[0])) {
          missing.push(`${file}: ${tag[0].replace(/\s+/g, " ").slice(0, 70)}`);
        }
      }
    }

    expect(missing).toEqual([]);
  });

  it("toda <img> tiene alt", () => {
    const missing: string[] = [];
    for (const [file, code] of files) {
      for (const tag of code.matchAll(/<(?:motion\.)?img\b[\s\S]*?\/>/g)) {
        if (!/\balt=/.test(tag[0])) missing.push(file);
      }
    }

    expect(missing).toEqual([]);
  });

  it("RNF-PERF-004: ningún componente importa un PNG o JPG original", () => {
    const offenders = files
      .filter(([, code]) => /from\s+["']@\/assets\/(?!optimized\/)[^"']+\.(png|jpe?g)["']/.test(code))
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });
});
