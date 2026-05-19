const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

function doReplace(desc, target, replacement) {
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  if (!app.includes(normTarget)) {
    console.error(`ERROR: Target not found for: ${desc}`);
    const snippet = normTarget.substring(0, 100);
    console.error(`Snippet attempted: ${snippet}`);
    process.exit(1);
  }
  app = app.replace(normTarget, normReplacement);
  console.log(`SUCCESS: ${desc}`);
}

// 1. Remove the startup redirect block "if (!user)" using robust index search
const startIdx = app.indexOf('if (!user) {');
if (startIdx !== -1) {
  const nextReturnIdx = app.indexOf('  return (', startIdx + 12);
  if (nextReturnIdx !== -1) {
    app = app.substring(0, startIdx) + app.substring(nextReturnIdx);
    console.log("SUCCESS: Remove if(!user) startup redirect block");
  } else {
    console.error("ERROR: Could not find next return block after if(!user)");
    process.exit(1);
  }
} else {
  console.error("ERROR: Could not find if(!user) start index");
  process.exit(1);
}

// 2. Add Theme Toggle to Header/Navbar
const navLogoTarget = `        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => { setFlowStep(0); setAdminTab(null); }}`;

const navLogoReplacement = `        <div className="flex items-center gap-6">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 glow-box-sm rounded-full text-[#1a2030] dark:text-white hover:text-[#1a7aad] dark:hover:text-[#4fc3f7] transition-all flex items-center justify-center mr-1"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => { setFlowStep(0); setAdminTab(null); }}`;

doReplace('Add theme toggle in desktop header', navLogoTarget, navLogoReplacement);

// 3. Update My Inventory navigation button logic (require login)
const myInventoryNavTarget = `          <button
            onClick={() => { setFlowStep(6); setAdminTab(null); }}
            className={\`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all \${flowStep === 6 ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
          >`;

const myInventoryNavReplacement = `          <button
            onClick={() => {
              if (!user) {
                signIn();
              } else {
                setFlowStep(6);
                setAdminTab(null);
              }
            }}
            className={\`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all \${flowStep === 6 ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
          >`;

doReplace('Secure My Inventory nav button', myInventoryNavTarget, myInventoryNavReplacement);

// 4. Replace Hero Title and Space Button in Flow Step 0
const flowStep0Target = `                {flowStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-2 md:py-6"
                  >
                    <h1 className="font-['Syne'] text-2xl md:text-4xl font-extrabold tracking-tighter mb-4 md:mb-6 leading-tight">
                      {t.heroTitle}
                    </h1>
                    <div className="flex flex-col items-center gap-4">
                      <button
                        onClick={() => setFlowStep(1)}
                        className="group btn-glossy gap-2 md:gap-3 text-[#1a7aad] px-6 py-3 md:px-8 md:py-4 font-bold text-sm"
                      >
                        <Sparkles size={20} />
                        {t.startBtn}
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}`;

const flowStep0Replacement = `                {flowStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-2 md:py-6"
                  >
                    <h1 className="font-['Orbitron'] text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 md:mb-6 leading-tight select-none">
                      {appLanguage === 'English' ? (
                        <>Product card created<br />before your <TypewriterCycle 
                          phrases={['coffee cools', 'WiFi has doubts', 'designer answers', 'lunch arrives', 'meeting starts', 'page loads']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      ) : appLanguage === 'Russian' ? (
                        <>Карточка товара будет готова<br />быстрее, чем <TypewriterCycle 
                          phrases={['остынет кофе', 'ответит дизайнер', 'начнется созвон', 'загрузится страница']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      ) : (
                        <>Mahsulot kartasi tayyor bo'ladi<br />hatto <TypewriterCycle 
                          phrases={['qahva soviguncha', 'dizayner javob berguncha', 'majlis boshlanguncha']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      )}
                    </h1>
                    <div className="flex flex-col items-center gap-4">
                      <button
                        id="start-creating-btn"
                        onClick={() => {
                          if (!user) {
                            signIn();
                          } else {
                            setFlowStep(1);
                          }
                        }}
                        className="btn-space"
                      >
                        <strong>{t.startBtn.toUpperCase()}</strong>
                        <div id="container-stars">
                          <div id="stars"></div>
                        </div>
                        <div id="glow">
                          <div className="circle"></div>
                          <div className="circle"></div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}`;

doReplace('Replace Hero content in Step 0', flowStep0Target, flowStep0Replacement);

