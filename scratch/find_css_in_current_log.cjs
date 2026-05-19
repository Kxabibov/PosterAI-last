const fs = require('fs');
const logFile = 'C:\\Users\\М313\\.gemini\\antigravity\\brain\\bfd734ed-6a55-4fed-b9b5-09cf04f4fa56\\.system_generated\\logs\\overview.txt';

if (fs.existsSync(logFile)) {
  const content = fs.readFileSync(logFile, 'utf8');
  const keywords = ['pricing-card-animated', 'comparison-split-wrapper'];
  const out = [];
  keywords.forEach(kw => {
    let pos = 0;
    out.push(`=== Matches for: ${kw} ===`);
    while (true) {
      pos = content.indexOf(kw, pos);
      if (pos === -1) break;
      const snippet = content.substring(Math.max(0, pos - 100), Math.min(content.length, pos + 1500));
      out.push(snippet.replace(/\\n/g, '\n').replace(/\\"/g, '"'));
      out.push('\n----------------------------------------\n');
      pos += kw.length;
    }
  });
  fs.writeFileSync('scratch/css_current_matches.txt', out.join('\n'), 'utf8');
  console.log('Saved directly as UTF-8.');
} else {
  console.log('Log file not found');
}
