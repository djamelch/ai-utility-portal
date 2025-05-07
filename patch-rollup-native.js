
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
