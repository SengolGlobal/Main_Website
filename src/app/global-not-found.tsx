import './globals.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale, isLocale, localeInfo, type Locale } from '@/i18n/locales';
import { loadMessages } from '@/i18n/messages';
import { archivo, dmSans, plexArabic } from '@/lib/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NotFoundContent } from '@/components/layout/NotFoundContent';

// Server-rendered, localized 404 for any URL that matches no route
// (enabled with `experimental.globalNotFound`).
async function resolveLocale(): Promise<Locale> {
  const h = await headers();
  // Set by the next-intl middleware for locale-prefixed requests.
  const fromMiddleware = h.get('x-next-intl-locale');
  return isLocale(fromMiddleware) ? fromMiddleware : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const m = await loadMessages(await resolveLocale());
  return { title: `${m.notFound.metaTitle} | ${m.meta.titleSuffix}`, robots: { index: false } };
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale();
  const m = await loadMessages(locale);
  const info = localeInfo[locale];
  const fonts = [archivo.variable, dmSans.variable, locale === 'ar' ? plexArabic.variable : ''].join(' ');

  return (
    <html lang={info.hreflang} dir={info.dir} className={fonts}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={{ a11y: m.a11y, nav: m.nav }}>
          <Header locale={locale} m={m} />
          <main id="main" className="flex-1">
            <NotFoundContent m={m} locale={locale} />
          </main>
          <Footer locale={locale} m={m} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
