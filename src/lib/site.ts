import { z } from 'astro/zod';
import raw from '../data/site.json';

// Valideert de algemene site-instellingen (src/data/site.json, ook te bewerken via de CMS).
const schema = z.object({
  name: z.string().min(1, 'site.json: "name" mag niet leeg zijn.'),
  role: z.string().default('Regisseur'),
  email: z.email('site.json: "email" is geen geldig e-mailadres.'),
  socials: z
    .array(
      z.object({
        platform: z.string(),
        handle: z.string(),
        url: z.url('site.json: elke social heeft een volledige "url" nodig (https://...).'),
      }),
    )
    .default([]),
  showreel: z.object({
    video: z.string().min(1, 'site.json: "showreel.video" ontbreekt.'),
    poster: z.string().min(1, 'site.json: "showreel.poster" ontbreekt.'),
  }),
  agent: z
    .object({
      show: z.boolean().default(false),
      name: z.string().default(''),
      agency: z.string().default(''),
      email: z.string().default(''),
      phone: z.string().default(''),
    })
    .default({ show: false, name: '', agency: '', email: '', phone: '' }),
});

const parsed = schema.safeParse(raw);
if (!parsed.success) {
  throw new Error(
    'Er klopt iets niet in src/data/site.json:\n' + parsed.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n'),
  );
}

export const site = parsed.data;
