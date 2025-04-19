
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)
      
      // Check for API requests
      if (url.pathname.startsWith('/api/')) {
        // Handle API requests (if needed)
        return new Response('API endpoint not implemented', { status: 501 })
      }

      // Try to fetch static assets
      try {
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
