export interface EasterEgg {
  /** Unieke naam, handig bij foutmeldingen. */
  id: string;
  /** Korte uitleg voor jezelf. */
  description: string;
  /** Wordt één keer per pagina aangeroepen. */
  init: () => void;
}
