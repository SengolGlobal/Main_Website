import type { Metadata } from 'next';
import { Info, MapPin } from 'lucide-react';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { photos } from '@/data/site';
import { indiaCities } from '@/data/network';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NetworkStats } from '@/components/ui/NetworkStats';
import { CtaBand } from '@/components/ui/CtaBand';
import { WorldRoutesMap } from '@/components/network/WorldRoutesMap';
import { IndiaMap } from '@/components/network/IndiaMap';
import { JsonLd } from '@/components/seo/JsonLd';
import { ClientMessages } from '@/components/ui/ClientMessages';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '/network',
    title: m.network.metaTitle,
    description: m.network.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

export default async function NetworkPage({ params }: LocaleParams) {
  const { locale, m } = await initPage(params);
  const n = m.network;

  return (
    <>
      <PageHero
        eyebrow={n.hero.eyebrow}
        title={n.hero.title}
        lead={n.hero.lead}
        image={photos.aerialShip}
        crumbs={[{ name: m.nav.home, href: '/' }, { name: m.nav.network }]}
        crumbLabel={m.a11y.breadcrumb}
      />

      {/* Figures */}
      <section className="border-b border-line bg-white py-12 sm:py-14" aria-label={n.hero.eyebrow}>
        <div className="container-x grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <NetworkStats labels={m.home.stats} className="reveal" />
          <p className="reveal flex gap-3 rounded-xl bg-navy-50 p-4 text-sm leading-relaxed text-navy-900">
            <Info className="mt-0.5 size-5 shrink-0 text-navy-600" aria-hidden />
            {n.statsNote}
          </p>
        </div>
      </section>

      {/* Interactive map */}
      <section className="section bg-navy-950 text-white" aria-labelledby="map-title">
        <div className="container-x">
          <SectionHeading id="map-title" eyebrow={n.hero.eyebrow} title={n.map.title} lead={n.map.lead} tone="light" />
          <div className="reveal mt-12">
            <ClientMessages m={m} namespaces={['network']}>
              <WorldRoutesMap />
            </ClientMessages>
          </div>
        </div>
      </section>

      {/* India network */}
      <section className="section bg-mist" aria-labelledby="india-title">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading id="india-title" eyebrow={n.india.eyebrow} title={n.india.title} lead={n.india.lead} />
            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {indiaCities.map((c, i) => (
                <li key={c} className="reveal flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-card" style={{ '--reveal-delay': `${(i % 6) * 50}ms` } as React.CSSProperties}>
                  <MapPin className="size-5 shrink-0 text-gold-600" aria-hidden />
                  <span className="font-medium text-navy-900">{n.india.cities[c]}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal rounded-3xl bg-white p-6 shadow-card sm:p-10">
            <IndiaMap cities={n.india.cities} label={n.india.mapAlt} />
          </div>
        </div>
      </section>

      <CtaBand title={n.cta.title} text={n.cta.text} primary={m.common.requestQuote} secondary={m.common.contactUs} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: m.nav.home, path: '' }, { name: m.nav.network, path: '/network' }])} />
    </>
  );
}
