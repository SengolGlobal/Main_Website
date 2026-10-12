import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-navy-100">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-navy-200/60 rtl:rotate-180" aria-hidden />}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-white">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-white">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
