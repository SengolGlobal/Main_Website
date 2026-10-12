'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LOCALE_COOKIE, localeInfo, locales, type Locale } from '@/i18n/locales';
import { stashDrafts } from '@/components/forms/draftStore';

/** Crawlable links to the current page in every language (footer). */
export function LanguageLinks() {
  const pathname = usePathname();
  const current = useLocale() as Locale;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {locales.map((l) => (
        <li key={l}>
          <Link
            href={pathname}
            locale={l}
            hrefLang={localeInfo[l].hreflang}
            lang={localeInfo[l].hreflang}
            aria-current={l === current ? 'page' : undefined}
            scroll={false}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; SameSite=Lax`;
              stashDrafts();
            }}
            className={`text-sm transition-colors ${l === current ? 'font-semibold text-gold-400' : 'text-navy-100 hover:text-white'}`}
          >
            {localeInfo[l].label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
