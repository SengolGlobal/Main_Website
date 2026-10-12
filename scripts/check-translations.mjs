// Translation QA: reports strings that are identical to English (possible
// untranslated fragments) and ICU placeholders that differ from English.
// Usage: npm run check:i18n
import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';

const dir = new URL('../src/messages/', import.meta.url);

async function load(file) {
  const source = readFileSync(new URL(file, dir), 'utf8').replace(/^import .*$/gm, '');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
  return (await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)).default;
}

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

// Strings that are legitimately the same in every language.
const allowed = [
  /^meta\.(siteName|titleSuffix)$/,
  /^contactInfo\.companyName$/,
  /^contactInfo\.addressLines\.[01]$/,
  /^common\.tagline$/,
  /^network\.india\.cities\./,
  /^network\.countries\./,
  /^network\.regions\.asia$/,
];

// Reviewed cognates: identical to English but correct in that language.
const cognates = {
  'de.ts': ['contactInfo.websiteLabel', 'services.warehousing.steps.3.title'],
  'es.ts': ['contactInfo.addressLines.2', 'network.map.india', 'notFound.eyebrow'],
  'fr.ts': [
    'nav.services', 'nav.contact', 'servicesPage.hero.eyebrow', 'services.warehousing.steps.3.title',
    'services.specialist-cargo.steps.2.title', 'network.regions.europe', 'contact.hero.eyebrow',
    'form.fields.destination', 'form.options.mode.rail', 'legal.privacy.sections.6.heading', 'footer.services',
  ],
  'it.ts': ['nav.home', 'contactInfo.addressLines.2', 'network.map.india'],
};

const placeholders =(s) => [...String(s).matchAll(/\{(\w+)\}|<(\w+)>/g)].map((m) => m[1] || m[2]).sort().join(',');

const en = flatten(await load('en.ts'));
let problems = 0;
for (const file of readdirSync(dir).filter((f) => /^[a-z-]+\.ts$/.test(f) && !['en.ts', 'types.ts'].includes(f))) {
  const loc = flatten(await load(file));
  const same = Object.keys(en).filter(
    (k) => loc[k] === en[k] && !allowed.some((re) => re.test(k)) && !(cognates[file] ?? []).includes(k) && /[a-z]{3}/i.test(en[k]),
  );
  const missing = Object.keys(en).filter((k) => !(k in loc));
  const badPh = Object.keys(en).filter((k) => k in loc && placeholders(en[k]) !== placeholders(loc[k]));
  if (same.length || missing.length || badPh.length) {
    console.log(`\n${file}`);
    same.forEach((k) => console.log(`  same as English: ${k} = ${JSON.stringify(en[k]).slice(0, 80)}`));
    missing.forEach((k) => console.log(`  missing: ${k}`));
    badPh.forEach((k) => console.log(`  placeholder mismatch: ${k}`));
    problems += same.length + missing.length + badPh.length;
  }
}
console.log(problems ? `\n${problems} item(s) to review.` : 'All locales translated; placeholders consistent.');
