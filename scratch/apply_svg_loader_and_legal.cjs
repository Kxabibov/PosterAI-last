const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
const cssPath = path.join(__dirname, '../src/index.css');

let app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

function replaceApp(desc, target, replacement) {
  if (!app.includes(target)) {
    console.error(`ERROR: target not found in App.tsx for: ${desc}`);
    process.exit(1);
  }
  app = app.replace(target, replacement);
  console.log(`SUCCESS (App): ${desc}`);
}

// 1. Append custom styles to src/index.css
const customLoaderCss = `
/* Custom PIXO Loader Animation */
.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}
.loader {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dash {
  animation: dashArray 4s ease-in-out infinite, dashOffset 4s linear infinite;
}
.spin {
  animation: spinDashArray 4s ease-in-out infinite, spin 16s ease-in-out infinite, dashOffset 4s linear infinite;
  transform-origin: center;
}
@keyframes dashArray {
  0%   { stroke-dasharray: 0 1 359 0; }
  50%  { stroke-dasharray: 0 359 1 0; }
  100% { stroke-dasharray: 359 1 0 0; }
}
@keyframes spinDashArray {
  0%   { stroke-dasharray: 270 90; }
  50%  { stroke-dasharray: 0 360; }
  100% { stroke-dasharray: 270 90; }
}
@keyframes dashOffset {
  0%   { stroke-dashoffset: 365; }
  100% { stroke-dashoffset: 5; }
}
@keyframes spin {
  0%          { rotate: 0deg; }
  12.5%, 25%  { rotate: 270deg; }
  37.5%, 50%  { rotate: 540deg; }
  62.5%, 75%  { rotate: 810deg; }
  87.5%, 100% { rotate: 1080deg; }
}
`;

if (!css.includes('Custom PIXO Loader Animation')) {
  css += customLoaderCss;
  fs.writeFileSync(cssPath, css);
  console.log('SUCCESS (CSS): Appended custom loader CSS to index.css');
} else {
  console.log('CSS: Custom loader styles already exist in index.css');
}

// 2. Add state for legal modals to App.tsx
const stateTarget = `  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);`;
const stateReplacement = `  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);`;

replaceApp('Add Privacy and Terms modal state hooks', stateTarget, stateReplacement);

// 3. Remove "hatto" and add "," in the Uzbek Hero title
const uzbekHeroTarget = `                      ) : (
                        <>Mahsulot kartasi tayyor bo'ladi<br />hatto <TypewriterCycle 
                          phrases={['qahva soviguncha', 'dizayner javob berguncha', 'majlis boshlanguncha']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      )}`;

const uzbekHeroReplacement = `                      ) : (
                        <>Mahsulot kartasi tayyor bo'ladi,<br /><TypewriterCycle 
                          phrases={['qahva soviguncha', 'dizayner javob berguncha', 'majlis boshlanguncha']} 
                          className="bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                        /></>
                      )}`;

replaceApp('Remove hatto and add comma in Uzbek hero', uzbekHeroTarget, uzbekHeroReplacement);

// 4. Update footer links to trigger modals instead of preventDefault
const footerLinksTarget = `                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{t.footerCompany}</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>{t.footerPrivacy}</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>{t.footerTerms}</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>{t.footerContact}</a></li>
                  </ul>`;

const footerLinksReplacement = `                  <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">{t.footerCompany}</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <button 
                        onClick={() => setIsPrivacyModalOpen(true)} 
                        className="hover:text-white transition-colors cursor-pointer text-left text-[#6b7a8d]"
                      >
                        {t.footerPrivacy}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setIsTermsModalOpen(true)} 
                        className="hover:text-white transition-colors cursor-pointer text-left text-[#6b7a8d]"
                      >
                        {t.footerTerms}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                        }} 
                        className="hover:text-white transition-colors cursor-pointer text-left text-[#6b7a8d]"
                      >
                        {t.footerContact}
                      </button>
                    </li>
                  </ul>`;

replaceApp('Update footer company links', footerLinksTarget, footerLinksReplacement);

// 5. Replace boring loading spinner and circle particles in flowStep === 4
const flowStep4Target = `                {flowStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 md:py-12 space-y-8 md:space-y-16"
                  >
                    <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-[#4fc3f7]/30 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border border-dashed border-[#dde3ea] dark:border-white/20/30 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#4fc3f7] rounded-full blur-2xl opacity-20 animate-pulse" />
                          <div className="glow-box w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
                            <Sparkles className="text-[#1a7aad] animate-bounce w-10 h-10 md:w-16 md:h-16" />
                          </div>
                        </div>
                      </div>

                      {/* Floating particles around loader */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -20, 0],
                            x: [0, i % 2 === 0 ? 10 : -10, 0],
                            opacity: [0.2, 0.5, 0.2]
                          }}
                          transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                          className="absolute w-1.5 h-1.5 bg-[#4fc3f7] rounded-full"
                          style={{
                            top: \`\${50 + 40 * Math.sin(i * 60 * Math.PI / 180)}%\`,
                            left: \`\${50 + 40 * Math.cos(i * 60 * Math.PI / 180)}%\`,
                          }}
                        />
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-['Orbitron'] text-sm md:text-base font-bold tracking-tight">{t.genTitle}</h3>
                      <p className="text-[#6b7a8d] text-sm md:text-lg max-w-md mx-auto leading-relaxed">
                        {selectedStyle?.isSolo 
                          ? (appLanguage === 'English' ? 'Our AI is crafting your custom poster' : appLanguage === 'Russian' ? 'Наш ИИ готовит ваш уникальный постер' : 'Bizning AI siz uchun maxsus poster yaratmoqda')
                          : t.genDesc}
                      </p>
                    </div>
                  </motion.div>
                )}`;

