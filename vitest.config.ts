import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuración propia de tests: no hereda los plugins de build de
// vite.config.ts (optimización de imágenes, CSS asíncrono), que no aportan
// nada al probar y hacen más lenta cada corrida.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: { modules: { classNameStrategy: "non-scoped" } },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "src/main.tsx", "src/types/**", "src/vite-env.d.ts"],
      reporter: ["text-summary", "html"],
      // Línea base del 2026-10-12 redondeada hacia abajo (BR-030). Solo sube:
      // al cerrar un ticket que agregue tests, se ajusta al nuevo valor.
      thresholds: { statements: 30, branches: 71, functions: 52, lines: 30 },
    },
  },
});
