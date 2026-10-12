import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { serviceConfig, type ServiceSlug } from '@/data/services';
import { photo } from '@/lib/images';

type Props = {
  slug: ServiceSlug;
  name: string;
  text: string;
  cta: string;
  imageAlt: string;
  index?: number;
};

export function ServiceCard({ slug, name, text, cta, imageAlt, index = 0 }: Props) {
  const { icon: Icon, image } = serviceConfig[slug];
  return (
    <article
      className="reveal group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift"
      style={{ '--reveal-delay': `${(index % 4) * 70}ms` } as React.CSSProperties}
    >
      <div className="relative">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={photo(image, 900)}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        </div>
        <span className="absolute start-4 bottom-0 grid size-12 translate-y-1/2 place-items-center rounded-xl bg-navy-900 text-gold-400 shadow-lg ring-4 ring-white transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
          <Icon className="size-6" aria-hidden />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 pt-10">
        <h3 className="text-xl font-bold">
          <Link href={`/services/${slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {name}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{text}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 group-hover:text-navy-900">
          {cta}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden />
        </span>
      </div>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gold-500 transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
    </article>
  );
}
