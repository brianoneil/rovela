/**
 * Builds every Rovela app icon asset from the approved "Sunrise Ridge, Day Tracks" concept (C2).
 *
 * Source: design/icon/round1/7-sunrise-ridge.svg (Recraft vector output, 2048 × 2048). Its five
 * shapes, in document order, are:
 *   0. background square (ground)
 *   1. sun (accent), already cut away below the ridge
 *   2. ridge route line, including a solid disk at the start ring
 *   3. small ground-colored disk that hollows out the start ring
 *   4. end dot
 * C2 keeps that artwork exactly and only recolors the route (shapes 2 and 4) with the five day
 * colors as equal, hard-edged segments running left to right in trip-day order.
 *
 * Colors are read from src/theme/tokens.ts so nothing here is hand-picked.
 *
 * Run: cd design/icon/tools && npm install && npm run build
 */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, crc32 } from 'node:zlib';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const out = (...p) => join(root, ...p);

// ---------- tokens ----------
const tokensSrc = readFileSync(out('src/theme/tokens.ts'), 'utf8');
const token = (name) => {
  const m = tokensSrc.match(new RegExp(`${name}: '(#[0-9A-Fa-f]{6})'`));
  if (!m) throw new Error(`Token "${name}" not found in src/theme/tokens.ts`);
  return m[1];
};
const dayColorsMatch = tokensSrc.match(/dayColors = \[([^\]]+)\]/);
if (!dayColorsMatch) throw new Error('dayColors not found in src/theme/tokens.ts');
const dayColors = [...dayColorsMatch[1].matchAll(/'(#[0-9A-Fa-f]{6})'/g)].map((m) => m[1]);
if (dayColors.length !== 5) throw new Error(`Expected 5 day colors, found ${dayColors.length}`);
const ground = token('ground');
const accent = token('accent');

// ---------- source shapes ----------
const source = readFileSync(join(here, '../round1/7-sunrise-ridge.svg'), 'utf8');
const d = [...source.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
if (d.length !== 5) throw new Error(`Expected 5 paths in source SVG, found ${d.length}`);
const [, sunD, lineD, holeD, dotD] = d;

const CANVAS = 2048;

// Horizontal extent of the route (start ring's left edge to the end dot's right edge). The
// hard-stop gradient splits exactly this span into five equal day segments.
const xs = (path) => [...path.matchAll(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g)].map((m) => +m[1]);
const routeX0 = Math.min(...xs(lineD));
const routeX1 = Math.max(...xs(dotD));

// Bounding box of the whole mark (sun + route), used to center it for Android and the splash.
const ysOf = (path) => [...path.matchAll(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g)].map((m) => +m[2]);
const markY0 = Math.min(...ysOf(sunD));
const markY1 = Math.max(...ysOf(lineD), ...ysOf(dotD));
const markCx = (routeX0 + routeX1) / 2;
const markCy = (markY0 + markY1) / 2;

const dayGradient = () => {
  const span = routeX1 - routeX0;
  const stops = dayColors
    .map((c, i) => {
      const a = ((i * span) / 5 / span).toFixed(4);
      const b = (((i + 1) * span) / 5 / span).toFixed(4);
      return `<stop offset="${a}" stop-color="${c}"/><stop offset="${b}" stop-color="${c}"/>`;
    })
    .join('');
  return `<linearGradient id="day" gradientUnits="userSpaceOnUse" x1="${routeX0}" y1="0" x2="${routeX1}" y2="0">${stops}</linearGradient>`;
};

// The route line and hole disk combined with even-odd fill leave the start ring truly hollow,
// so it stays transparent on layered and monochrome icons.
const routeShapes = (fill) =>
  `<path fill-rule="evenodd" fill="${fill}" d="${lineD} ${holeD}"/><path fill="${fill}" d="${dotD}"/>`;

// Recraft's sun shape also contains an amber copy of the whole route (it sat hidden under the
// white line). Masking the route area out of it leaves only the sun, so no amber shows through
// the hollow start ring or fringes the day-colored segments.
// Single-color artwork (monochrome) only needs the start ring hollowed; masking the whole route
// there would leave an anti-aliased seam where two same-color shapes meet.
const maskOf = (id, paths) =>
  `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${CANVAS}" height="${CANVAS}"><rect width="${CANVAS}" height="${CANVAS}" fill="#fff"/>${paths.map((p) => `<path fill="#000" d="${p}"/>`).join('')}</mask>`;
const sunMask = maskOf('noRoute', [lineD, dotD]) + maskOf('noHole', [holeD]);
const sunShape = (fill, mask = 'noRoute') => `<path fill="${fill}" mask="url(#${mask})" d="${sunD}"/>`;

const svg = (body, { size = CANVAS, defs = '' } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${CANVAS} ${CANVAS}">` +
  `<defs>${sunMask}${defs}</defs>` +
  body +
  `</svg>`;

/** Scales the mark about its own center and places that center in the middle of the canvas. */
const centered = (body, scale) =>
  `<g transform="translate(${CANVAS / 2} ${CANVAS / 2}) scale(${scale}) translate(${-markCx} ${-markCy})">${body}</g>`;

const fullMark = sunShape(accent) + routeShapes('url(#day)');
const fullIcon = (extra = '') =>
  svg(`<rect width="${CANVAS}" height="${CANVAS}" fill="${ground}"${extra}/>` + fullMark, {
    defs: dayGradient(),
  });

// ---------- rendering ----------
const render = (svgText, px) =>
  new Resvg(svgText, { fitTo: { mode: 'width', value: px } }).render();

const writeRgba = (file, svgText, px) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(svgText, px).asPng());
};

