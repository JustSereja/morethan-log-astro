import siteConfig from '@config/site';
import type { LocaleCode } from '@config/types';
import { DEFAULT_LOCALE } from '@lib/language';

export function formatDate(date: Date, lang: string) {
  const localeKey = (lang as LocaleCode) in siteConfig.dateFormats
    ? (lang as LocaleCode)
    : DEFAULT_LOCALE;

  const formatConfig =
    siteConfig.dateFormats[localeKey] ??
    siteConfig.dateFormats[DEFAULT_LOCALE];

  const { locale, options } = formatConfig;

  return new Intl.DateTimeFormat(locale, options).format(date);
}
