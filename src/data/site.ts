/** Verified company facts from the company profile presentation (Assets/). */
export const company = {
  legalName: 'Sengol Global Logistics Pvt. Ltd.',
  website: 'https://www.sengolgroup.com',
  websiteLabel: 'www.sengolgroup.com',
  phones: [
    { display: '+91 8448336307', href: 'tel:+918448336307' },
    { display: '+91 9540603266', href: 'tel:+919540603266' },
  ],
  emails: ['network@sengolgroup.com', 'bdm@sengolgroup.com'],
  address: {
    street: '4F-CS-27, 4th Floor, Ansal Plaza Mall, Vaishali, Sector 1',
    locality: 'Ghaziabad',
    region: 'Uttar Pradesh',
    postalCode: '201010',
    country: 'IN',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Ansal+Plaza+Mall+Vaishali+Sector+1+Ghaziabad+201010',
  network: { forwarders: 550, countries: 100, cities: 600 },
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || company.website).replace(/\/$/, '');

/** Unsplash-licensed photography (https://unsplash.com/license). */
export const photos = {
  hero: 'https://images.unsplash.com/photo-1585713181935-d5f622cc2415',
  port: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec',
  ship: 'https://images.unsplash.com/photo-1605745341112-85968b19335b',
  air: 'https://images.unsplash.com/photo-1571086291540-b137111fa1c7',
  road: 'https://images.unsplash.com/photo-1766785368863-f2188a8c8b32',
  rail: 'https://images.unsplash.com/photo-1761208986981-f3fad9aa4514',
  warehouse: 'https://images.unsplash.com/photo-1553413077-190dd305871c',
  terminal: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738',
  forklift: 'https://images.unsplash.com/photo-1645736315000-6f788915923b',
  aerialShip: 'https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e',
  cranes: 'https://images.unsplash.com/photo-1598203637341-69d7580a1507',
  containers: 'https://images.unsplash.com/photo-1494961104209-3c223057bd26',
} as const;
