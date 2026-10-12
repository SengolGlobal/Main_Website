import Image from 'next/image';
import type { Metadata } from 'next';
import { Anchor, Building2, FileCheck2, Globe2, PackageCheck, Truck, Warehouse } from 'lucide-react';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { photo } from '@/lib/images';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { photos } from '@/data/site';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NetworkStats } from '@/components/ui/NetworkStats';
import { CtaBand } from '@/components/ui/CtaBand';
import { EcosystemDiagram } from '@/components/services/EcosystemDiagram';
import { JsonLd } from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '/about',
    title: m.about.metaTitle,
    description: m.about.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

const pointIcons = [Building2, PackageCheck, Globe2];
const strengthIcons = [Building2, FileCheck2, Warehouse, Truck, Anchor, Globe2];

export default async function AboutPage({ params }: LocaleParams) {
  const { locale, m } = await initPage(params);
  const a = m.about;

  return (
    <>
      <PageHero
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        lead={a.hero.lead}
        image={photos.cranes}
        crumbs={[{ name: m.nav.home, href: '/' }, { name: m.nav.about }]}
        crumbLabel={m.a11y.breadcrumb}
      />

      {/* Who we are */}
      <section className="section" aria-labelledby="who-title">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading id="who-title" eyebrow={a.intro.eyebrow} title={a.intro.title} lead={a.intro.text} />
            <ul className="mt-10 space-y-5">
              {a.intro.points.map((p, i) => {
                const Icon = pointIcons[i];
                return (
                  <li key={p.title} className="reveal flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold">{p.title}</h3>
                      <p className="mt-1 text-muted">{p.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/5]">
            <Image src={photo(photos.port, 1400)} alt={a.intro.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section bg-mist" aria-labelledby="approach-title">
        <div className="container-x">
          <SectionHeading id="approach-title" eyebrow={a.approach.eyebrow} title={a.approach.title} />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.approach.items.map((item, i) => (
              <li key={item.title} className="card reveal p-7" style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
                <span className="font-display text-3xl font-bold text-gold-500" dir="ltr">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="section" aria-labelledby="eco-title">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <SectionHeading id="eco-title" eyebrow={a.ecosystem.eyebrow} title={a.ecosystem.title} lead={a.ecosystem.lead} />
          <div className="reveal px-6 py-8 sm:px-10">
            <EcosystemDiagram center={a.ecosystem.center} nodes={a.ecosystem.nodes} />
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="section bg-navy-950 text-white" aria-labelledby="strengths-title">
        <div className="container-x">
          <SectionHeading id="strengths-title" eyebrow={a.strengths.eyebrow} title={a.strengths.title} tone="light" />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {a.strengths.items.map((s, i) => {
              const Icon = strengthIcons[i];
              return (
                <li key={s.title} className="bg-navy-950 p-7">
                  <Icon className="size-7 text-gold-400" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-navy-100">{s.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Network */}
      <section className="section" aria-labelledby="net-title">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="reveal">
            <h2 id="net-title" className="h2">{a.networkBlock.title}</h2>
            <p className="lead mt-5">{a.networkBlock.text}</p>
            <Link href="/network" className="btn btn-navy mt-8">{m.common.viewNetwork}</Link>
          </div>
          <div className="card reveal p-8">
            <NetworkStats labels={m.home.stats} note={m.network.statsNote} />
          </div>
        </div>
      </section>

      <CtaBand title={m.home.cta.title} text={m.home.cta.text} primary={m.common.requestQuote} secondary={m.common.contactUs} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: m.nav.home, path: '' }, { name: m.nav.about, path: '/about' }])} />
    </>
  );
}
