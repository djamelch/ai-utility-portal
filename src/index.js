
// AI Tools Directory - Cloudflare Worker

/**
 * This is the main entry point for the Cloudflare Worker
 * It handles requests and responses for SEO optimization
 */

addEventListener('fetch', event => {
  console.log('Fetch event received');
  try {
    event.respondWith(handleRequest(event.request));
  } catch (error) {
    console.error('Error in fetch event handler:', error);
    event.respondWith(new Response('Worker error occurred', { status: 500 }));
  }
});

/**
 * Handle incoming requests and apply SEO enhancements
 * @param {Request} request - The incoming request object
 * @returns {Response} - The enhanced response
 */
async function handleRequest(request) {
  console.log('handleRequest started');
  
  try {
    // Get the URL and user agent from the request
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    
    console.log(`Processing request for URL: ${url.pathname}`);
    console.log(`User-Agent: ${userAgent}`);
    
    // Check if the request is from a search engine bot
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|bingbot|google|baidu|bing|msn|duckduckgo|slurp|yandex/i.test(userAgent);
    
    // Log bot detection for monitoring
    console.log(`Is bot request: ${isBot}`);
    
    let response;
    
    // For bots, we want to provide pre-rendered content if possible
    if (isBot) {
      console.log('Handling bot request');
      try {
        // Fetch the original content
        console.log('Fetching content for bot');
        response = await fetch(request);
        console.log(`Bot response status: ${response.status}`);
        
        // Clone the response so we can modify headers
        const newResponse = new Response(response.body, response);
        
        // Add custom headers for bots
        newResponse.headers.set('X-Prerendered', 'true');
        newResponse.headers.set('Cache-Control', 'public, max-age=3600');
        
        return newResponse;
      } catch (error) {
        console.error('Error handling bot request:', error);
        // If pre-rendering fails, fall back to the original request
        response = await fetch(request);
      }
    } else {
      console.log('Handling regular user request');
      // For regular users, adjust cache headers but otherwise pass through
      response = await fetch(request);
      console.log(`Regular user response status: ${response.status}`);
    }
    
    const newResponse = new Response(response.body, response);
    
    // Set appropriate cache headers based on content type
    const contentType = newResponse.headers.get('Content-Type') || '';
    console.log(`Content-Type: ${contentType}`);
    
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
    
    console.log('Returning response');
    return newResponse;
  } catch (error) {
    console.error('Error in handleRequest:', error);
    return new Response('Error processing request', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