// 5. Replace How It Works section
const howItWorksTarget = `          {/* How It Works */}
          <section id="how-it-works" className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <h2 className="font-['Syne'] text-xl md:text-3xl font-extrabold tracking-tighter text-center mb-10 md:mb-16">
              {t.howItWorksTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { img: '/step1.png', text: t.howStep1, num: '01' },
                { img: '/step2.png', text: t.howStep2, num: '02' },
                { img: '/step3.png', text: t.howStep3, num: '03' }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="step-card"
                >
                  <img src={step.img} alt={step.text} />
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-[#4fc3f7] bg-[#4fc3f7]/10 px-2.5 py-1 rounded-full">{step.num}</span>
                    </div>
                    <h3 className="font-['Syne'] text-sm md:text-base font-bold">{step.text}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>`;

const howItWorksReplacement = `          {/* How It Works */}
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
          </section>`;

doReplace('Replace How It Works section', howItWorksTarget, howItWorksReplacement);

// 6. Replace Explore Examples section
const examplesTarget = `          {/* Explore Examples */}
          <section id="examples" className="relative z-10 py-12 md:py-20">
            <h2 className="font-['Syne'] text-xl md:text-3xl font-extrabold tracking-tighter text-center mb-10 md:mb-16 px-4">
              {t.exploreExamples}
            </h2>
            <div className="examples-carousel-container">
              <div 
                className="examples-carousel-track"
                ref={examplesScroll.trackRef}
                {...examplesScroll.handlers}
                style={{ touchAction: 'pan-y' }}
              >
                {[...Array(4)].map((_, setIdx) => (
                  <React.Fragment key={setIdx}>
                    {[1,2,3,4,5,6].map(n => (
                      <div className="example-card" key={\`\${setIdx}-\${n}\`}>
                        <img src={\`/example\${n}.jpg\`} alt={\`Example \${n}\`} />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>`;

const examplesReplacement = `          {/* Explore Examples */}
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
          </section>`;

doReplace('Replace Explore Examples section', examplesTarget, examplesReplacement);

// 7. Replace Comparison section
const comparisonTarget = `          {/* Comparison Section */}
          <section id="comparison" className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="font-['Syne'] text-xl md:text-3xl font-extrabold tracking-tighter mb-3 leading-tight">
                {t.compTitle}
              </h2>
              <p className="text-[#6b7a8d] text-sm md:text-base max-w-xl mx-auto">
                {t.compSub}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Traditional */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="comparison-card traditional flex-1"
              >
                <h3 className="font-['Syne'] text-lg font-bold mb-1">{t.compTraditionalTitle}</h3>
                <p className="text-[#6b7a8d] text-sm mb-6">{t.compTraditionalTime}</p>
                <div className="space-y-4">
                  {[t.compTraditional1, t.compTraditional2, t.compTraditional3].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-[#d95050] text-base">✕</span>
                      <span className="text-[#6b7a8d]">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              {/* Pixo AI */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="comparison-card ai-card flex-1"
              >
                <h3 className="font-['Syne'] text-lg font-bold mb-1 bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">{t.compAiTitle}</h3>
                <p className="text-[#4fc3f7] text-sm mb-6 font-medium">✦ AI-Powered</p>
                <div className="space-y-4">
                  {[t.compAi1, t.compAi2, t.compAi3].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="text-[#4fc3f7] text-base">✓</span>
                      <span className="text-[#1a2030]">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>`;

const comparisonReplacement = `          {/* Comparison */}
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
          </section>`;

doReplace('Replace Comparison section', comparisonTarget, comparisonReplacement);

