import siteConfig from '@config/site';

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap-index.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
