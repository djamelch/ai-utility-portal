
// Cloudflare Worker script for pre-rendering content for search engine bots
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Check if the request is from a bot
  const userAgent = request.headers.get('User-Agent') || ''
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|bingbot|google|baidu|bing|msn|duckduckgo|slurp|yandex/i.test(userAgent)
  
  // Get the URL from the request
  const url = new URL(request.url)
  
  // If it's a bot, fetch pre-rendered content
  if (isBot) {
    console.log(`Bot detected: ${userAgent}`)
    
    try {
      // You can replace this with a call to a pre-rendering service like Prerender.io
      // This is a simplified example that just adds a cache header
      const response = await fetch(request)
      
      // Clone the response so we can modify headers
      const newResponse = new Response(response.body, response)
      
      // Add headers to indicate this is pre-rendered content
      newResponse.headers.set('X-Prerendered', 'true')
      newResponse.headers.set('Cache-Control', 'public, max-age=3600')
      
      return newResponse
    } catch (error) {
      console.error('Pre-rendering error:', error)
      // If pre-rendering fails, fall back to the original request
      return fetch(request)
    }
  }
  
  // For non-bot requests, pass through normally
  return fetch(request)
}
