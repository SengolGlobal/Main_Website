import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './locales';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // No Accept-Language redirects: visitors and crawlers always reach /en/ unless they
  // explicitly chose another language (handled in middleware via our own cookie).
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false, // hreflang is emitted in page metadata instead
});
