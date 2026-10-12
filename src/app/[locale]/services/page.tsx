import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { photo } from '@/lib/images';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { photos } from '@/data/site';
import { serviceConfig, serviceSlugs } from '@/data/services';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaBand } from '@/components/ui/CtaBand';
import { EcosystemDiagram } from '@/components/services/EcosystemDiagram';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '/services',
    title: m.servicesPage.metaTitle,
    description: m.servicesPage.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

export default async function ServicesPage({ params }: LocaleParams) {
  const { locale, m } = await initPage(params);
  const p = m.servicesPage;

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        lead={p.hero.lead}
        image={photos.terminal}
        crumbs={[{ name: m.nav.home, href: '/' }, { name: m.nav.services }]}
        crumbLabel={m.a11y.breadcrumb}
      />

      <section className="section" aria-labelledby="list-title">
        <div className="container-x">
          <h2 id="list-title" className="sr-only">{p.listTitle}</h2>
          <div className="space-y-20 lg:space-y-28">
            {serviceSlugs.map((slug, i) => {
              const s = m.services[slug];
              const { icon: Icon, image } = serviceConfig[slug];
              const flip = i % 2 === 1;
              return (
                <article key={slug} id={slug} className="grid scroll-mt-28 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                  <div className={`reveal relative aspect-[16/11] overflow-hidden rounded-3xl ${flip ? 'lg:order-2' : ''}`}>
                    <Image src={photo(image, 1400)} alt={s.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                    <span className="absolute start-5 top-5 grid size-14 place-items-center rounded-2xl bg-navy-900/90 text-gold-400 backdrop-blur">
                      <Icon className="size-7" aria-hidden />
                    </span>
                  </div>
                  <div className="reveal">
                    <p className="eyebrow" dir="ltr">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="h2 mt-3">{s.title}</h3>
                    <p className="lead mt-5">{s.intro}</p>
                    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                      {s.capabilities.map((c) => (
                        <li key={c} className="flex gap-3 text-[0.95rem]">
                          <Check className="mt-0.5 size-5 shrink-0 text-gold-600" aria-hidden />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href={`/services/${slug}`} className="btn btn-navy">
                        {m.common.viewService}
                        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                      </Link>
                      <Link href={{ pathname: '/quote', query: serviceConfig[slug].mode ? { mode: serviceConfig[slug].mode } : {} }} className="btn btn-outline">
                        {m.common.requestQuote}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-mist" aria-labelledby="together-title">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <SectionHeading id="together-title" eyebrow={m.about.ecosystem.eyebrow} title={p.integratedTitle} lead={p.integratedText} />
          <div className="reveal px-6 py-8 sm:px-10">
            <EcosystemDiagram center={m.about.ecosystem.center} nodes={m.about.ecosystem.nodes} />
          </div>
        </div>
      </section>

      <CtaBand title={m.home.cta.title} text={m.home.cta.text} primary={m.common.requestQuote} secondary={m.common.contactUs} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: m.nav.home, path: '' }, { name: m.nav.services, path: '/services' }])} />
    </>
  );
}