const flowStep4Replacement = `                {flowStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-2 md:py-4 space-y-4 md:space-y-6"
                  >
                    <div className="loader-wrap">
                      <svg height="0" width="0" viewBox="0 0 64 64" style={{ position: "absolute" }}>
                        <defs>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gp">
                            <stop stopColor="#973BED"></stop>
                            <stop stopColor="#007CFF" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gi">
                            <stop stopColor="#FF6B35"></stop>
                            <stop stopColor="#FF0080" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gx">
                            <stop stopColor="#00E0ED"></stop>
                            <stop stopColor="#00DA72" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="go">
                            <stop stopColor="#FFC800"></stop>
                            <stop stopColor="#FF00FF" offset="1"></stop>
                            <animateTransform repeatCount="indefinite"
                              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                              dur="8s"
                              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                              type="rotate" attributeName="gradientTransform">
                            </animateTransform>
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="loader">
                        {/* P */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gp)"
                            d="M 10,60 V 4 H 42 C 57,4 57,30 42,30 H 10"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* I */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gi)"
                            d="M 16,4 H 48 M 32,4 V 60 M 16,60 H 48"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* X */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gx)"
                            d="M 10,4 L 54,60 M 54,4 L 10,60"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* O */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="10" stroke="url(#go)"
                            d="M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54"
                            className="spin" pathLength="360"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-['Orbitron'] text-xs md:text-sm font-bold tracking-tight">{t.genTitle}</h3>
                      <p className="text-[#6b7a8d] text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                        {selectedStyle?.isSolo 
                          ? (appLanguage === 'English' ? 'Our AI is crafting your custom poster' : appLanguage === 'Russian' ? 'Наш ИИ готовит ваш уникальный постер' : 'Bizning AI siz uchun maxsus poster yaratmoqda')
                          : t.genDesc}
                      </p>
                    </div>
                  </motion.div>
                )}`;

replaceApp('Replace flowStep 4 spinner loading layout with PIXO letters', flowStep4Target, flowStep4Replacement);

// 6. Render the Privacy and Terms Modals in App.tsx before end of file
const modalsTarget = `      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (`;

