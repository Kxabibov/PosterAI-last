const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Fonts and custom variants
css = css.replace(
  /@import url\('.*?'\);/,
  `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');`
);
css = css.replace(
  /"Syne", sans-serif;/,
  `"Orbitron", sans-serif;`
);

// Add custom variant for Tailwind v4 to support class-based dark mode
if (!css.includes('@custom-variant dark')) {
  css = css.replace(/@theme \{[\s\S]*?\}/, match => match + '\n@custom-variant dark (&:is(.dark *));');
}

// 2. Remove .bg-area and .bg-circles
css = css.replace(/\/\* ═══════════════════════════════════════════\s*Floating shapes background\s*═══════════════════════════════════════════ \*\/\s*\.bg-area \{[\s\S]*?\.bg-circles li:nth-child\(even\) \{[\s\S]*?\}/, '');

// 3. Update CSS variables for dark mode support in custom classes
if (!css.includes('--glow-bg')) {
  css = css.replace(
    /:root \{[\s\S]*?\}/,
    `:root {
  --bg: #f4f7fa;
  --text: #1a2030;
  --muted: #6b7a8d;
  --accent: #4fc3f7;
  --accent2: #dde3ea;
  
  /* Glassmorphism Light Variables */
  --glow-bg: rgba(255, 255, 255, 0.5);
  --glow-bg-sm: rgba(255, 255, 255, 0.55);
  --glow-border: rgba(255, 255, 255, 0.7);
  --glow-border-sm: rgba(255, 255, 255, 0.6);
  --btn-glossy-bg: rgba(255, 255, 255, 0.35);
  --btn-glossy-border: rgba(255, 255, 255, 0.5);
}

:root.dark {
  --bg: #0d1520;
  --text: #ffffff;
  --muted: #a1a1aa;
  --accent: #4fc3f7;
  --accent2: #1a2736;
  
  /* Glassmorphism Dark Variables */
  --glow-bg: rgba(20, 25, 35, 0.5);
  --glow-bg-sm: rgba(20, 25, 35, 0.6);
  --glow-border: rgba(255, 255, 255, 0.15);
  --glow-border-sm: rgba(255, 255, 255, 0.1);
  --btn-glossy-bg: rgba(255, 255, 255, 0.1);
  --btn-glossy-border: rgba(255, 255, 255, 0.15);
}`
  );

  // Replace hardcoded rgba in glow-box
  css = css.replace(/\.glow-box \{[\s\S]*?background: rgba\(255,255,255,0\.5\);[\s\S]*?border: 1\.5px solid rgba\(255,255,255,0\.7\);/g, match => {
    return match.replace('rgba(255,255,255,0.5)', 'var(--glow-bg)').replace('rgba(255,255,255,0.7)', 'var(--glow-border)');
  });
  
  css = css.replace(/\.glow-box-sm \{[\s\S]*?background: rgba\(255,255,255,0\.55\);[\s\S]*?border: 1px solid rgba\(255,255,255,0\.6\);/g, match => {
    return match.replace('rgba(255,255,255,0.55)', 'var(--glow-bg-sm)').replace('rgba(255,255,255,0.6)', 'var(--glow-border-sm)');
  });

  css = css.replace(/\.btn-glossy \{[\s\S]*?background: rgba\(255,255,255,0\.35\);[\s\S]*?border: 1\.5px solid rgba\(255,255,255,0\.5\);/g, match => {
    return match.replace('rgba(255,255,255,0.35)', 'var(--btn-glossy-bg)').replace('rgba(255,255,255,0.5)', 'var(--btn-glossy-border)');
  });
  
  // Pricing card and other specific blocks that need dark adaptation
  css = css.replace(/\.pricing-card \{[\s\S]*?background: rgba\(255,255,255,0\.06\);[\s\S]*?border: 1px solid rgba\(255,255,255,0\.1\);/, match => {
     return match.replace('rgba(255,255,255,0.06)', 'var(--glow-bg-sm)').replace('rgba(255,255,255,0.1)', 'var(--glow-border-sm)');
  });
}

// Replace all remaining Syne fonts with Orbitron
css = css.replace(/"Syne"/g, '"Orbitron"');

fs.writeFileSync(cssPath, css);
console.log('index.css updated successfully.');
