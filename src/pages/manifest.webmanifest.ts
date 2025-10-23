import siteConfig from '@config/site';
import { DEFAULT_LOCALE } from '@lib/language';

export async function GET() {
  const defaultLang = DEFAULT_LOCALE;
  const title = siteConfig.title[defaultLang] ?? siteConfig.title.en;
  const description = siteConfig.description[defaultLang] ?? siteConfig.description.en;

  const manifest = {
    name: title,
    short_name: title,
    description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    lang: defaultLang,
    icons: [
      { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
