import rss from '@astrojs/rss';
import siteConfig from '@config/site';
import { getPosts, getPostPermalink } from '@lib/content';
import { DEFAULT_LOCALE } from '@lib/language';

export async function GET(context) {
  const posts = await getPosts({ lang: DEFAULT_LOCALE });

  return rss({
    title: siteConfig.title[DEFAULT_LOCALE],
    description: siteConfig.description[DEFAULT_LOCALE],
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
