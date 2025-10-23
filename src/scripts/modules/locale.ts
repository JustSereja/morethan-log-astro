export type LocaleConfig = {
  defaultLanguage: string;
  languages: string[];
};

type LocaleWindow = typeof window & { __LOCALE_CONFIG__?: LocaleConfig };

export const getLocaleConfig = (): LocaleConfig => {
  const raw = (window as LocaleWindow).__LOCALE_CONFIG__;
  const languages = Array.isArray(raw?.languages) && raw.languages.length ? [...raw.languages] : ['en'];
  const defaultLanguage = raw?.defaultLanguage ?? languages[0];
  return { defaultLanguage, languages };
};

export const normalizeLanguage = (lang: string | null | undefined, config: LocaleConfig): string => {
  if (!lang) {
    return config.defaultLanguage;
  }

  const lower = lang.toLowerCase();
  return config.languages.find((code) => code.toLowerCase() === lower) ?? config.defaultLanguage;
};

export const getLanguageFromPath = (pathname: string, config: LocaleConfig): string => {
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;

  for (const code of config.languages) {
    if (code === config.defaultLanguage) {
      continue;
    }

    if (normalizedPath === `/${code}/` || normalizedPath.startsWith(`/${code}/`)) {
      return code;
    }
  }

  return config.defaultLanguage;
};

export const getTargetPath = (lang: string, config: LocaleConfig): string => {
  return lang === config.defaultLanguage ? '/' : `/${lang}/`;
};

export const stripLanguageFromPath = (pathname: string, lang: string, config: LocaleConfig): string => {
  if (lang === config.defaultLanguage) {
    return pathname;
  }

  const pattern = new RegExp(`^/${lang}`);
  const stripped = pathname.replace(pattern, '');
  return stripped || '/';
};
