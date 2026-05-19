const fs = require('fs');
const content = fs.readFileSync('scratch/raw_matches.txt', 'utf8');

// Find occurrences of "credits" or "isSolo" or "tiles" in raw_matches.txt
const matches = [];
let pos = 0;
while (true) {
  pos = content.indexOf('isSolo', pos);
  if (pos === -1) break;
  // Get 400 characters around pos
  const snippet = content.substring(Math.max(0, pos - 200), Math.min(content.length, pos + 400));
  matches.push(`--- isSolo match ---\n${snippet}\n`);
  pos += 6;
}

pos = 0;
while (true) {
  pos = content.indexOf('credits', pos);
  if (pos === -1) break;
  const snippet = content.substring(Math.max(0, pos - 200), Math.min(content.length, pos + 400));
  matches.push(`--- credits match ---\n${snippet}\n`);
  pos += 7;
}

fs.writeFileSync('scratch/extracted_snippets.txt', matches.join('\n\n'));
console.log('Snippets saved successfully.');
