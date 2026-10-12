# Sengol Global Logistics — Corporate Website

Multilingual corporate website for **Sengol Global Logistics Pvt. Ltd.**, an India-based freight and logistics partner.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4 and next-intl 4.

- 9 languages with locale URLs: `/en/` (default), `/de/`, `/ko/`, `/fr/`, `/es/`, `/it/`, `/ja/`, `/zh-cn/`, `/ar/` (right-to-left)
- 15 pages per language (135 localized URLs, statically generated), plus a server-rendered localized 404
- Contact and quotation forms with client- and server-side validation, spam protection and honest delivery status

Content sources and items awaiting company confirmation: see [docs/CONTENT-NOTES.md](docs/CONTENT-NOTES.md).

---

## Pages

| Route | Page |
| --- | --- |
| `/[locale]` | Home: hero, India ⇄ world routes, services, why Sengol, network, process, enquiry |
| `/[locale]/about` | Company introduction, approach, logistics ecosystem, operational strengths |
| `/[locale]/services` | Overview of all services |
| `/[locale]/services/[slug]` | `air-freight`, `sea-freight`, `door-to-door`, `customs-clearance`, `warehousing`, `specialist-cargo`, `integrated-logistics` |
| `/[locale]/network` | Partner-network figures, interactive world map, India network map |
| `/[locale]/contact` | Verified contact details + general enquiry form |
| `/[locale]/quote` | Quotation request form (`?mode=air` etc. pre-selects the freight mode) |
| `/[locale]/privacy`, `/[locale]/terms` | Placeholder legal texts, visibly marked for review |
| any unknown URL | Localized 404 (`src/app/global-not-found.tsx`) |

`/` redirects to `/en`, or to the language the visitor explicitly chose earlier (cookie `NEXT_LOCALE`, set only by the language selector). There is no automatic browser-language redirect, so search engines and visitors can always reach the English site.

## Project structure

```
Assets/                     Company profile PDF and master logo artwork (source material)
public/brand/               Web logos generated from Assets/ (npm run build:logos)
public/maps/                Static dotted base maps (npm run generate:map)
scripts/                    Map/logo generators, link checker, translation checker
src/
  app/
    [locale]/               All localized pages, layout, OG image, locale 404
    api/enquiry/route.ts    Form submission endpoint
    global-not-found.tsx    Localized 404 for unmatched URLs
    sitemap.ts, robots.ts
  components/
    layout/                 Header, mobile menu, language selector, footer, 404 content
    network/                World routes map (static + interactive), India map
    services/               Service cards, logistics ecosystem diagram
    forms/                  Enquiry/quote form, language-switch draft hand-over
    ui/                     Page hero, breadcrumbs, section heading, CTA band, stats, FAQ
    seo/                    JSON-LD
  data/                     Verified company facts, service config, network regions, map pins
  i18n/                     Locales, routing, request config, message loader
  lib/                      SEO metadata, structured data, validation, server-only helpers
  messages/                 Translations: en.ts is the source; every other locale is typed against it
  middleware.ts             Locale routing
```

Content, translations, layout and business logic are kept apart: page copy lives only in `src/messages/*.ts`, verified company data in `src/data/site.ts`, and validation rules in `src/lib/enquiry.ts`, which the browser and the API share.

## Local development

Requirements: Node.js 20.9 or newer (developed with Node 24 LTS).

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` | TypeScript (also fails if any locale is missing a key) |
| `npm run lint` | ESLint |
| `npm run check:i18n` | Flags strings left identical to English and placeholder mismatches |
| `npm run check:links` | Crawls a running site (`BASE_URL`, default `http://localhost:3000`) for broken links and missing SEO tags |
| `npm run generate:map` | Regenerates map files after editing `scripts/map-locations.mjs` |
| `npm run build:logos` | Regenerates `public/brand/*` and the favicon from `Assets/no blur no font change.svg` |

## Environment variables

