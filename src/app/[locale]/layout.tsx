import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { localeInfo, locales } from '@/i18n/locales';
import { archivo, dmSans, plexArabic } from '@/lib/fonts';
import { initPage } from '@/lib/page';
import { siteUrl } from '@/data/site';
import { organizationJsonLd } from '@/lib/structured-data';
import { JsonLd } from '@/components/seo/JsonLd';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RevealObserver } from '@/components/ui/RevealObserver';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#0a2240',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale, m } = await initPage(params);
  const info = localeInfo[locale];
  const fontClasses = [archivo.variable, dmSans.variable, locale === 'ar' ? plexArabic.variable : ''].join(' ');

  // Only the namespaces the header needs are serialised here; pages with forms or the
  // interactive map add theirs via a nested provider (see ClientMessages).
  const clientMessages = { a11y: m.a11y, nav: m.nav };

  return (
    <html lang={info.hreflang} dir={info.dir} className={fontClasses} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <a
            href="#main"
            className="sr-only z-[100] rounded-md bg-gold-500 px-4 py-2 font-semibold text-navy-950 focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
          >
            {m.a11y.skipToContent}
          </a>
          <Header locale={locale} m={m} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer locale={locale} m={m} />
          <RevealObserver />
        </NextIntlClientProvider>
        <JsonLd data={organizationJsonLd(locale, m.meta.orgDescription)} />
      </body>
    </html>
  );
}
