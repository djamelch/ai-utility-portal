
// Custom build script for Cloudflare Pages
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

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

try {
  // First run the fix-dependencies script
  console.log('Fixing dependencies...');
  execSync('node fix-dependencies.js', { stdio: 'inherit' });
  
  // Install esbuild for Linux directly
  console.log('Installing esbuild for Linux...');
  execSync('npm install @esbuild/linux-x64 --no-save --force', { stdio: 'inherit' });
  
  // Ensure lovable-tagger exists (mock if needed)
  ensureLovableTagger();
  
  // Then run the Vite build command
  console.log('Building the application...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
