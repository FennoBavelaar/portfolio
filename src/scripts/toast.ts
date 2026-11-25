let timer: number | undefined;

/** Laat kort een berichtje onderin het scherm zien. */
export function toast(message: string, ms = 2600) {
  const el = document.querySelector<HTMLElement>('.toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  window.clearTimeout(timer);
  timer = window.setTimeout(() => el.classList.remove('is-visible'), ms);
}
