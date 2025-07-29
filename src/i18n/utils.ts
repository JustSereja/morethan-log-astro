import { ui, defaultLang, showDefaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}

function ensureTrailingSlash(path: string): string {
    if (!path || path === '/') return '/';
    // Don't add trailing slash to anchors or queries
    if (path.includes('#') || path.includes('?')) return path;
    return path.endsWith('/') ? path : `${path}/`;
}

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        const translatedPath = !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
        return ensureTrailingSlash(translatedPath);
    }
}