
// AI Tools Directory - Cloudflare Worker

/**
 * This is the main entry point for the Cloudflare Worker
 * It handles requests and responses for SEO optimization
 */

addEventListener('fetch', event => {
  console.log('Fetch event received for URL:', event.request.url);
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
  console.log('handleRequest started for:', request.url);
  
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

    // For the root path or empty path, serve the index.html
    if (url.pathname === '/' || url.pathname === '') {
      console.log('Handling root path request');
      
      // Create a simple response for the root path to ensure it works
      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Tools Directory</title>
          <meta name="description" content="Discover and compare the best AI tools">
        </head>
        <body>
          <h1>AI Tools Directory</h1>
          <p>Welcome to the AI Tools Directory! We're currently in maintenance mode.</p>
          <p>Please check back soon for our full directory of AI tools.</p>
        </body>
      </html>`;
      
      return new Response(htmlContent, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }
    
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
    // Return a more descriptive error page for debugging
    const errorHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Worker Error</title>
      </head>
      <body>
        <h1>Worker Error</h1>
        <p>Error processing request: ${error.message}</p>
        <pre>${error.stack}</pre>
      </body>
    </html>`;
    
    return new Response(errorHTML, { 
      status: 500,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
}
