const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/index.css');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Replace the Cosmic Space Button rules (lines 657-740)
const btnSpaceTarget = `/* ═══════════════════════════════════════════
   Cosmic Space Button
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
  background-image: linear-gradient(#212121, #212121),
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

.btn-space #container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

.btn-space strong {
  z-index: 2;
  font-family: "Orbitron", sans-serif;
  font-size: 14px;
  letter-spacing: 4px;
  color: #ffffff;
  text-shadow: 0 0 4px white;
}

.btn-space #glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.btn-space .circle {
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.btn-space .circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.btn-space .circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.btn-space:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.btn-space:hover {
  transform: scale(1.05);
}

.btn-space:active {
  border: double 4px #fe53bb;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
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
}

.btn-space #container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

.btn-space strong {
  z-index: 2;
  font-family: "Orbitron", sans-serif;
  font-size: 14px;
  letter-spacing: 4px;
  color: #000000;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.dark .btn-space strong {
  color: #ffffff;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
}

.btn-space #glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.btn-space .circle {
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.btn-space .circle:nth-of-type(1) {
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
}

.btn-space:hover {
  transform: scale(1.05);
}

.btn-space:active {
  border: double 4px #fe53bb;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}`;

if (!css.includes(btnSpaceTarget)) {
  console.error("ERROR: btnSpaceTarget not found in index.css");
  process.exit(1);
}
css = css.replace(btnSpaceTarget, btnSpaceReplacement);
console.log("SUCCESS: Replaced Cosmic Space Button CSS");

// 2. Replace the "Blob Cards (How It Works)" rules
const blobCardTarget = `/* ═══════════════════════════════════════════
   Blob Cards (How It Works)
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
    gap: 4rem;
  }
}

.blob-card {
  position: relative;
  width: 250px;
  height: 300px;
  border-radius: 14px;
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 20px 20px 60px rgba(0,0,0,0.1), -20px -20px 60px rgba(255,255,255,0.05);
  cursor: pointer;
  transition: transform 400ms ease, filter 400ms ease;
}

.blob-cards-container:hover > .blob-card:not(:hover) {
  filter: blur(10px);
  transform: scale(0.9);
}

.blob-card:hover {
  transform: scale(1.1);
  z-index: 20;
}

.blob-card-bg {
  position: absolute;
  inset: 4px;
  z-index: 2;
  background: var(--glow-bg);
  backdrop-filter: blur(24px);
  border-radius: 10px;
  overflow: hidden;
  outline: 2px solid var(--glow-border-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
}

.blob-card-blob {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  opacity: 0.8;
  filter: blur(20px);
  animation: blob-bounce 5s infinite ease;
}

.blob-card.red .blob-card-blob { background-color: #f43f5e; }
.blob-card.blue .blob-card-blob { background-color: #3b82f6; }
.blob-card.green .blob-card-blob { background-color: #22c55e; }

@keyframes blob-bounce {
  0% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
  25% { transform: translate(-100%, -100%) translate3d(100%, 0, 0); }
  50% { transform: translate(-100%, -100%) translate3d(100%, 100%, 0); }
  75% { transform: translate(-100%, -100%) translate3d(0, 100%, 0); }
  100% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
}`;

const blobCardReplacement = `/* ═══════════════════════════════════════════
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

if (!css.includes(blobCardTarget)) {
  console.error("ERROR: blobCardTarget not found in index.css");
  process.exit(1);
}
css = css.replace(blobCardTarget, blobCardReplacement);
console.log("SUCCESS: Replaced How It Works CSS");

// 3. Replace the "Example Cards Green Border Glow" rules
const exampleCardTarget = `/* ═══════════════════════════════════════════
   Example Cards Green Border Glow
   ═══════════════════════════════════════════ */
.example-card-glow {
  --green: #1BFD9C;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--green);
  background: linear-gradient(to right, rgba(27, 253, 156, 0.1) 1%, transparent 40%, transparent 60%, rgba(27, 253, 156, 0.1) 100%);
  box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.4), 0 0 9px 3px rgba(27, 253, 156, 0.1);
  transition: all 0.3s;
}

.example-card-glow:hover {
  box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.6), 0 0 9px 3px rgba(27, 253, 156, 0.2);
}

