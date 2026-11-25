import sharp from 'sharp';
import path from 'node:path';
import { site } from './site';

const root = process.cwd();
const fontfile = path.join(root, 'src/assets/fonts/Basteleur-Bold.ttf');
const W = 1200;
const H = 630;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function text(markup: string, size: number, width: number) {
  return sharp({
    text: { text: `<span foreground="#F3EEE3">${markup}</span>`, font: `Basteleur Bold ${size}`, fontfile, rgba: true, width, wrap: 'word' },
  })
    .png()
    .toBuffer();
}

/** Bouwt een Open Graph-afbeelding (1200×630): thumbnail + blauwe waas + titel. */
export async function ogImage({ title, subtitle, image }: { title: string; subtitle?: string; image?: string }) {
  let base: sharp.Sharp;
  if (image && image.startsWith('/')) {
    base = sharp(path.join(root, 'public', image)).resize(W, H, { fit: 'cover' });
  } else {
    base = sharp({ create: { width: W, height: H, channels: 3, background: '#1B2E5A' } });
  }
  const shade = Buffer.from(
    `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B2E5A" stop-opacity=".35"/><stop offset="1" stop-color="#1B2E5A" stop-opacity=".92"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
  );
  const titleImg = await text(esc(title), 84, W - 140);
  const titleMeta = await sharp(titleImg).metadata();
  const nameImg = await text(esc(site.name), 34, 600);
  const layers: sharp.OverlayOptions[] = [
    { input: shade, top: 0, left: 0 },
    { input: nameImg, top: 56, left: 70 },
    { input: titleImg, top: H - 70 - (titleMeta.height || 100) - (subtitle ? 56 : 0), left: 70 },
  ];
  if (subtitle) {
    const sub = await sharp({
      text: { text: `<span foreground="#F3EEE3">${esc(subtitle)}</span>`, font: 'sans 26', rgba: true, width: W - 140 },
    })
      .png()
      .toBuffer();
    layers.push({ input: sub, top: H - 100, left: 72 });
  }
  return base.composite(layers).png({ compressionLevel: 9, palette: true }).toBuffer();
}
