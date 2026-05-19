const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\М313\\.gemini\\antigravity\\brain\\32b2f240-fc35-43c9-aa63-b2ab14aadc03\\.system_generated\\logs\\overview.txt';
if (fs.existsSync(logFile)) {
  const content = fs.readFileSync(logFile, 'utf8');
  console.log('File size:', content.length);
  const lines = content.split('\n');
  const matches = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('isSolo') || line.includes('soloP')) {
      matches.push(`Line ${i+1}: ${line.substring(0, 1000)}...`);
    }
  }
  fs.writeFileSync('scratch/matches_32b2f240.txt', matches.join('\n\n'));
  console.log('Matches saved successfully.');
} else {
  console.log('Log file not found');
}
