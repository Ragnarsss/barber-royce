// @vitest-environment node
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { resolve } from "node:path";
import process from "node:process";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildSite, captureLogger, filesContaining } from "./buildOutput";
import { snapshot } from "../content/snapshot";

/**
 * Contenido desde la hoja, con el build de verdad (BR-040, HU-CNT-001, RNF-CONF-003). Un servidor HTTP local
 * hace de Google Sheets: sirve el CSV de cada pestaña según su `gid`. La entrada del build es un fixture que
 * importa `virtual:site-content`, así el contenido queda en el bundle y se puede inspeccionar.
 */
const ENTRY = resolve(process.cwd(), "src/test/fixtures/contentEntry.ts");
const SHEET_ENTRY = resolve(process.cwd(), "src/test/fixtures/sheetEntry.ts");
const SHEET_ID = "2PACX-id-secreto-de-prueba";

const SERVICIOS = "id,nombre,descripcion,precio,duracion,categoria\ncorte-hoja,Corte desde la hoja,Descripción desde la hoja,7500,50 min,Corte de Cabello\n";
const PRODUCTOS = "id,nombre,descripcion,precio,categoria\npomada-hoja,Pomada desde la hoja,Hold desde la hoja,15990,Styling\n";
const SERVICIOS_INVALIDOS = "id,nombre,descripcion,precio,duracion,categoria\ncorte-hoja,Corte inválido,Descripción,,50 min,Corte de Cabello\n";

const hojaPorGid: Record<string, string> = {};
let hits = 0;
let server: Server;
let baseUrl: string;

const env = (extra: Record<string, string> = {}) => ({
  CONTENT_SHEET_ID: SHEET_ID,
  CONTENT_SHEET_GIDS: "servicios:0,productos:1",
  CONTENT_SHEET_BASE_URL: baseUrl,
  CONTENT_FETCH_TIMEOUT_MS: "3000",
  ...extra,
});

// Primer servicio y primer miembro del equipo del respaldo, para saber qué contenido llegó.
const SERVICIO_DEL_RESPALDO = snapshot.services[0].name;
const EQUIPO_DEL_RESPALDO = snapshot.team[0].name;

