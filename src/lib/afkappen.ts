/**
 * Splitst de (als HTML gerenderde) Over mij-tekst op de markering [meer].
 *
 * Resultaat:
 * - `zichtbaar`: alles tot [meer], met daarachter
 *     <span class="about__dots">...</span>            (verdwijnt bij uitklappen)
 *     <span class="about__inline" hidden>…</span>      (de rest van díe alinea; loopt
 *                                                       vloeiend door na uitklappen)
 * - `rest`: de alinea's daarna (klappen open eronder)
 */
export const MARKERING = '[meer]';

const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'source', 'wbr']);
const TAG = /<\/?([a-zA-Z][\w-]*)([^>]*)>/g;
const DOTS = '<span class="about__dots" aria-hidden="true">...</span>';

function openTags(html: string): string[] {
  const stack: string[] = [];
  for (const m of html.matchAll(TAG)) {
    const name = m[1].toLowerCase();
    if (VOID.has(name) || m[0].endsWith('/>')) continue;
    if (m[0].startsWith('</')) {
      const i = stack.lastIndexOf(name);
      if (i !== -1) stack.splice(i);
    } else stack.push(name);
  }
  return stack;
}

/** Vindt in `na` het punt waarop de bij de markering open staande tags weer sluiten. */
function sluitpunt(na: string, open: string[]): { begin: number; eind: number } | null {
  const stack = [...open];
  for (const m of na.matchAll(TAG)) {
    const name = m[1].toLowerCase();
    if (VOID.has(name) || m[0].endsWith('/>')) continue;
    if (m[0].startsWith('</')) {
      const i = stack.lastIndexOf(name);
      if (i === -1) continue;
      stack.splice(i);
      if (stack.length === 0) return { begin: m.index!, eind: m.index! + m[0].length };
    } else stack.push(name);
  }
  return null;
}

const leegWeg = (html: string) => html.replace(/<p>\s*<\/p>/g, '').trim();

export function afkappen(html: string) {
  let idx = html.indexOf(MARKERING);
  let lengte = MARKERING.length;

  // Geen markering: na de eerste alinea afkappen.
  if (idx === -1) {
    const m = html.match(/^\s*<p>[\s\S]*?<\/p>/);
    if (!m) return { zichtbaar: html, rest: '' };
    idx = m[0].length - '</p>'.length;
    lengte = 0;
  }

  const voorRuw = html.slice(0, idx);
  const spatie = voorRuw.match(/\s*$/)![0];
  const voor = voorRuw.slice(0, voorRuw.length - spatie.length);
  const na = spatie + html.slice(idx + lengte);
  const open = openTags(voor);

  // Markering staat buiten een alinea (bijv. in een eigen regel): puntjes in de vorige alinea.
  if (open.length === 0) {
    const zichtbaar = /<\/p>$/.test(voor) ? voor.replace(/<\/p>$/, `${DOTS}</p>`) : voor + DOTS;
    return { zichtbaar: leegWeg(zichtbaar), rest: leegWeg(na) };
  }

  // Markering midden in een alinea: de rest van die alinea loopt na uitklappen gewoon door.
  const punt = sluitpunt(na, open);
  const doorloop = punt ? na.slice(0, punt.begin) : na;
  const sluiten = punt ? na.slice(punt.begin, punt.eind) : [...open].reverse().map((t) => `</${t}>`).join('');
  const rest = punt ? na.slice(punt.eind) : '';
  const inline = doorloop.trim() ? `<span class="about__inline" hidden>${doorloop}</span>` : '';

  return {
    zichtbaar: leegWeg(voor + DOTS + inline + sluiten),
    rest: leegWeg(rest),
  };
}
