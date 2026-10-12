import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Check, Eye, MessageSquareText, Route, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { photo } from '@/lib/images';
import { photos } from '@/data/site';
import { serviceSlugs } from '@/data/services';
import { indiaCities, regions } from '@/data/network';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NetworkStats } from '@/components/ui/NetworkStats';
import { CtaBand } from '@/components/ui/CtaBand';
import { ServiceCard } from '@/components/services/ServiceCard';
import { MapLegend, RoutesCanvas } from '@/components/network/RoutesCanvas';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '',
    title: m.meta.homeTitle,
    absoluteTitle: true,
    description: m.meta.homeDescription,
    siteName: m.meta.siteName,
  });
}

const whyIcons = [SlidersHorizontal, MessageSquareText, ShieldCheck, Route, Eye];

export default async function HomePage({ params }: LocaleParams) {
  const { m } = await initPage(params);
  const h = m.home;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate flex min-h-[44rem] items-end overflow-hidden bg-navy-950 pt-36 pb-16 text-white sm:min-h-[48rem] lg:min-h-[min(100svh,58rem)] lg:items-center lg:pb-24">
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <Image
            src={photo(photos.hero, 2400)}
            alt={h.hero.imageAlt}
            fill
            priority
            quality={65}
            sizes="100vw"
            className="animate-kenburns object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/20 rtl:bg-gradient-to-l" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-950 to-transparent" />

        <div className="container-x grid w-full gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-light">{h.hero.eyebrow}</p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.04] font-extrabold text-white sm:text-6xl lg:text-7xl">
              {h.hero.title}
              <span className="mt-2 block text-gold-400">{h.hero.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100 sm:text-xl">{h.hero.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/quote" className="btn btn-gold">
                {m.common.requestQuote}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
              <Link href="/services" className="btn btn-ghost-light">
                {m.common.exploreServices}
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-navy-950/55 p-6 backdrop-blur-md sm:p-7 lg:mb-2">
            <p className="text-xs font-semibold tracking-[0.16em] text-gold-400 uppercase">{h.hero.networkLabel}</p>
            <NetworkStats labels={h.stats} tone="light" className="mt-5" compact />
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-navy-200">{h.stats.note}</p>
          </div>
        </div>
      </section>

      {/* ---------- India ⇄ World ---------- */}
      <section className="section relative overflow-hidden bg-navy-950 pt-6 text-white sm:pt-8 lg:pt-10" aria-labelledby="trade-title">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <SectionHeading id="trade-title" eyebrow={h.trade.eyebrow} title={h.trade.title} lead={h.trade.lead} tone="light" />
            <Link href="/network" className="btn btn-ghost-light reveal mt-8">
              {h.trade.cta}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
          {/* Static (server-rendered) preview; the interactive version lives on /network. */}
          <div className="reveal flex flex-col gap-6">
            <RoutesCanvas idPrefix="home-map" ariaLabel={m.network.map.ariaLabel} indiaLabel={m.network.map.india} regionNames={m.network.regions} />
            <MapLegend labels={m.network.map} />
            <p className="text-xs leading-relaxed text-navy-200">{m.network.map.disclaimer}</p>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="section bg-mist" aria-labelledby="services-title">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading id="services-title" eyebrow={h.services.eyebrow} title={h.services.title} lead={h.services.lead} />
            <Link href="/services" className="link-arrow reveal shrink-0">
              {m.nav.allServices}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {serviceSlugs.map((slug, i) => (
              <ServiceCard
                key={slug}
                slug={slug}
                index={i}
                name={m.services[slug].name}
                text={m.services[slug].short}
                cta={m.common.viewService}
                imageAlt={m.services[slug].imageAlt}
              />
            ))}
            <div className="reveal flex flex-col justify-between rounded-2xl bg-navy-900 p-7 text-white [--reveal-delay:210ms]">
              <div>
                <h3 className="text-xl font-bold text-white">{h.services.ctaTitle}</h3>
                <p className="mt-3 text-navy-100">{h.services.ctaText}</p>
              </div>
              <Link href="/quote" className="btn btn-gold mt-8 w-full">
                {m.common.requestQuote}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why Sengol ---------- */}
      <section className="section" aria-labelledby="why-title">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center">
          <div className="reveal relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src={photo(photos.port, 1400)} alt={h.why.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
            </div>
            <div className="absolute -bottom-6 start-6 end-6 rounded-2xl bg-white p-5 shadow-lift sm:end-auto sm:max-w-xs">
              <p className="font-display text-lg font-bold text-navy-900">{m.common.tagline}</p>
              <p className="mt-1 text-sm text-muted">{m.contactInfo.companyName}</p>
            </div>
          </div>
          <div>
            <SectionHeading id="why-title" eyebrow={h.why.eyebrow} title={h.why.title} lead={h.why.lead} />
            <ol className="mt-10 space-y-6">
              {h.why.items.map((item, i) => {
                const Icon = whyIcons[i] ?? Check;
                return (
                  <li key={item.title} className="reveal flex gap-5" style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-700">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="mt-1 leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- Network ---------- */}
      <section className="section relative isolate overflow-hidden bg-navy-900 text-white" aria-labelledby="network-title">
        <Image src={photo(photos.containers, 2000)} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-15" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-navy-900/90 to-navy-950" />
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
            <SectionHeading id="network-title" eyebrow={h.network.eyebrow} title={h.network.title} lead={h.network.lead} tone="light" />
            <NetworkStats labels={h.stats} tone="light" note={h.stats.note} className="reveal" />
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="reveal rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white">{h.network.indiaTitle}</h3>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {indiaCities.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-navy-100">
                    <span className="size-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden />
                    {m.network.india.cities[c]}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal rounded-2xl border border-white/10 bg-white/5 p-6 [--reveal-delay:100ms] sm:p-8">
              <h3 className="text-lg font-bold text-white">{h.network.intlTitle}</h3>
              <dl className="mt-5 space-y-3">
                {regions.map((r) => (
                  <div key={r.id} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
                    <dt className="text-sm font-semibold text-gold-400">{m.network.regions[r.id]}</dt>
                    <dd className="text-sm text-navy-100">{r.markets.map((c) => m.network.countries[c]).join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Link href="/network" className="btn btn-gold reveal mt-10">
            {h.network.cta}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="section bg-mist" aria-labelledby="process-title">
        <div className="container-x">
          <SectionHeading id="process-title" eyebrow={h.process.eyebrow} title={h.process.title} lead={h.process.lead} align="center" />
          <ol className="relative mt-16 grid gap-8 md:grid-cols-5 md:gap-6">
            <div aria-hidden className="absolute start-6 top-6 bottom-6 w-px bg-gradient-to-b from-gold-500 to-navy-200 md:inset-x-[10%] md:top-6 md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r rtl:md:bg-gradient-to-l" />
            {h.process.steps.map((step, i) => (
              <li key={step.title} className="reveal relative flex gap-5 md:flex-col md:items-center md:text-center" style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
                <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-navy-900 font-display text-lg font-bold text-gold-400 ring-8 ring-mist" dir="ltr">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title={h.cta.title} text={h.cta.text} primary={m.common.requestQuote} secondary={m.common.contactUs} />
    </>
  );
}
