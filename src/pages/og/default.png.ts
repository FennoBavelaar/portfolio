import type { APIRoute } from 'astro';
import { ogImage } from '../../lib/og';
import { site } from '../../lib/site';

export const GET: APIRoute = async () => {
  const png = await ogImage({ title: site.role });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
