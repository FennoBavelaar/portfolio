import { gsap } from 'gsap';
import type { EasterEgg } from './types';
import { overlay } from './utils';
import { reducedMotion } from '../scripts/motion';

/*
 * Klik 5x snel op de naam of het logo (alles met [data-egg-name]):
 * een filmklapper klapt dicht met "ACTION!" en de site gaat even zwart-wit met film grain.
 */
const CLICKS = 5;
const WINDOW_MS = 1600;
const NOIR_MS = 7000;

function clapSound() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctx();
    const len = ctx.sampleRate * 0.12;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    src.buffer = buf;
    src.connect(gain).connect(ctx.destination);
    src.start();
    src.onended = () => ctx.close();
  } catch {
    /* geen geluid, geen probleem */
  }
}

let running = false;

function action() {
  if (running) return;
  running = true;
  const name = document.querySelector('.logo')?.textContent?.trim() || '';
  const rm = reducedMotion();

  const el = overlay(
    'egg-clapper',
    `<div class="egg-clapper__board" role="img" aria-label="Filmklapper: ACTION!">
      <svg viewBox="0 0 320 250" class="egg-clapper__svg">
        <g class="egg-clapper__stick">
          <rect x="10" y="10" width="300" height="44" rx="4" fill="#1b2e5a"/>
          ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${22 + i * 50} 12 l30 0 l-22 40 l-30 0z" fill="#f3eee3"/>`).join('')}
        </g>
        <g class="egg-clapper__base">
          <rect x="10" y="62" width="300" height="34" rx="2" fill="#1b2e5a"/>
          ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${30 + i * 50} 64 l30 0 l-22 30 l-30 0z" fill="#f3eee3"/>`).join('')}
          <rect x="10" y="100" width="300" height="140" rx="6" fill="#1b2e5a"/>
          <g fill="none" stroke="#f3eee3" stroke-width="1.5" opacity=".7">
            <line x1="20" y1="150" x2="300" y2="150"/><line x1="160" y1="150" x2="160" y2="230"/><line x1="20" y1="190" x2="300" y2="190"/>
          </g>
          <g fill="#f3eee3" font-family="Switzer, sans-serif" font-size="11" letter-spacing="1.5">
            <text x="24" y="122">PRODUCTIE</text>
            <text x="24" y="166">SCÈNE</text><text x="170" y="166">TAKE</text>
            <text x="24" y="206">REGIE</text><text x="170" y="206">DATUM</text>
          </g>
          <g fill="#f3eee3" font-family="Basteleur, Georgia, serif" font-weight="700">
            <text x="24" y="142" font-size="18">${name || 'PORTFOLIO'}</text>
            <text x="24" y="184" font-size="18">01</text><text x="170" y="184" font-size="18">5</text>
            <text x="24" y="224" font-size="16">${name}</text>
            <text x="170" y="224" font-size="14">${new Date().toLocaleDateString('nl-NL')}</text>
          </g>
        </g>
      </svg>
      <p class="egg-clapper__action">ACTION!</p>
    </div>`,
  );

  const stick = el.querySelector('.egg-clapper__stick');
  const tl = gsap.timeline({
    onComplete: () => {
      el.remove();
      noir();
    },
  });
  if (rm) {
    tl.set(el, { opacity: 1 }).set('.egg-clapper__action', { opacity: 1 }).call(clapSound).to(el, { opacity: 0, delay: 1.2, duration: 0.01 });
    return;
  }
  tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    .fromTo('.egg-clapper__board', { y: 60, scale: 0.8, rotate: -6 }, { y: 0, scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.6)' }, '<')
    .fromTo(stick, { rotate: -28, svgOrigin: '14 58' }, { rotate: -32, duration: 0.25, ease: 'power1.inOut' })
    .to(stick, { rotate: 0, duration: 0.11, ease: 'power4.in' })
    .call(clapSound)
    .to('.egg-clapper__board', { y: 6, duration: 0.06, yoyo: true, repeat: 1 })
    .fromTo('.egg-clapper__action', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.5)' }, '<')
    .to(el, { opacity: 0, duration: 0.35, delay: 0.7 });
}

function noir() {
  const fx = overlay('egg-noir', '<div class="egg-noir__grain"></div>');
  document.documentElement.classList.add('is-noir');
  setTimeout(() => {
    fx.classList.add('is-leaving');
    setTimeout(() => {
      fx.remove();
      document.documentElement.classList.remove('is-noir');
      running = false;
    }, 900);
  }, NOIR_MS);
}

const egg: EasterEgg = {
  id: 'clapper',
  description: 'Klik 5x op de naam: filmklapper + even zwart-wit met film grain.',
  init() {
    let count = 0;
    let first = 0;
    let navTimer: number | undefined;

    document.addEventListener('click', (e) => {
      const target = (e.target as Element).closest<HTMLElement>('[data-egg-name]');
      if (!target) return;
      const now = Date.now();
      if (now - first > WINDOW_MS) {
        count = 0;
        first = now;
      }
      count++;

      // Het logo is ook een link: we wachten heel even of er nog een klik komt.
      if (target instanceof HTMLAnchorElement && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        window.clearTimeout(navTimer);
        const href = target.href;
        const samePage = new URL(href).pathname === location.pathname;
        if (count < CLICKS && !(samePage && count > 1)) {
          navTimer = window.setTimeout(() => {
            if (samePage) window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
            else location.href = href;
          }, 320);
        }
      }

      if (count >= CLICKS) {
        count = 0;
        window.clearTimeout(navTimer);
        action();
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      .egg-clapper{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:color-mix(in srgb,var(--cream) 80%,transparent);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);pointer-events:none}
      .egg-clapper__board{display:grid;justify-items:center;gap:.5rem;width:min(78vw,420px)}
      .egg-clapper__svg{width:100%;height:auto;overflow:visible;filter:drop-shadow(0 18px 30px var(--blue-20))}
      .egg-clapper__action{margin:0;font-family:var(--font-display);font-weight:700;font-size:clamp(3rem,12vw,7rem);line-height:1;color:var(--blue);letter-spacing:.02em}
      .egg-noir{position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;transition:opacity .9s;backdrop-filter:grayscale(1) contrast(1.15) brightness(.97);-webkit-backdrop-filter:grayscale(1) contrast(1.15) brightness(.97);box-shadow:inset 0 0 18vmax color-mix(in srgb,var(--blue) 55%,transparent)}
      .egg-noir.is-leaving{opacity:0}
      .egg-noir__grain{position:absolute;inset:-100%;opacity:.22;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 -.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");animation:egg-grain .5s steps(6) infinite}
      @keyframes egg-grain{0%{transform:translate(0,0)}20%{transform:translate(-8%,4%)}40%{transform:translate(6%,-7%)}60%{transform:translate(-4%,9%)}80%{transform:translate(9%,2%)}100%{transform:translate(-2%,-5%)}}
      @media (prefers-reduced-motion: reduce){.egg-noir__grain{animation:none}}
    `;
    document.head.append(style);
  },
};

export default egg;
