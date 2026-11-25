import { finePointer, reducedMotion } from './motion';

const saveData = () => (navigator as any).connection?.saveData === true;

function start(card: HTMLElement) {
  const v = card.querySelector<HTMLVideoElement>('video[data-src]');
  if (!v) return;
  // in de lijstweergave op desktop doet de zwevende preview het werk
  if (finePointer() && card.closest('[data-view="lijst"]')) return;
  if (!v.src) v.src = v.dataset.src!;
  v.play()
    .then(() => card.classList.add('is-playing'))
    .catch(() => {});
}
function stop(card: HTMLElement) {
  const v = card.querySelector<HTMLVideoElement>('video[data-src]');
  card.classList.remove('is-playing');
  if (v && v.src) {
    v.pause();
    v.currentTime = 0;
  }
}

/**
 * Speelt de previewVideo af in de thumbnail.
 *  - Desktop: bij hover.
 *  - Touch: de kaart die midden in beeld staat (één tegelijk).
 * Video's worden pas geladen als ze nodig zijn.
 */
export function initHoverPreviews(root: ParentNode = document) {
  if (reducedMotion() || saveData()) return;
  const cards = [...root.querySelectorAll<HTMLElement>('[data-preview]')];

  if (finePointer()) {
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => start(card));
      card.addEventListener('mouseleave', () => stop(card));
      card.addEventListener('focusin', () => start(card));
      card.addEventListener('focusout', () => stop(card));
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? start(e.target as HTMLElement) : stop(e.target as HTMLElement))),
    { rootMargin: '-35% 0px -35% 0px' },
  );
  cards.forEach((c) => io.observe(c));
}
