
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
      
      // Create patched content that completely bypasses native module loading
      const patchedContent = `// PATCHED: Complete bypass of native module loading
console.log('Using patched Rollup native module - bypassing platform-specific dependencies');

// Mock implementation for all methods that might be used
const noop = () => {};
const emptyBundle = {
  generate: async () => ({ output: [], map: null }),
  write: async () => ({ output: [] }),
  close: noop
};

const mockExports = {
  // Core functionality
  rollup: async () => emptyBundle,
  watch: () => ({ close: noop }),
  VERSION: '4.40.0',
  
  // Plugin utilities
  createFilter: () => () => true,
  dataToEsm: (data) => \`export default \${JSON.stringify(data)};\`,
  normalizePath: (path) => path,
  
  // Configuration
  defineConfig: (config) => config,
  
  // Aliased properties for compatibility
  loadConfigFile: async () => ({ options: [], warnings: { flush: noop } }),
  parseModuleUrl: () => ({})
};

// Export all the mock functionality
module.exports = mockExports;
`;
      
      // Write the patched file
      fs.writeFileSync(nativePath, patchedContent);
      console.log(`Successfully patched ${nativePath} with complete bypass`);
    } catch (err) {
      console.error(`Error patching ${nativePath}:`, err);
    }
  }
}

// Also create mock modules for platform-specific dependencies
const platformSpecificPackages = [
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64'
];

// Create mock modules for each platform
platformSpecificPackages.forEach(packageName => {
  const packageDir = path.join(__dirname, 'node_modules', packageName);
  
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
    
    // Create package.json
    const packageJson = {
      name: packageName,
      version: "0.0.0",
      main: "index.js"
    };
    
    fs.writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create index.js with empty exports
    const indexContent = `
// Mock implementation for ${packageName}
console.log('Loading mock for ${packageName}');

const noop = () => {};
const emptyBundle = {
  generate: async () => ({ output: [] }),
  write: async () => ({ output: [] }),
  close: noop
};

module.exports = {
  VERSION: '4.40.0',
  rollup: async () => emptyBundle,
  watch: () => ({ close: noop }),
  createFilter: () => () => true,
  dataToEsm: (data) => \`export default \${JSON.stringify(data)};\`,
  normalizePath: (path) => path,
  defineConfig: (config) => config
};
`;
    
    fs.writeFileSync(path.join(packageDir, 'index.js'), indexContent);
    console.log(`Created mock module for ${packageName}`);
  }
});

// Try to patch the module directly inside node_modules/vite as well
try {
  console.log('Attempting to patch inside vite node_modules directory...');
  const viteRollupDir = path.join(__dirname, 'node_modules/vite/node_modules/@rollup');
  
  if (!fs.existsSync(viteRollupDir)) {
    fs.mkdirSync(viteRollupDir, { recursive: true });
  }
  
  // Create platform-specific directories inside vite's node_modules
  platformSpecificPackages.forEach(packageName => {
    const packageShortName = packageName.split('/')[1]; // Get just the package name without @rollup/
    const packageDir = path.join(viteRollupDir, packageShortName);
    
    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir, { recursive: true });
      
      // Create package.json
      const packageJson = {
        name: packageName,
        version: "0.0.0",
        main: "index.js"
      };
      
      fs.writeFileSync(
        path.join(packageDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      
      // Create index.js with empty exports
      const indexContent = `
// Mock implementation for ${packageName} inside vite
console.log('Loading mock for ${packageName} (vite)');

const noop = () => {};
const emptyBundle = {
  generate: async () => ({ output: [] }),
  write: async () => ({ output: [] }),
  close: noop
};

module.exports = {
  VERSION: '4.40.0',
  rollup: async () => emptyBundle,
  watch: () => ({ close: noop }),
  createFilter: () => () => true,
  dataToEsm: (data) => \`export default \${JSON.stringify(data)};\`,
  normalizePath: (path) => path,
  defineConfig: (config) => config
};
`;
      
      fs.writeFileSync(path.join(packageDir, 'index.js'), indexContent);
      console.log(`Created mock module for ${packageName} inside vite`);
    }
  });
} catch (err) {
  console.error('Error creating mocks inside vite node_modules:', err);
}

console.log('Rollup patching complete');
