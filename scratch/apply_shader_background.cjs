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

// 1. Add ShaderAnimation import at the top of App.tsx
const importTarget = `import { GoogleGenAI } from '@google/genai';`;
const importReplacement = `import { GoogleGenAI } from '@google/genai';
import { ShaderAnimation } from './components/ui/shader-animation';`;

replaceApp('Add ShaderAnimation import', importTarget, importReplacement);

// 2. Replace Background component rendering video with ShaderAnimation
const backgroundTarget = `const Background = ({ theme }: { theme: 'light' | 'dark' }) => (
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
    <div className={\`absolute inset-0 transition-colors duration-700 backdrop-blur-[2px] \${theme === 'dark' ? 'bg-[#0a0d12]/10' : 'bg-[#f4f7fa]/10'}\`}></div>
  </div>
);`;

const backgroundReplacement = `const Background = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
    <ShaderAnimation />
    <div className={\`absolute inset-0 transition-colors duration-700 backdrop-blur-[2px] \${theme === 'dark' ? 'bg-[#0a0d12]/45' : 'bg-[#f4f7fa]/75'}\`}></div>
  </div>
);`;

replaceApp('Replace video Background component with ShaderAnimation', backgroundTarget, backgroundReplacement);

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
