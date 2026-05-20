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

// Update the mobile Menu button to support dark mode text color
const menuButtonTarget = `        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[#1a2030]"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>`;

const menuButtonReplacement = `        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[#1a2030] dark:text-white"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>`;

replaceApp('Add dark:text-white to mobile menu toggle button', menuButtonTarget, menuButtonReplacement);

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
