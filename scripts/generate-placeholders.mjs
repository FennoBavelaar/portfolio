// Genereert placeholder-media (video's + posters) in de huisstijlkleuren.
// Draaien met: npm run media   (vereist ffmpeg)
// Je hoeft dit maar één keer te doen; vervang de bestanden daarna door je eigen werk.
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (p) => path.join(root, 'public/media', p);
const font = path.join(root, 'src/assets/fonts/Basteleur-Bold.ttf').replace(/:/g, '\\:');
const force = process.argv.includes('--force');

// Alleen de twee huisstijlkleuren
const CREAM = [243, 238, 227];
const BLUE = [27, 46, 90];

// Patronen: expressie die 1 (blauw) of 0 (crème) oplevert. X, Y, W, H, T zijn beschikbaar in geq.
const patterns = [
  'gt(sin((X+Y+T*180)/38),0)', // diagonale strepen
  'gt(sin(hypot(X-W/2,Y-H/2)/22-T*4),0)', // pulserende cirkels
  'lt(mod(floor((X+T*60)/(W/8))+floor(Y/(W/8)),2),1)', // tegels die schuiven
  'gt(Y,H/2+sin(X/60+T*3)*H/6)', // golf
  'gt(sin(atan2(Y-H/2,X-W/2)*6+T*1.5),0)', // draaiende sectoren
  'lt(hypot(mod(X,W/10)-W/20,mod(Y,W/10)-W/20),(W/40)*(1.3+sin(T*3+X/200)))', // stippen
];

const geq = (expr) => {
  const c = (i) => `if(${expr},${BLUE[i]},${CREAM[i]})`;
  return `geq=r='${c(0)}':g='${c(1)}':b='${c(2)}'`;
};

const text = (label, size, y = '(h-text_h)/2', color = 'F3EEE3', box = true) =>
  `drawtext=fontfile='${font}':text='${label}':fontsize=${size}:fontcolor=0x${color}:x=(w-text_w)/2:y=${y}` +
  (box ? `:box=1:boxcolor=0x1B2E5A:boxborderw=${Math.round(size / 3)}` : '');

function ff(args) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

function video({ file, w, h, dur, expr, label, sub, audioHz }) {
  if (existsSync(file) && !force) return;
  const vf = [geq(expr), text(label, Math.round(h / 9)), sub ? text(sub, Math.round(h / 28), `h-${Math.round(h / 8)}`) : null]
    .filter(Boolean)
    .join(',');
  const args = ['-f', 'lavfi', '-i', `color=c=black:s=${w}x${h}:r=25:d=${dur}`];
  if (audioHz) {
    // zacht akkoordje, zodat "geluid aan" iets doet
    args.push('-f', 'lavfi', '-i', `sine=f=${audioHz}:d=${dur},volume=0.08`);
    args.push('-f', 'lavfi', '-i', `sine=f=${Math.round(audioHz * 1.5)}:d=${dur},volume=0.05`);
  }
  args.push('-vf', vf);
  if (audioHz) {
    args.push('-filter_complex', `[1:a][2:a]amix=inputs=2,afade=t=in:d=0.4,afade=t=out:st=${dur - 0.5}:d=0.5[a]`, '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '64k');
  } else {
    args.push('-an');
  }
  args.push('-c:v', 'libx264', '-preset', 'veryslow', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-t', String(dur), file);
  ff(args);
}

function still({ file, w, h, expr, label, sub, t = 0.8 }) {
  if (existsSync(file) && !force) return;
  const vf = [geq(expr.replace(/T/g, String(t))), text(label, Math.round(h / 9)), sub ? text(sub, Math.round(h / 28), `h-${Math.round(h / 8)}`) : null]
    .filter(Boolean)
    .join(',');
  ff(['-f', 'lavfi', '-i', `color=c=black:s=${w}x${h}:d=1`, '-vf', vf, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '72', file]);
}

for (const d of ['projects', 'social', 'showreel']) mkdirSync(out(d), { recursive: true });

// Showreel: wisselt elke 2 seconden van patroon
const reelExpr = patterns
  .slice(0, 4)
  .map((p, i) => `eq(mod(floor(T/2),4),${i})*${p}`)
  .join('+');
console.log('→ showreel');
video({ file: out('showreel/showreel.mp4'), w: 1280, h: 720, dur: 8, expr: reelExpr, label: 'SHOWREEL', sub: 'placeholder · vervang mij', audioHz: 220 });
still({ file: out('showreel/showreel-poster.webp'), w: 1600, h: 900, expr: patterns[0], label: 'SHOWREEL', sub: 'placeholder' });

// 6 projecten
for (let i = 1; i <= 6; i++) {
  const n = String(i).padStart(2, '0');
  const expr = patterns[i - 1];
  console.log(`→ project ${n}`);
  still({ file: out(`projects/project-${n}.webp`), w: 1600, h: 900, expr, label: `PROJECT ${n}`, sub: 'placeholder' });
  video({ file: out(`projects/project-${n}-preview.mp4`), w: 640, h: 360, dur: 4, expr, label: `PROJECT ${n}` });
}

// 10 social video's (9:16)
for (let i = 1; i <= 10; i++) {
  const n = String(i).padStart(2, '0');
  const expr = patterns[(i - 1) % patterns.length];
  console.log(`→ social ${n}`);
  still({ file: out(`social/social-${n}.webp`), w: 540, h: 960, expr, label: n, sub: 'social placeholder' });
  video({ file: out(`social/social-${n}.mp4`), w: 540, h: 960, dur: 6, expr, label: n, sub: 'social placeholder', audioHz: 180 + i * 25 });
}

console.log('✓ Placeholder-media klaar in public/media/');
