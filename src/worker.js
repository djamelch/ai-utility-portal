
// Cloudflare Pages compatible worker script
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle API routes if needed
      if (url.pathname.startsWith('/api/')) {
        // API endpoints would be handled here
        return new Response('API endpoint not implemented', { status: 501 });
      }
      
      // Define known SPA routes that should serve index.html
      const spaRoutes = [
        '/tools', '/tools/', 
        '/about', '/about/',
        '/blog', '/blog/',
        '/submit-tool', '/submit-tool/',
        '/dashboard', '/dashboard/',
        '/auth', '/auth/',
        '/auth-callback', '/auth-callback/',
        '/admin', '/admin/'
      ];
      
      const isPathStartWith = spaRoutes.some(route => 
        url.pathname === route || 
        (route.endsWith('/') && url.pathname.startsWith(route))
      );
      
      // For SPA routes, serve the index.html
      if (isPathStartWith) {
        const indexPath = new URL('/', url).pathname;
        return await getAssetFromKV(
          {
            request: new Request(new URL(indexPath, request.url), request),
            waitUntil: ctx.waitUntil.bind(ctx)
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
            cacheControl: {
              browserTTL: 0, // Don't cache SPA routes in browser
              edgeTTL: 2 * 60 * 60 // Cache on edge for 2 hours
            }
          }
        );
      }
      
      // Try to serve the requested asset directly
      try {
        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx)
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            cacheControl: {
              // Static assets can be cached longer
              browserTTL: url.pathname.includes('/assets/') ? 24 * 60 * 60 : 60 * 60,
              edgeTTL: 24 * 60 * 60 // Cache on edge for 24 hours
            }
          }
        );
      } catch (assetError) {
        // If asset not found, fall back to index.html (SPA catch-all)
        return await getAssetFromKV(
          {
            request: new Request(`${new URL(request.url).origin}/index.html`, request),
            waitUntil: ctx.waitUntil.bind(ctx)
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            cacheControl: {
              browserTTL: 0, // Don't cache SPA fallback in browser
              edgeTTL: 60 * 60 // Cache on edge for 1 hour
            }
          }
        );
      }
    } catch (error) {
      return new Response(`Internal Error: ${error.message}`, { status: 500 });
    }
  }
};
