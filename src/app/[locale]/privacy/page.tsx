import type { Metadata } from 'next';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/legal/LegalPage';
import { legalUpdated } from '@/data/legal';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '/privacy',
    title: m.legal.privacy.metaTitle,
    description: m.legal.privacy.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const { locale, m } = await initPage(params);
  return <LegalPage m={m} doc={m.legal.privacy} crumb={m.nav.privacy} updated={legalUpdated(locale)} />;
}
