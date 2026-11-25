/** true als de bezoeker minder beweging wil (systeeminstelling). */
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** true op apparaten met een muis/trackpad (geen touch). */
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
