const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\М313\\.gemini\\antigravity\\brain';
const out = [];

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) {
      if (f !== '.tempmediaStorage') {
        search(fp);
      }
    } else if (f === 'overview.txt') {
      const content = fs.readFileSync(fp, 'utf8');
      if (content.includes('isSolo') || content.includes('soloPrompts') || content.includes('soloP')) {
        out.push(`=== Matches in: ${fp} ===`);
        const lines = content.split('\n');
        lines.forEach((l, idx) => {
          if (l.includes('isSolo') || l.includes('soloPrompts') || l.includes('soloP')) {
            out.push(`Line ${idx+1}: ${l.substring(0, 1000)}`);
          }
        });
      }
    }
  }
}

search(brainDir);
fs.writeFileSync('scratch/all_brains_solo_matches.txt', out.join('\n\n'), 'utf8');
console.log('Done searching all brains.');
