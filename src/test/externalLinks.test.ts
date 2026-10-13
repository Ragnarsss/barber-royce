import { describe, expect, it } from "vitest";
import { jsxElements, readAllSources, readComponentSources } from "./sourceFiles";

// BR-007 (RNF-SEG-002) y la parte de BR-005 que ya se puede cerrar: la URL de reserva existe una sola vez.
const components = readComponentSources().map(([file, code]) => ({ file, elements: jsxElements(code) }));
const links = components.flatMap(({ file, elements }) =>
  elements.filter(({ tag }) => tag === "a" || tag === "Link").map((element) => ({ file, ...element })),
);

describe("enlaces del sitio (BR-007)", () => {
  it("encuentra los enlaces de los componentes", () => {
    expect(links.length).toBeGreaterThan(10);
  });

  it("RNF-SEG-002: todo enlace que abre pestaña nueva lleva rel=\"noopener noreferrer\"", () => {
    const offenders = links
      .filter(({ attrs }) => attrs.has("target") && attrs.get("rel") !== "noopener noreferrer")
      .map(({ file, tag }) => `${file}: <${tag}>`);

    expect(offenders).toEqual([]);
  });

  it("los enlaces externos son <a>, no <Link> de React Router", () => {
    const offenders = links
      .filter(({ tag, attrs }) => tag === "Link" && /^https?:/.test(String(attrs.get("to"))))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it("las rutas internas usan <Link>: un <a href=\"/ruta\"> recarga toda la página", () => {
    const offenders = links
      .filter(({ tag, attrs }) => tag === "a" && /^\/[a-z]/.test(String(attrs.get("href"))))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });

  it("RNF-DATOS-001: la URL de AgendaPro existe una sola vez, en src/config/constants.ts", () => {
    const files = readAllSources()
      .filter(([, code]) => /https?:\/\/[^"'\s]*agendapro\.com/.test(code))
      .map(([file]) => file);

    expect(files).toEqual(["config/constants.ts"]);
  });
});
