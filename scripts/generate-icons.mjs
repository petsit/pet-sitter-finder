// One-shot script: generates all the app icons we need from a single
// SVG source. Run via `node scripts/generate-icons.mjs` whenever the
// brand mark changes. Output goes to app/ (handled by Next.js
// conventions) and public/ (referenced from app/manifest.json).

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Brand colours (mirror lib/globals.css)
const BRAND = "#0d9488"; // teal-600
const WHITE = "#ffffff";

// Master SVG — teal rounded square + balanced 4-toe paw print in white.
// Designed to look clean at 16px and impressive at 512px.
function brandSvg({ size = 512, rounded = true, padding = 0 }) {
  const r = rounded ? Math.round(size * 0.22) : 0;
  const inner = size - padding * 2;
  const s = inner / 512; // scale factor for the paw based on 512 baseline
  const off = padding;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${BRAND}"/>
  <g transform="translate(${off} ${off}) scale(${s})" fill="${WHITE}">
    <!-- four toes -->
    <ellipse cx="172" cy="216" rx="36" ry="48"/>
    <ellipse cx="216" cy="156" rx="40" ry="52"/>
    <ellipse cx="296" cy="156" rx="40" ry="52"/>
    <ellipse cx="340" cy="216" rx="36" ry="48"/>
    <!-- main pad -->
    <path d="M256 264c-58 0-100 36-100 80s40 80 100 80 100-36 100-80-42-80-100-80z"/>
  </g>
</svg>`;
}

async function writePng(svg, outPath, size) {
  const buf = await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toBuffer();
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, buf);
  console.log(`✓ ${path.relative(root, outPath)} (${size}×${size})`);
}

async function writeSvg(svg, outPath) {
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, svg);
  console.log(`✓ ${path.relative(root, outPath)} (SVG)`);
}

// ---- generate ----
// Favicon as SVG goes into app/ (Next.js auto-wires it as the favicon)
const masterSvg = brandSvg({ size: 512, rounded: true });
await writeSvg(brandSvg({ size: 64, rounded: true }), path.join(root, "app", "icon.svg"));

// Apple touch icon (180×180 PNG) goes into app/ for iOS home-screen icons
await writePng(masterSvg, path.join(root, "app", "apple-icon.png"), 180);

// PWA manifest icons go into public/ and are referenced from manifest.json
await writePng(masterSvg, path.join(root, "public", "icon-192.png"), 192);
await writePng(masterSvg, path.join(root, "public", "icon-512.png"), 512);

// Maskable icon: same artwork but with safe-zone padding so Android can
// crop into different shapes (circle, squircle, etc.) without losing the
// paw. PWA spec recommends 80% safe zone — we pad 10% on each side.
const maskableSvg = brandSvg({ size: 512, rounded: false, padding: 51 });
await writePng(maskableSvg, path.join(root, "public", "icon-512-maskable.png"), 512);

console.log("\nAll icons generated.");
