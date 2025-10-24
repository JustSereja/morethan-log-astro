import siteConfig from '@config/site';
import {
  getPostCategory,
  getPostImage,
  getPostLanguage,
  getPostPermalink,
  getPosts,
} from '@lib/content';
import { DEFAULT_LOCALE } from '@lib/language';

const isDevelopment = import.meta.env.DEV;

function cleanMarkdown(body) {
  return body
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[[^\]]*]\([^)]*\)/g, '')
    .replace(/^#+\s+(.*)/gm, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = await getPosts({ includeDrafts: isDevelopment });

  const payload = posts.map((entry) => ({
    title: entry.data.h1 ?? entry.data.title ?? 'Untitled',
    description: entry.data.description ?? '',
    url: new URL(getPostPermalink(entry), siteConfig.siteUrl).toString(),
    date: entry.data.date.toISOString(),
    content: cleanMarkdown(entry.body),
    imageUrl: (() => {
      const image = getPostImage(entry);
      return image.startsWith('http')
        ? image
        : `${siteConfig.siteUrl}${image}`;
    })(),
    category: getPostCategory(entry),
    icon: siteConfig.categories[getPostCategory(entry)]?.icon ?? '📂',
    lang: getPostLanguage(entry),
    categoryText:
      siteConfig.categories[getPostCategory(entry)]?.label?.[getPostLanguage(entry)] ??
      siteConfig.categories[getPostCategory(entry)]?.label?.[DEFAULT_LOCALE] ??
      getPostCategory(entry),
  }));

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
