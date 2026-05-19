const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\М313\\.gemini\\antigravity\\brain\\bfd734ed-6a55-4fed-b9b5-09cf04f4fa56\\.system_generated\\logs\\overview.txt';
if (!fs.existsSync(logFile)) {
  console.log('Log file not found at:', logFile);
  process.exit(1);
}

const content = fs.readFileSync(logFile, 'utf8');
const lines = content.split('\n');

const matches = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('isSolo') || line.includes('soloPrompts') || line.includes('solo') || line.includes('Solo') || line.includes('5 credits')) {
    matches.push(`Line ${i+1}: ${line.substring(0, 1000)}...`);
  }
}

fs.writeFileSync('scratch/current_solo_matches.txt', matches.join('\n\n'));
console.log('Matches saved successfully.');
