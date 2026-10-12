import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import type { Messages } from '@/messages/types';
import { serviceSlugs } from '@/data/services';
import { company } from '@/data/site';
import { Logo } from '@/components/ui/Logo';
import { LanguageLinks } from './LanguageLinks';

export function Footer({ m }: { locale: Locale; m: Messages }) {
  const year = new Date().getFullYear();
  const heading = 'text-sm font-semibold tracking-wide text-white';
  const link = 'text-sm text-navy-100 transition-colors hover:text-white';

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-100">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Link href="/" aria-label={m.a11y.homeLink} className="inline-block">
            <Logo variant="white" className="h-12 w-auto" />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{m.footer.about}</p>
          <Link href="/quote" className="btn btn-gold mt-8">
            {m.common.requestQuote}
          </Link>
        </div>

        <nav aria-label={m.a11y.footerNavigation} className="grid grid-cols-2 gap-8 lg:col-span-5">
          <div>
            <h2 className={heading}>{m.footer.company}</h2>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className={link}>{m.nav.about}</Link></li>
              <li><Link href="/services" className={link}>{m.nav.services}</Link></li>
              <li><Link href="/network" className={link}>{m.nav.network}</Link></li>
              <li><Link href="/contact" className={link}>{m.nav.contact}</Link></li>
              <li><Link href="/quote" className={link}>{m.nav.quote}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={heading}>{m.footer.services}</h2>
            <ul className="mt-4 space-y-3">
              {serviceSlugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/services/${slug}`} className={link}>
                    {m.services[slug].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-3">
          <h2 className={heading}>{m.footer.contact}</h2>
          <address className="mt-4 space-y-4 text-sm not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
              <span>
                {m.contactInfo.companyName}
                <br />
                {m.contactInfo.addressLines.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </span>
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
              <span className="flex flex-col gap-1">
                {company.phones.map((p) => (
                  <a key={p.href} href={p.href} className={link} dir="ltr">{p.display}</a>
                ))}
              </span>
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
              <span className="flex flex-col gap-1">
                {company.emails.map((e) => (
                  <a key={e} href={`mailto:${e}`} className={link}>{e}</a>
                ))}
              </span>
            </p>
            <p className="flex gap-3">
              <Globe className="mt-0.5 size-4 shrink-0 text-gold-500" aria-hidden />
              <a href={company.website} className={link}>{company.websiteLabel}</a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="sr-only">{m.footer.languages}</h2>
            <LanguageLinks />
          </div>
          <div className="flex flex-col gap-3 text-xs text-navy-200 sm:flex-row sm:items-center sm:gap-6">
            <p>© {year} {company.legalName} {m.footer.rights}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 whitespace-nowrap">
              <Link href="/privacy" className="hover:text-white">{m.nav.privacy}</Link>
              <Link href="/terms" className="hover:text-white">{m.nav.terms}</Link>
              <span>{m.footer.photoCredit}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
