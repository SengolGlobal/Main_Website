import { ExternalLink, Globe, Mail, MapPin, Phone } from 'lucide-react';
import type { Messages } from '@/messages/types';
import { company } from '@/data/site';

/** Verified contact details from the company profile. */
export function ContactDetails({ m }: { m: Messages }) {
  const c = m.contactInfo;
  const row = 'flex gap-4 border-b border-line py-5 last:border-0';
  const icon = 'grid size-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-gold-400';
  const label = 'text-xs font-semibold tracking-wider text-muted uppercase';
  const link = 'font-semibold text-navy-900 underline-offset-4 hover:text-navy-600 hover:underline';

  return (
    <address className="not-italic">
      <div className={row}>
        <span className={icon}><MapPin className="size-5" aria-hidden /></span>
        <div>
          <p className={label}>{c.addressLabel}</p>
          <p className="mt-1 font-semibold text-navy-900">{c.companyName}</p>
          {c.addressLines.map((l) => (
            <p key={l} className="text-ink">{l}</p>
          ))}
          <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900">
            {c.mapLink}
            <ExternalLink className="size-3.5" aria-hidden />
            <span className="sr-only">{m.a11y.opensInNewTab}</span>
          </a>
        </div>
      </div>
      <div className={row}>
        <span className={icon}><Phone className="size-5" aria-hidden /></span>
        <div>
          <p className={label}>{c.phoneLabel}</p>
          <ul className="mt-1 space-y-1">
            {company.phones.map((p) => (
              <li key={p.href}><a href={p.href} className={link} dir="ltr">{p.display}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className={row}>
        <span className={icon}><Mail className="size-5" aria-hidden /></span>
        <div>
          <p className={label}>{c.emailLabel}</p>
          <ul className="mt-1 space-y-1">
            {company.emails.map((e) => (
              <li key={e}><a href={`mailto:${e}`} className={`${link} break-all`}>{e}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className={row}>
        <span className={icon}><Globe className="size-5" aria-hidden /></span>
        <div>
          <p className={label}>{c.websiteLabel}</p>
          <a href={company.website} className={`${link} mt-1 inline-block`}>{company.websiteLabel}</a>
        </div>
      </div>
    </address>
  );
}
