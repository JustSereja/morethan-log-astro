import rss from '@astrojs/rss';
import siteConfig from '@config/site';
import { getPosts, getPostPermalink } from '@lib/content';
import { DEFAULT_LOCALE, isSupportedLocale, listNonDefaultLocales, normalizeLocale } from '@lib/language';

export function getStaticPaths() {
  return listNonDefaultLocales().map((lang) => ({ params: { lang } }));
}

export const trailingSlash = 'never';

export async function GET({ params }) {
  const { lang } = params;
  if (!lang || !isSupportedLocale(lang) || lang === DEFAULT_LOCALE) {
    return new Response('Not found', { status: 404 });
  }

  const locale = normalizeLocale(lang);
  const posts = await getPosts({ lang: locale });

  return rss({
    title: siteConfig.title[locale],
    description: siteConfig.description[locale],
    site: siteConfig.siteUrl,
    items: posts.map((entry) => ({
      title: entry.data.h1 ?? entry.data.title,
      description:
        entry.data.description ?? entry.data.announcement ?? '',
      link: new URL(getPostPermalink(entry), siteConfig.siteUrl).toString(),
      pubDate: entry.data.date,
      content: entry.body,
    })),
  });
}
