const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.tsx');
const cssPath = path.join(__dirname, '../src/index.css');

let app = fs.readFileSync(appPath, 'utf8').replace(/\r\n/g, '\n');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

function replaceApp(desc, target, replacement) {
  if (!app.includes(target)) {
    console.error(`ERROR: target not found in App.tsx for: ${desc}`);
    process.exit(1);
  }
  app = app.replace(target, replacement);
  console.log(`SUCCESS (App): ${desc}`);
}

// 1. Fix the Image load in App.tsx to support crossOrigin = 'anonymous' if http URL
const imageLoadTarget = `      // Flatten the image to remove transparency (alpha channel) and convert to valid JPEG
      const flattenedImageB64 = await new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
            resolve(jpegDataUrl.split(',')[1]);
          } else {
            resolve(finalDataUrl.split(',')[1] || '');
          }
        };
        img.onerror = () => resolve(finalDataUrl.split(',')[1] || '');
        img.src = finalDataUrl;
      });`;

const imageLoadReplacement = `      // Flatten the image to remove transparency (alpha channel) and convert to valid JPEG
      const flattenedImageB64 = await new Promise<string>((resolve) => {
        const img = new Image();
        if (finalDataUrl.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
              resolve(jpegDataUrl.split(',')[1]);
            } else {
              resolve(finalDataUrl.split(',')[1] || '');
            }
          } catch (e) {
            console.error('Canvas conversion error:', e);
            resolve(finalDataUrl.split(',')[1] || '');
          }
        };
        img.onerror = (err) => {
          console.error('Image load error for canvas flattening:', err);
          resolve(finalDataUrl.split(',')[1] || '');
        };
        img.src = finalDataUrl;
      });`;

replaceApp('Fix Image flattening load with crossOrigin', imageLoadTarget, imageLoadReplacement);

// 2. Fix the loader layout in App.tsx (change height/width of defs wrapper to avoid breaking gradients)
const loaderDefsTarget = `                      <svg height="0" width="0" viewBox="0 0 64 64" style={{ position: "absolute" }}>`;
const loaderDefsReplacement = `                      <svg height="1" width="1" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>`;

replaceApp('Fix loader SVG defs visibility', loaderDefsTarget, loaderDefsReplacement);

// 3. Update CSS styling in index.css to make it look premium and prevent wrapping
const cssLoaderTarget = `/* Custom PIXO Loader Animation */
.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}
.loader {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dash {
  animation: dashArray 4s ease-in-out infinite, dashOffset 4s linear infinite;
}
.spin {
  animation: spinDashArray 4s ease-in-out infinite, spin 16s ease-in-out infinite, dashOffset 4s linear infinite;
  transform-origin: center;
}`;

const cssLoaderReplacement = `/* Custom PIXO Loader Animation */
.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  width: 100%;
}
.loader {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 20px; /* larger gaps for bigger SVGs */
}
.dash {
  animation: dashArray 3s ease-in-out infinite, dashOffset 3s linear infinite;
}
.spin {
  animation: spinDashArray 3s ease-in-out infinite, spin 12s ease-in-out infinite, dashOffset 3s linear infinite;
  transform-origin: center;
}`;

if (css.includes(cssLoaderTarget)) {
  css = css.replace(cssLoaderTarget, cssLoaderReplacement);
  fs.writeFileSync(cssPath, css);
  console.log('SUCCESS (CSS): Updated custom loader css with flex row-nowrap and smooth speeds');
} else {
  console.log('WARNING: CSS custom loader target not found in index.css. Appending instead.');
  css += '\n' + cssLoaderReplacement;
  fs.writeFileSync(cssPath, css);
}

fs.writeFileSync(appPath, app);
console.log('App.tsx updated successfully.');
