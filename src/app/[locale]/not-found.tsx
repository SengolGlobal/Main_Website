import { getLocale } from 'next-intl/server';
import { defaultLocale, isLocale } from '@/i18n/locales';
import { loadMessages } from '@/i18n/messages';
import { NotFoundContent } from '@/components/layout/NotFoundContent';

// Shown when a page inside a locale calls notFound(). Unmatched URLs are handled
// by app/global-not-found.tsx.
export default async function LocaleNotFound() {
  const requested = await getLocale();
  const locale = isLocale(requested) ? requested : defaultLocale;
  return <NotFoundContent m={await loadMessages(locale)} locale={locale} />;
}
