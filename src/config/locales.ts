export type LocaleDefinition = {
  code: string;
  label: string;
  nativeLabel?: string;
  langTag: string;
  ogLocale?: string;
  flag?: string;
  dir?: 'ltr' | 'rtl';
  isDefault?: boolean;
};

const LOCALE_DEFINITIONS = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    langTag: 'en',
    ogLocale: 'en',
    flag: '🇬🇧',
    dir: 'ltr',
    isDefault: true,
  },
  {
    code: 'ru',
    label: 'Russian',
    nativeLabel: 'Русский',
    langTag: 'ru',
    ogLocale: 'ru',
    flag: '🇷🇺',
    dir: 'ltr',
  },
] as const satisfies readonly LocaleDefinition[];

export type LocaleCode = (typeof LOCALE_DEFINITIONS)[number]['code'];

const definitionByCode = new Map<string, LocaleDefinition>();
for (const definition of LOCALE_DEFINITIONS) {
  definitionByCode.set(definition.code.toLowerCase(), definition);
  definitionByCode.set(definition.langTag.toLowerCase(), definition);
}

const defaultDefinition =
  LOCALE_DEFINITIONS.find((entry) => entry.isDefault) ?? LOCALE_DEFINITIONS[0];

export const DEFAULT_LOCALE = defaultDefinition.code as LocaleCode;
export const DEFAULT_LANG_TAG = defaultDefinition.langTag;

export const SUPPORTED_LOCALES = LOCALE_DEFINITIONS.map(
  (entry) => entry.code,
) as LocaleCode[];

export const LOCALE_MAP = SUPPORTED_LOCALES.reduce((acc, code) => {
  const definition = definitionByCode.get(code.toLowerCase());
  if (definition) {
    acc[code] = definition;
  }
  return acc;
}, {} as Record<LocaleCode, LocaleDefinition>);

const fallbackLocale = LOCALE_MAP[DEFAULT_LOCALE];

const normalizeLookupKey = (value: string) => value.toLowerCase();

export const findLocaleDefinition = (
  value: string | null | undefined,
): LocaleDefinition | null => {
  if (!value) {
    return null;
  }

  const normalized = normalizeLookupKey(value);
  const hyphenReplaced = normalized.replace(/_/g, '-');

  return (
    definitionByCode.get(normalized) ??
    definitionByCode.get(hyphenReplaced) ??
    null
  );
};

export const resolveLocaleDefinition = (
  value: string | null | undefined,
): LocaleDefinition => findLocaleDefinition(value) ?? fallbackLocale;

export const resolveLocaleCode = (value: string | null | undefined): LocaleCode =>
  resolveLocaleDefinition(value).code as LocaleCode;

export const resolveLocaleLangTag = (value: string | null | undefined): string =>
  resolveLocaleDefinition(value).langTag;

export const getLocaleLabel = (code: LocaleCode): string => {
  const definition = LOCALE_MAP[code];
  if (!definition) {
    return code.toUpperCase();
  }

  return definition.nativeLabel ?? definition.label ?? code.toUpperCase();
};

export const getLocaleDisplayLabel = (code: LocaleCode): string => {
  const definition = LOCALE_MAP[code];
  if (!definition) {
    return code.toUpperCase();
  }

  return definition.label ?? code.toUpperCase();
};

export const getLocaleFlag = (code: LocaleCode): string => {
  const definition = LOCALE_MAP[code];
  if (!definition) {
    return code.toUpperCase();
  }

  return definition.flag ?? code.toUpperCase();
};

export const getLocaleLangTag = (code: LocaleCode): string =>
  LOCALE_MAP[code]?.langTag ?? code;

export const getLocaleDirection = (code: LocaleCode): 'ltr' | 'rtl' =>
  LOCALE_MAP[code]?.dir === 'rtl' ? 'rtl' : 'ltr';

export const getOgLocale = (code: LocaleCode): string => {
  const definition = LOCALE_MAP[code];
  if (!definition) {
    const upper = code.toUpperCase();
    return `${code}_${upper}`;
  }

  if (definition.ogLocale) {
    return definition.ogLocale;
  }

  const upper = definition.code.toUpperCase();
  return `${definition.code}_${upper}`;
};

export const listLocales = (): LocaleDefinition[] => [...LOCALE_DEFINITIONS];

export const LOCALE_LABELS = SUPPORTED_LOCALES.reduce(
  (acc, code) => {
    acc[code] = getLocaleLabel(code);
    return acc;
  },
  {} as Record<LocaleCode, string>,
);
