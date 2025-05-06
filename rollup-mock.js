
// This is a mock module for platform-specific Rollup dependencies
console.log('Using rollup mock for platform-specific dependencies');

// Create a mock that provides the minimum functionality needed
const noop = () => {};

// Mock object with all required methods
const rollupMock = {
  createBundle: () => ({
    generate: async () => ({ output: [] }),
    write: async () => ({ output: [] }),
    close: noop
  }),
  rollup: async () => ({
    generate: async () => ({ output: [] }),
    write: async () => ({ output: [] }),
    close: noop
  }),
  parseModuleUrl: () => ({}),
  VERSION: '4.40.0',
  watch: () => ({ 
    close: noop,
    on: noop,
    off: noop
  }),
  defineConfig: config => config,
  
  // Add more common rollup methods
  normalizePath: path => path,
  createFilter: () => () => true,
  dataToEsm: data => `export default ${JSON.stringify(data)};`,
  
  // Plugin helpers
  pluginUtils: {
    createFilter: () => () => true,
    normalizePath: path => path,
    dataToEsm: data => `export default ${JSON.stringify(data)};`
  }
};

// Export all required methods and properties
module.exports = rollupMock;
// Also export as default for ES modules
module.exports.default = rollupMock;
