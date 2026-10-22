import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { siteContentPlugin } from "./vite-plugins/siteContentPlugin";

// Configuración propia de tests: no hereda los plugins de build de
// vite.config.ts (optimización de imágenes, CSS asíncrono), que no aportan
// nada al probar y hacen más lenta cada corrida.
export default defineConfig({
  // El módulo virtual `virtual:site-content` (con el respaldo) tiene que existir también en los tests.
  plugins: [react(), siteContentPlugin()],
  // Los tests no leen `.env`: tienen que dar lo mismo en cualquier máquina, tengas o no las variables de analítica o de
  // la hoja en tu archivo local (BR-046). Cada test que necesita una variable la define él (`vi.stubEnv`).
  envDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "src/main.tsx", "src/types/**", "src/vite-env.d.ts"],
      reporter: ["text-summary", "html"],
      // Línea base del 2026-10-12 redondeada hacia abajo (BR-030). Solo sube:
      // al cerrar un ticket que agregue tests, se ajusta al nuevo valor.
      thresholds: { statements: 73, branches: 83, functions: 77, lines: 73 },
    },
    // Dos proyectos (BR-095): las unidades en jsdom y los e2e que abren Chrome real en Node. Cada e2e compila el sitio y
    // lanza su propio Chrome; corridos a la vez y con el resto de la suite, el cierre de Chrome se colgaba pasados los
    // 30 s en más de la mitad de las corridas completas (aunque todas las pruebas pasaban).
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./src/test/setup.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/**/*.e2e.test.{ts,tsx}"],
          css: { modules: { classNameStrategy: "non-scoped" } },
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          environment: "node",
          include: ["src/**/*.e2e.test.{ts,tsx}"],
          // Un archivo a la vez: cada uno compila el sitio y abre su Chrome
          fileParallelism: false,
          // Compilar el sitio y cerrar Chrome tardan más cuando la máquina está ocupada (otro build, otro Chrome, el
          // antivirus). Con los 10 s por defecto el cierre se pasaba y marcaba el archivo como fallido aunque todas las
          // pruebas pasaran. Los plazos son un margen, no un tiempo esperado: sin carga, el cierre toma ~0,2 s.
          testTimeout: 60_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
});
