import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export const TYPE_LABELS: Record<Project['data']['type'], string> = {
  commercial: 'Commercial',
  videoclip: 'Videoclip',
  'short film': 'Short film',
  branded: 'Branded',
  documentaire: 'Documentaire',
};

export const typeKey = (t: string) => t.replace(/\s+/g, '-');

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  const seen = new Map<string, string>();
  for (const p of all) {
    const other = seen.get(p.data.slug);
    if (other) {
      throw new Error(`Twee projecten hebben dezelfde slug "${p.data.slug}" (${other} en ${p.id}). Maak er één uniek.`);
    }
    seen.set(p.data.slug, p.id);
  }
  return all.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export async function getSocial() {
  const all = await getCollection('social');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Haalt platform + id uit een Vimeo- of YouTube-link. */
export function parseEmbed(url: string): { provider: 'vimeo' | 'youtube'; id: string; hash?: string } | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { provider: 'youtube', id: yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  if (vm) return { provider: 'vimeo', id: vm[1], hash: vm[2] };
  return null;
}

export function embedSrc(url: string): string | null {
  const e = parseEmbed(url);
  if (!e) return null;
  if (e.provider === 'youtube') return `https://www.youtube-nocookie.com/embed/${e.id}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`;
  return `https://player.vimeo.com/video/${e.id}?autoplay=1&muted=0&dnt=1${e.hash ? `&h=${e.hash}` : ''}`;
}
