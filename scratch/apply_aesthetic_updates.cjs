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

// Add Check to lucide-react imports
const importsTarget = `  ChevronRight,
  X,
  Send,`;
const importsReplacement = `  ChevronRight,
  X,
  Send,
  Check,`;
replaceApp('Add Check to lucide-react imports', importsTarget, importsReplacement);

// Remove emojis from comparison split icons & items
const comparisonSplitTarget = `<div className="comparison-split-wrapper">
              <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="comparison-split-left">
                <div className="comparison-split-header">
                  <div className="comparison-split-icon comparison-split-icon-red">📷</div>
                  <h3 className="font-['Orbitron'] text-xl font-bold text-red-400">{t.compTraditionalTitle}</h3>
                  <p className="text-red-400/70 text-sm font-medium mt-1">⏱ {t.compTraditionalTime}</p>
                </div>
                <div className="space-y-4 mt-6">
                  {[t.compTraditional1, t.compTraditional2, t.compTraditional3].map((item, i) => (
                    <div key={i} className="comparison-item comparison-item-bad">
                      <div className="comparison-item-icon comparison-item-icon-bad">✕</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="comparison-frustration-bar"><div className="comparison-frustration-fill"></div></div>
                <p className="text-red-400/60 text-xs mt-2 text-center">Workflow frustration: HIGH</p>
              </motion.div>
              <div className="comparison-divider">
                <div className="comparison-divider-line"></div>
                <div className="comparison-divider-vs">VS</div>
                <div className="comparison-divider-line"></div>
              </div>
              <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="comparison-split-right">
                <div className="comparison-split-header">
                  <div className="comparison-split-icon comparison-split-icon-blue">⚡</div>
                  <h3 className="font-['Orbitron'] text-xl font-bold bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">{t.compAiTitle}</h3>
                  <p className="text-[#4fc3f7]/80 text-sm font-medium mt-1">✦ AI-Powered, instant results</p>
                </div>
                <div className="space-y-4 mt-6">
                  {[t.compAi1, t.compAi2, t.compAi3].map((item, i) => (
                    <div key={i} className="comparison-item comparison-item-good">
                      <div className="comparison-item-icon comparison-item-icon-good">✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="comparison-success-bar"><div className="comparison-success-fill"></div></div>
                <p className="text-[#4fc3f7]/60 text-xs mt-2 text-center">Workflow efficiency: INSTANT ⚡</p>
              </motion.div>
            </div>`;

const comparisonSplitReplacement = `<div className="comparison-split-wrapper">
              <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="comparison-split-left">
                <div className="comparison-split-header">
                  <div className="comparison-split-icon comparison-split-icon-red">
                    <Camera size={24} className="text-red-400" />
                  </div>
                  <h3 className="font-['Orbitron'] text-xl font-bold text-red-400">{t.compTraditionalTitle}</h3>
                  <p className="text-red-400/70 text-sm font-medium mt-1">⏱ {t.compTraditionalTime}</p>
                </div>
                <div className="space-y-4 mt-6">
                  {[t.compTraditional1, t.compTraditional2, t.compTraditional3].map((item, i) => (
                    <div key={i} className="comparison-item comparison-item-bad">
                      <div className="comparison-item-icon comparison-item-icon-bad">
                        <X size={12} className="text-red-400" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="comparison-frustration-bar"><div className="comparison-frustration-fill"></div></div>
                <p className="text-red-400/60 text-xs mt-2 text-center">Workflow frustration: HIGH</p>
              </motion.div>
              <div className="comparison-divider">
                <div className="comparison-divider-line"></div>
                <div className="comparison-divider-vs">VS</div>
                <div className="comparison-divider-line"></div>
              </div>
              <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="comparison-split-right">
                <div className="comparison-split-header">
                  <div className="comparison-split-icon comparison-split-icon-blue">
                    <Sparkles size={24} className="text-[#4fc3f7]" />
                  </div>
                  <h3 className="font-['Orbitron'] text-xl font-bold bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">{t.compAiTitle}</h3>
                  <p className="text-[#4fc3f7]/80 text-sm font-medium mt-1">✦ AI-Powered, instant results</p>
                </div>
                <div className="space-y-4 mt-6">
                  {[t.compAi1, t.compAi2, t.compAi3].map((item, i) => (
                    <div key={i} className="comparison-item comparison-item-good">
                      <div className="comparison-item-icon comparison-item-icon-good">
                        <Check size={12} className="text-[#22c55e]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="comparison-success-bar"><div className="comparison-success-fill"></div></div>
                <p className="text-[#4fc3f7]/60 text-xs mt-2 text-center">Workflow efficiency: INSTANT ⚡</p>
              </motion.div>
            </div>`;

