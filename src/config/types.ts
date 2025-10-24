import type { LocaleCode } from './locales';

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

export interface SiteNavigationItemConfig {
  id: string;
  labelKey?: string;
  label?: LocaleRecord<string>;
  translationKey?: string;
  path?: string;
  external?: string;
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

export interface SiteProjectLink {
  id: string;
  url: string;
  label: LocaleRecord<string>;
  icon?: string;
  iconSvg?: string;
}

export interface SiteContactLink {
  id: string;
  label: LocaleRecord<string>;
  url: string | LocaleRecord<string>;
  icon?: string;
  iconSvg?: string;
}

export interface SiteConfig {
  siteUrl: string;
  title: LocaleRecord<string>;
  description: LocaleRecord<string>;
  author: SiteAuthorConfig;
  postsPerPage: number;
  featuredImageFallback: string;
  contactLinks: SiteContactLink[];
  projects: SiteProjectLink[];
  categories: Record<string, SiteCategoryConfig>;
  navigation: SiteNavigationItemConfig[];
  features: SiteFeatureToggles;
  seo: SiteSeoConfig;
  defaultLanguage: LocaleCode;
  languages: LocaleCode[];
  dateFormats: LocaleRecord<{
    locale: string;
    options: Intl.DateTimeFormatOptions;
  }>;
}

export type { LocaleCode } from './locales';
