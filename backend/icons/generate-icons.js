// Simple icon generator for RIKA Care PWA
// This creates SVG icons that can be served as placeholders
// For production, replace with professionally designed PNG icons

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const brandColor = '#C4A484';
const textColor = '#FFF9F5';

sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${brandColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#B89474;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad-${size})" rx="${size * 0.22}"/>

  <!-- Leaf icon representing natural beauty -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Stem -->
    <line x1="0" y1="${size * 0.05}" x2="0" y2="${size * -0.2}" stroke="${textColor}" stroke-width="${size * 0.03}" opacity="0.95"/>

    <!-- Left leaf -->
    <path d="M 0,0 Q ${size * -0.15},${size * -0.1} ${size * -0.2},${size * -0.25} Q ${size * -0.12},${size * -0.15} 0,0"
          fill="${textColor}" opacity="0.9"/>

    <!-- Right leaf -->
    <path d="M 0,0 Q ${size * 0.15},${size * -0.1} ${size * 0.2},${size * -0.25} Q ${size * 0.12},${size * -0.15} 0,0"
          fill="${textColor}" opacity="0.9"/>

    <!-- Center leaf -->
    <path d="M 0,0 Q 0,${size * -0.2} 0,${size * -0.35} Q 0,${size * -0.18} 0,0"
          fill="${textColor}" opacity="0.95" stroke="${textColor}" stroke-width="${size * 0.02}"/>
  </g>

  <!-- RIKA text (only show on larger icons) -->
  ${size >= 192 ? `<text x="${size/2}" y="${size * 0.85}" font-family="Arial, sans-serif" font-size="${size * 0.12}" fill="${textColor}" text-anchor="middle" font-weight="bold" opacity="0.95">RIKA</text>` : ''}
</svg>`;

  // Write as both .png and .svg (browsers will serve SVG if PNG doesn't exist)
  fs.writeFileSync(path.join(__dirname, `icon-${size}x${size}.svg`), svg);

  console.log(`✓ Generated icon-${size}x${size}.svg`);
});

console.log('\n✅ All placeholder icons generated!');
console.log('\n📝 Next steps:');
console.log('1. These are SVG placeholders');
console.log('2. For production, create proper PNG icons using:');
console.log('   - https://www.pwabuilder.com/imageGenerator');
console.log('   - OR design in Figma/Photoshop');
console.log('3. Replace the .svg files with .png files');
console.log('\n💡 Tip: Use your brand colors #C4A484 and #FFF9F5');
