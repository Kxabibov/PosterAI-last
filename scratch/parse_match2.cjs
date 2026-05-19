const fs = require('fs');
const content = fs.readFileSync('scratch/match2_content.txt', 'utf8');

// Find all matches of credit deduction or isSolo checks
const keywords = ['credits', 'isSolo', 'soloPrompts', 'adminTab', 'tiles'];
const matches = [];

for (const kw of keywords) {
  let pos = 0;
  while (true) {
    pos = content.indexOf(kw, pos);
    if (pos === -1) break;
    // Get 300 characters around pos
    const snippet = content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + 300));
    // Clean up escaped newlines to make readable
    const cleanSnippet = snippet.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    matches.push(`=== Keyword: ${kw} ===\n${cleanSnippet}\n`);
    pos += kw.length;
  }
}

fs.writeFileSync('scratch/match2_parsed.txt', matches.join('\n\n'), 'utf8');
console.log('Parsed matches saved to scratch/match2_parsed.txt');
