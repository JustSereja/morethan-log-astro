import type { LocaleCode } from '@config/locales';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES as LOCALE_CODES,
  resolveLocaleCode,
} from '@config/locales';

export const SUPPORTED_LOCALES = LOCALE_CODES as ReadonlyArray<LocaleCode>;
export { DEFAULT_LOCALE };

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

  return resolveLocaleCode(value);
};

export const isDefaultLocale = (value: string | null | undefined): boolean => {
  if (!value) {
    return true;
  }

  return value.toLowerCase() === DEFAULT_LOCALE.toLowerCase();
};

export const listNonDefaultLocales = (): LocaleCode[] =>
  SUPPORTED_LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
