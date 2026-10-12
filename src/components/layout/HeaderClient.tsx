'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronDown, Mail, Menu, Phone, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { serviceConfig, type ServiceSlug } from '@/data/services';
import { Logo } from '@/components/ui/Logo';
import { LanguageList, LanguageSwitcher } from './LanguageSwitcher';

type Props = {
  services: { slug: ServiceSlug; name: string; short: string }[];
  topbar: string;
  phone: { display: string; href: string };
  email: string;
};

export function HeaderClient({ services, topbar, phone, email }: Props) {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const megaId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setServicesOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [servicesOpen]);

  // The open mobile menu is dark, so the bar stays dark with it.
  const solid = scrolled && !menuOpen;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const navLink = (href: string) =>
    `relative inline-flex h-11 items-center px-3 text-[0.95rem] font-medium transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform hover:after:scale-x-100 ${
      isActive(href) ? 'after:scale-x-100' : ''
    } ${solid ? 'text-navy-900' : 'text-white'}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar */}
      <div
        className={`hidden overflow-hidden bg-navy-950 text-xs text-navy-100 transition-[height] duration-300 lg:block ${
          scrolled ? 'h-0' : 'h-9'
        }`}
      >
        <div className="container-x flex h-9 items-center justify-between">
          <span>{topbar}</span>
          <div className="flex items-center gap-6">
            <a href={phone.href} className="inline-flex items-center gap-1.5 hover:text-white" dir="ltr">
              <Phone className="size-3.5 text-gold-500" aria-hidden />
              {phone.display}
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail className="size-3.5 text-gold-500" aria-hidden />
              {email}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          menuOpen
            ? 'bg-navy-950'
            : solid
              ? 'bg-white/95 shadow-[0_1px_0_rgb(10_34_64/0.08),0_10px_30px_-20px_rgb(10_34_64/0.5)] backdrop-blur-md'
              : 'bg-gradient-to-b from-navy-950/70 to-transparent'
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
          <Link href="/" aria-label={t('a11y.homeLink')} className="shrink-0">
            <Logo variant={solid ? 'color' : 'white'} priority className="h-10 w-auto sm:h-11 lg:h-12" />
          </Link>

          <nav aria-label={t('a11y.mainNavigation')} className="hidden items-center lg:flex">
            <Link href="/about" className={navLink('/about')}>
              {t('nav.about')}
            </Link>

            <div ref={servicesRef} className="relative" onMouseLeave={() => setServicesOpen(false)}>
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls={megaId}
                onClick={() => setServicesOpen((v) => !v)}
                onMouseEnter={() => setServicesOpen(true)}
                className={`${navLink('/services')} gap-1`}
              >
                {t('nav.services')}
                <ChevronDown className={`size-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>
              <div
                id={megaId}
                hidden={!servicesOpen}
                className="absolute start-1/2 top-full w-[42rem] -translate-x-1/2 pt-3 rtl:translate-x-1/2"
              >
                <div className="rounded-2xl border border-line bg-white p-3 shadow-lift">
                  <ul className="grid grid-cols-2 gap-1">
                    {services.map(({ slug, name, short }) => {
                      const Icon = serviceConfig[slug].icon;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/services/${slug}`}
                            className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-navy-50 focus-visible:bg-navy-50"
                          >
                            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                              <Icon className="size-5" aria-hidden />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-navy-900">{name}</span>
                              <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted">{short}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link
                        href="/services"
                        className="flex h-full items-center justify-between gap-2 rounded-xl bg-navy-900 p-4 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
                      >
                        {t('nav.allServices')}
                        <ArrowRight className="size-4 text-gold-400 rtl:rotate-180" aria-hidden />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/network" className={navLink('/network')}>
              {t('nav.network')}
            </Link>
            <Link href="/contact" className={navLink('/contact')}>
              {t('nav.contact')}
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher tone={solid ? 'dark' : 'light'} />
            </div>
            <Link href="/quote" className="btn btn-gold hidden min-h-11 px-5 md:inline-flex">
              {t('nav.quote')}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls={panelId}
              aria-label={menuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
              onClick={() => setMenuOpen((v) => !v)}
              className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
                solid ? 'text-navy-900 hover:bg-navy-50' : 'text-white hover:bg-white/10'
              }`}
            >
              {menuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet panel */}
      <div
        id={panelId}
        hidden={!menuOpen}
        className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto overscroll-contain bg-navy-950 text-white lg:hidden"
      >
        <nav aria-label={t('a11y.mainNavigation')} className="container-x flex flex-col gap-8 py-8">
          <ul className="divide-y divide-white/10 border-y border-white/10 text-lg font-semibold">
            {[
              ['/', t('nav.home')],
              ['/about', t('nav.about')],
              ['/services', t('nav.services')],
              ['/network', t('nav.network')],
              ['/contact', t('nav.contact')],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className="flex min-h-14 items-center justify-between py-3 aria-[current=page]:text-gold-400"
                >
                  {label}
                  <ArrowRight className="size-5 text-white/40 rtl:rotate-180" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>

          <div>
            <p className="eyebrow eyebrow-light">{t('nav.services')}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {services.map(({ slug, name }) => {
                const Icon = serviceConfig[slug].icon;
                return (
                  <li key={slug}>
                    <Link href={`/services/${slug}`} className="flex min-h-12 items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-navy-100 hover:bg-white/10">
                      <Icon className="size-5 text-gold-400" aria-hidden />
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="eyebrow eyebrow-light">{t('a11y.chooseLanguage')}</p>
            <div className="mt-4">
              <LanguageList onSelect={() => setMenuOpen(false)} />
            </div>
          </div>

          <Link href="/quote" className="btn btn-gold w-full">
            {t('nav.quote')}
          </Link>
          <div className="flex flex-col gap-3 pb-6 text-sm text-navy-100">
            <a href={phone.href} className="inline-flex items-center gap-2" dir="ltr">
              <Phone className="size-4 text-gold-500" aria-hidden /> {phone.display}
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2">
              <Mail className="size-4 text-gold-500" aria-hidden /> {email}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
