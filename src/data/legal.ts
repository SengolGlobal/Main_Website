import { localeInfo, type Locale } from '@/i18n/locales';

/** Date the placeholder legal texts were drafted. Update when approved versions are published. */
export const LEGAL_UPDATED = '2026-10-11';

export function legalUpdated(locale: Locale) {
  return new Intl.DateTimeFormat(localeInfo[locale].hreflang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(LEGAL_UPDATED));
}
