import type { Metadata } from 'next';
import { Mail, Phone } from 'lucide-react';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { company, photos } from '@/data/site';
import { PageHero } from '@/components/ui/PageHero';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { ClientMessages } from '@/components/ui/ClientMessages';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '/quote',
    title: m.quote.metaTitle,
    description: m.quote.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

export default async function QuotePage({ params }: LocaleParams) {
  const { locale, m } = await initPage(params);
  const q = m.quote;

  return (
    <>
      <PageHero
        eyebrow={q.hero.eyebrow}
        title={q.hero.title}
        lead={q.hero.lead}
        image={photos.containers}
        crumbs={[{ name: m.nav.home, href: '/' }, { name: m.nav.quote }]}
        crumbLabel={m.a11y.breadcrumb}
      />
      <section className="section bg-mist">
        <div className="container-x grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          <div className="card min-w-0 p-6 sm:p-10">
            <ClientMessages m={m} namespaces={['form']}>
              <EnquiryForm kind="quote" />
            </ClientMessages>
          </div>
          <aside className="min-w-0 space-y-6 lg:sticky lg:top-28" aria-labelledby="next-title">
            <div className="rounded-2xl bg-navy-900 p-7 text-white">
              <h2 id="next-title" className="text-xl font-bold text-white">{q.asideTitle}</h2>
              <ol className="mt-6 space-y-5">
                {q.asideSteps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500 text-sm font-bold text-navy-950" dir="ltr">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-navy-100">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-7">
              <p className="font-semibold text-navy-900">{q.asideContact}</p>
              <ul className="mt-4 space-y-3 text-sm">
                {company.phones.map((p) => (
                  <li key={p.href}>
                    <a href={p.href} className="inline-flex items-center gap-2 font-semibold text-navy-700 hover:text-navy-900" dir="ltr">
                      <Phone className="size-4 text-gold-600" aria-hidden />
                      {p.display}
                    </a>
                  </li>
                ))}
                {company.emails.map((e) => (
                  <li key={e}>
                    <a href={`mailto:${e}`} className="inline-flex items-center gap-2 font-semibold break-all text-navy-700 hover:text-navy-900">
                      <Mail className="size-4 shrink-0 text-gold-600" aria-hidden />
                      {e}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: m.nav.home, path: '' }, { name: m.nav.quote, path: '/quote' }])} />
    </>
  );
}
