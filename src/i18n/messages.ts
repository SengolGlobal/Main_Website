import type { Locale } from './locales';
import type { Messages } from '@/messages/types';

const loaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  en: () => import('@/messages/en'),
  de: () => import('@/messages/de'),
  ko: () => import('@/messages/ko'),
  fr: () => import('@/messages/fr'),
  es: () => import('@/messages/es'),
  it: () => import('@/messages/it'),
  ja: () => import('@/messages/ja'),
  'zh-cn': () => import('@/messages/zh-cn'),
  ar: () => import('@/messages/ar'),
};

export async function loadMessages(locale: Locale): Promise<Messages> {
  return (await loaders[locale]()).default;
}