replaceApp('Remove emojis and replace with Lucide icons in Comparison Split', comparisonSplitTarget, comparisonSplitReplacement);

// Remove 3D hover effects from Explore Examples carousel cards
const examplesCardTarget = `                      <div
                        className="example-card example-card-glow"
                        key={String(setIdx)+'-'+String(n)}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
                          e.currentTarget.style.transform = 'perspective(600px) rotateX('+y+'deg) rotateY('+x+'deg) scale(1.04)';
                        }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                      >`;

const examplesCardReplacement = `                      <div
                        className="example-card example-card-glow"
                        key={String(setIdx)+'-'+String(n)}
                      >`;

replaceApp('Remove 3D mousemove hover tilt from Examples cards', examplesCardTarget, examplesCardReplacement);

// Remove the transparent box from the CTA block ("One upload is all it takes")
const ctaBoxTarget = `            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto glow-box rounded-3xl p-8 md:p-12 space-y-6"
              >`;

const ctaBoxReplacement = `            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto space-y-6 py-8"
              >`;

replaceApp('Remove transparent card box from final CTA section', ctaBoxTarget, ctaBoxReplacement);

// Restructure Pricing plans layout to support overflow-visible for the popular badge
const pricingCardsLoopTarget = `              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Basic', price: '75,000', credits: 50, icon: '🌱', blobColor: 'rgba(79,195,247,0.5)' },
                  { name: 'Standard', price: '150,000', credits: 150, icon: '🚀', popular: true, saving: 'Save 33%', originalPrice: '225,000', blobColor: 'rgba(79,195,247,0.8)' },
                  { name: 'Premium', price: '250,000', credits: 300, icon: '👑', saving: 'Save 44%', originalPrice: '450,000', blobColor: 'rgba(34,197,94,0.6)' }
                ].map((plan, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }} className={"pricing-card-animated flex flex-col" + (plan.popular ? " popular-animated" : "")}>
                    <div className="pricing-blob" style={{ background: plan.blobColor }}></div>
                    <div className="pricing-inner">
                      {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4fc3f7] text-[#0a0d12] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_20px_rgba(79,195,247,0.5)] z-10">{t.mostPopular}</div>}
                      <div className="text-3xl mb-4">{plan.icon}</div>
                      <h3 className="font-['Orbitron'] text-2xl font-bold text-white mb-1">{plan.name}</h3>
                      <div className="flex items-center flex-wrap gap-2 mb-6 relative">
                        {plan.originalPrice && <span className="text-sm font-bold text-white/30 line-through">{plan.originalPrice}</span>}
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#4fc3f7] drop-shadow-[0_0_8px_rgba(79,195,247,0.6)]">{plan.price}</span>
                          <span className="text-sm text-white/50">UZS</span>
                        </div>
                        {plan.saving && <span className="absolute -top-6 right-0 text-[10px] font-bold text-[#1a7aad] bg-[#4fc3f7] px-2 py-1 rounded-md">{plan.saving}</span>}
                      </div>
                      <div className="space-y-4 mb-6 flex-1">
                        <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={14} className="text-[#4fc3f7]" /><span className="text-white font-bold">{plan.credits} {t.credits}</span></div>
                        <div className="flex items-center gap-3 text-sm text-white/60"><CheckCircle2 size={14} /><span>AI Poster Generation</span></div>
                        <div className="flex items-center gap-3 text-sm text-white/60"><CheckCircle2 size={14} /><span>Background Removal</span></div>
                      </div>
                      <a href={"https://t.me/kxabibov?text=Hello! I want to buy the "+plan.name+" plan ("+plan.credits+" credits) for "+plan.price+" UZS."} target="_blank" rel="noreferrer" className="pricing-cta-btn">
                        <div className="pricing-cta-blob-violet"></div>
                        <div className="pricing-cta-blob-aqua"></div>
                        <Send size={16} className="relative z-10" />
                        <span className="relative z-10">{t.contactTelegram}</span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>`;

