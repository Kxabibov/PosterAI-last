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

// 1. Rename classes in flowStep 4 loader block in App.tsx
const loaderTarget = `                    <div className="loader-wrap">
                      <svg height="1" width="1" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>
                        <defs>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gp">
                            <stop stopColor="#973BED"></stop>
                            <stop stopColor="#007CFF" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gi">
                            <stop stopColor="#FF6B35"></stop>
                            <stop stopColor="#FF0080" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gx">
                            <stop stopColor="#00E0ED"></stop>
                            <stop stopColor="#00DA72" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="go">
                            <stop stopColor="#FFC800"></stop>
                            <stop stopColor="#FF00FF" offset="1"></stop>
                            <animateTransform repeatCount="indefinite"
                              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                              dur="8s"
                              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                              type="rotate" attributeName="gradientTransform">
                            </animateTransform>
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="loader">
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
                      </div>
                    </div>`;

const loaderReplacement = `                    <div className="pixo-loader-wrap">
                      <svg height="1" width="1" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>
                        <defs>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gp">
                            <stop stopColor="#973BED"></stop>
                            <stop stopColor="#007CFF" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gi">
                            <stop stopColor="#FF6B35"></stop>
                            <stop stopColor="#FF0080" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="gx">
                            <stop stopColor="#00E0ED"></stop>
                            <stop stopColor="#00DA72" offset="1"></stop>
                          </linearGradient>
                          <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="go">
                            <stop stopColor="#FFC800"></stop>
                            <stop stopColor="#FF00FF" offset="1"></stop>
                            <animateTransform repeatCount="indefinite"
                              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                              dur="8s"
                              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                              type="rotate" attributeName="gradientTransform">
                            </animateTransform>
                          </linearGradient>
                        </defs>
                      </svg>

                      <div className="pixo-loader">
                        {/* P */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gp)"
                            d="M 10,60 V 4 H 42 C 57,4 57,30 42,30 H 10"
                            className="pixo-dash" pathLength="360"></path>
                        </svg>

                        {/* I */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gi)"
                            d="M 16,4 H 48 M 32,4 V 60 M 16,60 H 48"
                            className="pixo-dash" pathLength="360"></path>
                        </svg>

                        {/* X */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="8" stroke="url(#gx)"
                            d="M 10,4 L 54,60 M 54,4 L 10,60"
                            className="pixo-dash" pathLength="360"></path>
                        </svg>

                        {/* O */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64" className="w-14 h-14 md:w-28 md:h-28">
                          <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="10" stroke="url(#go)"
                            d="M 32 32 m 0 -27 a 27 27 0 1 1 0 54 a 27 27 0 1 1 0 -54"
                            className="pixo-spin" pathLength="360"></path>
                        </svg>
                      </div>
                    </div>`;

replaceApp('Rename App.tsx loader classes to avoid css clashing', loaderTarget, loaderReplacement);

// 2. Update CSS classes in index.css to use .pixo prefix
const cssTarget = `/* Custom PIXO Loader Animation */
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
}`;

const cssReplacement = `/* Custom PIXO Loader Animation */
.pixo-loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  width: 100%;
}
.pixo-loader {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
@media (min-width: 768px) {
  .pixo-loader {
    gap: 16px;
  }
}
.pixo-loader svg {
  position: static !important; /* overrides standard .loader svg positioning absolute */
}
.pixo-dash {
  animation: dashArray 2s ease-in-out infinite, dashOffset 2s linear infinite;
}
.pixo-spin {
  animation: spinDashArray 2s ease-in-out infinite, spin 8s ease-in-out infinite, dashOffset 2s linear infinite;
  transform-origin: center;
}`;

if (css.includes(cssTarget)) {
  css = css.replace(cssTarget, cssReplacement);
} else {
  console.log('WARNING: cssTarget not found. Appending instead.');
  css += '\n' + cssReplacement;
}
fs.writeFileSync(cssPath, css);

fs.writeFileSync(appPath, app);
console.log('SUCCESS: Renamed custom loader classes to .pixo- prefixed names.');
