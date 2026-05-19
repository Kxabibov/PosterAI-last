const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('flowStep ===') || l.includes('setFlowStep(')) {
    console.log(idx + 1, l.trim());
  }
});
