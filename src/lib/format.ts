import siteConfig from '@config/site';
import type { LocaleCode } from '@config/types';
import { DEFAULT_LOCALE } from '@lib/language';

type DateFormatVariant = 'default' | 'compact';

export function formatDate(date: Date, lang: string, variant: DateFormatVariant = 'default') {
  const localeKey =
    (lang as LocaleCode) in siteConfig.dateFormats
      ? (lang as LocaleCode)
      : DEFAULT_LOCALE;

  const formatConfig =
    siteConfig.dateFormats[localeKey] ??
    siteConfig.dateFormats[DEFAULT_LOCALE];

  const { locale } = formatConfig;
  const options =
    variant === 'compact' && formatConfig.compactOptions
      ? formatConfig.compactOptions
      : formatConfig.options;

  return new Intl.DateTimeFormat(locale, options).format(date);
}
