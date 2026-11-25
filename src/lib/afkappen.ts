/**
 * Splitst de (als HTML gerenderde) Over mij-tekst op de markering [meer].
 * - `zichtbaar`: alles vóór [meer], met "..." erachter (altijd in beeld)
 * - `rest`: alles na [meer] (klapt open onder de knop)
 * Open tags (zoals een <p> die halverwege wordt afgekapt) worden netjes
 * gesloten en aan het begin van de rest weer geopend.
 */
export const MARKERING = '[meer]';

const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'wbr']);

function openTags(html: string): string[] {
  const stack: string[] = [];
  for (const m of html.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>/g)) {
    const [full, rawName] = m;
    const name = rawName.toLowerCase();
    if (VOID.has(name) || full.endsWith('/>')) continue;
    if (full.startsWith('</')) {
      const i = stack.lastIndexOf(name);
      if (i !== -1) stack.splice(i);
    } else {
      stack.push(name);
    }
  }
  return stack;
}

const opschonen = (html: string) => html.replace(/<p>\s*<\/p>/g, '').trim();

export function afkappen(html: string, puntjes = '...') {
  // De editor kan de haken escapen; in HTML staat het er altijd letterlijk.
  const idx = html.indexOf(MARKERING);
  if (idx === -1) {
    // Geen markering: toon de eerste alinea, de rest klapt open.
    const m = html.match(/^\s*<p>[\s\S]*?<\/p>/);
    if (!m) return { zichtbaar: html, rest: '', gevonden: false };
    return { zichtbaar: m[0], rest: html.slice(m[0].length).trim(), gevonden: false };
  }

  let voor = html.slice(0, idx).replace(/\s+$/, '');
  const na = html.slice(idx + MARKERING.length).replace(/^\s+/, '');
  const open = openTags(voor);

  // "..." direct achter het laatste woord, ook als de markering in een eigen alinea staat.
  if (open.length === 0 && /<\/p>$/.test(voor)) voor = voor.replace(/<\/p>$/, `${puntjes}</p>`);
  else voor += puntjes;

  const sluiten = [...open].reverse().map((t) => `</${t}>`).join('');
  const heropenen = open.map((t) => `<${t}>`).join('');

  return {
    zichtbaar: opschonen(voor + sluiten),
    rest: opschonen(heropenen + na),
    gevonden: true,
  };
}
