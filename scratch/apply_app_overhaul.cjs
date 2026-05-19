const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

function doReplace(desc, target, replacement) {
  if (!app.includes(target)) {
    console.error(`ERROR: Target not found for: ${desc}`);
    const snippet = target.substring(0, 100);
    console.error(`Snippet attempted:\n${snippet}`);
    process.exit(1);
  }
  app = app.replace(target, replacement);
  console.log(`SUCCESS: ${desc}`);
}

// 1. Update adminTab state type definition
const adminTabTarget = `const [adminTab, setAdminTab] = useState<'users' | 'prompts' | null>(null);`;
const adminTabReplacement = `const [adminTab, setAdminTab] = useState<'users' | 'prompts' | 'soloPrompts' | null>(null);
  const [styleType, setStyleType] = useState<'standard' | 'solo'>('standard');`;

doReplace('Update adminTab state definition and add styleType', adminTabTarget, adminTabReplacement);

// 2. Add translation keys to English, Russian, Uzbek blocks
const englishTranslationTarget = `      saveTemplate: "Save Template",
      cancel: "Cancel",`;
const englishTranslationReplacement = `      saveTemplate: "Save Template",
      cancel: "Cancel",
      standardPrompts: "Standard Styles (4 images)",
      soloPrompts: "Solo Styles (1 image)",`;

doReplace('Add English standard/solo translation keys', englishTranslationTarget, englishTranslationReplacement);

const russianTranslationTarget = `      saveTemplate: "Сохранить",
      cancel: "Отмена",`;
const russianTranslationReplacement = `      saveTemplate: "Сохранить",
      cancel: "Отмена",
      standardPrompts: "Стандартные (4 изображения)",
      soloPrompts: "Соло (1 изображение)",`;

doReplace('Add Russian standard/solo translation keys', russianTranslationTarget, russianTranslationReplacement);

const uzbekTranslationTarget = `      saveTemplate: "Saqlash",
      cancel: "Bekor qilish",`;
const uzbekTranslationReplacement = `      saveTemplate: "Saqlash",
      cancel: "Bekor qilish",
      standardPrompts: "Standart (4 ta rasm)",
      soloPrompts: "Yakka (1 ta rasm)",`;

doReplace('Add Uzbek standard/solo translation keys', uzbekTranslationTarget, uzbekTranslationReplacement);

// 3. Seed defaults additions
const defaultsSeederTarget = `        const defaults = [
          { name: 'Abstract', icon: '✦', description: 'Modern, elegant with artistic composition', promptText: ABSTRACT_PROMPT },
          { name: 'Minimalistic', icon: '◻', description: 'Clean studio photography', promptText: MINIMAL_PROMPT }
        ];`;

const defaultsSeederReplacement = `        const defaults = [
          { name: 'Abstract', icon: '✦', description: 'Modern, elegant with artistic composition', promptText: ABSTRACT_PROMPT },
          { name: 'Minimalistic', icon: '◻', description: 'Clean studio photography', promptText: MINIMAL_PROMPT },
          { name: 'Studio Solo', icon: '✦', description: 'Single high-quality studio portrait', promptText: MINIMAL_PROMPT.replace('2x2 grid image (4 images in one frame)', 'single product image'), isSolo: true }
        ];`;

doReplace('Add defaults seeder template', defaultsSeederTarget, defaultsSeederReplacement);

// 4. Update credit validation and splitting logic in startGeneration
const creditsValidationTarget = `    if (profile.credits < CREDITS_PER_GEN) {
      addToast(\`Insufficient credits. You need \${CREDITS_PER_GEN} credits.\`, 'error');
      return;
    }`;

const creditsValidationReplacement = `    const cost = selectedStyle.isSolo ? 5 : CREDITS_PER_GEN;
    if (profile.credits < cost) {
      addToast(\`Insufficient credits. You need \${cost} credits.\`, 'error');
      return;
    }`;

doReplace('Update credits validation for solo prompts', creditsValidationTarget, creditsValidationReplacement);

const splitImageTarget = `      setGenStep(4);
      // Split image into 4 tiles
      const tiles = await splitImage(generatedImageB64);
      setGeneratedTiles(tiles);`;

