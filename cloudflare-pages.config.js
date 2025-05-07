
// Cloudflare Pages specific configuration
export const config = {
  nodeVersion: '20',
  buildCommand: 'node fix-dependencies.js && node build.js',
  buildOutputDirectory: 'dist',
  compatibility_flags: ["nodejs_compat"],
  skipInstall: false
};
