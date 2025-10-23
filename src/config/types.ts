export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;

export type LocaleCode = typeof SUPPORTED_LANGUAGES[number];

export type LocaleRecord<T> = Record<LocaleCode, T>;

export interface SiteAuthorConfig {
  name: LocaleRecord<string>;
  email: string;
  avatar: string;
  bio: LocaleRecord<string>;
}

export interface SiteCategoryConfig {
  enabled: boolean;
  path: string;
  icon: string;
  label: LocaleRecord<string>;
  description: LocaleRecord<string>;
}

export interface SiteFeatureToggles {
  darkMode: boolean;
  search: boolean;
  rss: boolean;
  sitemap: boolean;
  imageLightbox: boolean;
  postNavigation: boolean;
  readingTime: boolean;
  viewCounter: boolean;
}

export interface SiteSeoConfig {
  defaultImage: string;
  twitterHandle: string;
  googleAnalytics: string;
}

export type SocialLinkConfig = Partial<Record<LocaleCode, Record<string, string>>>;

export interface SiteConfig {
  siteUrl: string;
  title: LocaleRecord<string>;
  description: LocaleRecord<string>;
  author: SiteAuthorConfig;
  postsPerPage: number;
  featuredImageFallback: string;
  socialLinks: SocialLinkConfig;
  categories: Record<string, SiteCategoryConfig>;
  features: SiteFeatureToggles;
  seo: SiteSeoConfig;
  defaultLanguage: LocaleCode;
  languages: LocaleCode[];
  dateFormats: LocaleRecord<{
    locale: string;
    options: Intl.DateTimeFormatOptions;
  }>;
}
