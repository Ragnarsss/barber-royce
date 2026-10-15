import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BOOKING } from "./constants";

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
