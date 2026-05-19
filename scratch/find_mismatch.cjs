const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8').replace(/\r\n/g, '\n');
const lines = content.split('\n');

let braceCount = 0;
let parenCount = 0;
let bracketCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let c = 0; c < line.length; c++) {
    const char = line[c];
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === '(') parenCount++;
    else if (char === ')') parenCount--;
    else if (char === '[') bracketCount++;
    else if (char === ']') bracketCount--;
  }
  if (braceCount < 0) {
    console.log(`Brace mismatch (underflow) on line ${i+1}: braceCount = ${braceCount}`);
    braceCount = 0; // Reset to continue searching
  }
  if (parenCount < 0) {
    console.log(`Paren mismatch (underflow) on line ${i+1}: parenCount = ${parenCount}`);
    parenCount = 0;
  }
  if (bracketCount < 0) {
    console.log(`Bracket mismatch (underflow) on line ${i+1}: bracketCount = ${bracketCount}`);
    bracketCount = 0;
  }
}

console.log(`Final Counts:
Braces: ${braceCount}
Parens: ${parenCount}
Brackets: ${bracketCount}
`);
