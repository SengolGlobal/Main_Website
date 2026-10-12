import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Check, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isLocale, locales } from '@/i18n/locales';
import { loadMessages } from '@/i18n/messages';
import { buildMetadata } from '@/lib/seo';
import { photo } from '@/lib/images';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/structured-data';
import { company } from '@/data/site';
import { isServiceSlug, serviceConfig, serviceSlugs } from '@/data/services';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaBand } from '@/components/ui/CtaBand';
import { Faq } from '@/components/ui/Faq';
import { ServiceCard } from '@/components/services/ServiceCard';
import { JsonLd } from '@/components/seo/JsonLd';

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

export const dynamicParams = false;

async function load(params: Params['params']) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isServiceSlug(slug)) notFound();
  setRequestLocale(locale);
  const m = await loadMessages(locale);
  return { locale, slug, m, s: m.services[slug] };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug, m, s } = await load(params);
  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: s.title,
    description: s.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

export default async function ServicePage({ params }: Params) {
  const { locale, slug, m, s } = await load(params);
  const config = serviceConfig[slug];
  const quoteHref = { pathname: '/quote', query: config.mode ? { mode: config.mode } : {} };

  return (
    <>
      <PageHero
        eyebrow={m.nav.services}
        title={s.title}
        lead={s.intro}
        image={config.image}
        imageAlt=""
        crumbs={[{ name: m.nav.home, href: '/' }, { name: m.nav.services, href: '/services' }, { name: s.name }]}
        crumbLabel={m.a11y.breadcrumb}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={quoteHref} className="btn btn-gold">
            {m.common.requestQuote}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
          <a href={company.phones[0].href} className="btn btn-ghost-light">
            <Phone className="size-4" aria-hidden />
            <span dir="ltr">{company.phones[0].display}</span>
          </a>
        </div>
      </PageHero>

      {/* Capabilities + image */}
      <section className="section" aria-labelledby="cap-title">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="reveal">
            <h2 id="cap-title" className="h2">{m.common.capabilities}</h2>
            <ul className="mt-8 space-y-4">
              {s.capabilities.map((c) => (
                <li key={c} className="flex gap-4 rounded-xl border border-line bg-white p-4 shadow-card">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500 text-navy-950">
                    <Check className="size-4" aria-hidden />
                  </span>
                  <span className="font-medium text-navy-900">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image src={photo(config.image, 1400)} alt={s.imageAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-mist" aria-labelledby="benefits-title">
        <div className="container-x">
          <SectionHeading id="benefits-title" eyebrow={s.name} title={m.common.benefits} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {s.benefits.map((b, i) => (
              <li key={b.title} className="card reveal p-7" style={{ '--reveal-delay': `${i * 70}ms` } as React.CSSProperties}>
                <span className="block h-1 w-10 rounded bg-gold-500" aria-hidden />
                <h3 className="mt-5 text-lg font-bold">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-navy-950 text-white" aria-labelledby="how-title">
        <div className="container-x">
          <SectionHeading id="how-title" eyebrow={s.name} title={m.common.howItWorks} tone="light" />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {s.steps.map((step, i) => (
              <li key={step.title} className="reveal relative rounded-2xl border border-white/10 bg-white/5 p-7" style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}>
                <span className="text-sm font-semibold text-gold-400">{m.common.step.replace('{number}', String(i + 1))}</span>
                <h3 className="mt-3 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-navy-100">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" aria-labelledby="faq-title">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="reveal">
            <h2 id="faq-title" className="h2">{m.common.faqTitle}</h2>
            <Link href="/contact" className="link-arrow mt-6">
              {m.common.contactUs}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
          <div className="reveal">
            <Faq items={s.faqs} />
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section bg-mist" aria-labelledby="related-title">
        <div className="container-x">
          <h2 id="related-title" className="h2 reveal">{m.common.relatedServices}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {config.related.map((r, i) => (
              <ServiceCard key={r} slug={r} index={i} name={m.services[r].name} text={m.services[r].short} cta={m.common.viewService} imageAlt={m.services[r].imageAlt} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={m.home.cta.title} text={m.home.cta.text} primary={m.common.requestQuote} secondary={m.common.contactUs} primaryHref={config.mode ? `/quote?mode=${config.mode}` : '/quote'} />

      <JsonLd data={serviceJsonLd({ locale, path: `/services/${slug}`, name: s.title, description: s.metaDescription })} />
      <JsonLd data={faqJsonLd(s.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: m.nav.home, path: '' },
          { name: m.nav.services, path: '/services' },
          { name: s.name, path: `/services/${slug}` },
        ])}
      />
    </>
  );
}
