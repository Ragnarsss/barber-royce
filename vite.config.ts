import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { siteContentPlugin } from "./vite-plugins/siteContentPlugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Contenido editable desde una hoja de Google, leído al construir (BR-040, ADR-008)
    siteContentPlugin(),
    // Optimización automática de imágenes en build
    ViteImageOptimizer({
      // PNG optimization
      png: {
        quality: 80, // Compresión moderada (balance calidad/tamaño)
      },
      // JPEG optimization (si hay JPG en el futuro)
      jpeg: {
        quality: 85,
      },
      // WebP generation (formato moderno, -60-80% tamaño)
      webp: {
        lossless: false,
        quality: 80, // Buena calidad con gran compresión
      },
      // Cache para acelerar rebuilds
      cache: true,
      cacheLocation: '.cache/image-optimizer',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Output directory for production build
    outDir: "dist",
    // Generate sourcemaps for production debugging (optional, disable for smaller builds)
    sourcemap: false,
    // Minification - using esbuild for better performance
    minify: "esbuild",
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Manual chunking strategy for better caching
        // Los vendors van en chunks aparte para que un cambio en el código de la app
        // no invalide el caché de React y de las librerías de animación (BR-035).
        // Con la forma de objeto, react-dom/client quedaba en el chunk de la app.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return "react-vendor";
          }
          if (/node_modules\/(framer-motion|motion-dom|motion-utils|lenis)\//.test(id)) {
            return "animation-vendor";
          }
          if (/node_modules\/(lucide-react|class-variance-authority|clsx|tailwind-merge)\//.test(id)) {
            return "ui-vendor";
          }
          return undefined;
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".");
          let extType = info?.[info.length - 1] || "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = "fonts";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        // JS chunk file naming
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
    // Target modern browsers for smaller bundle size
    target: "es2020",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lenis",
    ],
  },
});
