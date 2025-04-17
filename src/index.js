
// AI Tools Directory - Cloudflare Worker

/**
 * This is the main entry point for the Cloudflare Worker
 * It handles requests and responses for SEO optimization
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Handle incoming requests and apply SEO enhancements
 * @param {Request} request - The incoming request object
 * @returns {Response} - The enhanced response
 */
async function handleRequest(request) {
  // Get the URL and user agent from the request
  const url = new URL(request.url);
  const userAgent = request.headers.get('User-Agent') || '';
  
  // Check if the request is from a search engine bot
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|bingbot|google|baidu|bing|msn|duckduckgo|slurp|yandex/i.test(userAgent);
  
  // Log bot detection for monitoring
  if (isBot) {
    console.log(`Bot detected: ${userAgent}, Path: ${url.pathname}`);
  }
  
  // For bots, we want to provide pre-rendered content if possible
  if (isBot) {
    try {
      // Fetch the original content
      const response = await fetch(request);
      
      // Clone the response so we can modify headers
      const newResponse = new Response(response.body, response);
      
      // Add custom headers for bots
      newResponse.headers.set('X-Prerendered', 'true');
      newResponse.headers.set('Cache-Control', 'public, max-age=3600');
      
      return newResponse;
    } catch (error) {
      console.error('Error handling bot request:', error);
      // If pre-rendering fails, fall back to the original request
      return fetch(request);
    }
  }
  
  // For regular users, adjust cache headers but otherwise pass through
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);
  
  // Set appropriate cache headers based on content type
  const contentType = newResponse.headers.get('Content-Type') || '';
  
  if (contentType.includes('image/') || 
      contentType.includes('font/') || 
      contentType.includes('application/javascript') ||
      contentType.includes('text/css')) {
    // Cache static assets for a longer time
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    // Set a reasonable cache time for HTML content
    newResponse.headers.set('Cache-Control', 'public, max-age=3600');
  }
  
  return newResponse;
}
