import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// ✅ Performance: Self-hosted fonts (elimina request a Google Fonts)
// Solo carga pesos necesarios (400, 500, 600, 700), reduce FCP en ~200-400ms
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/anton/400.css";

import App from "./App.tsx";
import { installChunkRecovery } from "./utils/chunkRecovery";

// Recarga una vez si un chunk ya no existe tras un despliegue (BR-020).
installChunkRecovery();

// Analítica de Vercel, solo si se pide con la variable (BR-036). Con la variable
// ausente, esta condición es constante en el build y el bloque entero se elimina:
// el código de Analytics no llega al sitio.
if (import.meta.env.VITE_VERCEL_ANALYTICS === "true") {
  void import("./analytics/vercelAnalytics").then(({ installVercelAnalytics }) => installVercelAnalytics());
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
