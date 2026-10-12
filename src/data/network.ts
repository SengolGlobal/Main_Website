import geometry from './map-geometry.json';

/** Regions and example markets listed in the company profile. */
export const regions = [
  { id: 'north-america', pin: 'r-north-america', markets: ['usa', 'canada', 'mexico'] },
  { id: 'middle-east', pin: 'r-middle-east', markets: ['uae', 'egypt', 'turkey', 'oman'] },
  {
    id: 'asia',
    pin: 'r-asia',
    markets: ['bangladesh', 'sri-lanka', 'china', 'vietnam', 'thailand', 'malaysia', 'indonesia', 'philippines', 'taiwan', 'japan', 'south-korea'],
  },
  { id: 'oceania', pin: 'r-oceania', markets: ['australia', 'new-zealand'] },
  { id: 'europe', pin: 'r-europe', markets: ['london', 'germany', 'italy', 'croatia', 'lithuania', 'poland', 'spain'] },
] as const;

export type RegionId = (typeof regions)[number]['id'];
export type MarketId = (typeof regions)[number]['markets'][number];

export const indiaCities = [
  'chennai',
  'mumbai',
  'navi-mumbai',
  'mundra',
  'delhi',
  'ahmedabad',
  'tuticorin',
  'bengaluru',
  'cochin',
  'visakhapatnam',
  'kolkata',
  'hyderabad',
] as const;

export type IndiaCity = (typeof indiaCities)[number];

type Point = { x: number; y: number };

/** Marker positions; the dotted base maps are static files in public/maps/. */
export const worldMap = geometry.world as { width: number; height: number; pins: Record<string, Point> };
export const indiaMap = geometry.india as { width: number; height: number; pins: Record<IndiaCity, Point> };

/** Quadratic arc between two points, bowed upward for a trade-route look. */
export function arcPath(from: Point, to: Point, bend = 0.28) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  // Normal pointing "up" the map
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const cx = mx + nx * dist * bend;
  const cy = my + ny * dist * bend;
  return `M${from.x} ${from.y}Q${cx.toFixed(2)} ${cy.toFixed(2)} ${to.x} ${to.y}`;
}
