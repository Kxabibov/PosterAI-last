const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');
console.log('Lines:', lines.length);

// Fix 1: the broken hero button (lines ~1434-1490 have pricing junk instead of button close)
// Find the broken button
let btnStart = -1, btnEnd = -1;
for (let i = 1425; i < 1500; i++) {
  if (lines[i] && lines[i].includes('{plan.saving') && btnStart === -1) btnStart = i;
  if (lines[i] && lines[i].includes('</section>') && btnStart !== -1) { btnEnd = i + 1; break; }
}
console.log('Button fix:', btnStart, btnEnd);

const btnFix = `                        className="btn-space btn-space-glow"
                        type="button"
                      >
                        <strong>{t.startBtn}</strong>
                        <div id="container-stars"><div id="stars"></div></div>
                        <div id="glow"><div className="circle"></div><div className="circle"></div></div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* LANDING SECTIONS */}
      {flowStep === 0 && !adminTab && (
        <>
          {/* Marquee */}
          <div className="relative z-10 py-6 md:py-10">
            <div className="marquee-container">
              <div className="marquee-track" ref={marqueeScroll.trackRef} {...marqueeScroll.handlers} style={{ touchAction: 'pan-y' }}>
                {[...Array(4)].map((_, setIdx) => (
                  <React.Fragment key={setIdx}>
                    {t.marquee.map((text: string, i: number) => (
                      <div className="marquee-item" key={String(setIdx)+'-'+String(i)}>
                        <img src="/logo.png" alt="" className="marquee-logo marquee-logo-glow" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works */}
          <section id="how-it-works" className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter text-center mb-10 md:mb-16">{t.howItWorksTitle}</h2>
            <div className="blob-cards-container">
              {[
                { img: '/step1.png', text: t.howStep1, num: '01', color: 'blue' },
                { img: '/step2.png', text: t.howStep2, num: '02', color: 'cyan' },
                { img: '/step3.png', text: t.howStep3, num: '03', color: 'teal' }
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={"blob-card " + step.color}
                  >
                    <div className="blob-card-blob"></div>
                    <div className="blob-card-bg">
                      <img src={step.img} alt={step.text} style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'8px',marginBottom:'12px'}} />
                      <span className="text-xs font-bold text-[#4fc3f7] bg-[#4fc3f7]/10 px-2.5 py-1 rounded-full mb-2 inline-block">{step.num}</span>
                      <h3 className="font-['Orbitron'] text-sm font-bold text-center mt-2">{step.text}</h3>
                    </div>
                  </motion.div>
                  {i < 2 && <div className="connection-line" style={{left:'calc(100% - 0px)'}}></div>}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Examples */}
          <section id="examples" className="relative z-10 py-12 md:py-20">
            <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter text-center mb-10 md:mb-16 px-4">{t.exploreExamples}</h2>
            <div className="examples-carousel-container">
              <div className="examples-carousel-track" ref={examplesScroll.trackRef} {...examplesScroll.handlers} style={{ touchAction: 'pan-y' }}>
                {[...Array(4)].map((_, setIdx) => (
                  <React.Fragment key={setIdx}>
                    {[1,2,3,4,5,6].map(n => (
                      <div
                        className="example-card example-card-glow"
                        key={String(setIdx)+'-'+String(n)}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
                          e.currentTarget.style.transform = 'perspective(600px) rotateX('+y+'deg) rotateY('+x+'deg) scale(1.04)';
                        }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
                      >
                        <img src={'/example'+n+'.jpg'} alt={'Example '+n} />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section id="comparison" className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter mb-3">{t.compTitle}</h2>
              <p className="text-[#6b7a8d] dark:text-gray-300 text-sm md:text-base max-w-xl mx-auto">{t.compSub}</p>
            </div>
            <div className="comparison-split-wrapper">
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
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="pricing-section relative z-10 py-16 md:py-24 mt-8">
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="font-['Orbitron'] text-2xl md:text-3xl font-extrabold tracking-tighter text-white mb-3">{t.pricingTitle}</h2>
                <p className="text-white/60 text-sm md:text-base">{t.pricingDesc}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
              <p className="text-center mt-8 text-xs text-white/40">{t.manualPayment}</p>
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mt-12 md:mt-16">
                <div className="credits-pulse inline-flex items-center gap-4 glow-box rounded-xl px-6 py-3 md:px-8 md:py-4 !bg-white/10 !border-white/15 !backdrop-blur-xl">
                  <Sparkles className="text-[#4fc3f7] flex-shrink-0" size={24} />
                  <div className="text-left">
                    <h3 className="font-['Orbitron'] text-sm md:text-base font-bold text-white mb-0.5">{t.freeCreditsTitle}</h3>
                    <p className="text-white/60 text-[10px] md:text-xs m-0">{t.freeCreditsDesc}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
`;

// Apply the fix
const newLines = [...lines.slice(0, btnStart), ...btnFix.split('\n'), ...lines.slice(btnEnd)];
const result = newLines.join('\n');
fs.writeFileSync('src/App.tsx', result, 'utf8');
const finalLines = result.split('\n');
console.log('Done! Lines:', finalLines.length);

// Verify key sections
['marquee-container','comparison-split-wrapper','pricing-card-animated','btn-space','flowStep === 0'].forEach(m => {
  const idx = finalLines.findIndex(l => l && l.includes(m));
  console.log(m, '=>', idx);
});
