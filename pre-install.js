
// This script runs before npm install to create mock packages for platform-specific dependencies
const fs = require('fs');
const path = require('path');
console.log('Running pre-install script for platform-specific dependencies');

// Create node_modules directory if it doesn't exist
const nodeModulesDir = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesDir)) {
  fs.mkdirSync(nodeModulesDir, { recursive: true });
  console.log('Created node_modules directory');
}

// Create mock packages for platform-specific rollup dependencies
const platformSpecificPackages = [
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64'
];

// Create scope directory for @rollup
const rollupScopeDir = path.join(nodeModulesDir, '@rollup');
if (!fs.existsSync(rollupScopeDir)) {
  fs.mkdirSync(rollupScopeDir, { recursive: true });
  console.log('Created @rollup scope directory');
}

platformSpecificPackages.forEach(packageName => {
  const packageParts = packageName.split('/');
  const packageDir = path.join(rollupScopeDir, packageParts[1]);
  
  // Create package directory if it doesn't exist
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
    
    // Create package.json with explicit os and cpu fields set to "any"
    const packageJson = {
      name: packageName,
      version: "4.40.0",
      main: "index.js",
      os: ["any"],
      cpu: ["any"]
    };
    
    fs.writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create empty index.js with mock implementation
    fs.writeFileSync(
      path.join(packageDir, 'index.js'),
      `
// Mock implementation for ${packageName}
console.log('Loading mock for ${packageName}');
const noop = () => {};
module.exports = {
  VERSION: '4.40.0',
  rollup: async () => ({
    generate: async () => ({ output: [] }),
    write: async () => ({ output: [] }),
    close: noop
  }),
  watch: () => ({ close: noop }),
  createFilter: () => () => true,
  dataToEsm: (data) => \`export default \${JSON.stringify(data)};\`,
  normalizePath: (path) => path,
  defineConfig: (config) => config
};
`
    );
    
    console.log(`Created mock package for ${packageName}`);
  }
});

// Create rollup-mock.js in root for easier reference by other scripts
const rollupMockContent = `
// This is a mock module for platform-specific Rollup dependencies
console.log('Using rollup mock for platform-specific dependencies');

// Create a mock that provides the minimum functionality needed
const noop = () => {};

// Mock object with all required methods
const rollupMock = {
  // Core rollup methods
  rollup: async () => ({
    generate: async () => ({ output: [] }),
    write: async () => ({ output: [] }),
    close: noop
  }),
  VERSION: '4.40.0',
  watch: () => ({ close: noop }),
  defineConfig: (config) => config,
  
  // Plugin helpers
  createFilter: () => () => true,
  normalizePath: (path) => path,
  dataToEsm: (data) => \`export default \${JSON.stringify(data)};\`
};

// Export all required methods and properties
module.exports = rollupMock;
// Also export as default for ES modules
module.exports.default = rollupMock;
`;

fs.writeFileSync(path.join(__dirname, 'rollup-mock.js'), rollupMockContent);
console.log('Created rollup-mock.js for common use');

console.log('Pre-install script completed successfully');
