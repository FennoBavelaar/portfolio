/*
 * ─────────────────────────────────────────────────────────────
 *  EASTER EGG REGISTRY
 * ─────────────────────────────────────────────────────────────
 *  Elke easter egg is een eigen bestand in deze map.
 *  • Uitzetten?  Zet `aan` op false.
 *  • Nieuwe toevoegen?  Maak een bestand (kopieer bijv. console.ts),
 *    importeer het hieronder en zet het in de lijst.
 */
import type { EasterEgg } from './types';
import clapper from './clapper';
import konami from './konami';
import cut from './cut';
import consoleMessage from './console';

const eggs: { egg: EasterEgg; aan: boolean }[] = [
  { egg: clapper, aan: true }, //        5x klikken op de naam/het logo
  { egg: konami, aan: true }, //         ↑ ↑ ↓ ↓ ← → ← → B A
  { egg: cut, aan: true }, //            typ "cut"
  { egg: consoleMessage, aan: true }, // bericht in de browserconsole
];

export function initEasterEggs() {
  for (const { egg, aan } of eggs) {
    if (!aan) continue;
    try {
      egg.init();
    } catch (err) {
      console.warn(`Easter egg "${egg.id}" kon niet starten:`, err);
    }
  }
}
