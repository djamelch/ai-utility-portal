
// This is a mock module to handle missing platform-specific Rollup dependencies
console.log('Using rollup mock for platform-specific dependencies');

// Export a mock function that will be used when platform-specific modules are imported
module.exports = {
  // Mock basic functions that might be used by rollup
  createBundle: () => ({ generate: async () => ({}) }),
  rollup: async () => ({
    generate: async () => ({}),
    write: async () => ({})
  }),
  // Add a default export as well
  default: {
    rollup: async () => ({
      generate: async () => ({}),
      write: async () => ({})
    })
  }
};
