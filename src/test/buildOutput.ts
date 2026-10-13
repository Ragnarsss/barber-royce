import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { build } from "vite";
import config from "../../vite.config";

/**
 * Construye el sitio de verdad (con Vite) en una carpeta temporal y devuelve el texto de lo que
 * se publicaría. Sirve para comprobar lo que NO debe llegar al navegador (analítica sin activar,
 * identificadores de la hoja). Corre en entorno `node`: esbuild no funciona bajo jsdom.
 */
export async function buildSite(env: Record<string, string> = {}): Promise<Map<string, string>> {
  const outDir = mkdtempSync(join(tmpdir(), "barber-royce-build-"));
  const previous = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  Object.assign(process.env, env);

  try {
    await build({
      ...config,
      configFile: false,
      logLevel: "silent",
      // El optimizador de imágenes no aporta a estas pruebas y tarda varios segundos.
      plugins: (config.plugins ?? []).flat().filter((plugin) => !(plugin && "name" in plugin && String(plugin.name).includes("image-optimizer"))),
      build: { ...config.build, outDir, emptyOutDir: true },
    });

    const files = new Map<string, string>();
    for (const relative of readdirSync(outDir, { recursive: true }) as string[]) {
      if (/\.(js|html|css|json)$/.test(relative)) files.set(relative.replaceAll("\\", "/"), readFileSync(join(outDir, relative), "utf8"));
    }
    return files;
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    rmSync(outDir, { recursive: true, force: true });
  }
}

/** Archivos publicados que contienen un texto. */
export const filesContaining = (files: Map<string, string>, text: string) =>
  [...files].filter(([, content]) => content.includes(text)).map(([file]) => file);
