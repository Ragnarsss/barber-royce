// Variables de entorno de build que usa el código (documentadas en .env.example).
// Todas son públicas: terminan dentro del JavaScript que descarga el navegador.
interface ImportMetaEnv {
  /** "true" activa Vercel Analytics (BR-036). Sin ella no se carga nada. */
  readonly VITE_VERCEL_ANALYTICS?: string;
  /** ID de medición de GA4 (BR-037). Sin él no se carga nada ni se muestra el aviso. */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}
