import { setScrollLocked } from './smooth';

export function initMenu() {
  const btn = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  const label = btn.querySelector('.menu-toggle__label');

  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    if (label) label.textContent = open ? 'Sluit' : 'Menu';
    setScrollLocked(open);
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      set(false);
      btn.focus();
    }
  });
  nav.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) set(false);
  });
}
