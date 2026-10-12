// Pre-computes the dotted world map and India map used by the network
// visualisation. Run with `npm run generate:map` after changing locations.
// Output:
//   public/maps/world-dots.svg, public/maps/india-dots.svg  (static, cacheable base maps)
//   src/data/map-geometry.json                              (dimensions + marker positions)
import { mkdirSync, writeFileSync } from 'node:fs';
import DottedMap from 'dotted-map';
import { locations } from './map-locations.mjs';

const round = (n) => Math.round(n * 100) / 100;

function build({ countries, height, grid = 'diagonal', projection, region }) {
  const map = new DottedMap({ height, grid, countries, projection, region });
  const points = map.getPoints();
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return { map, points, width: Math.ceil(Math.max(...xs)) + 1, height: Math.ceil(Math.max(...ys)) + 1 };
}

function pin(map, { lat, lng }) {
  const p = map.getPin({ lat, lng });
  return p ? { x: round(p.x), y: round(p.y) } : null;
}

/** Many dots as one compact path (circle drawn with two arcs). */
function dotsPath(dots, r) {
  const d = r * 2;
  return dots.map(([x, y]) => `M${round(x - r)} ${y}a${r} ${r} 0 1 0 ${d} 0a${r} ${r} 0 1 0 -${d} 0`).join('');
}

function svg(viewBox, layers) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${layers
    .map(({ d, fill }) => `<path fill="${fill}" d="${d}"/>`)
    .join('')}</svg>\n`;
}

// World map (Robinson reads well for trade-route storytelling)
const projection = { name: 'robinson' };
// An explicit region keeps the India-only grid aligned with the world grid.
const region = { lat: { min: -56, max: 80 }, lng: { min: -180, max: 180 } };
const world = build({ height: 64, projection, region });
const indiaKeys = new Set(
  build({ height: 64, projection, region, countries: ['IND'] }).points.map((p) => `${round(p.x)}:${round(p.y)}`),
);
const worldDots = world.points.map((p) => [round(p.x), round(p.y)]);
const isIndia = ([x, y]) => indiaKeys.has(`${x}:${y}`);

const worldPins = {};
for (const [id, loc] of Object.entries({ ...locations.hub, ...locations.markets, ...locations.regions })) {
  worldPins[id] = pin(world.map, loc);
}

// India detail map
const india = build({ height: 46, countries: ['IND'], grid: 'vertical' });
const indiaPins = {};
for (const [id, loc] of Object.entries(locations.india)) indiaPins[id] = pin(india.map, loc);

mkdirSync(new URL('../public/maps/', import.meta.url), { recursive: true });
writeFileSync(
  new URL('../public/maps/world-dots.svg', import.meta.url),
  svg(`0 0 ${world.width} ${world.height}`, [
    { d: dotsPath(worldDots.filter((p) => !isIndia(p)), 0.36), fill: 'rgba(255,255,255,0.22)' },
    { d: dotsPath(worldDots.filter(isIndia), 0.42), fill: '#f2b416' },
  ]),
);
writeFileSync(
  new URL('../public/maps/india-dots.svg', import.meta.url),
  svg(`-1 -1 ${india.width + 2} ${india.height + 2}`, [
    { d: dotsPath(india.points.map((p) => [round(p.x), round(p.y)]), 0.36), fill: '#c3d3ea' },
  ]),
);

const out = {
  world: { width: world.width, height: world.height, pins: worldPins },
  india: { width: india.width, height: india.height, pins: indiaPins },
};
writeFileSync(new URL('../src/data/map-geometry.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(`world dots: ${worldDots.length} (india ${worldDots.filter(isIndia).length}), india dots: ${india.points.length}`);
console.log('missing pins:', Object.entries({ ...worldPins, ...indiaPins }).filter(([, v]) => !v).map(([k]) => k));
