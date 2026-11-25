import { gsap } from 'gsap';
import { finePointer, reducedMotion } from './motion';

/*
 * Custom cursor. Vorm hangt af van het element onder de muis:
 *   data-cursor="play"  → "play" (video's)
 *   data-cursor="view"  → "bekijk" (projecten)
 *   data-cursor="sound" → "geluid" (showreel)
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

  const labels: Record<string, string> = { play: 'play', view: 'bekijk', sound: 'geluid' };

  const update = (target: EventTarget | null) => {
    const t = target instanceof Element ? target : null;
    const special = t?.closest<HTMLElement>('[data-cursor]');
    if (special) {
      const state = special.dataset.cursor || 'link';
      el.dataset.state = state;
      label.textContent = special.dataset.cursorLabel || labels[state] || '';
      return;
    }
    if (t?.closest('a, button, [role="button"], label, select')) {
      el.dataset.state = 'link';
      label.textContent = '';
      return;
    }
    el.dataset.state = '';
    label.textContent = '';
  };
  document.addEventListener('pointerover', (e) => update(e.target), { passive: true });
  // labels die tijdens hover veranderen (bijv. geluid aan/uit)
  document.addEventListener('cursor:refresh', () => update(document.elementFromPoint(Number(gsap.getProperty(el, 'x')), Number(gsap.getProperty(el, 'y')))));
}