describe("contenido desde la hoja en el build real (BR-040)", () => {
  beforeAll(async () => {
    server = createServer((request, response) => {
      hits += 1;
      const gid = new URL(request.url ?? "", "http://localhost").searchParams.get("gid") ?? "";
      const body = hojaPorGid[gid];
      if (body === undefined) {
        response.writeHead(404, { "content-type": "text/plain" }).end("no existe");
        return;
      }
      response.writeHead(200, { "content-type": "text/csv; charset=utf-8" }).end(body);
    });
    await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/d/e`;
  });

  afterAll(async () => {
    await new Promise((done) => server.close(done));
  });

  it("CA-01: con la hoja válida, el sitio trae sus datos; el módulo de contenido no lleva la dirección de la hoja", async () => {
    hojaPorGid["0"] = SERVICIOS;
    hojaPorGid["1"] = PRODUCTOS;
    hits = 0;

    const files = await buildSite(env(), { input: ENTRY });

    expect(hits).toBe(2);
    expect(filesContaining(files, "Corte desde la hoja")).toHaveLength(1);
    expect(filesContaining(files, "$7.500")).toHaveLength(1);
    expect(filesContaining(files, "Pomada desde la hoja")).toHaveLength(1);
    expect(filesContaining(files, SERVICIO_DEL_RESPALDO)).toEqual([]);
    // Las pestañas que no se configuraron siguen con el respaldo.
    expect(filesContaining(files, EQUIPO_DEL_RESPALDO)).toHaveLength(1);
    // El contenido en sí no sabe de dónde salió. Quién sí lo sabe es `virtual:site-sheet` (BR-047), probado abajo.
    for (const secreto of [SHEET_ID, baseUrl, "docs.google.com", "CONTENT_SHEET"]) {
      expect(filesContaining(files, secreto), secreto).toEqual([]);
    }
  }, 120_000);

  it("CA-03 y RN-03: una fila inválida rechaza solo esa pestaña, usa su respaldo y el log dice pestaña, fila y campo", async () => {
    hojaPorGid["0"] = SERVICIOS_INVALIDOS;
    hojaPorGid["1"] = PRODUCTOS;
    const logger = captureLogger();

    const files = await buildSite(env(), { input: ENTRY, logger });

    expect(filesContaining(files, "Corte inválido")).toEqual([]);
    expect(filesContaining(files, SERVICIO_DEL_RESPALDO)).toHaveLength(1);
    expect(filesContaining(files, "Pomada desde la hoja")).toHaveLength(1);
    expect(logger.warns).toContain("[contenido]   - servicios fila 2, precio: es obligatorio");
    expect(logger.warns.some((line) => line.includes("servicios: respaldo (1 problema en la hoja)"))).toBe(true);
    expect(logger.infos.some((line) => line.includes("productos: hoja (1 fila)"))).toBe(true);
  }, 120_000);

  it("CA-02: con la hoja caída (nadie escucha en esa dirección) el build termina bien con el respaldo", async () => {
    const logger = captureLogger();

    const files = await buildSite(env({ CONTENT_SHEET_BASE_URL: "http://127.0.0.1:1/d/e" }), { input: ENTRY, logger });

    expect(filesContaining(files, SERVICIO_DEL_RESPALDO)).toHaveLength(1);
    expect(filesContaining(files, EQUIPO_DEL_RESPALDO)).toHaveLength(1);
    expect(logger.warns.some((line) => line.includes("servicios: no se pudo conectar"))).toBe(true);
  }, 120_000);

  it("CA-02: si la hoja responde 404 (pestaña inexistente), usa el respaldo y no falla", async () => {
    delete hojaPorGid["0"];
    delete hojaPorGid["1"];
    const logger = captureLogger();

    const files = await buildSite(env(), { input: ENTRY, logger });

    expect(filesContaining(files, SERVICIO_DEL_RESPALDO)).toHaveLength(1);
    expect(logger.warns.some((line) => line.includes("HTTP 404"))).toBe(true);
  }, 120_000);

  it("sin hoja configurada: no se hace ninguna petición y el sitio trae el respaldo (CP-CNT-001)", async () => {
    hojaPorGid["0"] = SERVICIOS;
    hits = 0;

    const files = await buildSite({ CONTENT_SHEET_ID: "", CONTENT_SHEET_GIDS: "", CONTENT_SHEET_BASE_URL: baseUrl }, { input: ENTRY });

    expect(hits).toBe(0);
    expect(filesContaining(files, SERVICIO_DEL_RESPALDO)).toHaveLength(1);
    expect(filesContaining(files, "Corte desde la hoja")).toEqual([]);
  }, 120_000);

  it("BR-047: con la hoja configurada, el navegador recibe el identificador y los gid para volver a leerla, y nada más de las variables", async () => {
    const files = await buildSite(env(), { input: SHEET_ENTRY });

    expect(filesContaining(files, SHEET_ID)).toHaveLength(1);
    expect(filesContaining(files, baseUrl)).toHaveLength(1);
    expect(filesContaining(files, 'servicios:"0"')).toHaveLength(1);
    expect(filesContaining(files, "CONTENT_SHEET")).toEqual([]);
  }, 120_000);

  it("BR-047: sin hoja configurada, el navegador no recibe ninguna fuente (null) y no se pide nada", async () => {
    hits = 0;

    const files = await buildSite({ CONTENT_SHEET_ID: "", CONTENT_SHEET_GIDS: "", CONTENT_SHEET_BASE_URL: baseUrl }, { input: SHEET_ENTRY });

    expect(hits).toBe(0);
    expect(filesContaining(files, "null")).toHaveLength(1);
    expect(filesContaining(files, SHEET_ID)).toEqual([]);
  }, 120_000);

  it("BR-047: con el identificador pero sin ninguna pestaña válida, tampoco hay fuente en el navegador", async () => {
    const files = await buildSite(env({ CONTENT_SHEET_GIDS: "peluqueria:5" }), { input: SHEET_ENTRY });

    expect(filesContaining(files, SHEET_ID)).toEqual([]);
  }, 120_000);
});
