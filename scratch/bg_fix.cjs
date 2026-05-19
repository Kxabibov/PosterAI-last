const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const oldBg = 'const Background = () => (\\r?\\n.*?<div className="bg-area">\\r?\\n.*?<ul className="bg-circles">\\r?\\n.*?<li /><li /><li /><li /><li />\\r?\\n.*?<li /><li /><li /><li /><li />\\r?\\n.*?</ul>\\r?\\n.*?</div>\\r?\\n.*?);';

const newBg = `const Background = ({ theme }: { theme: 'light' | 'dark' }) => (
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
);`;

app = app.replace(new RegExp(oldBg), newBg);
fs.writeFileSync('src/App.tsx', app);
console.log('Video background updated');
