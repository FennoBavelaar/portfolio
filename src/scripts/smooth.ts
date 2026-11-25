import Lenis from 'lenis';
import { gsap } from 'gsap';
import { reducedMotion } from './motion';

export let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (reducedMotion() || document.documentElement.dataset.smooth === 'off') return null;
  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: true });
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Pauzeer/hervat scrollen (bijv. tijdens een easter egg). */
export function setScrollLocked(locked: boolean) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  else document.documentElement.style.overflow = locked ? 'hidden' : '';
}
