// Derives web logo files from the master artwork in Assets/.
// The master SVG contains two lockups stacked vertically; the lower one is the
// full "GLOBAL LOGISTICS PVT LTD" lockup used on the website.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const src = readFileSync(new URL('../Assets/no blur no font change.svg', import.meta.url), 'utf8');
const lines = src.split(/\r?\n/);
const styleStart = lines.findIndex((l) => l.includes('<style>'));
const styleEnd = lines.findIndex((l) => l.includes('</style>'));
const style = lines.slice(styleStart + 1, styleEnd).join('\n');
// Lower lockup starts at the second "SENGOL" wordmark path (y ≈ 285+).
const lowerStart = lines.findIndex((l, i) => i > 40 && l.includes('class="cls-1"') && l.includes('M463.91,343.31'));
const body = lines.slice(lowerStart, lines.length - 1).join('\n');
const markStart = lines.findIndex((l, i) => i > lowerStart && l.trim() === '<g>');
const markEnd = lines.findIndex((l, i) => i > markStart && l.trim() === '</g>');
const mark = lines.slice(markStart, markEnd + 1).join('\n');

const svg = (viewBox, css, content, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img"><title>${title}</title><defs><style>${css}</style></defs>\n${content}\n</svg>\n`;

const white = style
  .replace('#1d3b66', '#ffffff')
  .replace('#1b3f72', '#ffffff')
  .replace('#0f508e', '#8fbdf0')
  .replace('#6c6f74', '#c7d2e0');

mkdirSync(new URL('../public/brand/', import.meta.url), { recursive: true });
const title = 'Sengol Global Logistics Pvt. Ltd.';
writeFileSync(new URL('../public/brand/logo.svg', import.meta.url), svg('0 273 507 136', style, body, title));
writeFileSync(new URL('../public/brand/logo-white.svg', import.meta.url), svg('0 273 507 136', white, body, title));
writeFileSync(new URL('../public/brand/mark.svg', import.meta.url), svg('-2 268 156 130', style, mark, 'Sengol'));
writeFileSync(new URL('../src/app/icon.svg', import.meta.url), svg('-2 268 156 130', style, mark, 'Sengol'));
console.log('logos written');
