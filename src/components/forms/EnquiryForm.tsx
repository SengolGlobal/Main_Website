'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AlertTriangle, CheckCircle2, ChevronDown, Info, Loader2, Send } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { company } from '@/data/site';
import {
  directions,
  emptyValues,
  isoDate,
  limits,
  modes,
  requiredFields,
  validate,
  type EnquiryErrors,
  type ErrorCode,
  type EnquiryField,
  type EnquiryKind,
  type EnquiryValues,
} from '@/lib/enquiry';
import { registerDraftCollector, takeDraft } from './draftStore';

type Status = 'idle' | 'submitting' | 'sent' | 'not_configured' | 'error' | 'rate_limited' | 'invalid';
type Props = { kind: EnquiryKind; defaultMode?: string };

const shipmentFields: EnquiryField[] = ['direction', 'origin', 'destination', 'mode', 'cargo', 'weight', 'date'];

export function EnquiryForm({ kind, defaultMode }: Props) {
  const t = useTranslations('form');
  const locale = useLocale();
  const formId = `enquiry-${kind}`;
  const uid = useId();
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(Date.now());

  const [values, setValues] = useState<EnquiryValues>(() => {
    const draft = takeDraft(formId) as Partial<EnquiryValues> | undefined;
    return { ...emptyValues, ...(draft ?? {}) };
  });

  // Pre-select the freight mode when arriving from a service page (?mode=air).
  // Read on the client so the page itself can stay statically generated.
  useEffect(() => {
    const mode = defaultMode ?? new URLSearchParams(window.location.search).get('mode');
    if (mode && (modes as readonly string[]).includes(mode)) setValues((v) => (v.mode ? v : { ...v, mode }));
  }, [defaultMode]);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [minDate, setMinDate] = useState<string>();
  const [showShipment, setShowShipment] = useState(
    () => kind === 'quote' || shipmentFields.some((f) => f !== 'mode' && Boolean(values[f])),
  );

  const valuesRef = useRef(values);
  valuesRef.current = values;
  useEffect(() => registerDraftCollector(formId, () => ({ ...valuesRef.current })), [formId]);
  useEffect(() => setMinDate(isoDate()), []);

  const required = new Set(requiredFields[kind]);

  const update = (field: EnquiryField, value: string | boolean) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field] || errors[field]) {
      setErrors((e) => ({ ...e, [field]: validate(kind, next, minDate)[field] }));
    }
  };

  const blur = (field: EnquiryField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validate(kind, values, minDate)[field];
    setErrors((e) => ({ ...e, [field]: fieldError }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;
    const found = validate(kind, values, minDate);
    setErrors(found);
    if (Object.keys(found).length) {
      if (shipmentFields.some((f) => found[f])) setShowShipment(true);
      setStatus('invalid');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setStatus('submitting');
    const honeypot = (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, locale, values, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { code?: string; errors?: EnquiryErrors };
      if (res.ok && data.code === 'sent') {
        setStatus('sent');
        setValues({ ...emptyValues });
        setTouched({});
      } else if (data.code === 'not_configured') setStatus('not_configured');
      else if (data.code === 'rate_limited') setStatus('rate_limited');
      else if (data.code === 'invalid' && data.errors) {
        setErrors(data.errors);
        setStatus('invalid');
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
    requestAnimationFrame(() => (statusRef.current ?? summaryRef.current)?.focus());
  };

  if (status === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center outline-none">
        <CheckCircle2 className="mx-auto size-12 text-emerald-600" aria-hidden />
        <h2 className="mt-4 text-2xl font-bold">{t('status.successTitle')}</h2>
        <p className="mt-3 text-muted">{t('status.successText')}</p>
        <button
          type="button"
          className="btn btn-outline mt-6"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus('idle');
          }}
        >
          {t('status.sendAnother')}
        </button>
      </div>
    );
  }

  const errorIds = Object.entries(errors).filter(([, v]) => v) as [EnquiryField, ErrorCode][];
  const id = (field: string) => `${uid}-${field}`;

  const field = (name: EnquiryField, label: string, input: ReactNode, hint?: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id(name)} className="text-sm font-semibold text-navy-900">
        {label}
        {required.has(name) ? (
          <span className="text-red-700" aria-hidden> *</span>
        ) : name !== 'phoneCode' ? (
          <span className="ms-1.5 text-xs font-normal text-muted">({t('optional')})</span>
        ) : null}
      </label>
      {input}
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {errors[name] && (
        <p id={`${id(name)}-error`} className="flex items-center gap-1.5 text-sm text-red-700">
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
          {t(`errors.${errors[name]}`)}
        </p>
      )}
    </div>
  );

  const inputProps = (name: Exclude<EnquiryField, 'consent'>) => ({
    id: id(name),
    name,
    value: values[name],
    maxLength: limits[name],
    required: required.has(name),
    'aria-required': required.has(name) || undefined,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id(name)}-error` : undefined,
    onBlur: () => blur(name),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => update(name, e.target.value),
    className:
      'w-full rounded-xl border bg-white px-4 py-3 text-base text-ink shadow-sm transition-colors placeholder:text-slate-400 focus:border-navy-600 focus:ring-4 focus:ring-navy-100 focus:outline-none aria-[invalid=true]:border-red-600 aria-[invalid=true]:ring-red-100 border-line',
  });

  const statusBox = (tone: 'warn' | 'error', title: string, text: string) => (
    <div
      ref={statusRef}
      tabIndex={-1}
      role="alert"
      className={`flex gap-3 rounded-xl border p-4 outline-none ${tone === 'warn' ? 'border-amber-300 bg-amber-50' : 'border-red-200 bg-red-50'}`}
    >
      {tone === 'warn' ? <Info className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden /> : <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-700" aria-hidden />}
      <div>
        <p className="font-semibold text-navy-900">{title}</p>
        <p className="mt-1 text-sm text-ink">{text}</p>
      </div>
    </div>
  );

  const shipment = (
    <div className="grid gap-5 sm:grid-cols-2">
      {field(
        'direction',
        t('fields.direction'),
        <select {...inputProps('direction')}>
          <option value="">{t('placeholders.select')}</option>
          {directions.map((d) => (
            <option key={d} value={d}>{t(`options.direction.${d}`)}</option>
          ))}
        </select>,
      )}
      {field(
        'mode',
        t('fields.mode'),
        <select {...inputProps('mode')}>
          <option value="">{t('placeholders.select')}</option>
          {modes.map((m) => (
            <option key={m} value={m}>{t(`options.mode.${m}`)}</option>
          ))}
        </select>,
      )}
      {field('origin', t('fields.origin'), <input type="text" autoComplete="off" placeholder={t('placeholders.origin')} {...inputProps('origin')} />)}
      {field('destination', t('fields.destination'), <input type="text" autoComplete="off" placeholder={t('placeholders.destination')} {...inputProps('destination')} />)}
      <div className="sm:col-span-2">
        {field('cargo', t('fields.cargo'), <textarea rows={3} placeholder={t('placeholders.cargo')} {...inputProps('cargo')} />)}
      </div>
      {field('weight', t('fields.weight'), <input type="text" autoComplete="off" placeholder={t('placeholders.weight')} {...inputProps('weight')} />)}
      {field('date', t('fields.date'), <input type="date" min={minDate} {...inputProps('date')} />)}
    </div>
  );

  const sectionTitle = 'text-lg font-bold text-navy-900';

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-8" aria-busy={status === 'submitting'}>
      <p className="text-sm text-muted">{t('requiredNote')}</p>

      {status === 'invalid' && errorIds.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 outline-none">
          <p className="font-semibold text-red-800">{t('status.validationTitle')}</p>
          <ul className="mt-2 list-inside list-disc text-sm text-red-800">
            {errorIds.map(([f, code]) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="underline underline-offset-2">
                  {f === 'consent' ? t('errors.consent') : `${t(`fields.${f}`)}: ${t(`errors.${code}`)}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="flex flex-col gap-5">
        <legend className={sectionTitle}>{t('sections.contact')}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {field('name', t('fields.name'), <input type="text" autoComplete="name" {...inputProps('name')} />)}
          {field('company', t('fields.company'), <input type="text" autoComplete="organization" {...inputProps('company')} />)}
          {field('email', t('fields.email'), <input type="email" autoComplete="email" inputMode="email" dir="ltr" {...inputProps('email')} />)}
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
            {field('phoneCode', t('fields.phoneCode'), <input type="text" autoComplete="tel-country-code" inputMode="tel" dir="ltr" {...inputProps('phoneCode')} />)}
            {field('phone', t('fields.phone'), <input type="tel" autoComplete="tel-national" inputMode="tel" dir="ltr" {...inputProps('phone')} />)}
          </div>
        </div>
      </fieldset>

      {kind === 'quote' ? (
        <fieldset className="flex flex-col gap-5 border-t border-line pt-8">
          <legend className={`${sectionTitle} float-start w-full`}>{t('sections.shipment')}</legend>
          {shipment}
        </fieldset>
      ) : (
        <div className="rounded-2xl border border-line bg-mist/60">
          <button
            type="button"
            aria-expanded={showShipment}
            aria-controls={`${uid}-shipment`}
            onClick={() => setShowShipment((v) => !v)}
            className="flex min-h-14 w-full items-center justify-between gap-4 px-5 text-start font-semibold text-navy-900"
          >
            {t('shipmentToggle')}
            <ChevronDown className={`size-5 transition-transform ${showShipment ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          <div id={`${uid}-shipment`} hidden={!showShipment} className="border-t border-line p-5">
            {shipment}
          </div>
        </div>
      )}

      <fieldset className={`flex flex-col gap-5 ${kind === 'quote' ? 'border-t border-line pt-8' : ''}`}>
        <legend className={`${sectionTitle} ${kind === 'quote' ? '' : 'sr-only'}`}>{t('sections.additional')}</legend>
        {field(
          'message',
          kind === 'contact' ? t('fields.messageContact') : t('fields.message'),
          <textarea rows={5} placeholder={t('placeholders.message')} {...inputProps('message')} />,
        )}
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
          <input
            id={id('consent')}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update('consent', e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${id('consent')}-error` : undefined}
            className="mt-0.5 size-5 shrink-0 accent-navy-700"
          />
          <span>
            {t.rich('fields.consent', {
              privacy: (chunks) => (
                <Link href="/privacy" className="font-semibold text-navy-700 underline underline-offset-2">
                  {chunks}
                </Link>
              ),
            })}
            <span className="text-red-700" aria-hidden> *</span>
          </span>
        </label>
        {errors.consent && (
          <p id={`${id('consent')}-error`} className="flex items-center gap-1.5 text-sm text-red-700">
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
            {t('errors.consent')}
          </p>
        )}
      </div>

      {status === 'not_configured' &&
        statusBox('warn', t('status.notConfiguredTitle'), t('status.notConfiguredText', { email: company.emails[0], phone: company.phones[0].display }))}
      {status === 'error' && statusBox('error', t('status.errorTitle'), t('status.errorText'))}
      {status === 'rate_limited' && statusBox('error', t('status.errorTitle'), t('status.rateLimitedText'))}

      <div>
        <button type="submit" className="btn btn-gold w-full sm:w-auto sm:min-w-56" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t('submitting')}
            </>
          ) : (
            <>
              {kind === 'quote' ? t('submitQuote') : t('submit')}
              <Send className="size-4 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
        <p className="sr-only" aria-live="polite">{status === 'submitting' ? t('submitting') : ''}</p>
      </div>
    </form>
  );
}
