import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/locales';
import { serviceSlugs } from '@/data/services';
import { languageAlternates, localizedUrl } from '@/lib/seo';

const paths = [
  { path: '', priority: 1 },
  { path: '/about', priority: 0.7 },
  { path: '/services', priority: 0.9 },
  ...serviceSlugs.map((s) => ({ path: `/services/${s}`, priority: 0.8 })),
  { path: '/network', priority: 0.8 },
  { path: '/contact', priority: 0.7 },
  { path: '/quote', priority: 0.9 },
  { path: '/privacy', priority: 0.2 },
  { path: '/terms', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: localizedUrl(locale, path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