const modalsReplacement = `      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {isPrivacyModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glow-box rounded-[32px] p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh] text-[#1a2030] dark:text-white"
            >
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#6b7a8d] hover:text-[#0d1520] dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-['Orbitron'] text-xl md:text-2xl font-bold mb-6 text-[#1a7aad] dark:text-[#4fc3f7]">{t.footerPrivacy}</h2>
              
              <div className="space-y-4 text-xs md:text-sm leading-relaxed overflow-y-auto max-h-[60vh] pr-2 text-[#1a2030] dark:text-white/80">
                {appLanguage === 'English' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Information We Collect</p>
                    <p>We collect information you provide directly to us when creating an account, including your Google profile name, email address, and profile photo. We also store the product images you upload and the poster visuals generated through the platform.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. How We Use Information</p>
                    <p>We use the collected information to power our AI generation models, manage credit allocations, maintain your personal inventory history, and optimize our generation pipelines.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Data Security & Storage</p>
                    <p>Your uploaded media assets, account profiles, and generation history are securely hosted and protected using industry-standard Firebase Authentication and Firestore Security Rules. We do not sell or lease your personal information to third parties.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Contact & Support</p>
                    <p>If you have any questions about this Privacy Policy or your data usage, please reach out to us via support at kxabibov.</p>
                  </>
                ) : appLanguage === 'Russian' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Сбор информации</p>
                    <p>Мы собираем информацию, которую вы предоставляете непосредственно при авторизации, включая имя профиля Google, адрес электронной почты и фотографию профиля. Мы также сохраняем загруженные вами изображения товаров и сгенерированные постеры.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Использование информации</p>
                    <p>Собранные данные используются для работы моделей генерации ИИ, начисления и списания кредитов, ведения истории вашего инвентаря и улучшения качества работы сервиса.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Безопасность и хранение данных</p>
                    <p>Ваши медиафайлы, профиль аккаунта и история генераций надежно защищены с помощью систем Firebase Authentication и Firestore Security Rules. Мы не продаем и не передаем ваши личные данные третьим лицам.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Поддержка пользователей</p>
                    <p>Если у вас возникли вопросы по поводу данной Политики конфиденциальности или использования ваших данных, пожалуйста, свяжитесь с нами.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Biz to'playdigan ma'lumotlar</p>
                    <p>Biz tizimga kirganingizda taqdim etilgan Google profil nomi, elektron pochta manzili va profil rasmini to'playmiz. Shuningdek, siz yuklagan mahsulot rasmlari va AI orqali yaratilgan posterlar saqlanadi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Ma'lumotlardan foydalanish</p>
                    <p>To'plangan ma'lumotlar AI modellarini ishga tushirish, balansdagi kreditlarni boshqarish, shaxsiy galereyangiz tarixini yuritish va xizmat sifatini yaxshilash uchun qo'llaniladi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Ma'lumotlar xavfsizligi va saqlanishi</p>
                    <p>Yuklangan fayllaringiz va foydalanuvchi hisobi ma'lumotlari Firebase Authentication hamda Firestore xavfsizlik qoidalari orqali himoyalangan. Shaxsiy ma'lumotlaringiz uchinchi shaxslarga berilmaydi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Yordam va aloqa</p>
                    <p>Ushbu Maxfiylik siyosati yoki ma'lumotlaringizdan foydalanish bo'yicha savollaringiz bo'lsa, biz bilan bog'laning.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {isTermsModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTermsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glow-box rounded-[32px] p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh] text-[#1a2030] dark:text-white"
            >
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#6b7a8d] hover:text-[#0d1520] dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="font-['Orbitron'] text-xl md:text-2xl font-bold mb-6 text-[#1a7aad] dark:text-[#4fc3f7]">{t.footerTerms}</h2>
              
              <div className="space-y-4 text-xs md:text-sm leading-relaxed overflow-y-auto max-h-[60vh] pr-2 text-[#1a2030] dark:text-white/80">
                {appLanguage === 'English' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Agreement to Terms</p>
                    <p>By accessing Pixo AI, you agree to comply with and be bound by these Terms of Service. If you do not agree, you are prohibited from using the generation services.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Credit & Payment System</p>
                    <p>Generation requests consume internal Credits. Credits are purchased via manual transaction through Telegram. All credit consumptions for poster generation tasks are final and non-refundable.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Acceptable Use Policy</p>
                    <p>You agree not to upload any illegal, adult, copyrighted, or offensive material for poster creation. We reserve the right to suspend accounts displaying abusive behavior.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Ownership of Generated Content</p>
                    <p>You retain full copyright and commercial usage rights over the poster designs created using the Pixo AI generator, subject to complete credit payments.</p>
                  </>
                ) : appLanguage === 'Russian' ? (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Согласие с условиями</p>
                    <p>Используя Pixo AI, вы соглашаетесь соблюдать настоящие Условия использования. Если вы не согласны с условиями, использование сервиса генерации запрещено.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Система кредитов и платежи</p>
                    <p>Для создания постеров используются внутренние кредиты. Покупка кредитов осуществляется через поддержку Telegram. Списанные за генерацию кредиты возврату не подлежат.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Правила использования</p>
                    <p>Запрещается загружать незаконный контент, порнографию, материалы, защищенные чужим авторским правом, или агрессивный медиаконтент. Мы оставляем за собой право блокировать нарушителей.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Права на сгенерированный контент</p>
                    <p>Вы владеете всеми коммерческими правами на сгенерированные вами рекламные материалы и постеры, созданные в сервисе Pixo AI.</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-[#1a2030] dark:text-white">1. Shartlarga rozilik</p>
                    <p>Pixo AI xizmatidan foydalanish orqali siz ushbu Foydalanish shartlariga to'liq rozilik bildirasiz. Shartlarga rozi bo'lmasangiz, saytdan foydalanish tavsiya etilmaydi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">2. Kreditlar va to'lovlar</p>
                    <p>Posterlar yaratish uchun ichki kreditlardan foydalaniladi. Kreditlar Telegram yordam xizmati orqali sotib olinadi. Generatsiya uchun sarflangan kreditlar qaytarib berilmaydi.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">3. Foydalanish qoidalari</p>
                    <p>Tizimga noqonuniy, mualliflik huquqi buzilgan, behayo yoki haqoratli rasmlarni yuklash taqiqlanadi. Qoidalarni buzgan foydalanuvchilar bloklanishi mumkin.</p>
                    
                    <p className="font-bold text-[#1a2030] dark:text-white">4. Mualliflik huquqi</p>
                    <p>Pixo AI generatori orqali yaratilgan barcha tayyor posterlar va tijoriy vizuallarga bo'lgan to'liq mualliflik huquqlari sizda qoladi.</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (`;

replaceApp('Render Privacy and Terms modals', modalsTarget, modalsReplacement);

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
