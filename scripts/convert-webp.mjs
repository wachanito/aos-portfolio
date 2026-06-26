// Converts all PNG/JPG images in public/uploads to WebP
// Run: node scripts/convert-webp.mjs

import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const DIR = new URL('../public/uploads', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const files = readdirSync(DIR).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

let saved = 0;
for (const file of files) {
  const src = join(DIR, file);
  const dest = join(DIR, basename(file, extname(file)) + '.webp');
  const origSize = statSync(src).size;
  try {
    await sharp(src).webp({ quality: 82 }).toFile(dest);
    const newSize = statSync(dest).size;
    const pct = Math.round((1 - newSize / origSize) * 100);
    saved += origSize - newSize;
    console.log(`✓ ${file} → ${basename(dest)} (−${pct}%, ${Math.round(origSize/1024)}KB → ${Math.round(newSize/1024)}KB)`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}
console.log(`\nTotal ahorrado: ${Math.round(saved / 1024)}KB`);
