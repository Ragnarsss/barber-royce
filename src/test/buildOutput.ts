import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { build, type Logger } from "vite";
import config from "../../vite.config";

/**
 * Construye el sitio de verdad (con Vite) en una carpeta temporal. Devuelve la carpeta y una función
 * para borrarla. Corre en entorno `node`: esbuild no funciona bajo jsdom.
 */
export interface BuildOptions {
  /** Archivo de entrada distinto de `index.html` (por ejemplo, un fixture que importa un módulo virtual). */
  input?: string;
  /** Para capturar lo que el build escribe en el log. */
  logger?: Logger;
}

export async function buildToTempDir(env: Record<string, string> = {}, options: BuildOptions = {}): Promise<{ outDir: string; cleanup: () => void }> {
  const outDir = mkdtempSync(join(tmpdir(), "barber-royce-build-"));
  const cleanup = () => rmSync(outDir, { recursive: true, force: true });
  const previous = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
  Object.assign(process.env, env);

  try {
    await build({
      ...config,
      configFile: false,
      logLevel: "silent",
      // El optimizador de imágenes no aporta a estas pruebas y tarda varios segundos.
      plugins: (config.plugins ?? []).flat().filter((plugin) => !(plugin && "name" in plugin && String(plugin.name).includes("image-optimizer"))),
      ...(options.logger ? { customLogger: options.logger } : {}),
      build: {
        ...config.build,
        outDir,
        emptyOutDir: true,
        ...(options.input ? { rollupOptions: { ...config.build?.rollupOptions, input: options.input } } : {}),
      },
    });
    return { outDir, cleanup };
  } catch (error) {
    cleanup();
    throw error;
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

/**
 * Construye el sitio y devuelve el texto de lo que se publicaría (js, html, css, json). Sirve para
 * comprobar lo que NO debe llegar al navegador (analítica sin activar, identificadores de la hoja).
 */
export async function buildSite(env: Record<string, string> = {}, options: BuildOptions = {}): Promise<Map<string, string>> {
  const { outDir, cleanup } = await buildToTempDir(env, options);
  try {
    const files = new Map<string, string>();
    for (const relative of readdirSync(outDir, { recursive: true }) as string[]) {
      if (/\.(js|html|css|json)$/.test(relative)) files.set(relative.replaceAll("\\", "/"), readFileSync(join(outDir, relative), "utf8"));
    }
    return files;
  } finally {
    cleanup();
  }
}

/** Archivos publicados que contienen un texto. */
export const filesContaining = (files: Map<string, string>, text: string) =>
  [...files].filter(([, content]) => content.includes(text)).map(([file]) => file);

/** Un `Logger` de Vite que guarda los mensajes en listas, para comprobar qué escribió el build. */
export function captureLogger(): Logger & { infos: string[]; warns: string[] } {
  const infos: string[] = [];
  const warns: string[] = [];
  return {
    infos,
    warns,
    hasWarned: false,
    info: (message) => void infos.push(message),
    warn: (message) => void warns.push(message),
    warnOnce: (message) => void warns.push(message),
    error: () => {},
    clearScreen: () => {},
    hasErrorLogged: () => false,
  };
}
