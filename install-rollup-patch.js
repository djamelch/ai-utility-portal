
// This script creates a direct patch for rollup's native module loader
console.log('Installing rollup patch for native module resolution...');

const fs = require('fs');
const path = require('path');

function patchRollupNative() {
  // Find the paths where rollup's native.js might be located
  const possiblePaths = [
    path.join(__dirname, 'node_modules', 'rollup', 'dist', 'native.js'),
    path.join(__dirname, 'node_modules', 'vite', 'node_modules', 'rollup', 'dist', 'native.js')
  ];
  
  // Try to find and patch each possible location
  let patchedAny = false;
  
  possiblePaths.forEach(nativePath => {
    if (fs.existsSync(nativePath)) {
      try {
        console.log(`Found rollup native.js at ${nativePath}, patching...`);
        
        // Read the original file
        const originalContent = fs.readFileSync(nativePath, 'utf8');
        
        // Create a patched version that falls back to our mock
        const patchedContent = originalContent.replace(
          /requireWithFriendlyError/g, 
          `function safeRequire(specifier) {
  try {
    return require(specifier);
  } catch (err) {
    console.warn(\`Could not load \${specifier}, using mock implementation\`);
    return require("${path.join(__dirname, 'rollup-mock.js')}");
  }
}
// Original requireWithFriendlyError`
        );
        
        // Write the patched file
        if (patchedContent !== originalContent) {
          fs.writeFileSync(nativePath, patchedContent);
          console.log(`Successfully patched ${nativePath}`);
          patchedAny = true;
        } else {
          console.log(`No changes needed for ${nativePath}`);
        }
      } catch (err) {
        console.error(`Error patching ${nativePath}:`, err);
      }
    }
  });
  
  if (!patchedAny) {
    console.log('Could not find rollup native.js to patch');
  }
}

// Run the patcher
patchRollupNative();

// Also run our fix-dependencies script
try {
  require('./fix-dependencies');
} catch (err) {
  console.error('Error running fix-dependencies:', err);
}

console.log('Rollup patch installation complete');
