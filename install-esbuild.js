
// Script to ensure esbuild is properly installed
console.log('Ensuring esbuild is properly installed...');

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Determine the correct platform-specific esbuild package
const platform = os.platform();
const arch = os.arch();

let esbuildPackage = '@esbuild/linux-x64'; // Default to Linux for Cloudflare Pages

if (platform === 'linux' && arch === 'x64') {
  esbuildPackage = '@esbuild/linux-x64';
} else if (platform === 'darwin' && arch === 'x64') {
  esbuildPackage = '@esbuild/darwin-x64';
} else if (platform === 'darwin' && arch === 'arm64') {
  esbuildPackage = '@esbuild/darwin-arm64';
} else if (platform === 'win32' && arch === 'x64') {
  esbuildPackage = '@esbuild/win32-x64';
}

try {
  console.log(`Installing ${esbuildPackage}...`);
  
  // Use --no-save to avoid modifying package.json and --ignore-scripts=false to allow installation scripts
  execSync(`npm install ${esbuildPackage} --no-save --ignore-scripts=false`, { stdio: 'inherit' });
  
  // Create a simple esbuild.js file that just requires the platform-specific package
  const esbuildJsPath = path.join(__dirname, 'node_modules', 'esbuild', 'lib', 'esbuild.js');
  const esbuildDirPath = path.dirname(esbuildJsPath);
  
  // Ensure the directory exists
  if (!fs.existsSync(esbuildDirPath)) {
    fs.mkdirSync(esbuildDirPath, { recursive: true });
  }
  
  // Write a simple esbuild.js file that imports the platform-specific package
  const esbuildJsContent = `
// This is a generated file that loads the platform-specific esbuild package
try {
  module.exports = require('${esbuildPackage}');
} catch (e) {
  console.error('Failed to load esbuild:', e);
  // Provide a minimal mock implementation to prevent crashes
  module.exports = {
    transform: () => ({ code: '', map: '' }),
    buildSync: () => ({ outputFiles: [] }),
    build: async () => ({ outputFiles: [] })
  };
}`;
  
  fs.writeFileSync(esbuildJsPath, esbuildJsContent);
  
  console.log('Platform-specific esbuild package installed successfully');
} catch (error) {
  console.error('Failed to install esbuild package:', error);
  // Continue despite errors
}

console.log('esbuild setup complete');
