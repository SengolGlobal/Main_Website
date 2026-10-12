import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { locales } from '@/i18n/locales';

export const alt = 'Sengol Global Logistics Pvt. Ltd.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Language-neutral social card (brand + company-provided network figures).
export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/brand/logo-white.svg'), 'utf8');
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`;
  const stats = [
    ['550+', 'Verified freight forwarders'],
    ['100+', 'Countries covered'],
    ['600+', 'Cities reached'],
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #061528 0%, #0f2e55 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={520} height={140} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1 }}>Connecting India to the world.</div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.1, color: '#f2b416' }}>Freight · Customs · Inland logistics</div>
        </div>
        <div style={{ display: 'flex', gap: 56, borderTop: '2px solid rgba(255,255,255,0.15)', paddingTop: 28 }}>
          {stats.map(([value, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 44, fontWeight: 700, color: '#f2b416' }}>{value}</div>
              <div style={{ fontSize: 22, color: '#c3d3ea' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
