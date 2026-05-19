const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

// Find the exact bad section boundaries
let startBad = -1, endBad = -1;
for (let i = 1330; i < 1600; i++) {
  const line = lines[i] || '';
  // The corruption starts where nav button code appears inside admin section
  if (line.includes('flex items-center gap-1 md:gap-2 px-2 py-1') && startBad === -1) {
    startBad = i - 1; // one line before (the "}}" line)
  }
  // Find where correct flow content resumes - key="flow"
  if (line.includes('"flow"') && endBad === -1 && startBad !== -1) {
    endBad = i + 1; // line after key="flow"
    break;
  }
}

console.log('Bad section: lines', startBad, 'to', endBad);
console.log('Line at startBad:', lines[startBad]);
console.log('Line at endBad:', lines[endBad]);

// The correct replacement for lines startBad to endBad
const replacement = `              {(adminTab === 'prompts' || adminTab === 'soloPrompts') && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-['Orbitron'] text-2xl font-bold">{adminTab === 'soloPrompts' ? 'Solo Prompt' : t.promptLib}</h2>
                    <button onClick={() => setIsPromptModalOpen(true)} className="flex items-center gap-2 btn-glossy text-[#1a7aad] px-4 py-2 rounded-lg text-sm font-semibold transition-all"><Plus size={16} />{t.newPrompt}</button>
                  </div>
                  <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {prompts.filter(p => adminTab === 'soloPrompts' ? p.isSolo : !p.isSolo).map(p => (
                        <div key={p.id} className="glow-box rounded-2xl p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {p.imageUrl ? (<img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30" />) : (<span className="text-lg w-12 h-12 flex items-center justify-center glow-box-sm rounded-lg">{p.icon}</span>)}
                              <div><div className="font-bold">{p.name}</div><div className="text-xs text-[#6b7a8d] dark:text-gray-300">{p.description}</div></div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingPrompt(p); setIsPromptModalOpen(true); }} className="p-2 glow-box-sm rounded-lg hover:text-[#1a7aad] transition-all"><Edit size={16} /></button>
                              <button onClick={() => deletePrompt(p.id)} className="p-2 glow-box-sm rounded-lg hover:text-[#ff7b72] transition-all"><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <div className="glow-box-sm rounded-lg p-4 text-xs text-[#6b7a8d] dark:text-gray-300 line-clamp-4 leading-relaxed font-mono">{p.promptText}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="flow"
`;

// Replace the lines
const before = lines.slice(0, startBad);
const after = lines.slice(endBad);

const newContent = [...before, replacement, ...after].join('\n');
fs.writeFileSync('src/App.tsx', newContent, 'utf8');

const newLines = newContent.split('\n');
console.log('Fixed! New total lines:', newLines.length);

// Verify the fix
for (let i = startBad - 2; i < startBad + 35; i++) {
  console.log(i, ':', newLines[i]?.substring(0, 80));
}
