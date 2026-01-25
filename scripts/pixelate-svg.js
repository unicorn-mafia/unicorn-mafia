#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const PIXEL_SIZE = 10; // Each pixel will be 10x10 units in the output SVG

async function pixelateSvg(inputPath) {
  console.log(`Processing: ${inputPath}`);

  // Read the original SVG to extract viewBox dimensions
  const svgContent = fs.readFileSync(inputPath, 'utf-8');
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const widthMatch = svgContent.match(/width="(\d+)"/);
  const heightMatch = svgContent.match(/height="(\d+)"/);

  if (!viewBoxMatch || !widthMatch || !heightMatch) {
    throw new Error('Could not parse SVG dimensions');
  }

  const [, , , viewBoxWidth, viewBoxHeight] = viewBoxMatch[1].split(' ').map(Number);
  const width = parseInt(widthMatch[1]);
  const height = parseInt(heightMatch[1]);

  // Calculate pixel grid dimensions
  const pixelWidth = Math.ceil(width / PIXEL_SIZE);
  const pixelHeight = Math.ceil(height / PIXEL_SIZE);

  console.log(`  Original: ${width}x${height}`);
  console.log(`  Pixel grid: ${pixelWidth}x${pixelHeight}`);

  // Rasterize SVG to PNG at the pixel grid resolution
  const { data, info } = await sharp(inputPath)
    .resize(pixelWidth, pixelHeight, {
      fit: 'fill',
      kernel: 'nearest'
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Generate pixel rectangles
  const rects = [];

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      // Convert to hex color
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      rects.push(`  <rect x="${x * PIXEL_SIZE}" y="${y * PIXEL_SIZE}" width="${PIXEL_SIZE}" height="${PIXEL_SIZE}" fill="${color}"/>`);
    }
  }

  console.log(`  Generated ${rects.length} pixel rectangles`);

  // Build the new SVG
  const newSvg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
${rects.join('\n')}
</svg>
`;

  // Write the output
  fs.writeFileSync(inputPath, newSvg);
  console.log(`  Saved: ${inputPath}`);
}

// Main
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node pixelate-svg.js <svg-file>');
  process.exit(1);
}

pixelateSvg(args[0]).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
