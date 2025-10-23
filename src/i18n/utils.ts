import { addTrailingSlash } from '@utils/url';
import { ui, defaultLang, showDefaultLang } from './ui';

const normalizeBasePath = (path: string): string => {
  if (!path) {
    return '/';
  }

  const prefixed = path.startsWith('/') ? path : `/${path}`;
  return addTrailingSlash(prefixed);
};

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in ui) {
    return lang as keyof typeof ui;
  }

  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return (key: keyof typeof ui[typeof defaultLang]) =>
    ui[lang][key] ?? ui[defaultLang][key];
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return (path: string, targetLang: keyof typeof ui = lang) => {
    const normalizedPath = normalizeBasePath(path);
    if (!showDefaultLang && targetLang === defaultLang) {
      return normalizedPath;
    }

    const translatedPath = `/${targetLang}${normalizedPath}`;
    return addTrailingSlash(translatedPath);
  };
}