const splitImageReplacement = `      setGenStep(4);
      let tiles: string[] = [];
      if (selectedStyle.isSolo) {
        tiles = [generatedImageB64];
      } else {
        // Split image into 4 tiles
        tiles = await splitImage(generatedImageB64);
      }
      setGeneratedTiles(tiles);`;

doReplace('Bypass splitImage for solo prompts', splitImageTarget, splitImageReplacement);

const deductCreditsTarget = `      // Deduct credits
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { credits: profile.credits - CREDITS_PER_GEN });
      setProfile(prev => prev ? { ...prev, credits: prev.credits - CREDITS_PER_GEN } : null);`;

const deductCreditsReplacement = `      // Deduct credits
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { credits: profile.credits - cost });
      setProfile(prev => prev ? { ...prev, credits: prev.credits - cost } : null);`;

doReplace('Update credit deduction for solo prompts', deductCreditsTarget, deductCreditsReplacement);

// 5. Update savePrompt form values to read isSolo checked state
const savePromptDataTarget = `      const data: any = {
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        icon: (form.elements.namedItem('icon') as HTMLInputElement).value,
        description: (form.elements.namedItem('description') as HTMLInputElement).value,
        promptText: (form.elements.namedItem('promptText') as HTMLTextAreaElement).value,
      };`;

const savePromptDataReplacement = `      const data: any = {
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        icon: (form.elements.namedItem('icon') as HTMLInputElement).value,
        description: (form.elements.namedItem('description') as HTMLInputElement).value,
        promptText: (form.elements.namedItem('promptText') as HTMLTextAreaElement).value,
        isSolo: (form.elements.namedItem('isSolo') as HTMLInputElement).checked
      };`;

doReplace('Include isSolo field in savePrompt data', savePromptDataTarget, savePromptDataReplacement);

// 6. Update header admin buttons to show Solo Prompts tab
const headerAdminButtonsTarget = `          {profile?.isAdmin && (
            <>
              <button
                onClick={() => { setAdminTab(adminTab === 'prompts' ? null : 'prompts'); setFlowStep(0); }}
                className={\`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all \${adminTab === 'prompts' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
              >
                <Sparkles size={14} />
                {t.promptLib}
              </button>
              <button
                onClick={() => { setAdminTab(adminTab === 'users' ? null : 'users'); setFlowStep(0); }}
                className={\`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all \${adminTab === 'users' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
              >
                <ShieldCheck size={14} />
                {adminTab === 'users' ? t.exitAdmin : t.admin}
              </button>
            </>
          )}`;

const headerAdminButtonsReplacement = `          {profile?.isAdmin && (
            <>
              <button
                onClick={() => { setAdminTab(adminTab === 'prompts' ? null : 'prompts'); setFlowStep(0); }}
                className={\`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all \${adminTab === 'prompts' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
              >
                <Sparkles size={14} />
                {t.promptLib}
              </button>
              <button
                onClick={() => { setAdminTab(adminTab === 'soloPrompts' ? null : 'soloPrompts'); setFlowStep(0); }}
                className={\`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all \${adminTab === 'soloPrompts' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
              >
                <Sparkles size={14} />
                {appLanguage === 'English' ? 'Solo Prompts' : appLanguage === 'Russian' ? 'Соло промпты' : 'Yakka prompstlar'}
              </button>
              <button
                onClick={() => { setAdminTab(adminTab === 'users' ? null : 'users'); setFlowStep(0); }}
                className={\`flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-all \${adminTab === 'users' ? 'btn-glossy text-[#1a7aad]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
              >
                <ShieldCheck size={14} />
                {adminTab === 'users' ? t.exitAdmin : t.admin}
              </button>
            </>
          )}`;

doReplace('Update desktop header with Solo Prompts admin button', headerAdminButtonsTarget, headerAdminButtonsReplacement);

// 7. Update admin panels conditional rendering for prompts tab
const adminPromptsPanelTarget = `              {adminTab === 'prompts' && (`;
const adminPromptsPanelReplacement = `              {(adminTab === 'prompts' || adminTab === 'soloPrompts') && (`;