const pricingCardsLoopReplacement = `              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Basic', price: '75,000', credits: 50, icon: Sparkles, iconClass: 'text-[#4fc3f7]/70', blobColor: 'rgba(79,195,247,0.3)' },
                  { name: 'Standard', price: '150,000', credits: 150, icon: Zap, iconClass: 'text-yellow-400 animate-pulse', popular: true, saving: 'Save 33%', originalPrice: '225,000', blobColor: 'rgba(79,195,247,0.6)' },
                  { name: 'Premium', price: '250,000', credits: 300, icon: ShieldCheck, iconClass: 'text-green-400', saving: 'Save 44%', originalPrice: '450,000', blobColor: 'rgba(34,197,94,0.4)' }
                ].map((plan, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * 0.1 }} className={"pricing-card-animated flex flex-col relative overflow-visible" + (plan.popular ? " popular-animated" : "")}>
                    {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1a7aad] to-[#4fc3f7] text-[#0a0d12] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_20px_rgba(79,195,247,0.5)] z-20">{t.mostPopular}</div>}
                    <div className="pricing-card-border-wrap relative overflow-hidden rounded-[32px] w-full h-full flex flex-col flex-1">
                      <div className="pricing-blob" style={{ background: plan.blobColor }}></div>
                      <div className="pricing-inner">
                        <div className="mb-4">
                          <plan.icon size={32} className={plan.iconClass} />
                        </div>
                        <h3 className="font-['Orbitron'] text-2xl font-bold text-white mb-1">{plan.name}</h3>
                        <div className="flex items-center flex-wrap gap-2 mb-6 relative">
                          {plan.originalPrice && <span className="text-sm font-bold text-white/30 line-through">{plan.originalPrice}</span>}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[#4fc3f7] drop-shadow-[0_0_8px_rgba(79,195,247,0.6)]">{plan.price}</span>
                            <span className="text-sm text-white/50">UZS</span>
                          </div>
                          {plan.saving && <span className="absolute -top-6 right-0 text-[10px] font-bold text-[#1a7aad] bg-[#4fc3f7] px-2 py-1 rounded-md">{plan.saving}</span>}
                        </div>
                        <div className="space-y-4 mb-6 flex-1">
                          <div className="flex items-center gap-3 text-sm"><CheckCircle2 size={14} className="text-[#4fc3f7]" /><span className="text-white font-bold">{plan.credits} {t.credits}</span></div>
                          <div className="flex items-center gap-3 text-sm text-white/60"><CheckCircle2 size={14} /><span>AI Poster Generation</span></div>
                          <div className="flex items-center gap-3 text-sm text-white/60"><CheckCircle2 size={14} /><span>Background Removal</span></div>
                        </div>
                        <a href={"https://t.me/kxabibov?text=Hello! I want to buy the "+plan.name+" plan ("+plan.credits+" credits) for "+plan.price+" UZS."} target="_blank" rel="noreferrer" className="pricing-cta-btn">
                          <div className="pricing-cta-blob-violet"></div>
                          <div className="pricing-cta-blob-aqua"></div>
                          <Send size={16} className="relative z-10" />
                          <span className="relative z-10">{t.contactTelegram}</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>`;