Copy `.env.example` to `.env.local` (development) or set them in your host's dashboard (production). Secrets are only read on the server and never reach the browser.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public base URL for canonical, hreflang, sitemap and Open Graph. Defaults to `https://www.sengolgroup.com`. |
| `RESEND_API_KEY` | For email delivery | API key from [Resend](https://resend.com). |
| `ENQUIRY_FROM_EMAIL` | For email delivery | Verified sender, e.g. `Sengol Website <website@sengolgroup.com>`. The domain must be verified in Resend. |
| `ENQUIRY_TO_EMAIL` | For email delivery | Comma-separated recipients, e.g. `network@sengolgroup.com,bdm@sengolgroup.com`. |
| `ENQUIRY_WEBHOOK_URL` | Optional | HTTPS endpoint (CRM, Zapier, Make, n8n…) that receives `{ type, locale, submittedAt, data }`. |
| `ENQUIRY_WEBHOOK_SECRET` | Optional | Sent as the `X-Webhook-Secret` header. |

### Form delivery behaviour

`POST /api/enquiry` validates again on the server, rejects honeypot or too-fast submissions, rate-limits each IP (8 requests per 10 minutes), then delivers through every configured channel:

- **No channel configured:** responds `503 not_configured`. The form tells the visitor plainly that the enquiry was **not** sent and shows the email address and phone number to use instead. Entries stay in the form.
- **Delivery failed:** `502`. The visitor sees an error, their entries are kept, and the failure is logged on the server.
- **Delivered:** `200`. Only now does the form show the success confirmation.

Email content is HTML-escaped. The visitor's address is used as `Reply-To`. Nothing from the form is stored in the browser. When the visitor switches language mid-form, entries are carried over in memory only.

## Deployment

The site is a standard Next.js app. Most pages are static; the API route and the 404 page need a Node.js runtime.

**Vercel (simplest):** import the repository, set the environment variables above, and deploy. Then point `www.sengolgroup.com` at the project.

**Any Node.js host / VPS:**

```bash
npm ci
```

```bash
npm run build
```

```bash
npm start
```

Put it behind a reverse proxy (Nginx, Caddy) with HTTPS, and keep the process running with a supervisor such as PM2 or systemd.

Production notes:
- The in-memory rate limiter protects a single server instance. On serverless or multi-instance hosting, add a shared limiter (e.g. Upstash Redis) or the host's firewall/WAF rules.
- Photos load from the Unsplash CDN through Next.js image optimisation. To self-host them, download the files listed in `src/data/site.ts`, put them in `public/images/`, and update the URLs there.
- `next-intl/plugin` is deliberately not used; `next.config.ts` registers the same `next-intl/config` alias directly. The plugin eagerly loads a native `@swc/core` binary, used only by its optional message extractor, and that binary failed to load on this Windows machine.

## Adding or editing content

- **Text:** edit `src/messages/en.ts`, then the same key in every other locale file. `npm run typecheck` fails if a key is missing anywhere; `npm run check:i18n` flags strings left in English.
- **A new language:** add the code to `src/i18n/locales.ts` (with label, hreflang, OG locale and direction), create `src/messages/<code>.ts` typed as `Messages`, and register it in `src/i18n/messages.ts`.
- **Contact details / network figures:** `src/data/site.ts` (the single source for phone, email, address and the 550+ / 100+ / 600+ figures).
- **Map markers:** `scripts/map-locations.mjs` + `src/data/network.ts`, then `npm run generate:map`.

## Verification performed (11 Oct 2026)

| Check | Result |
| --- | --- |
| Production build (`next build`) | Passes. 150 static pages + API + localized 404 |
| TypeScript (`tsc --noEmit`) | 0 errors, all 9 locales complete against English |
| ESLint | 0 warnings or errors |
| Translation QA (`check:i18n`) | No untranslated strings; placeholders consistent (reviewed cognates allow-listed) |
| Link and SEO crawl (`check:links`, production build) | 136 URLs, 0 broken. Every page has title, description, canonical, 10 hreflang alternates and exactly one h1 |
| Localized 404 | `/ko/nope`, `/de/services/unknown`, `/xyz` return 404 with server-rendered localized content |
| Language switching | Keeps page and query string, keeps form entries, updates `lang`/`dir`/title, remembered for `/` |
| Forms | Client validation and error summary; server 422 on invalid data; honeypot/timing rejection; 429 rate limit; honest `not_configured` message (no email service configured locally) |
| Responsive overflow (360 px) | No horizontal overflow on all pages tested in en, de, fr, es, it, ko, ja, zh-cn and ar |
| Lighthouse 12, production build, mobile | Performance 86–92; Accessibility, Best Practices and SEO 100 (home, network, de/quote, ar/service, ko/about) |
| Lighthouse 12, desktop | Performance 99–100; Accessibility, Best Practices and SEO 100 |

Lighthouse ran locally against `next start` on the same machine as the server, so the numbers are indicative; re-measure on the production host. Not yet done: a real email/webhook delivery test (needs credentials), tests on physical iOS/Android devices, and a screen-reader walkthrough.
