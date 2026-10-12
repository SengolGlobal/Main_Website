export const locales = ['en', 'de', 'ko', 'fr', 'es', 'it', 'ja', 'zh-cn', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Cookie that remembers an explicit language choice (set only by the language selector). */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

type LocaleInfo = {
  /** Native name shown in the language selector */
  label: string;
  /** Short code shown in compact UI */
  short: string;
  /** BCP 47 tag for <html lang> and hreflang */
  hreflang: string;
  /** Open Graph locale */
  og: string;
  dir: 'ltr' | 'rtl';
};

export const localeInfo: Record<Locale, LocaleInfo> = {
  en: { label: 'English', short: 'EN', hreflang: 'en', og: 'en_US', dir: 'ltr' },
  de: { label: 'Deutsch', short: 'DE', hreflang: 'de', og: 'de_DE', dir: 'ltr' },
  ko: { label: '한국어', short: 'KO', hreflang: 'ko', og: 'ko_KR', dir: 'ltr' },
  fr: { label: 'Français', short: 'FR', hreflang: 'fr', og: 'fr_FR', dir: 'ltr' },
  es: { label: 'Español', short: 'ES', hreflang: 'es', og: 'es_ES', dir: 'ltr' },
  it: { label: 'Italiano', short: 'IT', hreflang: 'it', og: 'it_IT', dir: 'ltr' },
  ja: { label: '日本語', short: 'JA', hreflang: 'ja', og: 'ja_JP', dir: 'ltr' },
  'zh-cn': { label: '简体中文', short: 'ZH', hreflang: 'zh-CN', og: 'zh_CN', dir: 'ltr' },
  ar: { label: 'العربية', short: 'AR', hreflang: 'ar', og: 'ar_AE', dir: 'rtl' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
