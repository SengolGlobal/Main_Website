import { ArrowRight, Compass } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import type { Messages } from '@/messages/types';
import { serviceSlugs } from '@/data/services';

export function NotFoundContent({ m, locale }: { m: Messages; locale: Locale }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pt-40 pb-24 text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.08)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="container-x max-w-3xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-500 text-navy-950">
          <Compass className="size-8" aria-hidden />
        </span>
        <p className="eyebrow eyebrow-light mt-8 justify-center">{m.notFound.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{m.notFound.title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-navy-100">{m.notFound.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" locale={locale} className="btn btn-gold">
            {m.common.backHome}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
          <Link href="/contact" locale={locale} className="btn btn-ghost-light">
            {m.common.contactUs}
          </Link>
        </div>
        <ul className="mt-14 flex flex-wrap justify-center gap-2">
          {serviceSlugs.map((slug) => (
            <li key={slug}>
              <Link
                href={`/services/${slug}`}
                locale={locale}
                className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-navy-100 hover:border-white/40 hover:text-white"
              >
                {m.services[slug].name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