replaceApp('Update Pricing plans layout, icons, and popular badge styling', pricingCardsLoopTarget, pricingCardsLoopReplacement);

// =========================================================================
// 2. UPDATE index.css
// =========================================================================

// Update Cosmic button gradient and light-mode star config
const btnSpaceTarget = `/* ═══════════════════════════════════════════
   Cosmic Space Button (Theme-Aware)
   ═══════════════════════════════════════════ */
.btn-space {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14rem;
  overflow: hidden;
  height: 3.5rem;
  background-size: 300% 300%;
  cursor: pointer;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(
      137.48deg,
      #ffdb3b 10%,
      #fe53bb 45%,
      #8f51ea 67%,
      #0044ff 87%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
  position: relative;
}

.dark .btn-space {
  background-image: linear-gradient(#000000, #000000),
    linear-gradient(
      137.48deg,
      #ffdb3b 10%,
      #fe53bb 45%,
      #8f51ea 67%,
      #0044ff 87%
    );
}`;

const btnSpaceReplacement = `/* ═══════════════════════════════════════════
   Cosmic Space Button (Theme-Aware)
   ═══════════════════════════════════════════ */
.btn-space {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14rem;
  overflow: hidden;
  height: 3.5rem;
  background-size: 300% 300%;
  cursor: pointer;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(
      137.48deg,
      #00f2fe 10%,
      #4fc3f7 40%,
      #22c55e 70%,
      #a8ff78 95%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
  position: relative;
}

.dark .btn-space {
  background-image: linear-gradient(#000000, #000000),
    linear-gradient(
      137.48deg,
      #00f2fe 10%,
      #4fc3f7 40%,
      #22c55e 70%,
      #a8ff78 95%
    );
}`;

replaceCSS('Update Cosmic Space Button gradient combinations', btnSpaceTarget, btnSpaceReplacement);

// Update stars color and glows inside button
const buttonCirclesTarget = `.btn-space .circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.btn-space .circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.btn-space:hover #container-stars {
  z-index: 1;
  background-color: #ffffff;
}

.dark .btn-space:hover #container-stars {
  background-color: #000000;
}`;

const buttonCirclesReplacement = `.btn-space .circle:nth-of-type(1) {
  background: rgba(79, 195, 247, 0.6);
}

.btn-space .circle:nth-of-type(2) {
  background: rgba(34, 197, 94, 0.5);
}

.btn-space:hover #container-stars {
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.95);
}

.dark .btn-space:hover #container-stars {
  background-color: #000000;
}`;

replaceCSS('Update Cosmic button circles to cyan/green and hover background', buttonCirclesTarget, buttonCirclesReplacement);

// Make stars responsive to light mode (blue stars) and dark mode (white stars)
const starsBgTarget = `.btn-space #stars::after {
  content: "";
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

.btn-space #stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}`;

const starsBgReplacement = `.btn-space #stars::after {
  content: "";
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
  background-image: radial-gradient(#1a7aad 1px, transparent 1%);
  background-size: 50px 50px;
}

.dark .btn-space #stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
}

.btn-space #stars::before {
  content: "";
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
  background-image: radial-gradient(#1a7aad 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

.dark .btn-space #stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
}`;

replaceCSS('Update stars gradients to adapt to theme', starsBgTarget, starsBgReplacement);

