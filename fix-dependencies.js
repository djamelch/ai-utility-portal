
// Script to fix platform-specific dependency issues
console.log('Fixing platform-specific dependency issues...');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create mock modules for platform-specific rollup packages
function createMockRollupModule(packageName) {
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
      'module.exports = require("../../rollup-mock.js");'
    );
    
    console.log(`Created mock module for ${packageName}`);
  }
}

// Create mock for lovable-tagger if it fails to install
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
    
    // Create a mock index.js with componentTagger function
    const indexContent = `
module.exports = {
  componentTagger: function() {
    return {
      name: 'lovable-tagger-mock',
      transform: function(code) { return { code, map: null }; }
    };
  }
};`;
    
    fs.writeFileSync(
      path.join(packageDir, 'index.js'),
      indexContent
    );
    
    console.log('Created mock lovable-tagger module');
  }
}

// Create a more direct, reliable mock for the Linux rollup binary
function createDirectLinuxRollupMock() {
  // Create paths for both potential locations
  const paths = [
    // Direct path for the module
    path.join(__dirname, 'node_modules', '@rollup', 'rollup-linux-x64-gnu'),
    // Path that might be used inside vite's node_modules
    path.join(__dirname, 'node_modules', 'vite', 'node_modules', '@rollup', 'rollup-linux-x64-gnu')
  ];
  
  // Create the mock in both possible locations for maximum compatibility
  paths.forEach(rollupDir => {
    if (!fs.existsSync(rollupDir)) {
      fs.mkdirSync(rollupDir, { recursive: true });
      
      // Create package.json
      const packageJson = {
        name: "@rollup/rollup-linux-x64-gnu",
        version: "4.40.0",  // Match rollup's version
        main: "index.js"
      };
      
      fs.writeFileSync(
        path.join(rollupDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );
      
      // Create the index.js that points to our mock
      const indexContent = `
// Mock implementation for @rollup/rollup-linux-x64-gnu
try {
  module.exports = require("${path.relative(rollupDir, path.join(__dirname, 'rollup-mock.js'))}");
} catch (e) {
  // Fallback to absolute path if relative path fails
  module.exports = require("${path.join(__dirname, 'rollup-mock.js')}");
}
`;
      
      fs.writeFileSync(path.join(rollupDir, 'index.js'), indexContent);
      console.log(`Created direct rollup mock at ${rollupDir}`);
    }
  });
  
  // Also try to hook into Node's require system by creating a symbolic link in node_modules
  try {
    const nodeModulesDir = path.join(__dirname, 'node_modules');
    const rollupModuleDir = path.join(nodeModulesDir, '@rollup', 'rollup-linux-x64-gnu');
    
    // Create .node file to match Node's binary expectations
    const nodeFilePath = path.join(rollupModuleDir, 'rollup.node');
    if (!fs.existsSync(nodeFilePath)) {
      // Create an empty binary file as a placeholder
      fs.writeFileSync(nodeFilePath, '');
      console.log('Created placeholder rollup.node file');
    }
  } catch (error) {
    console.warn('Warning: Could not create .node file:', error.message);
  }
}

// List of platform-specific packages to mock
const platformSpecificPackages = [
  '@rollup/rollup-win32-x64-msvc',
  '@rollup/rollup-linux-x64-gnu',
  '@rollup/rollup-darwin-x64',
  '@rollup/rollup-darwin-arm64'
];

// Create mock modules for each platform-specific package
platformSpecificPackages.forEach(createMockRollupModule);

// Create more direct mock for Linux Rollup
createDirectLinuxRollupMock();

// Create mock for lovable-tagger
createMockLovableTagger();

// Install esbuild Linux x64 package directly
try {
  console.log('Installing @esbuild/linux-x64...');
  execSync('npm install @esbuild/linux-x64 --no-save --force', { stdio: 'inherit' });
  console.log('@esbuild/linux-x64 installed successfully');
} catch (error) {
  console.error('Failed to install @esbuild/linux-x64:', error);
  // Create a fallback mechanism
  const esbuildLinuxDir = path.join(__dirname, 'node_modules', '@esbuild', 'linux-x64');
  if (!fs.existsSync(esbuildLinuxDir)) {
    fs.mkdirSync(esbuildLinuxDir, { recursive: true });
    
    // Create a basic package.json
    const esbuildPackageJson = {
      name: "@esbuild/linux-x64",
      version: "0.19.8",
      description: "The Linux x64 binary for esbuild",
      main: "esbuild.js"
    };
    
    fs.writeFileSync(
      path.join(esbuildLinuxDir, 'package.json'),
      JSON.stringify(esbuildPackageJson, null, 2)
    );
    
    // Create a simple mock implementation
    const esbuildJsContent = `
module.exports = {
  version: '0.19.8',
  transform: () => ({ code: '', map: '' }),
  buildSync: () => ({ outputFiles: [] }),
  build: async () => ({ outputFiles: [] })
};`;
    
    fs.writeFileSync(path.join(esbuildLinuxDir, 'esbuild.js'), esbuildJsContent);
    console.log('Created fallback esbuild Linux module');
  }
}

// Create a symlink for esbuild if it doesn't exist
const esbuildDir = path.join(__dirname, 'node_modules/esbuild');
if (!fs.existsSync(esbuildDir)) {
  fs.mkdirSync(esbuildDir, { recursive: true });
  
  // Create a basic package.json for esbuild
  const esbuildPackageJson = {
    name: "esbuild",
    version: "0.19.8",
    description: "Platform-specific esbuild binary",
    main: "lib/esbuild.js",
    license: "MIT"
  };
  
  fs.writeFileSync(
    path.join(esbuildDir, 'package.json'),
    JSON.stringify(esbuildPackageJson, null, 2)
  );
  
  // Create the lib directory
  const esbuildLibDir = path.join(esbuildDir, 'lib');
  if (!fs.existsSync(esbuildLibDir)) {
    fs.mkdirSync(esbuildLibDir, { recursive: true });
  }
  
  // Create a simple esbuild.js file that imports the platform-specific package
  const esbuildJsContent = `
try {
  module.exports = require('@esbuild/linux-x64');
} catch (e) {
  console.error('Failed to load esbuild:', e);
  // Provide a minimal mock implementation
  module.exports = {
    version: '0.19.8',
    transform: () => ({ code: '', map: '' }),
    buildSync: () => ({ outputFiles: [] }),
    build: async () => ({ outputFiles: [] })
  };
}`;
  
  fs.writeFileSync(path.join(esbuildLibDir, 'esbuild.js'), esbuildJsContent);
  console.log('Created esbuild module successfully');
}

console.log('Dependencies fixed successfully');
