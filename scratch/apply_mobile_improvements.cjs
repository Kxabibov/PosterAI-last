const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

function replaceApp(desc, target, replacement) {
  if (!app.includes(target)) {
    console.error(`ERROR: target not found in App.tsx for: ${desc}`);
    process.exit(1);
  }
  app = app.replace(target, replacement);
  console.log(`SUCCESS: ${desc}`);
}

// 1. Add credit count next to Pixo AI in phone mode (header)
const brandHeaderTarget = `<span className="font-['Orbitron'] text-lg md:text-lg font-extrabold tracking-tighter bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">
              Pixo AI
            </span>`;

const brandHeaderReplacement = `<span className="font-['Orbitron'] text-lg md:text-lg font-extrabold tracking-tighter bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">
              Pixo AI
            </span>
            {profile && (
              <span className="md:hidden ml-2 font-['Orbitron'] text-[10px] font-bold text-[#1a7aad] dark:text-[#4fc3f7] bg-[#4fc3f7]/10 px-2 py-0.5 rounded-full border border-[#4fc3f7]/20">
                {profile.credits} cr
              </span>
            )}`;

replaceApp('Add credit count in phone mode next to Pixo AI', brandHeaderTarget, brandHeaderReplacement);

// 2. Change Mobile Menu Overlay into a smaller, sleek dropdown card that does not fully cover the screen, with smaller text size, and comparison section removed.
const mobileMenuOverlayTarget = `      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#dde3ea] dark:border-white/20">
              <span className="font-['Orbitron'] text-lg font-extrabold tracking-tighter bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">
                Pixo AI
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#1a2030]">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col p-6 gap-6">
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xl font-bold">{t.howItWorksTitle}</a>
              <a href="#examples" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xl font-bold">{t.exploreExamples}</a>
              <a href="#comparison" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xl font-bold">{t.compTitle}</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xl font-bold">{t.pricingTitle}</a>
              
              <div className="mt-auto">
                <p className="text-xs font-bold text-[#6b7a8d] uppercase tracking-wider mb-3">System Language</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['English', 'Russian', 'Uzbek'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => {
                        setAppLanguage(lang);
                        setIsMobileMenuOpen(false);
                      }}
                      className={\`py-3 rounded-xl text-sm font-bold transition-all border \${appLanguage === lang ? 'bg-[#4fc3f7]/15 text-[#1a7aad] border-[#4fc3f7]/30' : 'bg-white/5 dark:bg-white/10 border-[#dde3ea] dark:border-white/20 text-[#6b7a8d]'
                        }\`}
                    >
                      {lang === 'English' ? 'EN' : lang === 'Russian' ? 'RU' : 'UZ'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>`;

const mobileMenuOverlayReplacement = `      {/* Mobile Menu Dropdown Modal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 z-[200] w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#dde3ea]/80 dark:border-white/10 p-5 flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#dde3ea]/50 dark:border-white/10">
              <span className="font-['Orbitron'] text-sm font-extrabold tracking-tighter bg-gradient-to-br from-[#1a7aad] to-[#4fc3f7] bg-clip-text text-transparent">
                Pixo AI
              </span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-[#6b7a8d] hover:text-[#0d1520] transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#1a7aad] transition-colors">{t.howItWorksTitle}</a>
              <a href="#examples" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#1a7aad] transition-colors">{t.exploreExamples}</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="font-['Orbitron'] text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-[#1a7aad] transition-colors">{t.pricingTitle}</a>
            </div>
            
            <div className="pt-2 border-t border-[#dde3ea]/50 dark:border-white/10">
              <p className="text-[9px] font-bold text-[#6b7a8d] uppercase tracking-wider mb-2">Language</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['English', 'Russian', 'Uzbek'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setAppLanguage(lang);
                      setIsMobileMenuOpen(false);
                    }}
                    className={\`py-1.5 rounded-lg text-[10px] font-bold transition-all border \${appLanguage === lang ? 'bg-[#4fc3f7]/15 text-[#1a7aad] border-[#4fc3f7]/30' : 'bg-white/5 dark:bg-white/10 border-[#dde3ea] dark:border-white/20 text-[#6b7a8d]'
                      }\`}
                  >
                    {lang === 'English' ? 'EN' : lang === 'Russian' ? 'RU' : 'UZ'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>`;

replaceApp('Update mobile menu to a small drop dropdown overlay', mobileMenuOverlayTarget, mobileMenuOverlayReplacement);

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
