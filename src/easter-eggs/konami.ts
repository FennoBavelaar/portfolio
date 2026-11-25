import type { EasterEgg } from './types';
import { onKeySequence } from './utils';
import { toast } from '../scripts/toast';

/*
 * Konami-code (↑ ↑ ↓ ↓ ← → ← → B A): de achtergrond wordt een Delfts-blauw tegeltableau.
 * Alle tegels zijn hieronder met de hand in SVG getekend. Nog een keer de code = uit.
 */
const B = '#1b2e5a';
const C = '#f3eee3';
const S = 120; // tegelgrootte

const frame = (inner: string) => `
  <rect width="${S}" height="${S}" fill="${C}"/>
  <rect x=".75" y=".75" width="${S - 1.5}" height="${S - 1.5}" fill="none" stroke="${B}" stroke-opacity=".35" stroke-width="1.5"/>
  ${[0, 1, 2, 3]
    .map(
      (r) => `<g transform="rotate(${r * 90} 60 60)" fill="none" stroke="${B}" stroke-width="1.6" stroke-linecap="round">
        <path d="M6 18 q6 -2 8 -8 M10 6 q2 6 8 8"/><circle cx="9" cy="9" r="2.2" fill="${B}" stroke="none"/>
      </g>`,
    )
    .join('')}
  <g fill="none" stroke="${B}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;

const tiles = {
  bloem: frame(`
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path transform="rotate(${a} 60 60)" d="M60 60 q-7 -14 0 -26 q7 12 0 26z" fill="${B}" fill-opacity=".85"/>`).join('')}
    <circle cx="60" cy="60" r="6" fill="${C}"/><circle cx="60" cy="60" r="2.5" fill="${B}"/>`),
  ster: frame(`
    <circle cx="60" cy="60" r="20"/>
    ${[0, 60, 120, 180, 240, 300].map((a) => `<path transform="rotate(${a} 60 60)" d="M60 40 L60 28 M56 32 L60 26 L64 32"/>`).join('')}
    <circle cx="60" cy="60" r="7" fill="${B}"/>`),
  molenMetCamera: frame(`
    <path d="M50 98 L54 66 L66 66 L70 98 Z" fill="${B}" fill-opacity=".15"/>
    <path d="M57 98 v-10 a3 3 0 0 1 6 0 v10"/>
    <line x1="40" y1="98" x2="80" y2="98"/>
    ${[20, 110, 200, 290]
      .map((a) => `<g transform="rotate(${a} 60 60)"><rect x="57" y="22" width="9" height="32" fill="${C}"/><path d="M57 30 h9 M57 38 h9 M57 46 h9"/></g>`)
      .join('')}
    <rect x="49" y="53" width="22" height="15" rx="2" fill="${B}"/>
    <circle cx="60" cy="60.5" r="4.5" fill="${C}"/><circle cx="60" cy="60.5" r="2" fill="${B}" stroke="none"/>
    <path d="M71 57 l7 -4 v15 l-7 -4" fill="${B}"/>
    <circle cx="53" cy="49" r="4" fill="${C}"/><circle cx="64" cy="48" r="5" fill="${C}"/>`),
  regisseursstoel: frame(`
    <rect x="38" y="30" width="44" height="20" rx="2" fill="${B}"/>
    <text x="60" y="44.5" fill="${C}" stroke="none" font-family="Georgia, serif" font-weight="700" font-size="11" text-anchor="middle" letter-spacing="1">REGIE</text>
    <line x1="40" y1="28" x2="40" y2="66"/><line x1="80" y1="28" x2="80" y2="66"/>
    <rect x="34" y="64" width="52" height="6" rx="1.5" fill="${B}"/>
    <path d="M38 70 L82 98 M82 70 L38 98"/>
    <line x1="34" y1="98" x2="44" y2="98"/><line x1="76" y1="98" x2="86" y2="98"/>
    <path d="M30 58 h10 M80 58 h10"/>`),
  klapper: frame(`
    <g transform="rotate(-18 34 46)"><rect x="32" y="36" width="58" height="11" fill="${B}"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${38 + i * 14} 36 l7 0 l-5 11 l-7 0z" fill="${C}" stroke="none"/>`).join('')}</g>
    <rect x="32" y="52" width="58" height="11" fill="${B}"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${40 + i * 14} 52 l7 0 l-5 11 l-7 0z" fill="${C}" stroke="none"/>`).join('')}
    <rect x="32" y="64" width="58" height="30" rx="2"/>
    <path d="M32 79 h58 M61 64 v30"/>`),
  koffie: frame(`
    <path d="M40 54 h36 l-4 38 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4 z" fill="${B}" fill-opacity=".12"/>
    <path d="M76 62 a9 9 0 0 1 0 18 h-2"/>
    <path d="M50 46 q-5 -7 0 -12 q5 -6 0 -12 M60 46 q-5 -7 0 -12 q5 -6 0 -12 M70 46 q-5 -7 0 -12"/>
    <text x="57" y="80" fill="${B}" stroke="none" font-family="Georgia, serif" font-weight="700" font-size="9.5" text-anchor="middle">TAKE 47</text>`),
};

// 4×4 tableau: vooral klassieke tegels, met hier en daar iets absurds.
const layout = [
  ['bloem', 'ster', 'bloem', 'molenMetCamera'],
  ['ster', 'regisseursstoel', 'ster', 'bloem'],
  ['bloem', 'ster', 'klapper', 'ster'],
  ['koffie', 'bloem', 'ster', 'bloem'],
] as const;

function tableauUrl() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S * 4}" height="${S * 4}">${layout
    .flatMap((row, y) => row.map((t, x) => `<g transform="translate(${x * S} ${y * S})">${tiles[t]}</g>`))
    .join('')}</svg>`;
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}")`;
}

const egg: EasterEgg = {
  id: 'konami',
  description: 'Konami-code: Delfts-blauw tegelpatroon als achtergrond.',
  init() {
    let styled = false;
    onKeySequence(['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'], () => {
      if (!styled) {
        styled = true;
        const style = document.createElement('style');
        style.textContent = `
          html.egg-tiles body{background-image:${tableauUrl()};background-size:${S * 4 * 0.85}px;background-attachment:fixed}
          html.egg-tiles main .wrap{background:color-mix(in srgb,var(--cream) 84%,transparent);box-shadow:0 0 0 1px var(--blue-10)}
          html.egg-tiles .site-footer{box-shadow:0 -8px 0 var(--cream)}
          @media (prefers-reduced-motion: no-preference){html.egg-tiles body{animation:egg-tiles-in .8s var(--ease-out)}}
          @keyframes egg-tiles-in{from{background-position:0 -60px;opacity:.6}}
        `;
        document.head.append(style);
      }
      const on = document.documentElement.classList.toggle('egg-tiles');
      toast(on ? 'Delfts blauw-modus aan. Gezellig hè? (nog een keer = uit)' : 'Terug naar de gewone take.');
    });
  },
};

export default egg;
