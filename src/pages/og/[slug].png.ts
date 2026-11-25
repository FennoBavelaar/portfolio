import type { APIRoute } from 'astro';
import { getProjects, TYPE_LABELS } from '../../lib/projects';
import { ogImage } from '../../lib/og';

export async function getStaticPaths() {
  const projects = await getProjects();
  return projects.map((p) => ({ params: { slug: p.data.slug }, props: { project: p } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { data } = (props as any).project;
  const png = await ogImage({
    title: data.title,
    subtitle: `${TYPE_LABELS[data.type as keyof typeof TYPE_LABELS]} · ${data.client} · ${data.year}`,
    image: data.thumbnail,
  });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
