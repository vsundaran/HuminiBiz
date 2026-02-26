/**
 * generate-icons.mjs
 * Generates Android + iOS app icons from logo.svg with a gradient background.
 * Gradient: linear-gradient(180deg, #FFFBEA 0%, #F4F4F4 100%)
 *
 * Usage: node generate-icons.mjs
 * Requires: sharp (npm install --save-dev sharp)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── 1. SVG logo source ───────────────────────────────────────────────────────
const SVG_LOGO_PATH = path.join(__dirname, 'src/assets/logo.svg');

// ─── 2. Target sizes ──────────────────────────────────────────────────────────

// Android mipmap sizes  (name: pixel size for square icon)
const ANDROID_SIZES = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

// iOS sizes  { filename: pixelSize }
const IOS_SIZES = {
  'Icon-40.png':    40,   // 20×20 @2x
  'Icon-60.png':    60,   // 20×20 @3x
  'Icon-58.png':    58,   // 29×29 @2x
  'Icon-87.png':    87,   // 29×29 @3x
  'Icon-80.png':    80,   // 40×40 @2x
  'Icon-120a.png':  120,  // 40×40 @3x
  'Icon-120b.png':  120,  // 60×60 @2x (same px, kept for mapping)
  'Icon-180.png':   180,  // 60×60 @3x
  'Icon-1024.png':  1024, // App Store
};

// ─── 3. Helpers ───────────────────────────────────────────────────────────────

/**
 * Build a gradient SVG rectangle of given size.
 * Simulates: linear-gradient(180deg, #FFFBEA 0%, #F4F4F4 29.92%, ...)
 * We blend the two stops across the full height for a smooth look.
 */
function buildGradientSvg(size) {
  return Buffer.from(`
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#FFFBEA"/>
      <stop offset="29.92%" stop-color="#F4F4F4"/>
      <stop offset="100%" stop-color="#F4F4F4"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
</svg>`.trim());
}

/**
 * Generate a single icon PNG:
 *   1. Render gradient background at `size` px
 *   2. Render logo SVG scaled to fit (with padding ~15%)
 *   3. Composite logo over background
 *   4. Save to `outPath`
 *
 * For round icons (Android) we also apply a circular mask.
 */
async function generateIcon(size, outPath, { round = false } = {}) {
  const padding = Math.round(size * 0.28);        // 28% padding — logo sits at ~44% of icon area
  const logoSize = size - padding * 2;

  // --- Render gradient background ---
  const bgPng = await sharp(buildGradientSvg(size))
    .resize(size, size)
    .png()
    .toBuffer();

  // --- Render logo SVG → PNG at target logo size ---
  const rawSvg = fs.readFileSync(SVG_LOGO_PATH);
  const logoPng = await sharp(rawSvg)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // --- Composite logo centered on background ---
  let icon = await sharp(bgPng)
    .composite([{ input: logoPng, gravity: 'center' }])
    .png();

  if (round) {
    // Apply circular mask
    const circleMask = Buffer.from(`
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
</svg>`);
    const circlePng = await sharp(circleMask).resize(size, size).png().toBuffer();
    const iconBuf = await icon.toBuffer();
    icon = sharp(iconBuf).composite([{
      input: circlePng,
      blend: 'dest-in',
    }]);
  }

  await icon.toFile(outPath);
  console.log(`  ✔  ${outPath}`);
}

// ─── 4. Main ──────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(SVG_LOGO_PATH)) {
    throw new Error(`Logo not found at ${SVG_LOGO_PATH}`);
  }

  // ── Android ──────────────────────────────────────────────────────────────
  console.log('\n📱 Generating Android icons…');
  const androidResDir = path.join(__dirname, 'android/app/src/main/res');

  for (const [folder, size] of Object.entries(ANDROID_SIZES)) {
    const dir = path.join(androidResDir, folder);
    fs.mkdirSync(dir, { recursive: true });

    await generateIcon(size, path.join(dir, 'ic_launcher.png'));
    await generateIcon(size, path.join(dir, 'ic_launcher_round.png'), { round: true });
  }

  // ── iOS ──────────────────────────────────────────────────────────────────
  console.log('\n🍎 Generating iOS icons…');
  const iosIconDir = path.join(
    __dirname,
    'ios/HuminiBiz/Images.xcassets/AppIcon.appiconset',
  );
  fs.mkdirSync(iosIconDir, { recursive: true });

  for (const [filename, size] of Object.entries(IOS_SIZES)) {
    const outPath = path.join(iosIconDir, filename);
    await generateIcon(size, outPath);
  }

  // Write Contents.json
  const contentsJson = {
    images: [
      { idiom: 'iphone', scale: '2x', size: '20x20',   filename: 'Icon-40.png'   },
      { idiom: 'iphone', scale: '3x', size: '20x20',   filename: 'Icon-60.png'   },
      { idiom: 'iphone', scale: '2x', size: '29x29',   filename: 'Icon-58.png'   },
      { idiom: 'iphone', scale: '3x', size: '29x29',   filename: 'Icon-87.png'   },
      { idiom: 'iphone', scale: '2x', size: '40x40',   filename: 'Icon-80.png'   },
      { idiom: 'iphone', scale: '3x', size: '40x40',   filename: 'Icon-120a.png' },
      { idiom: 'iphone', scale: '2x', size: '60x60',   filename: 'Icon-120b.png' },
      { idiom: 'iphone', scale: '3x', size: '60x60',   filename: 'Icon-180.png'  },
      { idiom: 'ios-marketing', scale: '1x', size: '1024x1024', filename: 'Icon-1024.png' },
    ],
    info: { author: 'xcode', version: 1 },
  };
  fs.writeFileSync(
    path.join(iosIconDir, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2),
  );
  console.log(`  ✔  Contents.json`);

  console.log('\n✅ All icons generated successfully!\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
