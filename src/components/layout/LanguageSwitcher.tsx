'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALE_COOKIE, localeInfo, locales, type Locale } from '@/i18n/locales';
import { stashDrafts } from '@/components/forms/draftStore';

function rememberLocale(locale: Locale) {
  // Functional cookie: remembers an explicit language choice for one year.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function useSwitchLocale() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    rememberLocale(next);
    stashDrafts();
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    startTransition(() => {
      router.replace({ pathname, query }, { locale: next, scroll: false });
    });
  };
  return { switchTo, isPending };
}

type Props = { tone?: 'light' | 'dark' };

/** Compact dropdown used in the desktop header. */
export function LanguageSwitcher({ tone = 'dark' }: Props) {
  const t = useTranslations('a11y');
  const current = useLocale() as Locale;
  const { switchTo, isPending } = useSwitchLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t('chooseLanguage')} — ${t('currentLanguage', { language: localeInfo[current].label })}`}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors ${
          tone === 'light' ? 'text-white hover:bg-white/10' : 'text-navy-800 hover:bg-navy-50'
        } ${isPending ? 'opacity-60' : ''}`}
      >
        <Globe className="size-4" aria-hidden />
        <span>{localeInfo[current].short}</span>
        <ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (
        <ul
          id={listId}
          onKeyDown={onListKeyDown}
          className="absolute end-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-lift"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                lang={localeInfo[l].hreflang}
                aria-current={l === current ? 'true' : undefined}
                onClick={() => {
                  setOpen(false);
                  if (l !== current) switchTo(l);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm transition-colors hover:bg-navy-50 focus-visible:bg-navy-50 ${
                  l === current ? 'font-semibold text-navy-900' : 'text-ink'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 text-xs font-semibold text-muted" dir="ltr">
                    {localeInfo[l].short}
                  </span>
                  {localeInfo[l].label}
                </span>
                {l === current && <Check className="size-4 text-gold-600" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Full list used in the mobile menu and footer. */
export function LanguageList({ onSelect, tone = 'light' }: { onSelect?: () => void; tone?: 'light' | 'dark' }) {
  const current = useLocale() as Locale;
  const { switchTo } = useSwitchLocale();
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {locales.map((l) => (
        <li key={l}>
          <button
            type="button"
            lang={localeInfo[l].hreflang}
            aria-current={l === current ? 'true' : undefined}
            onClick={() => {
              onSelect?.();
              if (l !== current) switchTo(l);
            }}
            className={`flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 py-2 text-start text-sm transition-colors ${
              tone === 'light'
                ? l === current
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-white/15 text-navy-100 hover:border-white/40'
                : l === current
                  ? 'border-gold-500 bg-gold-100 text-navy-900'
                  : 'border-line text-ink hover:border-navy-200'
            }`}
          >
            <span className="text-xs font-semibold opacity-70" dir="ltr">
              {localeInfo[l].short}
            </span>
            {localeInfo[l].label}
          </button>
        </li>
      ))}
    </ul>
  );
}
