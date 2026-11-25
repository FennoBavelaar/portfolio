import { gsap } from 'gsap';
import { finePointer, reducedMotion } from './motion';

/*
 * Custom cursor. Vorm hangt af van het element onder de muis:
 *   data-cursor="play"  → play-icoontje (video's)
 *   data-cursor="view"  → oog (projecten)
 *   data-cursor="sound" → luidspreker (social feed)
 *   data-cursor="copy"  → kopieer-icoontje (e-mailadres)
 *   links & knoppen     → ring
 * Uitgeschakeld op touch-apparaten.
 */
export function initCursor() {
  if (!finePointer()) return;
  const el = document.querySelector<HTMLElement>('.cursor');
  const label = el?.querySelector<HTMLElement>('.cursor__label');
  if (!el || !label) return;

  document.documentElement.classList.add('has-cursor');
  const dur = reducedMotion() ? 0 : 0.35;
  const xTo = gsap.quickTo(el, 'x', { duration: dur, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: dur, ease: 'power3' });

  let visible = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add('is-on');
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => {
    el.classList.remove('is-on');
    visible = false;
  });
  window.addEventListener('pointerdown', () => el.classList.add('is-down'));
  window.addEventListener('pointerup', () => el.classList.remove('is-down'));

  // Kleine icoontjes in de cursor (stroke = crème, getekend op 20×20).
  const svg = (d: string) =>
    `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const icons: Record<string, string> = {
    view: svg('<path d="M1.5 10s3.2-5.5 8.5-5.5S18.5 10 18.5 10s-3.2 5.5-8.5 5.5S1.5 10 1.5 10z"/><circle cx="10" cy="10" r="2.4" fill="currentColor"/>'),
    play: svg('<path d="M7 5l8 5-8 5z" fill="currentColor"/>'),
    copy: svg('<rect x="7" y="7" width="9.5" height="9.5" rx="1.5"/><path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v6.5A1.5 1.5 0 0 0 5.5 13H7"/>'),
    soundOn: svg('<path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor"/><path d="M13.5 7.5a3.5 3.5 0 0 1 0 5M15.8 5.5a6.5 6.5 0 0 1 0 9"/>'),
    soundOff: svg('<path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor"/><path d="M13.5 8l4 4M17.5 8l-4 4"/>'),
  };
  const iconFor = (state: string, label?: string) => {
    // "geluid aan" = klik zet geluid aan → toon luidspreker; "geluid uit" → doorgestreept
    if (state === 'sound') return label === 'geluid uit' ? icons.soundOff : icons.soundOn;
    return icons[state] || '';
  };

  const update = (target: EventTarget | null) => {
    const t = target instanceof Element ? target : null;
    const special = t?.closest<HTMLElement>('[data-cursor]');
    if (special) {
      const state = special.dataset.cursor || 'link';
      el.dataset.state = state;
      label.innerHTML = iconFor(state, special.dataset.cursorLabel);
      return;
    }
    if (t?.closest('a, button, [role="button"], label, select')) {
      el.dataset.state = 'link';
      label.innerHTML = '';
      return;
    }
    el.dataset.state = '';
    label.innerHTML = '';
  };
  document.addEventListener('pointerover', (e) => update(e.target), { passive: true });
  // labels die tijdens hover veranderen (bijv. geluid aan/uit)
  document.addEventListener('cursor:refresh', () => update(document.elementFromPoint(Number(gsap.getProperty(el, 'x')), Number(gsap.getProperty(el, 'y')))));
}
