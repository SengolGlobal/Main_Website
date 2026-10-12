import Image from 'next/image';
import type { ReactNode } from 'react';
import { photo } from '@/lib/images';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  image?: string;
  imageAlt?: string;
  crumbs: Crumb[];
  crumbLabel: string;
  children?: ReactNode;
};

/** Dark hero band used at the top of every inner page. */
export function PageHero({ eyebrow, title, lead, image, imageAlt = '', crumbs, crumbLabel, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-16 text-white sm:pb-20 lg:pt-44 lg:pb-24">
      {image && (
        <Image
          src={photo(image, 2000)}
          alt={imageAlt}
          fill
          priority
          quality={60}
          sizes="100vw"
          className="-z-20 object-cover opacity-45"
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/40 rtl:bg-gradient-to-l" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.08)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="container-x">
        <Breadcrumbs items={crumbs} label={crumbLabel} />
        <div className="mt-8 max-w-3xl">
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1 className="mt-4 text-4xl leading-[1.08] font-bold text-white sm:text-5xl lg:text-6xl">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100">{lead}</p>}
          {children}
        </div>
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-transparent rtl:bg-gradient-to-l" />
    </section>
  );
}