// Redesign How It Works cards (images larger, white glow border animation smaller)
const howItWorksTarget = `/* ═══════════════════════════════════════════
   Blob Cards (How It Works - Redesigned)
   ═══════════════════════════════════════════ */
.blob-cards-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .blob-cards-container {
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
  }
}

.blob-card {
  position: relative;
  width: 310px;
  height: 380px;
  border-radius: 20px;
  z-index: 10;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: linear-gradient(0deg, transparent, transparent, #4fc3f7, #4fc3f7);
  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1), filter 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

.blob-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent 40%, #1a7aad 60%, #4fc3f7 80%, transparent 100%);
  animation: rotate-border-glow 6s linear infinite;
  z-index: 1;
}

@keyframes rotate-border-glow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.blob-cards-container:hover > .blob-card:not(:hover) {
  filter: blur(3px);
  transform: scale(0.88);
  opacity: 0.6;
}

.blob-card:hover {
  transform: scale(1.08) translateZ(10px);
  z-index: 20;
  box-shadow: 0 15px 40px rgba(79, 195, 247, 0.25);
}

.blob-card-bg {
  position: absolute;
  inset: 3px;
  z-index: 2;
  background: var(--glow-bg);
  backdrop-filter: blur(24px);
  border-radius: 17px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
  transition: background 0.3s ease;
}

.blob-card-bg img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: transform 0.5s ease;
}

.blob-card:hover .blob-card-bg img {
  transform: scale(1.03);
}`;

const howItWorksReplacement = `/* ═══════════════════════════════════════════
   Blob Cards (How It Works - Redesigned)
   ═══════════════════════════════════════════ */
.blob-cards-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .blob-cards-container {
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
  }
}

.blob-card {
  position: relative;
  width: 300px;
  height: 350px;
  border-radius: 20px;
  z-index: 10;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: linear-gradient(0deg, transparent, transparent, #ffffff, #ffffff);
  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1), filter 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

.blob-card::before {
  content: '';
  position: absolute;
  top: -30%;
  left: -30%;
  width: 160%;
  height: 160%;
  background: conic-gradient(from 0deg, transparent 40%, rgba(255,255,255,0.2) 65%, rgba(255,255,255,0.85) 85%, transparent 100%);
  animation: rotate-border-glow 6s linear infinite;
  z-index: 1;
}

@keyframes rotate-border-glow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.blob-cards-container:hover > .blob-card:not(:hover) {
  filter: blur(3px);
  transform: scale(0.88);
  opacity: 0.6;
}

.blob-card:hover {
  transform: scale(1.08) translateZ(10px);
  z-index: 20;
  box-shadow: 0 10px 24px rgba(255, 255, 255, 0.15);
}

.blob-card-bg {
  position: absolute;
  inset: 3px;
  z-index: 2;
  background: var(--glow-bg);
  backdrop-filter: blur(24px);
  border-radius: 17px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  transition: background 0.3s ease;
}

.blob-card-bg img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: transform 0.5s ease;
}

.blob-card:hover .blob-card-bg img {
  transform: scale(1.03);
}`;

replaceCSS('Redesign How It Works card sizing and border glows to white', howItWorksTarget, howItWorksReplacement);

// Update Explore Examples white border glows
const examplesTarget = `/* ═══════════════════════════════════════════
   Example Cards Blue Border Glow
   ═══════════════════════════════════════════ */
.example-card-glow {
  --glow-color: #4fc3f7;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--glow-color);
  background: linear-gradient(to right, rgba(79, 195, 247, 0.1) 1%, transparent 40%, transparent 60%, rgba(79, 195, 247, 0.1) 100%);
  box-shadow: inset 0 0 10px rgba(79, 195, 247, 0.4), 0 0 9px 3px rgba(79, 195, 247, 0.1);
  transition: all 0.3s;
}

.example-card-glow:hover {
  box-shadow: inset 0 0 10px rgba(79, 195, 247, 0.6), 0 0 9px 3px rgba(79, 195, 247, 0.2);
}

.example-card-glow::before {
  content: "";
  position: absolute;
  left: -4em;
  width: 4em;
  height: 100%;
  top: 0;
  transition: transform .4s ease-in-out;
  background: linear-gradient(to right, transparent 1%, rgba(79, 195, 247, 0.25) 40%, rgba(79, 195, 247, 0.25) 60%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

.example-card-glow:hover::before {
  transform: translateX(300px);
}`;

