const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = '// --- Components ---';
const endStr = 'interface ToastProps {';

const startIndex = app.indexOf(startStr);
const endIndex = app.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const before = app.slice(0, startIndex + startStr.length);
  const after = app.slice(endIndex);
  
  const newBg = `\n\nconst Background = ({ theme }: { theme: 'light' | 'dark' }) => (
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
);\n\n`;

  app = before + newBg + after;
  fs.writeFileSync('src/App.tsx', app);
  console.log('Background updated perfectly.');
} else {
  console.log('Could not find boundaries.');
}
