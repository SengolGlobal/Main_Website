import { Plus } from 'lucide-react';

/** Native <details> accordion: keyboard accessible and works without JavaScript. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((item) => (
        <details key={item.q} className="group px-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-start font-semibold text-navy-900">
            {item.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-700 transition-transform duration-300 group-open:rotate-45 group-open:bg-gold-500 group-open:text-navy-950">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="pb-6 leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
