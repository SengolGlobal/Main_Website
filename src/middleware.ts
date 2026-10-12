import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { defaultLocale, isLocale, LOCALE_COOKIE } from './i18n/locales';

const intl = createMiddleware(routing);

// www.sengolgroup.com is the main address; the bare domain forwards to the same page there.
const APEX_HOST = 'sengolgroup.com';
const MAIN_HOST = 'www.sengolgroup.com';

export default function middleware(request: NextRequest) {
  if (request.headers.get('host') === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = MAIN_HOST;
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  // The site root sends visitors to the language they explicitly chose before
  // (cookie set by the language selector); otherwise to English.
  if (request.nextUrl.pathname === '/') {
    const preferred = request.cookies.get(LOCALE_COOKIE)?.value;
    const target = isLocale(preferred) ? preferred : defaultLocale;
    return NextResponse.redirect(new URL(`/${target}`, request.url), 307);
  }
  return intl(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|brand|.*\\..*).*)'],
};
