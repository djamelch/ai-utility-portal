
// Cloudflare Pages specific configuration
export const config = {
  nodeVersion: '20', // Specify Node.js 20
  buildCommand: 'node install-esbuild.js && node cloud-deploy.js && npm run build',
  buildOutputDirectory: './dist',
};
