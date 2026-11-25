// Verkleint en comprimeert geüploade foto's automatisch bij elke build.
// Je hoeft je beelden dus niet zelf klein te maken: na het uploaden via de CMS
// gebeurt dit vanzelf. Het origineel in public/media blijft onaangeroerd;
// alleen de versie in de gebouwde site (dist/) wordt geoptimaliseerd.
import sharp from 'sharp';
import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_WIDTH = 1600; // breder heeft geen zin in een thumbnail
const MIN_BYTES = 120 * 1024; // kleinere bestanden laten we met rust

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

export default function optimizeMedia() {
  return {
    name: 'optimize-media',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const mediaDir = path.join(fileURLToPath(dir), 'media');
        let saved = 0;
        let count = 0;
        try {
          for await (const file of walk(mediaDir)) {
            const ext = path.extname(file).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
            const before = (await stat(file)).size;
            if (before < MIN_BYTES) continue;
            const input = await readFile(file);
            let img = sharp(input).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
            if (ext === '.png') img = img.png({ compressionLevel: 9, palette: true, quality: 85 });
            else if (ext === '.webp') img = img.webp({ quality: 78 });
            else img = img.jpeg({ quality: 78, mozjpeg: true, progressive: true });
            const out = await img.toBuffer();
            if (out.length < before) {
              await writeFile(file, out);
              saved += before - out.length;
              count++;
            }
          }
        } catch (err) {
          if (err.code !== 'ENOENT') throw err;
        }
        if (count) logger.info(`${count} foto('s) geoptimaliseerd, ${Math.round(saved / 1024)} KB bespaard.`);
      },
    },
  };
}
