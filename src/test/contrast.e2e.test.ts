// @vitest-environment node
import { existsSync } from "node:fs";
import process from "node:process";
import puppeteer, { type Browser } from "puppeteer-core";
import { preview, type PreviewServer } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ROUTES } from "../config/routes";
import { buildToTempDir } from "./buildOutput";

/**
 * Texto invisible (BR-045). Los h1-h6 globales tienen color oscuro: sobre un fondo oscuro que no
 * redefina el color, el título desaparece. Pasó en la 404, en PageError, en el aviso de
 * consentimiento y en la página de privacidad, y ni Lighthouse ni los tests de jsdom lo ven
 * (axe lo marca "incompleto" con animaciones; jsdom no calcula los estilos de CSS Modules).
 *
 * Aquí se construye el sitio, se abre en Chrome real y, ruta por ruta, se calcula el contraste
 * de cada texto con el fondo sólido que tiene detrás. Se ignoran los textos sobre degradados o
 * imágenes (el fondo no es un color único) y se exige solo un mínimo de 1,5: no es una auditoría
 * WCAG (eso es `BR-033`), es la red de seguridad contra texto que no se lee.
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

const MIN_CONTRAST = 1.5;
const routes = [...Object.values(ROUTES).map((route) => route.path), "/ruta-que-no-existe"];

interface Finding {
  tag: string;
  text: string;
  ratio: number;
}

describe.skipIf(!chromePath)("texto legible en todas las rutas (BR-045, RNF-A11Y-004)", () => {
  let browser: Browser;
  let server: PreviewServer;
  let baseUrl: string;
  let cleanup: () => void;

  beforeAll(async () => {
    const built = await buildToTempDir({ VITE_GA_MEASUREMENT_ID: "G-TEST123" });
    cleanup = built.cleanup;
    server = await preview({ configFile: false, logLevel: "silent", build: { outDir: built.outDir }, preview: { port: 0, host: "127.0.0.1" } });
    baseUrl = server.resolvedUrls?.local[0]?.replace(/\/$/, "") ?? "";
    browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ["--no-sandbox"] });
  }, 120_000);

  afterAll(async () => {
    await browser?.close();
    await server?.close();
    cleanup?.();
  });

  it.each(routes)("%s: ningún texto se confunde con su fondo", async (route) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle0" });
    // Baja por la página para que se disparen las animaciones de entrada.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    await new Promise((resolve) => setTimeout(resolve, 600));

    const findings: Finding[] = await page.evaluate((minContrast) => {
      type Color = { r: number; g: number; b: number; a: number };
      const parse = (value: string): Color | null => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (match) {
          const [r, g, b, a] = match[1].split(",").map(Number);
          return { r, g, b, a: a === undefined ? 1 : a };
        }
        // Lo que sale de color-mix() se informa como `color(srgb r g b / a)`, con canales de 0 a 1 (BR-022). Sin
        // esto, un fondo así no se reconocía y se comparaba contra el blanco por defecto.
        const srgb = value.match(/color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.e-]+))?\)/);
        if (!srgb) return null;
        const [r, g, b] = [srgb[1], srgb[2], srgb[3]].map((channel) => Number(channel) * 255);
        return { r, g, b, a: srgb[4] === undefined ? 1 : Number(srgb[4]) };
      };
      const luminance = ({ r, g, b }: Color) => {
        const channel = (v: number) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      // Fondo sólido detrás del elemento; null si antes hay una imagen o un degradado.
      const solidBackground = (element: Element): Color | null => {
        for (let node: Element | null = element; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (style.backgroundImage !== "none") return null;
          const color = parse(style.backgroundColor);
          if (color && color.a > 0.9) return color;
        }
        return { r: 255, g: 255, b: 255, a: 1 };
      };

      const found: { tag: string; text: string; ratio: number }[] = [];
      for (const element of document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,a,button,label")) {
        const text = [...element.childNodes]
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent ?? "")
          .join("")
          .trim();
        if (!text) continue;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (rect.width === 0 || rect.height === 0 || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
        if (style.webkitTextFillColor === "rgba(0, 0, 0, 0)") continue; // texto con degradado (background-clip: text)
        const foreground = parse(style.color);
        const background = solidBackground(element);
        if (!foreground || !background) continue;

        const lighter = Math.max(luminance(foreground), luminance(background));
        const darker = Math.min(luminance(foreground), luminance(background));
        const ratio = (lighter + 0.05) / (darker + 0.05);
        if (ratio < minContrast) found.push({ tag: element.tagName, text: text.slice(0, 40), ratio: Math.round(ratio * 100) / 100 });
      }
      return found;
    }, MIN_CONTRAST);

    await page.close();
    expect(findings).toEqual([]);
  }, 60_000);
});
