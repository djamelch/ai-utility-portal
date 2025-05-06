
// Cloudflare Pages deployment helper
// This script helps with platform-specific dependencies during build
console.log('Starting cloud deployment process...');

const fs = require('fs');
const path = require('path');

// Function to update package.json to remove problematic dependencies
function updatePackageJson() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Filter out platform-specific dependencies
    const filteredDependencies = {};
    for (const [key, value] of Object.entries(packageJson.dependencies || {})) {
      if (!key.includes('rollup-win') && !key.includes('rollup-linux') && !key.includes('rollup-darwin')) {
        filteredDependencies[key] = value;
      }
    }

    // Update package.json
    packageJson.dependencies = filteredDependencies;
    
    // Add custom build script for Cloudflare
    packageJson.scripts = {
      ...packageJson.scripts,
      'cloudflare-build': 'vite build --mode production'
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Successfully updated package.json for cloud deployment');
  } catch (error) {
    console.error('Error updating package.json:', error);
    process.exit(1);
  }
}

// Execute updates
updatePackageJson();
console.log('Cloud deployment preparation complete!');
