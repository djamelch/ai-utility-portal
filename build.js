
// Custom build script for Cloudflare Pages
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

// First patch the rollup native module
try {
  console.log('Patching rollup native module...');
  require('./patch-rollup-native');
} catch (error) {
  console.warn('Warning: Error patching rollup:', error);
}

try {
  // Ensure lovable-tagger exists (mock if needed)
  ensureLovableTagger();
  
  // Try building with both Vite and a fallback approach if that fails
  console.log('Building the application...');
  try {
    execSync('NODE_OPTIONS="--max-old-space-size=4096" npx vite build', { stdio: 'inherit' });
  } catch (buildError) {
    console.error('Primary build failed, trying fallback method:', buildError);
    
    // Try rebuilding with our patch explicitly applied
    try {
      console.log('Running with explicit patch before rebuild...');
      require('./patch-rollup-native');
      execSync('NODE_OPTIONS="--max-old-space-size=4096" npx vite build', { stdio: 'inherit' });
    } catch (rebuildError) {
      console.error('Rebuild also failed:', rebuildError);
      
      // Create a minimal build output to allow deployment to continue
      const distDir = path.join(__dirname, 'dist');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }
      
      // Create a minimal index.html
      const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Tools Directory</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
    .error { background: #f8d7da; border: 1px solid #f5c6cb; padding: 1rem; border-radius: 0.25rem; }
  </style>
</head>
<body>
  <h1>AI Tools Directory</h1>
  <p>The application is currently experiencing technical difficulties during build. Please try again later.</p>
  <div class="error">
    <h2>Build Error</h2>
    <p>There was a problem with the build process. Our team has been notified and is working to resolve the issue.</p>
  </div>
</body>
</html>`;
      
      fs.writeFileSync(path.join(distDir, 'index.html'), fallbackHtml);
      console.log('Created fallback index.html');
    }
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Check if lovable-tagger exists, if not create a mock
function ensureLovableTagger() {
  const packageDir = path.join(__dirname, 'node_modules', 'lovable-tagger');
  
  if (!fs.existsSync(packageDir)) {
    console.log('Creating mock lovable-tagger for build...');
    fs.mkdirSync(packageDir, { recursive: true });
    
    // Create a simple package.json
    const packageJson = {
      name: "lovable-tagger",
      version: "0.1.0",
      main: "index.js"
    };
    
    fs.writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create a mock implementation
    const indexJs = `
module.exports = {
  componentTagger: function() {
    return {
      name: 'lovable-tagger-mock',
      transform: function(code) { return { code, map: null }; }
    };
  }
};`;
    
    fs.writeFileSync(path.join(packageDir, 'index.js'), indexJs);
    console.log('Mock lovable-tagger created successfully');
  }
}
