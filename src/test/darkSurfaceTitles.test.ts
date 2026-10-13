import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-045: los h1-h6 globales (styles/global.css) tienen color oscuro. Un título sobre una superficie oscura
// tiene que fijar su propio color o desaparece. El test de contraste en Chrome (`contrast.e2e.test.ts`)
// cubre las rutas; PageError solo aparece cuando una página falla, así que se vigila aquí leyendo su CSS.
const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const ruleBody = (css: string, selector: string) => css.match(new RegExp(`${selector.replace(".", "\\.")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("títulos sobre fondo oscuro fijan su color (BR-045)", () => {
  it.each([
    ["components/common/ErrorBoundary/PageError.module.css", ".title"],
    ["pages/NotFoundPage.module.css", ".title"],
    ["analytics/ConsentBanner.module.css", ".title"],
  ])("%s %s", (file, selector) => {
    const css = readFileSync(resolve(srcDir, file), "utf8");

    expect(ruleBody(css, selector)).toMatch(/(^|[\s;])color:/);
  });
});
