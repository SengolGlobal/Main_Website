import { company, siteUrl } from '@/data/site';
import type { Locale } from '@/i18n/locales';
import { localizedUrl } from './seo';

const orgId = `${siteUrl}/#organization`;

/** Organization data limited to verified company facts. */
export function organizationJsonLd(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: company.legalName,
    url: localizedUrl(locale),
    logo: `${siteUrl}/brand/logo.svg`,
    description,
    email: company.emails[0],
    telephone: company.phones.map((p) => p.display.replace(/\s/g, '')),
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.locality,
      addressRegion: company.address.region,
      postalCode: company.address.postalCode,
      addressCountry: company.address.country,
    },
    contactPoint: company.emails.map((email) => ({
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email,
      telephone: company.phones[0].display.replace(/\s/g, ''),
    })),
  };
}

export function serviceJsonLd(opts: { locale: Locale; path: string; name: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    url: localizedUrl(opts.locale, opts.path),
    provider: { '@id': orgId },
    areaServed: { '@type': 'Country', name: 'India' },
  };
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
