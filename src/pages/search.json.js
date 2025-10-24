import siteConfig from '@config/site';
import {
  getPostCategory,
  getPostImage,
  getPostLanguage,
  getPostPermalink,
  getPosts,
} from '@lib/content';
import { DEFAULT_LOCALE } from '@lib/language';
import { formatDate } from '@lib/format';

const isDevelopment = import.meta.env.DEV;
const MAX_CONTENT_LENGTH = 400;

function cleanMarkdown(body) {
  return body
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[[^\]]*]\([^)]*\)/g, '')
    .replace(/<[^>]+>/g, '')
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
    description: entry.data.description ?? entry.data.announcement ?? '',
    url: new URL(getPostPermalink(entry), siteConfig.siteUrl).toString(),
    date: formatDate(entry.data.date, getPostLanguage(entry)),
    publishedAt: entry.data.date.toISOString(),
    content: (() => {
      const raw = cleanMarkdown(entry.body);
      if (!raw) {
        return '';
      }

      if (raw.length <= MAX_CONTENT_LENGTH) {
        return raw;
      }

      const snippet = raw.slice(0, MAX_CONTENT_LENGTH).trim();
      return `${snippet}…`;
    })(),
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
