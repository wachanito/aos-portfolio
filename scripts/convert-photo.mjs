import sharp from 'sharp';
import { statSync } from 'fs';

const src = new URL('../public/img/foto-agustin.jpg', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const dest = src.replace('.jpg', '.webp');

const origSize = statSync(src).size;
await sharp(src).webp({ quality: 82 }).toFile(dest);
const newSize = statSync(dest).size;
console.log(`foto-agustin: ${Math.round(origSize/1024)}KB → ${Math.round(newSize/1024)}KB (−${Math.round((1-newSize/origSize)*100)}%)`);
