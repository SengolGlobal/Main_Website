import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import type { Messages } from '@/messages/types';

/** Ships the given translation namespaces to client components below it. */
export function ClientMessages({ m, namespaces, children }: { m: Messages; namespaces: (keyof Messages)[]; children: ReactNode }) {
  const messages = Object.fromEntries(['a11y', 'nav', ...namespaces].map((ns) => [ns, m[ns as keyof Messages]]));
  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
