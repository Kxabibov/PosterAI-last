const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
let app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');

function replaceApp(desc, target, replacement) {
  if (!app.includes(target)) {
    console.error(`ERROR: target not found in App.tsx for: ${desc}`);
    process.exit(1);
  }
  app = app.replace(target, replacement);
  console.log(`SUCCESS: ${desc}`);
}

// Update the model parameter to gemini-3-pro-image-preview for highest quality asset generation
const proModelTarget = `      setGenStep(2);
      const result = await ai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: [
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: flattenedImageB64
            }
          }
        ],
        config: {
          responseModalities: ["IMAGE"]
        }
      });`;

const proModelReplacement = `      setGenStep(2);
      const result = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: flattenedImageB64
            }
          }
        ],
        config: {
          responseModalities: ["IMAGE"]
        }
      });`;

replaceApp('Set image model to gemini-3-pro-image-preview', proModelTarget, proModelReplacement);

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
