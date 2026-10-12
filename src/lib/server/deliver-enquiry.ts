import 'server-only';
import type { EnquiryKind, EnquiryValues } from '@/lib/enquiry';

export type DeliveryResult = { status: 'sent' } | { status: 'not_configured' } | { status: 'failed'; reason: string };

const labels: Record<Exclude<keyof EnquiryValues, 'consent'>, string> = {
  name: 'Name',
  company: 'Company',
  email: 'Business email',
  phoneCode: 'Country code',
  phone: 'Phone',
  direction: 'Import / export',
  origin: 'Origin',
  destination: 'Destination',
  mode: 'Freight mode',
  cargo: 'Cargo description',
  weight: 'Weight / dimensions / CBM',
  date: 'Expected shipment date',
  message: 'Additional requirements / message',
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function rows(values: EnquiryValues) {
  return (Object.keys(labels) as (keyof typeof labels)[])
    .filter((k) => values[k])
    .map((k) => [labels[k], values[k]] as const);
}

function buildEmail(kind: EnquiryKind, locale: string, values: EnquiryValues) {
  const title = kind === 'quote' ? 'New quotation request' : 'New website enquiry';
  const subject = `${title}: ${values.name}${values.company ? ` (${values.company})` : ''}`.replace(/[\r\n]+/g, ' ').slice(0, 180);
  const list = rows(values);
  const text = `${title} via sengolgroup.com (language: ${locale})\n\n${list.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`;
  const html = `<div style="font-family:Arial,sans-serif;color:#1d2733"><h2 style="color:#0a2240">${title}</h2><p style="color:#4b5767">Submitted via the website (language: ${escapeHtml(locale)})</p><table cellpadding="8" style="border-collapse:collapse">${list
    .map(
      ([k, v]) =>
        `<tr><th align="left" valign="top" style="border-bottom:1px solid #e2e7ee;white-space:nowrap">${k}</th><td style="border-bottom:1px solid #e2e7ee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')}</table></div>`;
  return { subject, text, html };
}

async function sendWithResend(kind: EnquiryKind, locale: string, values: EnquiryValues) {
  const { subject, text, html } = buildEmail(kind, locale, values);
  const to = (process.env.ENQUIRY_TO_EMAIL ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.ENQUIRY_FROM_EMAIL, to, reply_to: values.email, subject, text, html }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

async function sendToWebhook(kind: EnquiryKind, locale: string, values: EnquiryValues) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.ENQUIRY_WEBHOOK_SECRET) headers['X-Webhook-Secret'] = process.env.ENQUIRY_WEBHOOK_SECRET;
  const res = await fetch(process.env.ENQUIRY_WEBHOOK_URL!, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type: kind, locale, submittedAt: new Date().toISOString(), data: values }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

export function deliveryConfigured() {
  const resend = Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL && process.env.ENQUIRY_TO_EMAIL);
  const webhook = Boolean(process.env.ENQUIRY_WEBHOOK_URL?.startsWith('https://'));
  return { resend, webhook };
}

/** Sends through every configured channel; succeeds if at least one channel accepted it. */
export async function deliverEnquiry(kind: EnquiryKind, locale: string, values: EnquiryValues): Promise<DeliveryResult> {
  const { resend, webhook } = deliveryConfigured();
  if (!resend && !webhook) return { status: 'not_configured' };

  const attempts = await Promise.allSettled([
    resend ? sendWithResend(kind, locale, values) : Promise.reject(new Error('skip')),
    webhook ? sendToWebhook(kind, locale, values) : Promise.reject(new Error('skip')),
  ]);
  const errors = attempts
    .map((a, i) => (a.status === 'rejected' && (i === 0 ? resend : webhook) ? String(a.reason) : null))
    .filter(Boolean);
  const anySent = attempts.some((a) => a.status === 'fulfilled');
  if (errors.length) console.error('[enquiry] delivery error:', errors.join('; '));
  return anySent ? { status: 'sent' } : { status: 'failed', reason: errors.join('; ') };
}
