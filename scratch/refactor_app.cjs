const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8');

// 1. Replace imports
app = app.replace(
  /import \{\s*LogOut,/,
  `import {\n  Sun,\n  Moon,\n  LogOut,`
);

// 2. Replace Background component
app = app.replace(
  /const Background = \(\) => \([\s\S]*?<\/div>\n\);/,
  `const Background = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
    <video
      key={theme}
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover"
    >
      <source src={\`/\${theme}.mp4\`} type="video/mp4" />
    </video>
    <div className={\`absolute inset-0 transition-colors duration-700 \${theme === 'dark' ? 'bg-black/60' : 'bg-white/30'}\`}></div>
  </div>
);`
);

// 3. Add Theme State and Effects
app = app.replace(
  /const \[user, setUser\] = useState<User \| null>\(null\);/,
  `const [theme, setTheme] = useState<'light'|'dark'>('light');\n  const [user, setUser] = useState<User | null>(null);`
);

app = app.replace(
  /const t = translations\[appLanguage\];/,
  `const t = translations[appLanguage];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);`
);

// 4. Update the Nav block (Add Theme Toggle)
app = app.replace(
  /<div className="flex items-center gap-6">/,
  `<div className="flex items-center gap-6">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 glow-box-sm rounded-full text-[#1a2030] dark:text-white hover:text-[#1a7aad] dark:hover:text-[#4fc3f7] transition-all flex items-center justify-center"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>`
);

// 5. Remove the 'if (!user)' block
const ifNotUserIndex = app.indexOf('if (!user) {');
if (ifNotUserIndex !== -1) {
  // Find the end of this if block. It ends with '    );' and '  }'
  // We can use a simple trick since we know exactly how it looks
  const endBlockIndex = app.indexOf('return (', ifNotUserIndex + 1);
  if (endBlockIndex !== -1) {
    app = app.slice(0, ifNotUserIndex) + app.slice(endBlockIndex);
  }
}

// 6. Update the main return's <Background /> to pass theme
app = app.replace(
  /<Background \/>/,
  `<Background theme={theme} />`
);

// 7. Update start button logic (flowStep 0)
app = app.replace(
  /onClick=\{\(\) => setFlowStep\(1\)\}\s*className="group btn-glossy gap-2 md:gap-3 text-\[#1a7aad\] px-6 py-3 md:px-8 md:py-4 font-bold text-sm"/,
  `onClick={() => {
                          if (!user) {
                            signIn();
                          } else {
                            setFlowStep(1);
                          }
                        }}
                        className="group btn-glossy gap-2 md:gap-3 text-[#1a7aad] dark:text-[#4fc3f7] px-6 py-3 md:px-8 md:py-4 font-bold text-sm"`
);

// 8. Update My Inventory button logic
app = app.replace(
  /onClick=\{\(\) => \{ setFlowStep\(6\); setAdminTab\(null\); \}\}/,
  `onClick={() => { 
              if (!user) { signIn(); return; }
              setFlowStep(6); setAdminTab(null); 
            }}`
);

// 9. Optimize Tailwind classes for dark mode and video bg
app = app.replace(/bg-\[#f4f7fa\]/g, 'bg-transparent');
app = app.replace(/text-\[#1a2030\]/g, 'text-[#1a2030] dark:text-white');
app = app.replace(/text-\[#6b7a8d\]/g, 'text-[#6b7a8d] dark:text-gray-300');
app = app.replace(/bg-white\/60/g, 'bg-white/60 dark:bg-black/40');
app = app.replace(/bg-white\/5(?!0)/g, 'bg-white/5 dark:bg-white/10');
app = app.replace(/bg-white(?!\/)/g, 'bg-white dark:bg-gray-900');
app = app.replace(/border-\[#dde3ea\]/g, 'border-[#dde3ea] dark:border-white/20');
app = app.replace(/border-\[#4fc3f7\]\/10/g, 'border-[#4fc3f7]/10 dark:border-[#4fc3f7]/30');

// 10. Replace Syne with Orbitron and make headings larger
app = app.replace(/font-\['Syne'\]/g, "font-['Orbitron']");

// Make headings larger. Using regex to find font-['Orbitron'] and its text- size
app = app.replace(/font-\['Orbitron'\](.*?)text-xl/g, "font-['Orbitron']$1text-2xl");
app = app.replace(/font-\['Orbitron'\](.*?)text-2xl(.*?)md:text-4xl/g, "font-['Orbitron']$1text-4xl$2md:text-6xl");
app = app.replace(/font-\['Orbitron'\](.*?)text-lg/g, "font-['Orbitron']$1text-xl");

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
