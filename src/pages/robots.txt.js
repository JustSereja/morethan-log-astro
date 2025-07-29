import SITE_CONFIG from '../site.config';

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_CONFIG.siteUrl}/sitemap-index.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
} 