const examplesReplacement = `/* ═══════════════════════════════════════════
   Example Cards White Border Glow
   ═══════════════════════════════════════════ */
.example-card-glow {
  --glow-color: #ffffff;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--glow-color);
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1%, transparent 40%, transparent 60%, rgba(255, 255, 255, 0.1) 100%);
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.4), 0 0 9px 3px rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.example-card-glow:hover {
  box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.6), 0 0 15px 4px rgba(255, 255, 255, 0.2);
}

.example-card-glow::before {
  content: "";
  position: absolute;
  left: -4em;
  width: 4em;
  height: 100%;
  top: 0;
  transition: transform .4s ease-in-out;
  background: linear-gradient(to right, transparent 1%, rgba(255, 255, 255, 0.25) 40%, rgba(255, 255, 255, 0.25) 60%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

.example-card-glow:hover::before {
  transform: translateX(300px);
}`;

replaceCSS('Update Examples card glows to white', examplesTarget, examplesReplacement);

// Make Pricing cards transparent with rotating conic border glows (and Standard card glowing brighter)
const pricingCardsTarget = `/* ═══════════════════════════════════════════
   Animated Pricing Cards Section
   ═══════════════════════════════════════════ */
.pricing-card-animated {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: transparent;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 600ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.pricing-card-animated:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
}

.pricing-blob {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  filter: blur(75px);
  opacity: 0.28;
  z-index: 1;
  top: -120px;
  left: -120px;
  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pricing-card-animated:hover .pricing-blob {
  transform: translate(40px, 40px);
  opacity: 0.38;
}

.pricing-inner {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 2.5rem;
  background: var(--glow-bg-sm);
  border: 1.5px solid var(--glow-border);
  backdrop-filter: blur(24px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pricing-card-animated.popular-animated .pricing-inner {
  border-color: rgba(79, 195, 247, 0.35);
  box-shadow: inset 0 0 24px rgba(79, 195, 247, 0.08);
}`;

const pricingCardsReplacement = `/* ═══════════════════════════════════════════
   Animated Pricing Cards Section
   ═══════════════════════════════════════════ */
.pricing-card-animated {
  position: relative;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  background: transparent;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 600ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.pricing-card-animated:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 45px rgba(79, 195, 247, 0.1);
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
}

/* Standard/Popular stands out with a brighter, colorful border glow */
.pricing-card-animated.popular-animated .pricing-card-border-wrap::before {
  background: conic-gradient(from 0deg, transparent 30%, #4fc3f7 50%, #8f51ea 75%, transparent 100%);
  animation: rotate-border-glow 4s linear infinite; /* Faster rotation and brighter */
}

.pricing-blob {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  filter: blur(75px);
  opacity: 0.18;
  z-index: 1;
  top: -120px;
  left: -120px;
  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pricing-card-animated:hover .pricing-blob {
  transform: translate(40px, 40px);
  opacity: 0.28;
}

.pricing-inner {
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 2.2rem;
  background: rgba(255, 255, 255, 0.02); /* Transparent boxes */
  border: 1.5px solid rgba(255, 255, 255, 0.08); /* Minimal border */
  backdrop-filter: blur(24px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pricing-card-animated.popular-animated .pricing-inner {
  background: rgba(79, 195, 247, 0.02);
  border-color: rgba(79, 195, 247, 0.25);
  box-shadow: inset 0 0 24px rgba(79, 195, 247, 0.05);
}`;

replaceCSS('Make pricing cards transparent with rotating conic border glows', pricingCardsTarget, pricingCardsReplacement);

// Save files
fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');

fs.writeFileSync(cssPath, css);
console.log('index.css updated successfully.');
