// Variables de entorno de build que usa el código (documentadas en .env.example).
// Todas son públicas: terminan dentro del JavaScript que descarga el navegador.
// Contenido editable del sitio (BR-040): lo genera `vite-plugins/siteContentPlugin.ts`.
declare module "virtual:site-content" {
  const content: import("./content/types").SiteContent;
  export default content;
}

// De dónde puede el navegador volver a leer la hoja (BR-047); `null` si no hay hoja configurada.
declare module "virtual:site-sheet" {
  const source: import("./content/sheetSource").SheetSource | null;
  export default source;
}

interface ImportMetaEnv {
  /** "true" activa Vercel Analytics (BR-036). Sin ella no se carga nada. */
  readonly VITE_VERCEL_ANALYTICS?: string;
  /** ID de medición de GA4 (BR-037). Sin él no se carga nada ni se muestra el aviso. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}