.example-card-glow::before {
  content: "";
  position: absolute;
  left: -4em;
  width: 4em;
  height: 100%;
  top: 0;
  transition: transform .4s ease-in-out;
  background: linear-gradient(to right, transparent 1%, rgba(27, 253, 156, 0.2) 40%, rgba(27, 253, 156, 0.2) 60%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

.example-card-glow:hover::before {
  transform: translateX(300px); /* adjusted for card width */
}`;

const exampleCardReplacement = `/* ═══════════════════════════════════════════
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

if (!css.includes(exampleCardTarget)) {
  console.error("ERROR: exampleCardTarget not found in index.css");
  process.exit(1);
}
css = css.replace(exampleCardTarget, exampleCardReplacement);
console.log("SUCCESS: Replaced Explore Examples CSS");

// 4. Append missing Comparison & Pricing section CSS styles at the end
const extraCSS = `
/* ═══════════════════════════════════════════
   Comparison Section VS Split View
   ═══════════════════════════════════════════ */
.comparison-split-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: stretch;
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .comparison-split-wrapper {
    flex-direction: row;
    align-items: stretch;
    gap: 3.5rem;
  }
}

.comparison-split-left,
.comparison-split-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  border-radius: 28px;
  background: var(--glow-bg);
  border: 1.5px solid var(--glow-border);
  backdrop-filter: blur(20px);
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.comparison-split-left:hover,
.comparison-split-right:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(79,195,247,0.12);
}

.comparison-split-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid var(--glow-border-sm);
  padding-bottom: 1.5rem;
}

.comparison-split-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
}

.comparison-split-icon-red {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.comparison-split-icon-blue {
  background: rgba(79, 195, 247, 0.15);
  color: #4fc3f7;
  border: 1px solid rgba(79, 195, 247, 0.3);
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  color: var(--text);
}

.comparison-item-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  flex-shrink: 0;
}

.comparison-item-icon-bad {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.comparison-item-icon-good {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.comparison-frustration-bar,
.comparison-success-bar {
  width: 100%;
  height: 8px;
  background: rgba(120, 120, 120, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 2rem;
}

.comparison-frustration-fill {
  height: 100%;
  width: 85%;
  background: #ef4444;
  border-radius: 10px;
}

.comparison-success-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #1a7aad, #4fc3f7);
  border-radius: 10px;
}

.comparison-divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
}

@media (min-width: 768px) {
  .comparison-divider {
    flex-direction: column;
  }
}

.comparison-divider-line {
  flex: 1;
  width: 2px;
  min-height: 40px;
  background: var(--glow-border-sm);
}

.comparison-divider-vs {
  background: rgba(79, 195, 247, 0.12);
  border: 1.5px solid rgba(79, 195, 247, 0.35);
  color: #4fc3f7;
  padding: 0.75rem 1rem;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 800;
  font-family: 'Orbitron';
  letter-spacing: 1.5px;
  z-index: 5;
  box-shadow: 0 0 20px rgba(79,195,247,0.15);
  text-shadow: 0 0 4px rgba(79,195,247,0.4);
}

/* ═══════════════════════════════════════════
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
}

.pricing-cta-btn {
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
}

.dark .pricing-cta-btn {
  background: #ffffff;
  color: #0d1520;
  border: none;
}

.pricing-cta-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  color: #ffffff;
}

.pricing-cta-blob-violet,
.pricing-cta-blob-aqua {
  position: absolute;
  inset: 0;
  opacity: 0;
  z-index: 0;
  transition: opacity 0.4s ease;
}

.pricing-cta-blob-violet {
  background: linear-gradient(135deg, #8f51ea, #fe53bb);
}

.pricing-cta-blob-aqua {
  background: linear-gradient(135deg, #1a7aad, #4fc3f7);
}

.pricing-cta-btn:hover .pricing-cta-blob-aqua {
  opacity: 1;
}

.pricing-card-animated.popular-animated .pricing-cta-btn:hover .pricing-cta-blob-violet {
  opacity: 1;
}
`;

css += extraCSS;
fs.writeFileSync(cssPath, css);
console.log("SUCCESS: Wrote index.css overhaul styles");
