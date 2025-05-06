
// Cloudflare Pages specific configuration
export const config = {
  nodeVersion: '20',
  buildCommand: 'npm install @esbuild/linux-x64 --no-save && npm run build',
  buildOutputDirectory: 'dist',
  compatibility_flags: ["nodejs_compat"],
  skipInstall: false
};
