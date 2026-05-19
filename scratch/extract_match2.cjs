const fs = require('fs');
const content = fs.readFileSync('scratch/raw_matches.txt', 'utf8');

const parts = content.split('--- MATCH 2 ---');
if (parts.length > 1) {
  const match2Content = parts[1].trim();
  // Write to a file directly to inspect
  fs.writeFileSync('scratch/match2_content.txt', match2Content, 'utf8');
  console.log('Saved match 2 content to scratch/match2_content.txt');
} else {
  console.log('Match 2 not found');
}
