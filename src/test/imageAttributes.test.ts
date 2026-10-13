import { describe, expect, it } from "vitest";
import { jsxElements, readComponentSources } from "./sourceFiles";

const files = readComponentSources();
const images = files.flatMap(([file, code]) =>
  jsxElements(code)
    .filter(({ tag }) => tag === "img" || tag === "motion.img")
    .map((element) => ({ file, ...element })),
);

describe("imágenes del sitio (BR-012)", () => {
  it("encuentra el código de los componentes y sus imágenes", () => {
    expect(files.length).toBeGreaterThan(20);
    expect(images.length).toBeGreaterThan(5);
  });

  it("RNF-PERF-002: toda <img> declara width y height (evita saltos de diseño)", () => {
    const missing = images.filter(({ attrs }) => !attrs.has("width") || !attrs.has("height")).map(({ file }) => file);

    expect(missing).toEqual([]);
  });

  it("toda <img> tiene alt", () => {
    const missing = images.filter(({ attrs }) => !attrs.has("alt")).map(({ file }) => file);

    expect(missing).toEqual([]);
  });

  it("RNF-PERF-004: ningún componente importa un PNG o JPG original", () => {
    const offenders = files
      .filter(([, code]) => /from\s+["']@\/assets\/(?!optimized\/)[^"']+\.(png|jpe?g)["']/.test(code))
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });
});
