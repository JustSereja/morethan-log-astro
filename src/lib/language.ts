import siteConfig from '@config/site';
import type { LocaleCode } from '@config/types';

export const DEFAULT_LOCALE = siteConfig.defaultLanguage;
export const SUPPORTED_LOCALES = siteConfig.languages as ReadonlyArray<LocaleCode>;

export const isSupportedLocale = (value: string | null | undefined): value is LocaleCode => {
  if (!value) {
    return false;
  }

  return SUPPORTED_LOCALES.some((locale) => locale.toLowerCase() === value.toLowerCase());
};

export const normalizeLocale = (value: string | null | undefined): LocaleCode => {
  if (!value) {
    return DEFAULT_LOCALE;
  }

  const matched = SUPPORTED_LOCALES.find(
    (locale) => locale.toLowerCase() === value.toLowerCase(),
  );

  return matched ?? DEFAULT_LOCALE;
};

export const isDefaultLocale = (value: string | null | undefined): boolean => {
  if (!value) {
    return true;
  }

  return value.toLowerCase() === DEFAULT_LOCALE.toLowerCase();
};

export const listNonDefaultLocales = (): LocaleCode[] =>
  SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

