// @vitest-environment node
import { describe, expect, it } from "vitest";
import config from "../../vite.config";

// BR-035: con la forma de objeto de manualChunks, react-dom/client caía en el chunk de la
// app (541 KB sin minificar) y cada despliegue invalidaba el caché de React.
type ManualChunks = (id: string) => string | undefined;
const output = config.build?.rollupOptions?.output;
const manualChunks = (Array.isArray(output) ? output[0] : output)?.manualChunks as ManualChunks;

const nm = (path: string) => `/repo/node_modules/${path}`;

describe("manualChunks de vite.config.ts (BR-035, RNF-PERF-005)", () => {
  it("es una función", () => {
    expect(typeof manualChunks).toBe("function");
  });

  it.each([
    ["react/index.js", "react-vendor"],
    ["react-dom/client.js", "react-vendor"],
    ["react-dom/cjs/react-dom-client.production.js", "react-vendor"],
    ["scheduler/index.js", "react-vendor"],
    ["react-router-dom/dist/index.mjs", "react-vendor"],
    ["framer-motion/dist/es/index.mjs", "animation-vendor"],
    ["motion-dom/dist/es/index.mjs", "animation-vendor"],
    ["lenis/dist/lenis.mjs", "animation-vendor"],
    ["lucide-react/dist/esm/lucide-react.js", "ui-vendor"],
  ])("%s va al chunk %s", (path, chunk) => {
    expect(manualChunks(nm(path))).toBe(chunk);
  });

  it("el código de la app no cae en ningún chunk de vendors", () => {
    expect(manualChunks("/repo/src/App.tsx")).toBeUndefined();
  });

  it("una librería no clasificada queda con el chunk automático de Rollup", () => {
    expect(manualChunks(nm("react-helmet-async/lib/index.js"))).toBeUndefined();
  });

  it("un paquete que solo empieza igual no se confunde con React (react-helmet-async)", () => {
    expect(manualChunks(nm("react-helmet-async/lib/index.js"))).not.toBe("react-vendor");
  });
});
