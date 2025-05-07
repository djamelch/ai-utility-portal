
// Custom build script for Cloudflare Pages
const { execSync } = require('child_process');

console.log('Starting build process...');

try {
  // First run the fix-dependencies script
  console.log('Fixing dependencies...');
  execSync('node fix-dependencies.js', { stdio: 'inherit' });
  
  // Install esbuild for Linux directly
  console.log('Installing esbuild for Linux...');
  execSync('npm install @esbuild/linux-x64 --no-save --force', { stdio: 'inherit' });
  
  // Then run the Vite build command
  console.log('Building the application...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
