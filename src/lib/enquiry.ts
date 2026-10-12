/**
 * Enquiry validation shared by the browser (instant feedback) and the API route
 * (authoritative). Error values are codes that map to translated messages.
 */
export const directions = ['import', 'export', 'other'] as const;
export const modes = ['air', 'sea', 'road', 'rail', 'multimodal', 'unsure'] as const;

export type EnquiryKind = 'contact' | 'quote';
export type ErrorCode = 'required' | 'email' | 'phone' | 'phoneCode' | 'tooLong' | 'date' | 'consent';

export type EnquiryValues = {
  name: string;
  company: string;
  email: string;
  phoneCode: string;
  phone: string;
  direction: string;
  origin: string;
  destination: string;
  mode: string;
  cargo: string;
  weight: string;
  date: string;
  message: string;
  consent: boolean;
};

export type EnquiryField = keyof EnquiryValues;
export type EnquiryErrors = Partial<Record<EnquiryField, ErrorCode>>;

export const emptyValues: EnquiryValues = {
  name: '',
  company: '',
  email: '',
  phoneCode: '+91',
  phone: '',
  direction: '',
  origin: '',
  destination: '',
  mode: '',
  cargo: '',
  weight: '',
  date: '',
  message: '',
  consent: false,
};

export const limits: Record<Exclude<EnquiryField, 'consent'>, number> = {
  name: 120,
  company: 160,
  email: 200,
  phoneCode: 5,
  phone: 24,
  direction: 10,
  origin: 160,
  destination: 160,
  mode: 12,
  cargo: 1000,
  weight: 300,
  date: 10,
  message: 3000,
};

export const requiredFields: Record<EnquiryKind, EnquiryField[]> = {
  contact: ['name', 'email', 'message', 'consent'],
  quote: ['name', 'email', 'phoneCode', 'phone','direction', 'origin', 'destination', 'mode', 'cargo', 'consent'],
};

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_CODE = /^\+\d{1,4}$/;
const PHONE = /^[\d\s().-]{5,24}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Normalises unknown input into trimmed strings; ignores unexpected keys. */
export function normalise(input: unknown): EnquiryValues {
  const src = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const out = { ...emptyValues };
  for (const key of Object.keys(emptyValues) as EnquiryField[]) {
    if (key === 'consent') out.consent = src.consent === true;
    else if (typeof src[key] === 'string') out[key] = (src[key] as string).replace(/\u0000/g, '').trim();
    else if (key === 'phoneCode') out.phoneCode = '';
  }
  return out;
}

/**
 * @param minDate earliest acceptable shipment date (YYYY-MM-DD); omit to skip the check.
 */
export function validate(kind: EnquiryKind, v: EnquiryValues, minDate?: string): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const required = requiredFields[kind];

  for (const field of required) {
    if (field === 'consent') {
      if (!v.consent) errors.consent = 'consent';
    } else if (!v[field]) errors[field] = 'required';
  }

  for (const [field, max] of Object.entries(limits) as [Exclude<EnquiryField, 'consent'>, number][]) {
    if (!errors[field] && v[field].length > max) errors[field] = 'tooLong';
  }

  if (v.email && !errors.email && !EMAIL.test(v.email)) errors.email = 'email';

  if (v.phone && !errors.phone) {
    const digits = v.phone.replace(/\D/g, '').length;
    if (!PHONE.test(v.phone) || digits < 5 || digits > 15) errors.phone = 'phone';
  }
  if ((v.phone || required.includes('phone')) && !PHONE_CODE.test(v.phoneCode)) errors.phoneCode = 'phoneCode';

  if (v.direction && !(directions as readonly string[]).includes(v.direction)) errors.direction = 'required';
  if (v.mode && !(modes as readonly string[]).includes(v.mode)) errors.mode = 'required';

  if (v.date && !errors.date) {
    if (!DATE.test(v.date) || Number.isNaN(Date.parse(v.date))) errors.date = 'date';
    else if (minDate && v.date < minDate) errors.date = 'date';
  }
  return errors;
}

/** Local calendar date as YYYY-MM-DD, optionally shifted by whole days. */
export function isoDate(date = new Date(), offsetDays = 0) {
  const d = new Date(date);
  d.setDate(d.getDate() + offsetDays);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}
