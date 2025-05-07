
// Cloudflare Pages specific configuration
export const config = {
  nodeVersion: '20',
  buildCommand: 'node pre-install.js && node patch-rollup-native.js && npm run build',
  buildOutputDirectory: 'dist',
  compatibility_flags: ["nodejs_compat"],
  skipInstall: false,
  installCommand: 'node pre-install.js && npm install --no-optional --no-fund --ignore-scripts=false'
};
