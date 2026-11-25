import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Hier staat precies welke velden een project en een social video moeten hebben.
 * Vergeet je een veld, of klopt de waarde niet? Dan stopt de site met bouwen
 * en krijg je een Nederlandstalige foutmelding met de bestandsnaam erbij.
 */

export const PROJECT_TYPES = ['commercial', 'videoclip', 'short film', 'branded', 'documentaire'] as const;

const verplicht = (veld: string, uitleg = '') => ({
  error: (issue: { input: unknown }) =>
    issue.input === undefined
      ? `Het veld "${veld}" ontbreekt. ${uitleg}`.trim()
      : `Het veld "${veld}" heeft een ongeldige waarde. ${uitleg}`.trim(),
});

// Media staan in public/media en worden opgeslagen als "/media/...".
const mediaPad = (veld: string, extensies: string[]) =>
  z
    .string(verplicht(veld, `Verwacht een pad zoals "/media/.../bestand.${extensies[0]}".`))
    .refine((v) => v.startsWith('/media/') || /^https?:\/\//.test(v), {
      message: `"${veld}" moet beginnen met "/media/" (een geüpload bestand) of met "https://".`,
    })
    .refine((v) => extensies.some((e) => v.toLowerCase().split('?')[0].endsWith(`.${e}`)), {
      message: `"${veld}" moet een bestand zijn van het type: ${extensies.join(', ')}.`,
    });

const afbeelding = (veld: string) => mediaPad(veld, ['jpg', 'jpeg', 'png', 'webp', 'avif']);
const video = (veld: string) => mediaPad(veld, ['mp4', 'webm', 'mov']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(verplicht('title', 'Geef het project een titel.')).min(1, 'De titel mag niet leeg zijn.'),
    slug: z
      .string(verplicht('slug', 'Dit is het stukje van de webadres, bijv. "mijn-project".'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'De slug mag alleen kleine letters, cijfers en streepjes bevatten, bijv. "nike-zomer-2025".'),
    client: z.string(verplicht('client', 'Voor wie was het? Bijv. "Heineken".')),
    year: z.coerce
      .number(verplicht('year', 'Bijv. 2025.'))
      .int('Het jaar moet een heel getal zijn.')
      .min(1900, 'Dat jaar is wel heel vroeg.')
      .max(2100, 'Dat jaar ligt wel heel ver in de toekomst.'),
    role: z.string(verplicht('role', 'Bijv. "regie" of "regie + script".')),
    type: z.enum(PROJECT_TYPES, {
      error: (issue) =>
        issue.input === undefined
          ? 'Het veld "type" ontbreekt.'
          : `"${String(issue.input)}" is geen geldig type. Kies uit: ${PROJECT_TYPES.join(', ')}.`,
    }),
    thumbnail: afbeelding('thumbnail'),
    previewVideo: video('previewVideo').optional(),
    videoEmbed: z
      .string(verplicht('videoEmbed', 'Plak hier de Vimeo- of YouTube-link.'))
      .refine((v) => /(vimeo\.com|youtube\.com|youtu\.be)/.test(v), {
        message: '"videoEmbed" moet een Vimeo- of YouTube-link zijn.',
      }),
    credits: z
      .array(
        z.object({
          role: z.string(verplicht('credits → role', 'Bijv. "Director of Photography".')),
          name: z.string(verplicht('credits → name')),
        }),
        verplicht('credits', 'Een lijst met rol + naam (mag leeg zijn: credits: []).'),
      )
      .default([]),
    featured: z.boolean(verplicht('featured', 'Vul true (op de homepage) of false in.')).default(false),
    order: z.coerce.number(verplicht('order', 'Een getal; lager staat eerder.')).default(100),
  }),
});

export const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'youtube'] as const;

const social = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/social' }),
  schema: z.object({
    videoSrc: video('videoSrc'),
    poster: afbeelding('poster'),
    caption: z.string(verplicht('caption', 'Het tekstje bij de video.')),
    platform: z.enum(SOCIAL_PLATFORMS, {
      error: (issue) =>
        issue.input === undefined
          ? 'Het veld "platform" ontbreekt.'
          : `"${String(issue.input)}" is geen geldig platform. Kies uit: ${SOCIAL_PLATFORMS.join(', ')}.`,
    }),
    date: z.coerce.date(verplicht('date', 'Gebruik het formaat JJJJ-MM-DD, bijv. 2025-06-01.')),
    link: z.url(verplicht('link', 'De link naar de originele post, beginnend met https://.')),
  }),
});

export const collections = { projects, social };
