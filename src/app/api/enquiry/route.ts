import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/i18n/locales';
import { isoDate, normalise, validate, type EnquiryKind } from '@/lib/enquiry';
import { deliverEnquiry } from '@/lib/server/deliver-enquiry';
import { rateLimit } from '@/lib/server/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 20_000;
const MIN_FILL_MS = 2500;

const json = (body: object, status: number) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: NextRequest) {
  // Same-origin only
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return json({ code: 'forbidden' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ code: 'bad_request' }, 415);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  if (!rateLimit(ip)) return json({ code: 'rate_limited' }, 429);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ code: 'bad_request' }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ code: 'bad_request' }, 400);
  }

  // Spam traps: hidden honeypot field and implausibly fast submissions.
  const elapsed = Date.now() - Number(body.startedAt);
  if (body.website || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return json({ code: 'rejected' }, 400);

  const kind: EnquiryKind = body.kind === 'quote' ? 'quote' : 'contact';
  const locale = isLocale(body.locale) ? body.locale : 'en';
  const values = normalise(body.values);
  // Allow one day of slack for visitors in time zones ahead of the server.
  const errors = validate(kind, values, isoDate(new Date(), -1));
  if (Object.keys(errors).length) return json({ code: 'invalid', errors }, 422);

  const result = await deliverEnquiry(kind, locale, values);
  if (result.status === 'not_configured') return json({ code: 'not_configured' }, 503);
  if (result.status === 'failed') return json({ code: 'delivery_failed' }, 502);
  return json({ code: 'sent' }, 200);
}
