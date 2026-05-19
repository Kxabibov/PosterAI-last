const fs = require('fs');
const logFile = 'C:\\Users\\М313\\.gemini\\antigravity\\brain\\6c939afc-de9e-4b38-a3f5-db12fb6d41ef\\.system_generated\\logs\\overview.txt';
if (!fs.existsSync(logFile)) {
  console.log('Log file not found');
  process.exit(1);
}

const content = fs.readFileSync(logFile, 'utf8');
const lines = content.split('\n');

const matches = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('isSolo') || line.includes('soloPrompts') || line.includes('soloP')) {
    matches.push(`Line ${i+1}: ${line.substring(0, 1000)}...`);
  }
}

fs.writeFileSync('scratch/solo_matches.txt', matches.join('\n\n'));
console.log('Matches saved successfully.');
