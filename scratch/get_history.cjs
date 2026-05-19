const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\М313\\.gemini\\antigravity\\brain\\6c939afc-de9e-4b38-a3f5-db12fb6d41ef\\.system_generated\\logs\\overview.txt';
if (!fs.existsSync(logFile)) {
  console.log('Log file not found');
  process.exit(1);
}

const content = fs.readFileSync(logFile, 'utf8');
const lines = content.split('\n');

for (const line of lines) {
  if (line.includes('"step_index":54') || line.includes('"step_index": 54')) {
    try {
      const parsed = JSON.parse(line);
      fs.writeFileSync('scratch/history_step54.json', JSON.stringify(parsed, null, 2));
      console.log('Successfully saved to scratch/history_step54.json');
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  }
}
