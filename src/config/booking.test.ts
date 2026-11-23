import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BOOKING } from "./constants";
import { parseCsv, toTable } from "@/content/csv";
import { readLocations } from "@/content/schemas";
import { locationsList } from "@/data/locationsData";

// BR-066 (HU-RES-001 CA-03, RNF-DATOS-001): el respaldo del enlace de reserva usaba un subdominio de AgendaPro que no
// existe (redirigía a su página comercial). Es la dirección que el dueño tiene en la hoja.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const REAL_URL = "https://roycespa.site.agendapro.com/cl/sucursal/400965";
const OLD_SUBDOMAIN = ["barberia", "royc.site"].join("");

describe("enlace de reserva de respaldo (BR-066)", () => {
  it("el respaldo es la dirección real de AgendaPro", () => {
    expect(BOOKING.url).toBe(REAL_URL);
  });

  it("la plantilla negocio.csv trae la misma dirección", () => {
    const template = readFileSync(join(root, "docs/contenido/negocio.csv"), "utf8");
    expect(template).toContain(`reservas.url,${REAL_URL}`);
  });

  it("el subdominio antiguo no queda en el código ni en las plantillas", () => {
    const files = [
      ...readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" }).map((file) => join(root, "src", file)),
      ...readdirSync(join(root, "docs/contenido")).map((file) => join(root, "docs/contenido", file)),
      join(root, "index.html"),
    ].filter((file) => /\.(tsx?|css|html|csv|json)$/.test(file) && !file.endsWith("booking.test.ts"));

    const offenders = files.filter((file) => readFileSync(file, "utf8").includes(OLD_SUBDOMAIN));
    expect(offenders).toEqual([]);
  });
});

// BR-103 (RF-CNT-009, HU-RES-001 CA-04): cada sucursal tiene su propio enlace de AgendaPro, también en la plantilla de la hoja.
describe("enlace de reserva por sucursal (BR-103)", () => {
  const template = readFileSync(join(root, "docs/contenido/sucursales.csv"), "utf8");

  it("la plantilla sucursales.csv trae la columna reserva con el mismo enlace que el respaldo de cada sucursal", () => {
    const { items, issues } = readLocations(toTable(parseCsv(template)));

    expect(issues).toEqual([]);
    for (const location of locationsList) {
      expect(items.find((item) => item.id === location.id)?.bookingUrl, location.id).toBe(location.bookingUrl);
    }
  });

  it("Coquimbo conserva el enlace de siempre y La Serena tiene el suyo", () => {
    expect(locationsList.find((l) => l.id === "barberia-royce-coquimbo")?.bookingUrl).toBe(BOOKING.url);
    expect(locationsList.find((l) => l.id === "barberia-royce-la-serena")?.bookingUrl).toBe("https://roycespa.site.agendapro.com/cl/sucursal/98243");
  });
});
