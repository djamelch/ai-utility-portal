
// Script to ensure esbuild is properly installed
console.log('Ensuring esbuild is properly installed...');

const { execSync } = require('child_process');
const os = require('os');

// Determine the correct platform-specific esbuild package
const platform = os.platform();
const arch = os.arch();

let esbuildPackage = '';

if (platform === 'linux' && arch === 'x64') {
  esbuildPackage = '@esbuild/linux-x64';
} else if (platform === 'darwin' && arch === 'x64') {
  esbuildPackage = '@esbuild/darwin-x64';
} else if (platform === 'darwin' && arch === 'arm64') {
  esbuildPackage = '@esbuild/darwin-arm64';
} else if (platform === 'win32' && arch === 'x64') {
  esbuildPackage = '@esbuild/win32-x64-msvc';
}

if (esbuildPackage) {
  try {
    console.log(`Installing ${esbuildPackage}...`);
    execSync(`npm install ${esbuildPackage} --no-save`, { stdio: 'inherit' });
    console.log('esbuild package installed successfully');
  } catch (error) {
    console.error('Failed to install esbuild package:', error);
    // Don't exit with error code, allow the build to continue
  }
}

console.log('esbuild setup complete');
