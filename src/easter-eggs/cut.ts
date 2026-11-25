import { gsap } from 'gsap';
import type { EasterEgg } from './types';
import { isTyping, overlay } from './utils';
import { setScrollLocked } from '../scripts/smooth';

/*
 * Typ "cut" ergens op de site: alles bevriest, met een timecode-overlay
 * en het tekstje "...en cut! Nog één keer?".
 */
const WORD = 'cut';
const FPS = 25;

function timecode(ms: number) {
  const totalFrames = Math.floor((ms / 1000) * FPS);
  const f = totalFrames % FPS;
  const s = Math.floor(totalFrames / FPS) % 60;
  const m = Math.floor(totalFrames / FPS / 60) % 60;
  const h = Math.floor(totalFrames / FPS / 3600);
  return [h, m, s, f].map((n) => String(n).padStart(2, '0')).join(':');
}

let frozen: HTMLElement | null = null;
let pausedVideos: HTMLVideoElement[] = [];

function freeze() {
  if (frozen) return;
  const tc = timecode(performance.now());

  pausedVideos = [...document.querySelectorAll('video')].filter((v) => !v.paused);
  pausedVideos.forEach((v) => v.pause());
  gsap.globalTimeline.pause();
  document.documentElement.classList.add('is-cut');
  setScrollLocked(true);

  frozen = overlay(
    'egg-cut',
    `<div class="egg-cut__frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
     <div class="egg-cut__tc" aria-hidden="true"><span class="egg-cut__dot"></span>TC ${tc}</div>
     <div class="egg-cut__center" role="dialog" aria-modal="true" aria-labelledby="egg-cut-title">
       <p id="egg-cut-title" class="egg-cut__title">...en cut! Nog één keer?</p>
       <button type="button" class="egg-cut__again">Take 2 <span aria-hidden="true">↻</span></button>
     </div>`,
  );
  const btn = frozen.querySelector<HTMLButtonElement>('.egg-cut__again')!;
  btn.addEventListener('click', unfreeze);
  btn.focus({ preventScroll: true });
}

function unfreeze() {
  if (!frozen) return;
  frozen.remove();
  frozen = null;
  document.documentElement.classList.remove('is-cut');
  gsap.globalTimeline.resume();
  setScrollLocked(false);
  pausedVideos.forEach((v) => v.play().catch(() => {}));
  pausedVideos = [];
}

const egg: EasterEgg = {
  id: 'cut',
  description: 'Typ "cut": alles bevriest met een timecode-overlay.',
  init() {
    let buffer = '';
    window.addEventListener('keydown', (e) => {
      if (frozen && e.key === 'Escape') return unfreeze();
      if (isTyping(e) || e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-WORD.length);
      if (buffer === WORD) {
        buffer = '';
        freeze();
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      html.is-cut :is(main,.site-header,.site-footer) :is(*,*::before,*::after){animation-play-state:paused !important;transition:none !important}
      html.is-cut main, html.is-cut .site-header, html.is-cut .site-footer{filter:saturate(.6) contrast(1.05)}
      .egg-cut{position:fixed;inset:0;z-index:10000;color:var(--cream);font-family:var(--font-body)}
      .egg-cut::before,.egg-cut::after{content:"";position:absolute;left:0;right:0;height:9vh;background:var(--blue);animation:egg-cut-bars .4s var(--ease-out) both}
      .egg-cut::before{top:0}.egg-cut::after{bottom:0;animation-name:egg-cut-bars-b}
      @keyframes egg-cut-bars{from{transform:translateY(-100%)}}
      @keyframes egg-cut-bars-b{from{transform:translateY(100%)}}
      .egg-cut__frame i{position:absolute;width:44px;height:44px;border:2px solid var(--blue);z-index:1}
      .egg-cut__frame i:nth-child(1){top:calc(9vh + 18px);left:18px;border-right:0;border-bottom:0}
      .egg-cut__frame i:nth-child(2){top:calc(9vh + 18px);right:18px;border-left:0;border-bottom:0}
      .egg-cut__frame i:nth-child(3){bottom:calc(9vh + 18px);left:18px;border-right:0;border-top:0}
      .egg-cut__frame i:nth-child(4){bottom:calc(9vh + 18px);right:18px;border-left:0;border-top:0}
      .egg-cut__tc{position:absolute;z-index:2;top:0;left:0;right:0;height:9vh;display:flex;align-items:center;justify-content:center;gap:.6rem;font-variant-numeric:tabular-nums;font-weight:600;letter-spacing:.12em;font-size:clamp(.85rem,2.5vw,1.2rem)}
      .egg-cut__dot{width:.6em;height:.6em;border-radius:50%;background:var(--cream);animation:egg-cut-blink 1s steps(1) infinite}
      @keyframes egg-cut-blink{50%{opacity:0}}
      .egg-cut__center{position:absolute;z-index:2;left:50%;bottom:0;transform:translateX(-50%);height:9vh;display:flex;align-items:center;gap:1rem;white-space:nowrap}
      .egg-cut__title{margin:0;font-family:var(--font-display);font-weight:700;font-size:clamp(1rem,3.2vw,1.6rem)}
      .egg-cut__again{background:var(--cream);color:var(--blue);border:0;border-radius:999px;padding:.4em 1em;font-weight:600;font-size:.9rem}
      .egg-cut__again:hover{background:var(--blue-light);color:var(--cream)}
      @media (max-width:30em){.egg-cut__center{flex-direction:column;gap:.3rem;height:auto;bottom:1rem;white-space:normal;text-align:center;width:90%}.egg-cut::after{height:16vh}.egg-cut__frame i:nth-child(3),.egg-cut__frame i:nth-child(4){bottom:calc(16vh + 18px)}}
    `;
    document.head.append(style);
  },
};

export default egg;
