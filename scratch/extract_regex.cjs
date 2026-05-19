const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\М313\\.gemini\\antigravity\\brain\\6c939afc-de9e-4b38-a3f5-db12fb6d41ef\\.system_generated\\logs\\overview.txt';
const content = fs.readFileSync(logFile, 'utf8');

const lines = content.split('\n');
const out = [];
let matchCount = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('isSolo') || line.includes('soloPrompts') || line.includes('soloP')) {
    matchCount++;
    out.push(`--- MATCH ${matchCount} ---`);
    out.push(line);
  }
}

fs.writeFileSync('scratch/raw_matches.txt', out.join('\n\n'), 'utf8');
console.log('Matches written directly as UTF-8.');
