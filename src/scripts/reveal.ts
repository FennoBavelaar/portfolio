import { gsap } from 'gsap';
import { reducedMotion } from './motion';

/*
 * Subtiele scroll-animaties. Inhoud is standaard zichtbaar; we animeren alleen
 * elementen die nog onder de vouw zitten, en pas als ze in beeld komen.
 * Gebruik: data-reveal op een element, of data-reveal-stagger op een container.
 */
export function initReveal() {
  if (reducedMotion() || !('IntersectionObserver' in window)) return;

  const items = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger] > *')];
  const below = items.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
  if (!below.length) return;

  gsap.set(below, { opacity: 0, y: 28 });
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      if (!visible.length) return;
      visible.forEach((el) => io.unobserve(el));
      gsap.to(visible, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, overwrite: true });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );
  below.forEach((el) => io.observe(el));

  // Vangnet bij printen: alles zichtbaar.
  window.addEventListener('beforeprint', () => gsap.set(below, { opacity: 1, y: 0 }));
}
