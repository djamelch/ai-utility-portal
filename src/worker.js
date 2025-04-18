import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)

      // نحاول إحضار ملف من ملفات static assets
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
        }
      )
    } catch (error) {
      // إذا فشل (مثلاً في حال routes SPA)، نظهر index.html
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
        return new Response('Internal Error', { status: 500 })
      }
    }
  }
}
