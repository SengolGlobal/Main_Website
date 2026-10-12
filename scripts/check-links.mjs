// Crawls the running site and reports broken internal links and pages missing
// SEO essentials (title, description, canonical, hreflang, single h1).
// Usage: npm run build && npm start, then in another terminal:
//   npm run check:links            (defaults to http://localhost:3000)
//   BASE_URL=http://localhost:3001 npm run check:links
const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const locales = ['en', 'de', 'ko', 'fr', 'es', 'it', 'ja', 'zh-cn', 'ar'];

const queue = locales.map((l) => `/${l}`);
const seen = new Set();
const broken = [];
const seoIssues = [];

const attr = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  let res;
  try {
    res = await fetch(base + path, { redirect: 'follow' });
  } catch (e) {
    broken.push(`${path} -> ${e.message}`);
    continue;
  }
  if (!res.ok) {
    broken.push(`${path} -> ${res.status}`);
    continue;
  }
  if (!(res.headers.get('content-type') || '').includes('text/html')) continue;
  const html = await res.text();

  const checks = {
    title: /<title>[^<]+<\/title>/.test(html),
    description: /<meta name="description" content="[^"]+"/.test(html),
    canonical: /<link rel="canonical"/.test(html),
    hreflang: (html.match(/<link rel="alternate" hrefLang="/gi) || []).length >= locales.length + 1,
    singleH1: (html.match(/<h1[\s>]/g) || []).length === 1,
  };
  const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
  if (failed.length) seoIssues.push(`${path}: missing/invalid ${failed.join(', ')}`);

  for (const href of attr(html, /href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    if (href.startsWith('/_next') || href.startsWith('/brand') || href.startsWith('//')) continue;
    if (!seen.has(href)) queue.push(href);
  }
}

console.log(`Checked ${seen.size} internal URLs on ${base}`);
if (broken.length) console.log(`\nBroken (${broken.length}):\n  ${broken.join('\n  ')}`);
if (seoIssues.length) console.log(`\nSEO issues (${seoIssues.length}):\n  ${seoIssues.join('\n  ')}`);
if (!broken.length && !seoIssues.length) console.log('No broken links; every page has title, description, canonical, hreflang and one h1.');
process.exit(broken.length ? 1 : 0);
