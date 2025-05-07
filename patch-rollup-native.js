
// This script directly modifies the Rollup native.js file to use our mock
// It's a more direct approach than just creating mock modules
console.log('Patching Rollup native module loader...');

const fs = require('fs');
const path = require('path');

// Find Rollup's native.js file in both possible locations
const possiblePaths = [
  path.join(__dirname, 'node_modules/vite/node_modules/rollup/dist/native.js'),
  path.join(__dirname, 'node_modules/rollup/dist/native.js')
];

// Backup and patch the file if it exists
for (const nativePath of possiblePaths) {
  if (fs.existsSync(nativePath)) {
    try {
      console.log(`Found Rollup native.js at: ${nativePath}`);
      
      // Create backup if it doesn't exist
      const backupPath = `${nativePath}.backup`;
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(nativePath, backupPath);
        console.log(`Created backup at: ${backupPath}`);
      }
      
      // Read the file content
      const content = fs.readFileSync(nativePath, 'utf8');
      
      // Check if already patched
      if (content.includes('// PATCHED')) {
        console.log(`File ${nativePath} is already patched.`);
        continue;
      }
      
      // Create patched content that uses our mock
      const patchedContent = `// PATCHED: Uses mock implementation for native modules
try {
  // Try to load the original module
  module.exports = require('${path.relative(path.dirname(nativePath), path.join(__dirname, 'rollup-mock.js')).replace(/\\/g, '/')}');
  console.log('Using rollup mock for native functionality');
} catch (err) {
  // Fallback to absolute path if relative path fails
  console.error('Failed to load rollup mock with relative path:', err);
  module.exports = require('${path.join(__dirname, 'rollup-mock.js').replace(/\\/g, '/')}');
}
`;
      
      // Write the patched file
      fs.writeFileSync(nativePath, patchedContent);
      console.log(`Successfully patched ${nativePath}`);
    } catch (err) {
      console.error(`Error patching ${nativePath}:`, err);
    }
  }
}

// Also create the mock modules directory structure
const platformSpecificPackages = [
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64'
];

// Create mock modules
platformSpecificPackages.forEach(packageName => {
  const packageDir = path.join(__dirname, 'node_modules', packageName);
  
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
    
    // Create a package.json
    const packageJson = {
      name: packageName,
      version: "0.0.0",
      main: "index.js"
    };
    
    fs.writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create index.js that points to our mock
    const indexContent = `
// Mock implementation for ${packageName}
try {
  module.exports = require('../../rollup-mock.js');
} catch (e) {
  console.error('Failed to load rollup mock:', e);
  // Simple fallback implementation
  module.exports = {
    VERSION: '4.40.0',
    rollup: () => ({ write: () => {}, generate: () => {} }),
    watch: () => ({ close: () => {} })
  };
}
`;
    
    fs.writeFileSync(path.join(packageDir, 'index.js'), indexContent);
    console.log(`Created mock module for ${packageName}`);
  }
});

console.log('Rollup native module patching complete');
