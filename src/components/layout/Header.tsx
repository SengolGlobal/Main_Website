import type { Locale } from '@/i18n/locales';
import type { Messages } from '@/messages/types';
import { serviceSlugs } from '@/data/services';
import { company } from '@/data/site';
import { HeaderClient } from './HeaderClient';

export function Header({ m }: { locale: Locale; m: Messages }) {
  const services = serviceSlugs.map((slug) => ({ slug, name: m.services[slug].name, short: m.services[slug].short }));
  return (
    <HeaderClient
      services={services}
      topbar={m.topbar.message}
      phone={company.phones[0]}
      email={company.emails[0]}
    />
  );
}
