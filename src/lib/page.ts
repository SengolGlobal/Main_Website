import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isLocale, type Locale } from '@/i18n/locales';
import { loadMessages } from '@/i18n/messages';

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Validates the locale segment, enables static rendering and loads typed content. */
export async function initPage(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const m = await loadMessages(locale);
  return { locale: locale as Locale, m };
}

/** Minimal `{name}` interpolation for server-rendered strings. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}