/**
 * App Store Connect and Google Play reject icons with an alpha channel, so opaque store icons are
 * re-encoded as 8-bit RGB PNGs (color type 2) from the rendered RGBA pixels.
 */
const writeRgb = (file, svgText, px) => {
  const img = render(svgText, px);
  const { width, height, pixels } = img;
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * 4;
      const t = y * (width * 3 + 1) + 1 + x * 3;
      raw[t] = pixels[s];
      raw[t + 1] = pixels[s + 1];
      raw[t + 2] = pixels[s + 2];
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, png);
};

// ---------- master ----------
writeFileSync(join(here, '../rovela-icon-master.svg'), fullIcon());

// ---------- universal / store ----------
writeRgb(out('assets/images/icon.png'), fullIcon(), 1024);
writeRgb(join(here, '../store/app-store-icon-1024.png'), fullIcon(), 1024);
writeRgb(join(here, '../store/play-store-icon-512.png'), fullIcon(), 512);

// ---------- iOS: Icon Composer bundle ----------
// Two layers on a solid ground fill so iOS can apply Liquid Glass depth and derive the dark and
// tinted appearances. Layer SVGs keep the source canvas (1024 pt), so artwork position is exact.
const iconDir = out('assets/rovela.icon');
rmSync(iconDir, { recursive: true, force: true });
mkdirSync(join(iconDir, 'Assets'), { recursive: true });
writeFileSync(
  join(iconDir, 'Assets/route.svg'),
  svg(routeShapes('url(#day)'), { size: 1024, defs: dayGradient() }),
);
writeFileSync(join(iconDir, 'Assets/sun.svg'), svg(sunShape(accent), { size: 1024 }));
const srgb = (hex) =>
  'srgb:' +
  [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(5)).join(',') +
  ',1.00000';
writeFileSync(
  join(iconDir, 'icon.json'),
  JSON.stringify(
    {
      fill: { solid: srgb(ground) },
      groups: [
        {
          layers: [{ 'image-name': 'route.svg', name: 'route' }],
          shadow: { kind: 'neutral', opacity: 0.5 },
          translucency: { enabled: false, value: 0 },
        },
        {
          layers: [{ 'image-name': 'sun.svg', name: 'sun' }],
          shadow: { kind: 'neutral', opacity: 0.5 },
          translucency: { enabled: false, value: 0 },
        },
      ],
      'supported-platforms': { squares: 'shared' },
    },
    null,
    2,
  ) + '\n',
);

// ---------- Android adaptive icon ----------
// Launchers mask the 108 dp layer down to as little as a 66 dp circle, so the mark is scaled until
// its farthest point (the end dot) sits inside that safe circle.
const safeRadius = (CANVAS * (66 / 108)) / 2;
const farthest = Math.max(
  Math.hypot(routeX0 - markCx, markY1 - markCy),
  Math.hypot(routeX1 - markCx, markY1 - markCy),
  Math.hypot(0, markY0 - markCy),
);
const androidScale = safeRadius / farthest;
writeRgba(
  out('assets/images/android-icon-foreground.png'),
  svg(centered(fullMark, androidScale), { defs: dayGradient() }),
  1024,
);
writeRgba(
  out('assets/images/android-icon-background.png'),
  svg(`<rect width="${CANVAS}" height="${CANVAS}" fill="${ground}"/>`),
  1024,
);
writeRgba(
  out('assets/images/android-icon-monochrome.png'),
  svg(centered(sunShape('#FFFFFF', 'noHole') + routeShapes('#FFFFFF'), androidScale)),
  1024,
);

// ---------- splash + favicon ----------
writeRgba(
  out('assets/images/splash-icon.png'),
  svg(centered(fullMark, CANVAS / (routeX1 - routeX0)), { defs: dayGradient() }),
  1024,
);
writeRgba(out('assets/images/favicon.png'), fullIcon(` rx="${CANVAS * 0.2237}"`), 48);
writeFileSync(out('site/public/favicon.svg'), fullIcon(` rx="${CANVAS * 0.2237}"`) + '\n');

console.log(
  `Built icons. Route span ${routeX0.toFixed(1)}–${routeX1.toFixed(1)}, Android scale ${androidScale.toFixed(3)}.`,
);
