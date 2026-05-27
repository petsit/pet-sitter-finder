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

// Master SVG — teal rounded square + a bold "H" letterform in white.
// H = Helpers, Equine, Rural, Directory.  A single-letter mark stays
// legible at favicon size and gives the brand a confident, corporate
// feel (think Hilton/Hyatt-style letter marks).
function brandSvg({ size = 512, rounded = true, padding = 0 }) {
  const r = rounded ? Math.round(size * 0.22) : 0;
  const inner = size - padding * 2;
  const s = inner / 512; // scale based on 512 baseline
  const off = padding;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${BRAND}"/>
  <g transform="translate(${off} ${off}) scale(${s})" fill="${WHITE}">
    <!-- left leg -->
    <rect x="148" y="116" width="64" height="280" rx="10"/>
    <!-- right leg -->
    <rect x="300" y="116" width="64" height="280" rx="10"/>
    <!-- crossbar -->
    <rect x="148" y="224" width="216" height="64" rx="10"/>
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
const masterSvg = brandSvg({ size: 512, rounded: true });
await writeSvg(brandSvg({ size: 64, rounded: true }), path.join(root, "app", "icon.svg"));
await writePng(masterSvg, path.join(root, "app", "apple-icon.png"), 180);
await writePng(masterSvg, path.join(root, "public", "icon-192.png"), 192);
await writePng(masterSvg, path.join(root, "public", "icon-512.png"), 512);
const maskableSvg = brandSvg({ size: 512, rounded: false, padding: 51 });
await writePng(maskableSvg, path.join(root, "public", "icon-512-maskable.png"), 512);

console.log("\nAll icons generated.");