doReplace('Expand admin prompts tab condition', adminPromptsPanelTarget, adminPromptsPanelReplacement);

const adminPromptsHeaderTarget = `                    <h2 className="font-['Orbitron'] text-xl font-bold">{t.promptLib}</h2>`;
const adminPromptsHeaderReplacement = `                    <h2 className="font-['Orbitron'] text-xl font-bold">{adminTab === 'soloPrompts' ? (appLanguage === 'English' ? 'Solo Prompts' : appLanguage === 'Russian' ? 'Соло промпты' : 'Yakka prompstlar') : t.promptLib}</h2>`;

doReplace('Customize admin prompts list header', adminPromptsHeaderTarget, adminPromptsHeaderReplacement);

const adminPromptsListMapTarget = `                      {prompts.map(p => (`;
const adminPromptsListMapReplacement = `                      {prompts.filter(p => adminTab === 'soloPrompts' ? p.isSolo === true : !p.isSolo).map(p => (`;

doReplace('Filter admin prompts list by isSolo', adminPromptsListMapTarget, adminPromptsListMapReplacement);

// 8. Update style selection page (Step 3) to show Standard/Solo tabs and filter prompts
const step3TitleTarget = `                    <div className="text-center">
                      <h2 className="font-['Orbitron'] text-lg font-bold mb-2">{t.step3Title}</h2>
                      <p className="text-[#6b7a8d] text-sm">{t.step3Desc}</p>
                    </div>`;

const step3TitleReplacement = `                    <div className="text-center">
                      <h2 className="font-['Orbitron'] text-lg font-bold mb-2">{t.step3Title}</h2>
                      <p className="text-[#6b7a8d] text-sm mb-4">{t.step3Desc}</p>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                      <button
                        onClick={() => { setStyleType('standard'); setSelectedStyle(null); }}
                        className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${styleType === 'standard' ? 'btn-glossy text-[#1a7aad] border-[#4fc3f7]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
                      >
                        ⚡ {translations[appLanguage].standardPrompts || 'Standard Styles (4 images)'} (10 Credits)
                      </button>
                      <button
                        onClick={() => { setStyleType('solo'); setSelectedStyle(null); }}
                        className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${styleType === 'solo' ? 'btn-glossy text-[#1a7aad] border-[#4fc3f7]' : 'glow-box-sm text-[#6b7a8d] hover:text-[#0d1520]'}\`}
                      >
                        ✦ {translations[appLanguage].soloPrompts || 'Solo Styles (1 image)'} (5 Credits)
                      </button>
                    </div>`;

doReplace('Add Standard/Solo tabs in Step 3', step3TitleTarget, step3TitleReplacement);

const step3PromptsMapTarget = `                        {prompts.map(p => (`;
const step3PromptsMapReplacement = `                        {prompts.filter(p => styleType === 'solo' ? p.isSolo === true : !p.isSolo).map(p => (`;

doReplace('Filter Step 3 styles list', step3PromptsMapTarget, step3PromptsMapReplacement);

// Update credit cost text dynamically
const genCostTarget = `                      <p className="mt-4 text-[11px] text-[#6b7a8d]">{t.genCost}</p>`;
const genCostReplacement = `                      <p className="mt-4 text-[11px] text-[#6b7a8d]">
                        {selectedStyle?.isSolo 
                          ? (appLanguage === 'English' ? 'Costs 5 credits per generation' : appLanguage === 'Russian' ? 'Стоимость: 5 кредитов' : 'Har bir yaratish uchun 5 kredit')
                          : t.genCost}
                      </p>`;

doReplace('Update step 3 credit cost dynamically', genCostTarget, genCostReplacement);

// 9. Update Step 4 loading text dynamically
const step4DescTarget = `                      <p className="text-[#6b7a8d] text-sm md:text-lg max-w-md mx-auto leading-relaxed">{t.genDesc}</p>`;
const step4DescReplacement = `                      <p className="text-[#6b7a8d] text-sm md:text-lg max-w-md mx-auto leading-relaxed">
                        {selectedStyle?.isSolo 
                          ? (appLanguage === 'English' ? 'Our AI is crafting your custom poster' : appLanguage === 'Russian' ? 'Наш ИИ готовит ваш уникальный постер' : 'Bizning AI siz uchun maxsus poster yaratmoqda')
                          : t.genDesc}
                      </p>`;

