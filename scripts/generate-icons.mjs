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

// Brand colours (mirror lib/globals.css and Tailwind palette)
const TEAL_400 = "#2dd4bf"; // top of background gradient
const TEAL_700 = "#0f766e"; // bottom of background gradient
const AMBER = "#fcd34d"; // accent — small rising "sun"
const WHITE = "#ffffff";

// Master SVG — a refined H mark on a gradient teal disc with a small
// amber sun accent in the top-right corner.  Designed to read cleanly
// at 16×16 (the H is the dominant element) while gaining depth and
// character at app-icon sizes (gradient + sun become visible).
function brandSvg({ size = 512, rounded = true, padding = 0 }) {
  const r = rounded ? Math.round(size * 0.22) : 0;
  const inner = size - padding * 2;
  const s = inner / 512; // scale factor based on 512 baseline
  const off = padding;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="herd-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${TEAL_400}"/>
      <stop offset="100%" stop-color="${TEAL_700}"/>
    </linearGradient>
    <linearGradient id="herd-highlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${WHITE}" stop-opacity="0.18"/>
      <stop offset="40%" stop-color="${WHITE}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="herd-sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${AMBER}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${AMBER}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background: rounded square with vertical teal gradient -->
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#herd-bg)"/>

  <!-- Subtle top highlight for an embossed-coin feel -->
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#herd-highlight)"/>

  <g transform="translate(${off} ${off}) scale(${s})">
    <!-- Soft amber sun accent in the top-right corner -->
    <circle cx="408" cy="104" r="80" fill="url(#herd-sun)"/>

    <!-- Refined H letterform -->
    <g fill="${WHITE}">
      <!-- left leg -->
      <rect x="156" y="112" width="56" height="288" rx="6"/>
      <!-- right leg -->
      <rect x="300" y="112" width="56" height="288" rx="6"/>
      <!-- crossbar (centred) -->
      <rect x="156" y="226" width="200" height="60" rx="6"/>
    </g>
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
