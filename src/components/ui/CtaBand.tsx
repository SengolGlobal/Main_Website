import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { company } from '@/data/site';

type Props = {
  title: string;
  text: string;
  primary: string;
  secondary: string;
  primaryHref?: string;
};

/** Closing business-enquiry band used across pages. */
export function CtaBand({ title, text, primary, secondary, primaryHref = '/quote' }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-20 text-white sm:py-24">
      <div aria-hidden className="absolute -end-40 -top-40 -z-10 size-[36rem] rounded-full bg-gold-500/15 blur-3xl" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.07)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="reveal">
          <h2 className="h2 text-white">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryHref} className="btn btn-gold">
              {primary}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
            <Link href="/contact" className="btn btn-ghost-light">
              {secondary}
            </Link>
          </div>
        </div>
        <div className="reveal grid gap-3 [--reveal-delay:120ms]">
          {company.phones.map((p) => (
            <a key={p.href} href={p.href} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-gold-500/60 hover:bg-white/10">
              <span className="grid size-11 place-items-center rounded-full bg-gold-500 text-navy-950">
                <Phone className="size-5" aria-hidden />
              </span>
              <span className="text-lg font-semibold" dir="ltr">{p.display}</span>
            </a>
          ))}
          <a href={`mailto:${company.emails[0]}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-gold-500/60 hover:bg-white/10">
            <span className="grid size-11 place-items-center rounded-full bg-white/10 text-gold-400">
              <Mail className="size-5" aria-hidden />
            </span>
            <span className="font-semibold break-all">{company.emails[0]}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
