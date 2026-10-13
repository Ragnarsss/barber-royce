import { describe, expect, it } from "vitest";
import { jsxElements, readComponentSources } from "./sourceFiles";

// BR-038 (RF-MED-004): todo enlace que lleva a reservar, a WhatsApp o a un teléfono rastrea su clic.
// Se revisa el JSX de todos los componentes: si alguien agrega un botón nuevo sin rastreo, el test falla.
const CONVERSION_HREF = /booking\.url|contact\.whatsapp\.link|contact\.phone\.link|wa\.me|tel:/;

const links = readComponentSources().flatMap(([file, code]) =>
  jsxElements(code)
    .filter(({ tag }) => tag === "a" || tag === "Link")
    .map((element) => ({ file, ...element })),
);
const conversionLinks = links.filter(({ attrs }) => CONVERSION_HREF.test(String(attrs.get("href") ?? attrs.get("to") ?? "")));

describe("enlaces de conversión rastreados (BR-038, CP-MED-004)", () => {
  it("encuentra los enlaces de reserva, WhatsApp y teléfono del sitio", () => {
    expect(conversionLinks.length).toBeGreaterThanOrEqual(11);
  });

  it("cada uno tiene un onClick que llama a un rastreador de src/analytics/track", () => {
    const untracked = conversionLinks
      .filter(({ attrs }) => !/track(Reserve|WhatsApp|Phone)\(/.test(String(attrs.get("onClick") ?? "")))
      .map(({ file, attrs }) => `${file}: ${String(attrs.get("href") ?? attrs.get("to"))}`);

    expect(untracked).toEqual([]);
  });

  it("el tipo de evento coincide con el destino: reserva, WhatsApp o teléfono", () => {
    const mismatched = conversionLinks
      .filter(({ attrs }) => {
        const target = String(attrs.get("href") ?? attrs.get("to"));
        const handler = String(attrs.get("onClick"));
        if (/booking\.url/.test(target)) return !handler.includes("trackReserve(");
        if (/whatsapp|wa\.me/.test(target)) return !handler.includes("trackWhatsApp(");
        return !handler.includes("trackPhone(");
      })
      .map(({ file }) => file);

    expect(mismatched).toEqual([]);
  });
});
