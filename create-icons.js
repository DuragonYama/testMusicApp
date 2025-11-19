import sharp from 'sharp';
import { readFileSync } from 'fs';

const svg = readFileSync('./public/icon.svg');

// Generate 192x192 PNG
await sharp(svg)
  .resize(192, 192)
  .png()
  .toFile('./public/icon-192.png');

// Generate 512x512 PNG
await sharp(svg)
  .resize(512, 512)
  .png()
  .toFile('./public/icon-512.png');

console.log('Icons generated successfully!');
