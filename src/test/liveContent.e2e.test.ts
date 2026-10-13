// @vitest-environment node
import { existsSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import process from "node:process";
import puppeteer, { type Browser } from "puppeteer-core";
import { preview, type PreviewServer } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildToTempDir } from "./buildOutput";

/**
 * El dueño cambia la hoja y el sitio lo muestra sin un nuevo despliegue (BR-047, HU-CNT-001 CA-06).
 * Un servidor local hace de Google Sheets (con el encabezado CORS que Google envía), se construye el sitio una
 * sola vez y se abre en Chrome real: el contenido cambia solo con editar la "hoja", sin reconstruir.
 */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const chromePath = CHROME_CANDIDATES.find((candidate) => candidate && existsSync(candidate));

const tabla = (...filas: string[]) => ["clave,valor", ...filas, ""].join(String.fromCharCode(10));
const team = (name: string) => `id,nombre,cargo,experiencia\nbarbero-uno,${name},Master Barber,10 años\n`;

describe.skipIf(!chromePath)("el contenido de la hoja llega al sitio sin reconstruirlo (BR-047)", () => {
  let browser: Browser;
  let site: PreviewServer;
  let sheet: Server;
  let siteUrl: string;
  let cleanup: () => void;
  let equipo: string | undefined;
  let negocio: string | undefined;

  beforeAll(async () => {
    sheet = createServer((request, response) => {
      const gid = new URL(request.url ?? "", "http://localhost").searchParams.get("gid");
      const body = gid === "5" ? negocio : equipo;
      if (body === undefined) {
        response.writeHead(500, { "access-control-allow-origin": "*" }).end("caído");
        return;
      }
      response.writeHead(200, { "content-type": "text/csv; charset=utf-8", "access-control-allow-origin": "*" }).end(body);
    });
    await new Promise<void>((done) => sheet.listen(0, "127.0.0.1", done));
    const sheetUrl = `http://127.0.0.1:${(sheet.address() as AddressInfo).port}/d/e`;

    // El build lee la hoja una vez: ese es el contenido "de fábrica" del sitio.
    equipo = team("Barbero Del Build");
    negocio = tabla("telefono,+56 9 1000 2000");
    const built = await buildToTempDir({
      CONTENT_SHEET_ID: "2PACX-prueba",
      CONTENT_SHEET_GIDS: "equipo:2,negocio:5",
      CONTENT_SHEET_BASE_URL: sheetUrl,
      CONTENT_FETCH_TIMEOUT_MS: "3000",
    });
    cleanup = built.cleanup;

    site = await preview({ configFile: false, logLevel: "silent", build: { outDir: built.outDir }, preview: { port: 0, host: "127.0.0.1" } });
    siteUrl = site.resolvedUrls?.local[0]?.replace(/\/$/, "") ?? "";
    browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ["--no-sandbox"] });
  }, 180_000);

  afterAll(async () => {
    await browser?.close();
    await site?.close();
    await new Promise((done) => sheet?.close(done));
    cleanup?.();
  });

  const teamNames = async (path: string, expected: string) => {
    const page = await browser.newPage();
    try {
      await page.goto(`${siteUrl}${path}`, { waitUntil: "networkidle0" });
      await page
        .waitForFunction((text) => document.body.innerText.toLowerCase().includes(text), { timeout: 8000 }, expected.toLowerCase())
        .catch(() => undefined);
      return (await page.evaluate(() => document.body.innerText)).toLowerCase();
    } finally {
      await page.close();
    }
  };

  it("un cambio en la hoja aparece al recargar, sin reconstruir el sitio", async () => {
    equipo = team("Barbero En Vivo");

    expect(await teamNames("/equipo", "Barbero En Vivo")).toContain("barbero en vivo");

    equipo = team("Barbero Tres");
    const next = await teamNames("/equipo", "Barbero Tres");

    expect(next).toContain("barbero tres");
    expect(next).not.toContain("barbero en vivo");
  }, 60_000);

  it("BR-048: un cambio en la pestaña negocio (teléfono, correo, enlaces) aparece en el footer sin reconstruir", async () => {
    equipo = team("Barbero Del Build");
    negocio = tabla("telefono,+56 9 5555 4444", "email,hola@hoja.test", "reservas.etiqueta,Agenda con la hoja");

    const text = await teamNames("/equipo", "+56 9 5555 4444");

    expect(text).toContain("+56 9 5555 4444");
    expect(text).toContain("hola@hoja.test");
    expect(text).not.toContain("+56 9 1000 2000");
  }, 60_000);

  it("BR-048: un teléfono mal escrito en la hoja no se publica: queda el del build", async () => {
    negocio = tabla("telefono,llámanos");

    const text = await teamNames("/equipo", "+56 9 1000 2000");

    expect(text).toContain("+56 9 1000 2000");
    expect(text).not.toContain("llámanos");
  }, 60_000);

  it("si la hoja se cae, el sitio sigue mostrando el contenido del build", async () => {
    equipo = undefined;

    const text = await teamNames("/equipo", "Barbero Del Build");

    expect(text).toContain("barbero del build");
  }, 60_000);

  it("si la hoja trae una fila inválida, esa pestaña conserva el contenido del build", async () => {
    equipo = "id,nombre,cargo,experiencia\nbarbero-uno,,Master Barber,10 años\n";

    const text = await teamNames("/equipo", "Barbero Del Build");

    expect(text).toContain("barbero del build");
  }, 60_000);
});
