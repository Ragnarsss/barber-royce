// @vitest-environment node
import { existsSync } from "node:fs";
import process from "node:process";
import puppeteer, { type Browser } from "puppeteer-core";
import { preview, type PreviewServer } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildToTempDir } from "./buildOutput";

/**
 * Figuras de fondo con geometría fija (BR-091, HU-EXP-004 CA-34). Antes eran `clip-path` en porcentajes sobre cajas en
 * vw × vh y cambiaban de forma con la proporción de la ventana; jsdom no calcula el layout, así que se mide en Chrome real,
 * en las ventanas en que se vio el problema:
 * - cada figura conserva la proporción de su viewBox (no se estira);
 * - con CTA1 en reposo (alineada arriba), el título, el subtítulo y los botones quedan dentro del hexágono rojo, que se
 *   ancla al bloque de texto con las mismas variables que lo ubican.
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

const VIEWPORTS: Array<[number, number]> = [
  [1920, 1080],
  [1440, 900],
  [1440, 1289],
  [1366, 768],
  [1280, 720],
  [1024, 1117],
  [1024, 768],
  [900, 1100],
  [772, 839],
];
const RATIO_TOLERANCE = 0.02;

describe.skipIf(!chromePath)("figuras de fondo con geometría fija (BR-091, HU-EXP-004 CA-34)", () => {
  let browser: Browser;
  let server: PreviewServer;
  let baseUrl: string;
  let cleanup: () => void;

  beforeAll(async () => {
    const built = await buildToTempDir({});
    cleanup = built.cleanup;
    server = await preview({ configFile: false, logLevel: "silent", build: { outDir: built.outDir }, preview: { port: 0, host: "127.0.0.1" } });
    baseUrl = server.resolvedUrls?.local[0]?.replace(/\/$/, "") ?? "";
    browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ["--no-sandbox"] });
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
    cleanup?.();
  });

  it.each(VIEWPORTS)("%ix%i: las figuras no se estiran y el texto de CTA1 queda dentro del hexágono rojo", async (width, height) => {
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.querySelector("#cta-1")?.scrollIntoView());
    // La entrada del texto (fadeInLeft) termina antes de medir
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const result = await page.evaluate(() => {
      // Solo las figuras que se ven en esta ventana: las ocultas (display: none) miden 0 × 0
      const visible = [...document.querySelectorAll<HTMLElement>("[data-shape]")].filter((shape) => shape.offsetWidth > 0 && shape.offsetHeight > 0);
      const ratioErrors = visible.map((shape) => {
        const box = shape.querySelector("svg")!.viewBox.baseVal;
        return Math.abs(shape.offsetWidth / shape.offsetHeight / (box.width / box.height) - 1);
      });

      const section = document.querySelector("#cta-1")!;
      const polygon = section.querySelector<SVGPolygonElement>("[data-shape='text'] polygon")!;
      const toShape = polygon.getScreenCTM()!.inverse();
      const title = section.querySelector("h2")!;
      const parts = [title, title.nextElementSibling!, ...section.querySelectorAll(".magnet a, a[href='/servicios']")];
      const outside = parts.flatMap((part) => {
        const rect = part.getBoundingClientRect();
        const corners: Array<[number, number]> = [
          [rect.left, rect.top],
          [rect.right, rect.top],
          [rect.left, rect.bottom],
          [rect.right, rect.bottom],
        ];
        return corners.filter(([x, y]) => {
          const local = new DOMPoint(x, y).matrixTransform(toShape);
          const point = polygon.ownerSVGElement!.createSVGPoint();
          point.x = local.x;
          point.y = local.y;
          return !polygon.isPointInFill(point);
        });
      });
      return { shapes: ratioErrors.length, worstRatioError: Math.max(...ratioErrors), outside };
    });
    await page.close();

    expect(result.shapes).toBeGreaterThanOrEqual(10);
    expect(result.worstRatioError).toBeLessThan(RATIO_TOLERANCE);
    expect(result.outside).toEqual([]);
  });
});
