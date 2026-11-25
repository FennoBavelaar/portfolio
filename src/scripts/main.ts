import { initSmoothScroll } from './smooth';
import { initCursor } from './cursor';
import { initReveal } from './reveal';
import { initMenu } from './menu';
import { initEasterEggs } from '../easter-eggs/registry';

initSmoothScroll();
initMenu();
initCursor();
initReveal();
initEasterEggs();

// Klik op een project → op de projectpagina start de video meteen (met geluid).
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-autoplay]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
  try {
    sessionStorage.setItem('autoplay', new URL(a.href).pathname.replace(/\/$/, ''));
  } catch {}
});
