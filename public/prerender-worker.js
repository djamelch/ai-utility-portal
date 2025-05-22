
// Enhanced Cloudflare Worker script for pre-rendering content for search engine bots
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Check if the request is from a bot
  const userAgent = request.headers.get('User-Agent') || ''
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|bingbot|google|baidu|bing|msn|duckduckgo|slurp|yandex|prerender|headless|lighthouse|puppet/i.test(userAgent)
  
  // Get the URL from the request
  const url = new URL(request.url)
  
  // Skip prerendering for admin pages, auth, etc.
  if (url.pathname.startsWith('/admin') || 
      url.pathname.startsWith('/auth') || 
      url.pathname.startsWith('/dashboard')) {
    return fetch(request)
  }
  
  // If it's a bot, fetch pre-rendered content
  if (isBot) {
    console.log(`Bot detected: ${userAgent}`)
    
    try {
      // In a production environment, you would use a proper prerendering service like:
      // - Prerender.io
      // - Rendertron
      // - Your own prerender server
      
      // For this example, we'll simulate prerendering by modifying the response
      const response = await fetch(request)
      
      // Only prerender HTML requests
      const contentType = response.headers.get('Content-Type') || ''
      if (!contentType.includes('text/html')) {
        return response
      }
      
      // Create a custom prerendered response
      const originalText = await response.text()
      
      // Add prerender metadata and custom bot-friendly content
      let modifiedText = originalText
      
      // Add prerender meta tags if they don't exist
      if (!modifiedText.includes('name="prerender-status-code"')) {
        modifiedText = modifiedText.replace(
          '<head>',
          `<head>
            <meta name="prerender-status-code" content="200">
            <meta name="fragment" content="!">
          `
        )
      }
      
      // Create a new response with the modified HTML
      const newResponse = new Response(modifiedText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      })
      
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
