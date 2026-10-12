import { AlertTriangle } from 'lucide-react';
import type { Messages } from '@/messages/types';
import { PageHero } from '@/components/ui/PageHero';
import { fmt } from '@/lib/page';

type Props = {
  m: Messages;
  doc: Messages['legal']['privacy'];
  crumb: string;
  updated: string;
};

/** Placeholder legal page: clearly flagged for company and legal review. */
export function LegalPage({ m, doc, crumb, updated }: Props) {
  return (
    <>
      <PageHero eyebrow={m.contactInfo.companyName} title={doc.title} crumbs={[{ name: m.nav.home, href: '/' }, { name: crumb }]} crumbLabel={m.a11y.breadcrumb} />
      <section className="section">
        <div className="container-x max-w-3xl">
          <p role="note" className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-ink">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
            {m.legal.reviewNotice}
          </p>
          <p className="mt-8 text-sm text-muted">{fmt(m.legal.lastUpdated, { date: updated })}</p>
          <div className="prose-legal">
            {doc.sections.map((s) => (
              <div key={s.heading}>
                <h2>{s.heading}</h2>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
