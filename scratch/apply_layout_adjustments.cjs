const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

const appPath = path.join(__dirname, '../src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

function replaceCSS(desc, target, replacement) {
  if (!css.includes(target)) {
    console.error(`ERROR: target not found in index.css for: ${desc}`);
    process.exit(1);
  }
  css = css.replace(target, replacement);
  console.log(`SUCCESS: ${desc}`);
}

function replaceApp(desc, target, replacement) {
  if (!app.includes(target)) {
    console.error(`ERROR: target not found in App.tsx for: ${desc}`);
    process.exit(1);
  }
  app = app.replace(target, replacement);
  console.log(`SUCCESS: ${desc}`);
}

// =========================================================================
// 1. UPDATE App.tsx
// =========================================================================

// Fixed mobile dropdown menu position: make it fixed instead of absolute
const fixedMenuTarget = `            className="absolute top-16 right-4 z-[200] w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#dde3ea]/80 dark:border-white/10 p-5 flex flex-col gap-4 text-left"`;
const fixedMenuReplacement = `            className="fixed top-16 right-4 z-[200] w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#dde3ea]/80 dark:border-white/10 p-5 flex flex-col gap-4 text-left"`;
replaceApp('Make mobile menu dropdown fixed rather than absolute', fixedMenuTarget, fixedMenuReplacement);

// Make standard pricing card border wrap use index.css rounded class instead of tailwind rounded-[32px]
const borderWrapTarget = `<div className="pricing-card-border-wrap relative overflow-hidden rounded-[32px] w-full h-full flex flex-col flex-1">`;
const borderWrapReplacement = `<div className="pricing-card-border-wrap relative overflow-hidden w-full h-full flex flex-col flex-1">`;
replaceApp('Remove hardcoded rounded-[32px] from pricing-card-border-wrap', borderWrapTarget, borderWrapReplacement);

// Update app translations for contactTelegram
replaceApp('Update EN contactTelegram text', `contactTelegram: "Contact via Telegram",`, `contactTelegram: "Contact",`);
replaceApp('Update RU contactTelegram text', `contactTelegram: "Связаться в Telegram",`, `contactTelegram: "Связаться",`);
replaceApp('Update UZ contactTelegram text', `contactTelegram: "Telegram orqali bog'lanish",`, `contactTelegram: "Bog'lanish",`);

// Lock Hero H1 height to prevent layout shifts on typewriter text changes
const h1HeroTarget = `<h1 className="font-['Orbitron'] text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 md:mb-6 leading-tight select-none">`;
const h1HeroReplacement = `<h1 className="font-['Orbitron'] text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 md:mb-6 leading-tight select-none min-h-[110px] sm:min-h-[130px] md:min-h-[160px] flex flex-col justify-center items-center">`;
replaceApp('Lock Hero H1 min-height to prevent text wrapping layout shift', h1HeroTarget, h1HeroReplacement);


// =========================================================================
// 2. UPDATE index.css
// =========================================================================

// Make pricing button smaller
const pricingCtaTarget = `.pricing-cta-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1.15rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Orbitron';
  cursor: pointer;
  overflow: hidden;
  background: #0d1520;
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  z-index: 10;
  margin-top: auto;
}`;

const pricingCtaReplacement = `.pricing-cta-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  font-weight: 700;
  font-size: 0.8rem;
  font-family: 'Orbitron';
  cursor: pointer;
  overflow: hidden;
  background: #0d1520;
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  z-index: 10;
  margin-top: auto;
}`;
replaceCSS('Make pricing CTA button smaller', pricingCtaTarget, pricingCtaReplacement);

// Make pricing card border wrap have responsive rounded corners in index.css
const borderWrapCssTarget = `.pricing-card-border-wrap::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent 40%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.45) 80%, transparent 100%);
  animation: rotate-border-glow 8s linear infinite;
  z-index: 1;
}`;

const borderWrapCssReplacement = `.pricing-card-border-wrap {
  border-radius: 32px;
}

.pricing-card-border-wrap::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent 40%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.45) 80%, transparent 100%);
  animation: rotate-border-glow 8s linear infinite;
  z-index: 1;
}`;
replaceCSS('Define default border-radius in pricing-card-border-wrap', borderWrapCssTarget, borderWrapCssReplacement);

// Add mobile media queries for smaller pricing boxes and smaller comparison split boxes
const mobileRulesAppend = `
/* Mobile Responsive Sizing Refinements */
@media (max-width: 768px) {
  /* Smaller Pricing boxes and card wraps */
  .pricing-inner {
    padding: 1.25rem !important;
    border-radius: 24px !important;
  }
  .pricing-card-animated {
    border-radius: 24px !important;
  }
  .pricing-card-border-wrap {
    border-radius: 24px !important;
  }
  
  /* Smaller Comparison Section boxes */
  .comparison-split-left,
  .comparison-split-right {
    padding: 1.25rem !important;
    border-radius: 20px !important;
  }
  .comparison-split-header {
    padding-bottom: 0.85rem !important;
  }
  .comparison-item {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.8rem !important;
  }
  .comparison-split-icon {
    width: 2.75rem !important;
    height: 2.75rem !important;
    font-size: 1.25rem !important;
    margin-bottom: 0.75rem !important;
  }
}
`;

css += mobileRulesAppend;
console.log('Appended mobile responsive refinements to CSS.');

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');

fs.writeFileSync(cssPath, css);
console.log('index.css updated successfully.');
