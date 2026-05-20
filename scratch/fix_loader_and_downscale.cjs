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

// 1. Update Image load in App.tsx to downscale max dimension to 1024px to prevent Gemini API 400 errors
const imageLoadTarget = `      // Flatten the image to remove transparency (alpha channel) and convert to valid JPEG
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

const imageLoadReplacement = `      // Flatten the image to remove transparency (alpha channel) and convert to valid JPEG
      const flattenedImageB64 = await new Promise<string>((resolve) => {
        const img = new Image();
        if (finalDataUrl.startsWith('http')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            
            // Limit max dimension to 1024px to prevent large payloads that cause Gemini API 400 error
            const MAX_DIM = 1024;
            let width = img.width;
            let height = img.height;
            if (width > MAX_DIM || height > MAX_DIM) {
              if (width > height) {
                height = Math.round((height * MAX_DIM) / width);
                width = MAX_DIM;
              } else {
                width = Math.round((width * MAX_DIM) / height);
                height = MAX_DIM;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, width, height);
              const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.85);
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

replaceApp('Update Image downscale flattening logic', imageLoadTarget, imageLoadReplacement);

// 2. Make SVGs responsive and use exact user code structure (P, I, X, O)
const flowStep4Target = `                      <div className="loader">
                        {/* P */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gp)"
                            d="M 10,60 V 4 H 42 C 57,4 57,30 42,30 H 10"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* I */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gi)"
                            d="M 16,4 H 48 M 32,4 V 60 M 16,60 H 48"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* X */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gx)"
                            d="M 10,4 L 54,60 M 54,4 L 10,60"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* O */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" height="96" width="96">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="10" stroke="url(#go)"
                            d="M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54"
                            className="spin" pathLength="360"></path>
                        </svg>
                      </div>`;

const flowStep4Replacement = `                      <div className="loader">
                        {/* P */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gp)"
                            d="M 10,60 V 4 H 42 C 57,4 57,30 42,30 H 10"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* I */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gi)"
                            d="M 16,4 H 48 M 32,4 V 60 M 16,60 H 48"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* X */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gx)"
                            d="M 10,4 L 54,60 M 54,4 L 10,60"
                            className="dash" pathLength="360"></path>
                        </svg>

                        {/* O */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="10" stroke="url(#go)"
                            d="M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54"
                            className="spin" pathLength="360"></path>
                        </svg>
                      </div>`;

replaceApp('Make SVG loader letters larger and responsive', flowStep4Target, flowStep4Replacement);

// 3. Update CSS styling in index.css to match the user's exact specifications but responsive
const cssLoaderTarget = `/* Custom PIXO Loader Animation */
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
}
@keyframes dashArray {
  0%   { stroke-dasharray: 0 1 359 0; }
  50%  { stroke-dasharray: 0 359 1 0; }
  100% { stroke-dasharray: 359 1 0 0; }
}
@keyframes spinDashArray {
  0%   { stroke-dasharray: 270 90; }
  50%  { stroke-dasharray: 0 360; }
  100% { stroke-dasharray: 270 90; }
}
@keyframes dashOffset {
  0%   { stroke-dashoffset: 365; }
  100% { stroke-dashoffset: 5; }
}
@keyframes spin {
  0%          { rotate: 0deg; }
  12.5%, 25%  { rotate: 270deg; }
  37.5%, 50%  { rotate: 540deg; }
  62.5%, 75%  { rotate: 810deg; }
  87.5%, 100% { rotate: 1080deg; }
}`;

const cssLoaderReplacement = `/* Custom PIXO Loader Animation */
.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  width: 100%;
}
.loader {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
@media (min-width: 768px) {
  .loader {
    gap: 16px;
  }
}
.dash {
  animation: dashArray 2s ease-in-out infinite, dashOffset 2s linear infinite;
}
.spin {
  animation: spinDashArray 2s ease-in-out infinite, spin 8s ease-in-out infinite, dashOffset 2s linear infinite;
  transform-origin: center;
}
@keyframes dashArray {
  0%   { stroke-dasharray: 0 1 359 0; }
  50%  { stroke-dasharray: 0 359 1 0; }
  100% { stroke-dasharray: 359 1 0 0; }
}
@keyframes spinDashArray {
  0%   { stroke-dasharray: 270 90; }
  50%  { stroke-dasharray: 0 360; }
  100% { stroke-dasharray: 270 90; }
}
@keyframes dashOffset {
  0%   { stroke-dashoffset: 365; }
  100% { stroke-dashoffset: 5; }
}
@keyframes spin {
  0%          { rotate: 0deg; }
  12.5%, 25%  { rotate: 270deg; }
  37.5%, 50%  { rotate: 540deg; }
  62.5%, 75%  { rotate: 810deg; }
  87.5%, 100% { rotate: 1080deg; }
}`;

if (css.includes(cssLoaderTarget)) {
  css = css.replace(cssLoaderTarget, cssLoaderReplacement);
} else {
  // If already modified by apply_svg_loader_and_legal.cjs, let's find the current block
  const currentLoaderTarget = `/* Custom PIXO Loader Animation */
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
}
@keyframes dashArray {
  0%   { stroke-dasharray: 0 1 359 0; }
  50%  { stroke-dasharray: 0 359 1 0; }
  100% { stroke-dasharray: 359 1 0 0; }
}
@keyframes spinDashArray {
  0%   { stroke-dasharray: 270 90; }
  50%  { stroke-dasharray: 0 360; }
  100% { stroke-dasharray: 270 90; }
}
@keyframes dashOffset {
  0%   { stroke-dashoffset: 365; }
  100% { stroke-dashoffset: 5; }
}
@keyframes spin {
  0%          { rotate: 0deg; }
  12.5%, 25%  { rotate: 270deg; }
  37.5%, 50%  { rotate: 540deg; }
  62.5%, 75%  { rotate: 810deg; }
  87.5%, 100% { rotate: 1080deg; }
}`;
  if (css.includes(currentLoaderTarget)) {
    css = css.replace(currentLoaderTarget, cssLoaderReplacement);
  } else {
    console.log('WARNING: Custom loader styles block not matching. Appending instead.');
    css += '\n' + cssLoaderReplacement;
  }
}
fs.writeFileSync(cssPath, css);

fs.writeFileSync(appPath, app);
console.log('App.tsx and index.css updated successfully.');
