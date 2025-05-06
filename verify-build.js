
// Script to verify build output for Cloudflare Pages
const fs = require('fs');
const path = require('path');

console.log('Verifying build output for Cloudflare Pages deployment...');

const distDir = path.join(__dirname, 'dist');
try {
  if (fs.existsSync(distDir)) {
    console.log('✓ Dist directory exists');
    
    // Check for index.html
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✓ index.html exists');
    } else {
      console.log('✗ index.html is missing!');
    }
    
    // Check for assets directory
    const assetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      console.log('✓ assets directory exists');
      const assetFiles = fs.readdirSync(assetsDir);
      console.log(`  Found ${assetFiles.length} asset files`);
    } else {
      console.log('✗ assets directory is missing!');
    }
  } else {
    console.log('✗ Dist directory does not exist!');
  }
} catch (error) {
  console.error('Error verifying build:', error);
}

console.log('Verification complete.');
