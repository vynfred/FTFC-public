/**
 * Memory-efficient script to convert SVG to PNG for PWA icons
 *
 * This script converts the FTFC SVG icon to PNG files of various sizes
 * for use in the PWA manifest, with careful memory management.
 *
 * To run this script:
 * 1. Install sharp: npm install sharp
 * 2. Run: node scripts/convert-svg-to-png.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const svgPath = path.join(__dirname, '..', 'public', 'ftfc-icon.svg');
const outputDir = path.join(__dirname, '..', 'public');

// Icon sizes - process one at a time to minimize memory usage
const sizes = [
  { name: 'favicon.ico', size: 32 },
  { name: 'logo192.png', size: 192 },
  { name: 'logo512.png', size: 512 },
  { name: 'maskable_icon.png', size: 512 } // Maskable icon has same size but different padding
];

/**
 * Process a single icon to minimize memory usage
 * @param {Object} iconConfig - Icon configuration
 * @returns {Promise<void>}
 */
async function processIcon(iconConfig) {
  const { name, size } = iconConfig;
  console.log(`Processing ${name} (${size}x${size})...`);

  try {
    // Read the SVG file for each conversion to avoid keeping it in memory
    const svgBuffer = fs.readFileSync(svgPath);

    // For maskable icon, add padding (safe area)
    const padding = name === 'maskable_icon.png' ? Math.floor(size * 0.1) : 0;

    if (name === 'favicon.ico') {
      // For favicon.ico, create a PNG first
      await sharp(svgBuffer)
        .resize(size, size)
        .png({ compressionLevel: 9 }) // Maximum compression
        .toFile(path.join(outputDir, `favicon.png`));
      console.log(`Created favicon.png - convert to ICO manually`);
    } else {
      // For PNG files
      const pipeline = sharp(svgBuffer)
        .resize(size - (padding * 2), size - (padding * 2));

      // Only add padding if needed
      if (padding > 0) {
        pipeline.extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
        });
      }

      await pipeline
        .png({ compressionLevel: 9 }) // Maximum compression
        .toFile(path.join(outputDir, name));

      console.log(`Created ${name}`);
    }

    // Force garbage collection if possible
    if (global.gc) {
      global.gc();
    }
  } catch (error) {
    console.error(`Error creating ${name}:`, error);
  }
}

/**
 * Process icons sequentially to minimize memory usage
 */
async function convertSvgToPng() {
  console.log('Starting SVG to PNG conversion...');
  console.log(`Memory usage before: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);

  // Process one icon at a time
  for (const iconConfig of sizes) {
    await processIcon(iconConfig);
  }

  console.log(`Memory usage after: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  console.log('Conversion complete!');
}

// Run the conversion with error handling
convertSvgToPng()
  .catch(error => {
    console.error('Conversion failed:', error);
    process.exit(1);
  });