doReplace('Update loading screen description dynamically', step4DescTarget, step4DescReplacement);

// 10. Update Step 5 results grid layout to center single image
const step5GridTarget = `                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      {generatedTiles.map((tile, i) => (
                        <div key={i} className="group relative aspect-square bg-white/5 dark:bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 overflow-hidden">
                          <img src={tile} className="w-full h-full object-cover" alt={\`Result \${i + 1}\`} />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => downloadTile(tile, i)}
                              className="btn-glossy text-[#1a2030] !bg-white/80 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                            >
                              <Download size={14} />
                              {t.download}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>`;

const step5GridReplacement = `                    <div className={generatedTiles.length === 1 ? "max-w-md mx-auto aspect-[4/5] bg-white/5 dark:bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 overflow-hidden relative group" : "grid grid-cols-2 gap-2 md:gap-4"}>
                      {generatedTiles.map((tile, i) => (
                        generatedTiles.length === 1 ? (
                          <React.Fragment key={i}>
                            <img src={tile} className="w-full h-full object-cover animate-fade-in" alt="Result Solo" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => downloadTile(tile, i)}
                                className="btn-glossy text-[#1a2030] !bg-white/80 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                              >
                                <Download size={14} />
                                {t.download}
                              </button>
                            </div>
                          </React.Fragment>
                        ) : (
                          <div key={i} className="group relative aspect-square bg-white/5 dark:bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30 overflow-hidden">
                            <img src={tile} className="w-full h-full object-cover" alt={\`Result \${i + 1}\`} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => downloadTile(tile, i)}
                                className="btn-glossy text-[#1a2030] !bg-white/80 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                              >
                                <Download size={14} />
                                {t.download}
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>`;

doReplace('Center single result image in Step 5', step5GridTarget, step5GridReplacement);

// 11. Add isSolo checkbox in Prompt Modal
const promptModalTextareaTarget = `                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6b7a8d] uppercase">{t.promptText}</label>
                  <textarea name="promptText" defaultValue={editingPrompt?.promptText} className="w-full glow-box-sm rounded-xl px-4 py-3 text-xs font-mono min-h-[200px] focus:outline-none focus:border-[#4fc3f7] leading-relaxed" required />
                </div>`;

const promptModalTextareaReplacement = `                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#6b7a8d] uppercase">{t.promptText}</label>
                  <textarea name="promptText" defaultValue={editingPrompt?.promptText} className="w-full glow-box-sm rounded-xl px-4 py-3 text-xs font-mono min-h-[200px] focus:outline-none focus:border-[#4fc3f7] leading-relaxed" required />
                </div>
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="isSoloCheckbox"
                    name="isSolo"
                    defaultChecked={editingPrompt ? !!editingPrompt.isSolo : adminTab === 'soloPrompts'}
                    className="w-4 h-4 rounded text-[#4fc3f7] focus:ring-[#4fc3f7] bg-white/5 dark:bg-white/10 border-white/20"
                  />
                  <label htmlFor="isSoloCheckbox" className="text-xs font-bold text-[#6b7a8d] uppercase cursor-pointer">
                    Is Solo Style (Costs 5 credits, single output)
                  </label>
                </div>`;

doReplace('Add isSolo checkbox in prompt modal', promptModalTextareaTarget, promptModalTextareaReplacement);

// 12. Remove the animated blob from Step Cards (How It Works section) so that ONLY the rotating glow border animates
const stepCardsBlobTarget = `                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={"blob-card " + step.color}
                  >
                    <div className="blob-card-blob"></div>
                    <div className="blob-card-bg">`;

const stepCardsBlobReplacement = `                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={"blob-card " + step.color}
                  >
                    <div className="blob-card-bg">`;

doReplace('Remove blob-card-blob animation elements from How It Works', stepCardsBlobTarget, stepCardsBlobReplacement);

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
