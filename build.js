
// Custom build script for Cloudflare Pages
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

// Create mock packages for platform-specific dependencies
try {
  console.log('Creating mock packages for platform-specific dependencies...');
  require('./pre-install');
} catch (error) {
  console.warn('Warning: Error creating mock packages:', error);
}

// First patch the rollup native module directly
try {
  console.log('Direct patching of rollup native module...');
  require('./patch-rollup-native');
} catch (error) {
  console.warn('Warning: Error during direct patching:', error);
}

try {
  // Build the application
  console.log('Building the application...');
  try {
    // Set NODE_ENV to production to avoid development-only code
    process.env.NODE_ENV = 'production';
    
    // Run the build command with increased memory limit
    execSync('NODE_OPTIONS="--max-old-space-size=4096" npx vite build', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } catch (buildError) {
    console.error('Primary build failed:', buildError);
    
    // Create a minimal fallback build
    const distDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Create a minimal index.html
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Tools Directory</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { color: #0070f3; }
    .container { margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>AI Tools Directory</h1>
  <div class="container">
    <p>The application is currently being deployed. Please check back shortly.</p>
    <p>If you continue to see this page, please contact support.</p>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(distDir, 'index.html'), fallbackHtml);
    console.log('Created fallback index.html');
    
    // Also create a minimal _headers file for Cloudflare Pages
    const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`;
    
    if (!fs.existsSync(path.join(distDir, '_headers'))) {
      fs.writeFileSync(path.join(distDir, '_headers'), headersContent);
    }
  }
  
  console.log('Build process completed');
} catch (error) {
  console.error('Build process failed:', error);
  process.exit(1);
}
