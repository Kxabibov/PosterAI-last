const fs = require('fs');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const lines = app.split('\n');
const newLines = [...lines.slice(0, 1038), ...lines.slice(1080)];
fs.writeFileSync('src/App.tsx', newLines.join('\n'));
console.log('Fixed syntax error in App.tsx');
