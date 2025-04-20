
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)
      console.log("Request URL:", url.pathname)
      
      // Check for API requests
      if (url.pathname.startsWith('/api/')) {
        // Handle API requests (if needed)
        return new Response('API endpoint not implemented', { status: 501 })
      }

      // Try to fetch static assets
      try {
        // For direct routes like /tools, /about, etc. - serve index.html to support SPA routing
        if (url.pathname === '/tools' || url.pathname.startsWith('/tools/') || 
            url.pathname === '/about' || url.pathname === '/blog' || 
            url.pathname.startsWith('/blog/') || url.pathname === '/submit-tool' ||
            url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/') ||
            url.pathname === '/auth' || url.pathname === '/auth-callback' ||
            url.pathname.startsWith('/admin/')) {
          
          console.log("Serving index.html for SPA route:", url.pathname)
          const indexAsset = new Request(`${new URL(request.url).origin}/index.html`, request)
          return await getAssetFromKV(
            {
              request: indexAsset,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
            }
          )
        }
        
        // Try to fetch the requested asset directly
        console.log("Attempting to fetch asset directly:", url.pathname)
        return await getAssetFromKV(
          {
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
          }
        )
      } catch (assetError) {
        console.error('Asset fetch error:', assetError)
        
        // If the asset isn't found, serve index.html (SPA fallback)
        try {
          console.log("Asset not found, falling back to index.html")
          const indexAsset = new Request(`${new URL(request.url).origin}/index.html`, request)
          return await getAssetFromKV(
            {
              request: indexAsset,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
            }
          )
        } catch (e) {
          console.error('Index.html fetch error:', e)
          return new Response('Internal Error', { status: 500 })
        }
      }
    } catch (error) {
      console.error('Worker error:', error)
      return new Response('Internal Error', { status: 500 })
    }
  }
}
