/** Is de gebruiker aan het typen in een formulierveld? Dan luisteren we niet. */
export const isTyping = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
};

/** Roept `cb` aan zodra de bezoeker de toetsen in `sequence` achter elkaar indrukt. */
export function onKeySequence(sequence: string[], cb: () => void) {
  const seq = sequence.map((k) => k.toLowerCase());
  let pos = 0;
  window.addEventListener('keydown', (e) => {
    if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.toLowerCase();
    if (key === seq[pos]) {
      pos++;
      if (pos === seq.length) {
        pos = 0;
        cb();
      }
    } else {
      pos = key === seq[0] ? 1 : 0;
    }
  });
}

/** Maakt een element aan en hangt het aan <body>. */
export function overlay(className: string, html: string) {
  const el = document.createElement('div');
  el.className = className;
  el.innerHTML = html;
  document.body.append(el);
  return el;
}
