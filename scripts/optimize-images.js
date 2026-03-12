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
    input: "cta1_model.png",
    sizes: [700, 1400],
    displayName: "cta1_model",
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

      // Generate AVIF fallback for base size (mejor compresión)
      const baseSize = img.sizes[0];
      const avifPath = path.join(
        outputDir,
        `${img.displayName}_${baseSize}w.avif`,
      );
      await sharp(inputPath)
        .resize(baseSize, null, {
          withoutEnlargement: true,
          fit: "inside",
        })
        .avif({ quality: 80 })
        .toFile(avifPath);

      const avifStats = await fs.stat(avifPath);
      const avifSizeKB = (avifStats.size / 1024).toFixed(2);
      totalOptimizedSize += avifStats.size;

      console.log(
        `  Generated ${img.displayName}_${baseSize}w.avif (${avifSizeKB} KB) - fallback\n`,
      );
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
