import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// ✅ Performance: Self-hosted fonts (elimina request a Google Fonts)
// Solo carga pesos necesarios (400, 500, 600, 700), reduce FCP en ~200-400ms
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
