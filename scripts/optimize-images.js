import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    input: "social_proof_1.png",
    sizes: [560, 1120, 1680],
    displayName: "social_proof",
  },
  {
    input: "barber_back.png",
    sizes: [954, 1908], // Actual display size + 2x
    displayName: "barber_background",
  },
  {
    input: "hero_model_left_profile.png",
    sizes: [842, 1060, 1684], // Added 1060w for actual display size
    displayName: "hero_model_left_profile",
  },
  {
    input: "hero_mobile.png",
    sizes: [780, 1170], // Fondo a pantalla completa del Hero móvil (390 px de ancho) a 2x y 3x
    displayName: "hero_mobile",
  },
  {
    input: "cta1_model.png",
    sizes: [700, 1400],
    displayName: "cta1_model",
  },
  {
    input: "cta2_crew.png",
    sizes: [455], // Tamano original (455x705): se muestra como fondo con object-fit: cover
    displayName: "cta2_crew",
  },
  {
    input: "royce-barber-logo.png",
    sizes: [46, 92], // Actual display size (46x56) + 2x
    displayName: "royce-barber-logo",
  },
];

const sourceDir = path.join(__dirname, "..", "src", "assets");
const outputDir = path.join(__dirname, "..", "src", "assets", "optimized");

async function optimizeImages() {
  console.log("Starting image optimization...\n");

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const img of images) {
    const inputPath = path.join(sourceDir, img.input);

    // Get original file size
    try {
      const stats = await fs.stat(inputPath);
      const originalSizeKB = (stats.size / 1024).toFixed(2);
      totalOriginalSize += stats.size;

      console.log(`Processing: ${img.input} (${originalSizeKB} KB)`);

      for (const size of img.sizes) {
        // WebP (mejor compresión, soportado en 2026 por 98%+ browsers)
        const webpPath = path.join(
          outputDir,
          `${img.displayName}_${size}w.webp`,
        );
        await sharp(inputPath)
          .resize(size, null, {
            withoutEnlargement: true,
            fit: "inside",
          })
          .webp({ quality: 85, effort: 6 })
          .toFile(webpPath);

        // Get optimized file size
        const optimizedStats = await fs.stat(webpPath);
        const optimizedSizeKB = (optimizedStats.size / 1024).toFixed(2);
        totalOptimizedSize += optimizedStats.size;

        console.log(
          `  Generated ${img.displayName}_${size}w.webp (${optimizedSizeKB} KB)`,
        );
      }

      // Sin AVIF (BR-011): con quality 80 pesaba entre 3 % y 28 % MAS que el
      // WebP del mismo tamano, y como el <picture> lista WebP primero ningun
      // navegador lo elegia. Si se reintroduce, medir antes de publicarlo.
      console.log("");
    } catch (error) {
      console.error(`  Error processing ${img.input}:`, error.message);
    }
  }

  // Summary
  const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
  const totalOptimizedMB = (totalOptimizedSize / 1024 / 1024).toFixed(2);
  const savingsPercent = (
    ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) *
    100
  ).toFixed(1);
  const savingsMB = (totalOriginalMB - totalOptimizedMB).toFixed(2);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" Image optimization complete!\n");
  console.log(` Original total: ${totalOriginalMB} MB`);
  console.log(` Optimized total: ${totalOptimizedMB} MB`);
  console.log(` Estimated savings: ${savingsMB} MB (-${savingsPercent}%)`);
  console.log(` Output directory: ${outputDir}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(" Next steps:");
  console.log("1. Update component imports to use optimized images");
  console.log("2. Add srcset with multiple sizes");
  console.log("3. Add width/height attributes");
  console.log("4. Run npm run build and test with Lighthouse\n");
}

optimizeImages().catch(console.error);
