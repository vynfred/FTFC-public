/**
 * Script to generate PWA icons
 * 
 * This script generates PNG icons from the FTFCLogo component
 * for use in the PWA manifest.
 */
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Function to generate a simple FTFC logo
function generateFTFCLogo(size, color = '#f59e0b') {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = color;
  ctx.beginPath();
  const radius = size * 0.16; // Rounded corners
  ctx.moveTo(size - radius, 0);
  ctx.arcTo(size, 0, size, radius, radius);
  ctx.lineTo(size, size - radius);
  ctx.arcTo(size, size, size - radius, size, radius);
  ctx.lineTo(radius, size);
  ctx.arcTo(0, size, 0, size - radius, radius);
  ctx.lineTo(0, radius);
  ctx.arcTo(0, 0, radius, 0, radius);
  ctx.closePath();
  ctx.fill();
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.375}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FTFC', size / 2, size / 2);
  
  return canvas;
}

// Generate and save icons
function saveIcon(size, filename, color) {
  const canvas = generateFTFCLogo(size, color);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Generated ${filename}`);
}

// Generate standard icons
saveIcon(192, 'logo192.png', '#f59e0b');
saveIcon(512, 'logo512.png', '#f59e0b');

// Generate maskable icon (with padding for safe area)
saveIcon(512, 'maskable_icon.png', '#f59e0b');

console.log('PWA icons generated successfully!');
