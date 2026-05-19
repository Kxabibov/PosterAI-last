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
    const data = JSON.parse(line);
    const toolCall = data.tool_calls.find(tc => tc.name === 'multi_replace_file_content' || tc.name === 'replace_file_content');
    if (toolCall) {
      const chunks = typeof toolCall.args.ReplacementChunks === 'string' ? JSON.parse(toolCall.args.ReplacementChunks) : toolCall.args.ReplacementChunks;
      if (chunks) {
        chunks.forEach((c, idx) => {
          console.log(`--- Chunk ${idx + 1} (Start: ${c.StartLine}, End: ${c.EndLine}) ---`);
          console.log('TARGET:');
          console.log(c.TargetContent);
          console.log('REPLACEMENT:');
          console.log(c.ReplacementContent);
          console.log('\n');
        });
      } else {
        console.log('ReplacementContent:', toolCall.args.ReplacementContent);
      }
    }
  }
}
