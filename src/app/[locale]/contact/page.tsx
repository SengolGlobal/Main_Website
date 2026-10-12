import type { Metadata } from 'next';
import { initPage, type LocaleParams } from '@/lib/page';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { photos } from '@/data/site';
import { PageHero } from '@/components/ui/PageHero';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { ClientMessages } from '@/components/ui/ClientMessages';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale, m } = await initPage(params);
  return buildMetadata({
    locale,
    path: '/contact',
    title: m.contact.metaTitle,
    description: m.contact.metaDescription,
    siteName: m.meta.siteName,
    titleSuffix: m.meta.titleSuffix,
  });
}

export default async function ContactPage({ params }: LocaleParams) {
  const { locale, m } = await initPage(params);
  const c = m.contact;

  return (
    <>
      <PageHero
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        lead={c.hero.lead}
        image={photos.port}
        crumbs={[{ name: m.nav.home, href: '/' }, { name: m.nav.contact }]}
        crumbLabel={m.a11y.breadcrumb}
      />
      <section className="section bg-mist">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          <div className="card min-w-0 p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-2xl font-bold">{c.detailsTitle}</h2>
            <div className="mt-4">
              <ContactDetails m={m} />
            </div>
          </div>
          <div className="card min-w-0 p-6 sm:p-10">
            <h2 className="text-2xl font-bold">{c.formTitle}</h2>
            <p className="mt-2 text-muted">{c.formLead}</p>
            <div className="mt-8">
              <ClientMessages m={m} namespaces={['form']}>
                <EnquiryForm kind="contact" />
              </ClientMessages>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: m.nav.home, path: '' }, { name: m.nav.contact, path: '/contact' }])} />
    </>
  );
}
