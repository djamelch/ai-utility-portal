
// This script directly patches rollup's native module loader
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
        
        // Check if the file has already been patched
        if (originalContent.includes('safeRequire')) {
          console.log(`File ${nativePath} already patched.`);
          patchedAny = true;
          return;
        }
        
        // Create a patched version that falls back to our mock
        const patchedContent = originalContent.replace(
          'function requireWithFriendlyError(',
          `function safeRequire(specifier) {
  try {
    return require(specifier);
  } catch (err) {
    console.warn(\`Could not load \${specifier}, using mock implementation\`);
    return require("${path.join(__dirname, 'rollup-mock.js').replace(/\\/g, '\\\\')}");
  }
}

function requireWithFriendlyError(`
        );
        
        // Also replace all direct require calls
        const finalPatchedContent = patchedContent.replace(
          /require\(specifier\)/g,
          'safeRequire(specifier)'
        );
        
        // Write the patched file if changes were made
        if (finalPatchedContent !== originalContent) {
          fs.writeFileSync(nativePath, finalPatchedContent);
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
    console.log('Could not find rollup native.js to patch, will create a complete mock');
    createCompleteMock();
  }
  
  // Create the mock module directory structure
  ensureMockModules();
}

// Create a more aggressive mock for all rollup native modules
function createCompleteMock() {
  const rollupPaths = [
    path.join(__dirname, 'node_modules', 'rollup'),
    path.join(__dirname, 'node_modules', 'vite', 'node_modules', 'rollup')
  ];
  
  rollupPaths.forEach(rollupPath => {
    if (fs.existsSync(rollupPath)) {
      try {
        console.log(`Creating complete mock for ${rollupPath}...`);
        
        // Create mock native.js
        const nativePath = path.join(rollupPath, 'dist', 'native.js');
        if (!fs.existsSync(path.dirname(nativePath))) {
          fs.mkdirSync(path.dirname(nativePath), { recursive: true });
        }
        
        const mockContent = `
// Complete mock for rollup native modules
console.log('Using complete mock for rollup native modules');
const mock = require('${path.join(__dirname, 'rollup-mock.js').replace(/\\/g, '\\\\')}');
module.exports = mock;
`;
        
        fs.writeFileSync(nativePath, mockContent);
        console.log(`Created mock native.js at ${nativePath}`);
      } catch (err) {
        console.error(`Error creating complete mock for ${rollupPath}:`, err);
      }
    }
  });
}

// Ensure all necessary mock modules are in place
function ensureMockModules() {
  // Platform-specific packages to mock
  const platformSpecificPackages = [
    '@rollup/rollup-win32-x64-msvc',
    '@rollup/rollup-linux-x64-gnu',
    '@rollup/rollup-darwin-x64',
    '@rollup/rollup-darwin-arm64'
  ];
  
  // Create mock modules for each
  platformSpecificPackages.forEach(packageName => {
    createMockModule(packageName);
  });
}

// Create a mock module for a specific package
function createMockModule(packageName) {
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
    
    // Create a mock index.js
    fs.writeFileSync(
      path.join(packageDir, 'index.js'),
      `module.exports = require("${path.join(__dirname, 'rollup-mock.js').replace(/\\/g, '\\\\')}");`
    );
    
    console.log(`Created mock module for ${packageName}`);
  }
}

// Also create a mock lovable-tagger if needed
function createMockLovableTagger() {
  const packageDir = path.join(__dirname, 'node_modules', 'lovable-tagger');
  
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
    
    // Create a package.json
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
    console.log('Created mock lovable-tagger');
  }
}

// Run all the patches
patchRollupNative();
createMockLovableTagger();

// Also run the fix-dependencies script
try {
  console.log('Running fix-dependencies script...');
  require('./fix-dependencies');
} catch (err) {
  console.error('Error running fix-dependencies:', err);
}

console.log('Rollup patch installation complete.');
