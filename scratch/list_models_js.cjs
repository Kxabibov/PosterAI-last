const fs = require('fs');
let key = '';
if (fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf8');
  const match = env.match(/GEMINI_API_KEY=(.*)/);
  if (match) key = match[1].trim().replace(/['"]/g, '');
}
if (!key) key = process.env.GEMINI_API_KEY;
console.log('Using Key:', key ? key.substring(0, 10) + '...' : 'none');
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
  .then(r => r.json())
  .then(data => {
    if (data.models) {
      console.log(data.models.map(m => m.name).filter(m => m.includes('image') || m.includes('gemini-3') || m.includes('flash')));
    } else {
      console.log('Error:', data);
    }
  })
  .catch(e => console.error(e));
