import type { EasterEgg } from './types';

const egg: EasterEgg = {
  id: 'console',
  description: 'Een grappig bericht voor nieuwsgierige mensen in de browserconsole.',
  init() {
    if ((window as any).__fennoConsole) return;
    (window as any).__fennoConsole = true;
    const big = 'font: 700 28px Basteleur, Georgia, serif; color:#1b2e5a; background:#f3eee3; padding:10px 16px; border-radius:6px;';
    const small = 'font: 13px/1.6 Switzer, sans-serif; color:#1b2e5a;';
    console.log(
      `%c
   ___________________
  /__/__/__/__/__/__/|
 |  SCÈNE  |  TAKE  ||
 |   01    |   ∞    ||
 |_________|________|/
`,
      'font-family: monospace; color:#1b2e5a;',
    );
    console.log('%cStilte op de set! 🎬', big);
    console.log(
      '%cOh hoi. Jij kijkt ook altijd naar de aftiteling, hè?\n' +
        'Leuk dat je onder de motorkap kijkt. Voor de echte nieuwsgierigen nog drie tips:\n' +
        '  1. Klik eens een paar keer achter elkaar op de naam.\n' +
        '  2. ↑ ↑ ↓ ↓ ← → ← → B A  (je weet wel).\n' +
        '  3. Een regisseur zegt het aan het eind van elke take…\n\n' +
        'Zin om samen iets te maken? Je weet waar je me kunt vinden.',
      small,
    );
  },
};

export default egg;
