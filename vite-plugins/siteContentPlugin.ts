import { join } from "node:path";
import process from "node:process";
import { createServer, type Plugin, type ResolvedConfig } from "vite";
import type { SiteContent, TabReport } from "../src/content/types";
import { fetchSheet, type SheetCsv, type SheetEnv } from "./siteContentSource";

// Forma de lo que se usa de `src/content/resolveContent.ts`. No se importa su tipo: eso arrastraría el
// código de la app (con alias `@/`) al proyecto de TypeScript de Node.
interface ResolverModule {
  resolveContent(sheet: SheetCsv, snapshot: SiteContent): { content: SiteContent; reports: TabReport[] };
  formatReports(reports: TabReport[]): string[];
}

/**
 * Plugin de Vite: el contenido editable del sitio como módulo virtual (BR-040, ADR-008).
 *
 *   import siteContent from "virtual:site-content";
 *
 * - **Sin `CONTENT_SHEET_ID`** (o en desarrollo): el módulo es el respaldo del repo. No se hace ninguna
 *   petición y el build es idéntico al de siempre.
 * - **Con la hoja configurada**, al construir: se descargan las pestañas, se validan con
 *   `resolveContent` (el mismo código que prueban los tests) y el resultado queda escrito como datos
 *   en el módulo. El navegador nunca habla con Google Sheets ni recibe el código de validación.
 * - **Nada rompe el build**: si la hoja falla, usa el respaldo de la pestaña afectada y deja el motivo
 *   en el log (HU-CNT-001 CA-02 y CA-03).
 */
const VIRTUAL_ID = "virtual:site-content";
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

interface Options {
  env?: SheetEnv;
  fetchImpl?: typeof fetch;
}

export function siteContentPlugin({ env = process.env as SheetEnv, fetchImpl = fetch }: Options = {}): Plugin {
  let config: ResolvedConfig;
  let generated: string | undefined;

  /** `resolveContent` y el respaldo son código de la app (TypeScript con alias `@/`): se cargan con Vite, no con `import`. */
  async function resolveFromSheet(): Promise<string | undefined> {
    const outcome = await fetchSheet(env, fetchImpl);
    if (!outcome.configured) return undefined;

    config.logger.info("[contenido] leyendo la hoja de cálculo…");
    for (const problem of outcome.problems) config.logger.warn(`[contenido] ${problem}`);

    const server = await createServer({
      configFile: false,
      root: config.root,
      resolve: { alias: config.resolve.alias },
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: "custom",
      logLevel: "silent",
      optimizeDeps: { noDiscovery: true },
    });
    try {
      const { resolveContent, formatReports } = (await server.ssrLoadModule("/src/content/resolveContent.ts")) as unknown as ResolverModule;
      const { snapshot } = (await server.ssrLoadModule("/src/content/snapshot.ts")) as unknown as { snapshot: SiteContent };
      const { content, reports } = resolveContent(outcome.sheet, snapshot);

      for (const line of formatReports(reports)) {
        const isProblem = line.startsWith("  -") || line.startsWith("  !") || line.includes(": respaldo");
        (isProblem ? config.logger.warn : config.logger.info)(`[contenido] ${line}`);
      }
      return `export default ${JSON.stringify(content)};`;
    } finally {
      await server.close();
    }
  }

  return {
    name: "site-content",

    configResolved(resolved) {
      config = resolved;
    },

    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },

    async buildStart() {
      if (config.command !== "build") return;
      try {
        generated = await resolveFromSheet();
      } catch (error) {
        // Última red de seguridad: ningún fallo de la hoja puede detener el build.
        config.logger.warn(`[contenido] se usa el respaldo: ${error instanceof Error ? error.message : String(error)}`);
        generated = undefined;
      }
    },

    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      if (generated !== undefined) return generated;
      const snapshotPath = join(config.root, "src/content/snapshot.ts").replaceAll("\\", "/");
      return `import { snapshot } from ${JSON.stringify(snapshotPath)};\nexport default snapshot;`;
    },
  };
}
