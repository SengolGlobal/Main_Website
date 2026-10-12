import type { Metadata } from 'next';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/legal/LegalPage';
import { legalUpdated } from '@/data/legal';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '/terms',
    title: m.legal.terms.metaTitle,
    description: m.legal.terms.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

export default async function TermsPage({ params }: LocaleParams) {
  const { locale, m } = await initPage(params);
  return <LegalPage m={m} doc={m.legal.terms} crumb={m.nav.terms} updated={legalUpdated(locale)} />;
}
