import { getCollection, type CollectionEntry } from 'astro:content';
import siteConfig from '@config/site';
import { DEFAULT_LOCALE } from '@lib/language';
import { ensureTrailingSlash } from '@utils/url';

export type PostEntry = CollectionEntry<'posts'>;
export type PageEntry = CollectionEntry<'pages'>;

export interface GetPostsOptions {
  lang?: string;
  category?: string;
  includeDrafts?: boolean;
}

const DEFAULT_POST_SORT = (a: PostEntry, b: PostEntry) =>
  b.data.date.getTime() - a.data.date.getTime();

const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  blog: '/img/posts/placeholder-blog.svg',
  technology: '/img/posts/placeholder-technology.svg',
  projects: '/img/posts/placeholder-projects.svg',
};

function derivePostMeta(entry: PostEntry) {
  const segments = entry.slug.split('/');
  const [lang = DEFAULT_LOCALE, category = 'blog', ...rest] = segments;
  const fallbackKey = rest.length > 0 ? rest.join('/') : entry.id;
  const translationKey = entry.data.translationKey ?? fallbackKey;

  return { lang, category, translationKey };
}

function derivePageMeta(entry: PageEntry) {
  const segments = entry.slug.split('/');
  const [lang = DEFAULT_LOCALE, ...rest] = segments;
  const fallbackKey = rest.length > 0 ? rest.join('/') : entry.id;
  const translationKey = entry.data.translationKey ?? fallbackKey;

  return { lang, translationKey };
}

export async function getPosts(options: GetPostsOptions = {}) {
  const { lang, category, includeDrafts = false } = options;

  const entries = await getCollection('posts', ({ data }) => includeDrafts || !data.draft);

  const filtered = entries.filter((entry) => {
    const meta = derivePostMeta(entry);
    const categoryConfig = siteConfig.categories[meta.category];

    if (!categoryConfig?.enabled) return false;
    if (lang && meta.lang !== lang) return false;
    if (category && meta.category !== category) return false;
    return true;
  });

  return filtered.sort(DEFAULT_POST_SORT);
}

export async function getPageByTranslationKey(
  translationKey: string,
  lang: string,
) {
  const entries = await getCollection('pages');
  return (
    entries.find((entry) => {
      const meta = derivePageMeta(entry);
      return meta.translationKey === translationKey && meta.lang === lang;
    }) ?? null
  );
}

export function getPostPermalink(entry: PostEntry) {
  const { lang } = derivePostMeta(entry);
  const slugSegments = entry.slug.split('/');
  const [, ...rest] = slugSegments;
  const relativePath = rest.join('/');

  const isDefaultLang = lang === DEFAULT_LOCALE;
  const url = isDefaultLang
    ? `/${relativePath}`
    : `/${lang}/${relativePath}`;

  return ensureTrailingSlash(url);
}

export function getPostCategory(entry: PostEntry) {
  return derivePostMeta(entry).category;
}

export function getPostLanguage(entry: PostEntry) {
  return derivePostMeta(entry).lang;
}

export function getPostTranslationKey(entry: PostEntry) {
  return derivePostMeta(entry).translationKey;
}

export async function getPostTranslations(entry: PostEntry) {
  const translationKey = getPostTranslationKey(entry);
  const allTranslations = await getCollection('posts', ({ data }) => !data.draft);
  return allTranslations
    .filter((candidate) => {
      if (getPostTranslationKey(candidate) !== translationKey) return false;
      const categoryConfig = siteConfig.categories[getPostCategory(candidate)];
      return Boolean(categoryConfig?.enabled);
    })
    .sort(DEFAULT_POST_SORT);
}

export function getPostImage(entry: PostEntry) {
  if (entry.data.image) {
    return entry.data.image;
  }

  const imageMatch = /!\[[^\]]*]\(([^)]+)\)/.exec(entry.body);
  if (imageMatch) {
    return imageMatch[1];
  }

  const category = getPostCategory(entry);

  return (
    CATEGORY_PLACEHOLDERS[category] ??
    siteConfig.featuredImageFallback
  );
}

export function getPageLanguage(entry: PageEntry) {
  return derivePageMeta(entry).lang;
}

export function getPageTranslationKey(entry: PageEntry) {
  return derivePageMeta(entry).translationKey;
}

export function getPageSlug(entry: PageEntry) {
  const segments = entry.slug.split('/');
  const [, ...rest] = segments;
  return rest.join('/');
}

export function getPagePermalink(entry: PageEntry) {
  const slug = getPageSlug(entry);
  const lang = getPageLanguage(entry);
  const basePath = slug ? `/${slug}` : '/';

  return lang === DEFAULT_LOCALE
    ? ensureTrailingSlash(basePath)
    : ensureTrailingSlash(`/${lang}${basePath}`);
}

export async function getPageTranslations(entry: PageEntry) {
  const translationKey = getPageTranslationKey(entry);
  const allTranslations = await getCollection('pages', ({ data }) => !data.draft);

  return allTranslations.filter(
    (candidate) => getPageTranslationKey(candidate) === translationKey,
  );
}

export const getEnabledCategoryIds = (): string[] =>
  Object.entries(siteConfig.categories)
    .filter(([, config]) => config.enabled)
    .map(([id]) => id);

export const isCategoryEnabled = (categoryId: string): boolean =>
  Boolean(siteConfig.categories[categoryId]?.enabled);

export const getCategoryConfig = (categoryId: string) => siteConfig.categories[categoryId] ?? null;

export const getPostSlug = (entry: PostEntry): string => entry.slug.split('/').pop() ?? entry.id;

export type PostsByLocale = {
  lang: string;
  posts: PostEntry[];
};

export type TopLevelPageDescriptor = {
  entry: PageEntry;
  lang: string;
  slug: string;
  translationKey: string;
};

export async function groupPostsByLocales(
  locales: readonly string[],
  options: { category?: string; includeDrafts?: boolean } = {},
): Promise<PostsByLocale[]> {
  const { category, includeDrafts } = options;

  const groups = await Promise.all(
    locales.map(async (locale) => {
      const postsForLocale = await getPosts({ lang: locale, category, includeDrafts });
      return { lang: locale, posts: postsForLocale };
    }),
  );

  return groups.filter((group) => group.posts.length > 0);
}

export async function findTopLevelPage(options: {
  translationKey: string;
  lang: string;
  slug: string;
}): Promise<PageEntry | null> {
  const { translationKey, lang, slug } = options;
  const entry = await getPageByTranslationKey(translationKey, lang);
  if (!entry) {
    return null;
  }

  const entrySlug = getPageSlug(entry);
  if (!entrySlug || entrySlug.includes('/')) {
    return null;
  }

  return entrySlug === slug ? entry : null;
}

export async function getTopLevelPageDescriptors(): Promise<TopLevelPageDescriptor[]> {
  const pages = await getCollection('pages');

  return pages
    .map((entry) => {
      const slug = getPageSlug(entry);
      if (!slug || slug.includes('/')) {
        return null;
      }

      return {
        entry,
        lang: getPageLanguage(entry),
        slug,
        translationKey: getPageTranslationKey(entry),
      };
    })
    .filter((value): value is TopLevelPageDescriptor => value !== null);
}