// 8. Replace Pricing section
const pricingTarget = `          {/* Pricing Section (inline) */}
          <section id="pricing" className="pricing-section relative z-10 py-16 md:py-24 mt-8">
            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-6">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="font-['Syne'] text-xl md:text-3xl font-extrabold tracking-tighter text-white mb-3">
                  {t.pricingTitle}
                </h2>
                <p className="text-white/60 text-sm md:text-base">{t.pricingDesc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Basic', price: '75,000', credits: 50, icon: '🌱' },
                  { name: 'Standard', price: '150,000', credits: 150, icon: '🚀', popular: true, saving: 'Save 33%', originalPrice: '225,000' },
                  { name: 'Premium', price: '250,000', credits: 300, icon: '👑', saving: 'Save 44%', originalPrice: '450,000' }
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={\`pricing-card flex flex-col \${plan.popular ? 'popular' : ''}\`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4fc3f7] text-[#0a0d12] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-[0_0_20px_rgba(79,195,247,0.3)]">
                        {t.mostPopular}
                      </div>
                    )}
                    <div className="text-2xl mb-4">{plan.icon}</div>
                    <h3 className="font-['Syne'] text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <div className="flex items-center flex-wrap gap-2 mb-6 relative">
                      {plan.originalPrice && (
                        <span className="text-sm font-bold text-white/30 line-through decoration-1 decoration-white/40">{plan.originalPrice}</span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-[#4fc3f7]">{plan.price}</span>
                        <span className="text-sm text-white/50">UZS</span>
                      </div>
                      {plan.saving && (
                        <span className="absolute -top-6 right-0 text-[10px] font-bold text-[#1a7aad] bg-[#4fc3f7] px-2 py-1 rounded-md shadow-lg shadow-[#4fc3f7]/20">
                          {plan.saving}
                        </span>
                      )}
                    </div>
                    <div className="space-y-4 mb-6 flex-1">
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle2 size={14} className="text-[#4fc3f7]" />
                        <span className="text-white font-bold">{plan.credits} {t.credits}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <CheckCircle2 size={14} />
                        <span>AI Poster Generation</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <CheckCircle2 size={14} />
                        <span>Background Removal</span>
                      </div>
                    </div>
                    <a
                      href={\`https://t.me/kxabibov?text=Hello! I want to buy the \${plan.name} plan (\${plan.credits} credits) for \${plan.price} UZS.\`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    >
                      <Send size={16} />
                      {t.contactTelegram}
                    </a>
                  </motion.div>
                ))}
              </div>

              <p className="text-center mt-8 text-xs text-white/40">
                {t.manualPayment}
              </p>

              {/* Free credits animated text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-12 md:mt-16"
              >
                <div className="credits-pulse inline-flex items-center gap-4 glow-box rounded-xl px-6 py-3 md:px-8 md:py-4 !bg-white/10 !border-white/15 !backdrop-blur-xl">
                  <Sparkles className="text-[#4fc3f7] flex-shrink-0" size={24} />
                  <div className="text-left">
                    <h3 className="font-['Syne'] text-sm md:text-base font-bold text-white mb-0.5">
                      {t.freeCreditsTitle}
                    </h3>
                    <p className="text-white/60 text-[10px] md:text-xs m-0">{t.freeCreditsDesc}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>`;

const pricingReplacement = `          {/* Pricing */}
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
          </section>`;

doReplace('Replace Pricing section', pricingTarget, pricingReplacement);

// 9. Replace CTA Section (Windows target version)
const ctaTarget = `          {/* CTA Section */}
          <section className="cta-section relative z-10 py-16 md:py-24">
            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-['Syne'] text-2xl md:text-4xl font-extrabold tracking-tighter text-white mb-3 leading-tight">
                  {t.ctaTitle}
                </h2>
                <p className="text-white/70 text-sm md:text-lg mb-8">{t.ctaSub}</p>
                <button
                  onClick={() => setFlowStep(1)}
                  className="group inline-flex items-center gap-3 bg-white text-[#1a7aad] px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Sparkles size={20} />
                  {t.ctaBtn}
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </section>`;

const ctaReplacement = `          {/* CTA Section */}
          <section className="cta-section relative z-10 py-16 md:py-24">
            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto glow-box rounded-3xl p-8 md:p-12 space-y-6"
              >
                <h2 className="font-['Orbitron'] text-2xl md:text-4xl font-extrabold tracking-tighter text-white">
                  {t.ctaTitle}
                </h2>
                <p className="text-white/70 text-sm md:text-base">
                  {t.ctaSub}
                </p>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      if (!user) {
                        signIn();
                      } else {
                        setFlowStep(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="btn-space"
                  >
                    <strong>{t.ctaBtn.toUpperCase()}</strong>
                    <div id="container-stars">
                      <div id="stars"></div>
                    </div>
                    <div id="glow">
                      <div className="circle"></div>
                      <div className="circle"></div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </section>`;

doReplace('Replace CTA section', ctaTarget, ctaReplacement);

// 10. Optimize Tailwind classes for dark mode and video bg
const mainReturnDivTarget = `  return (
    <div className="min-h-screen bg-[#f4f7fa] text-[#1a2030] font-['DM_Sans']">`;

const mainReturnDivReplacement = `  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#1a2030] dark:text-white font-['DM_Sans']">`;

doReplace('Update main return container classes', mainReturnDivTarget, mainReturnDivReplacement);

// Optimize global styles in render blocks
app = app.replace(/bg-white\/60/g, 'bg-white/60 dark:bg-black/40');
app = app.replace(/bg-white\/5(?!0)/g, 'bg-white/5 dark:bg-white/10');
app = app.replace(/bg-white(?!\/)/g, 'bg-white dark:bg-gray-900');
app = app.replace(/border-\[#dde3ea\]/g, 'border-[#dde3ea] dark:border-white/20');
app = app.replace(/border-\[#4fc3f7\]\/10/g, 'border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30');
app = app.replace(/font-\['Syne'\]/g, "font-['Orbitron']");

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully with all replacements.');
