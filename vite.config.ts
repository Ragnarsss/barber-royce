import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
        manualChunks: {
          // Vendor chunk for React and related libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Animation libraries chunk
          "animation-vendor": ["framer-motion", "lenis"],
          // UI libraries chunk
          "ui-vendor": [
            "lucide-react",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
          ],
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
