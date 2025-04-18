
// Worker script for Cloudflare
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // Get the URL from the request
    const url = new URL(request.url);
    
    // Check if this is a request for static assets
    if (url.pathname.includes('/assets/') || 
        url.pathname.endsWith('.ico') || 
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.txt') ||
        url.pathname.endsWith('.xml') ||
        url.pathname.endsWith('.webmanifest')) {
      // For static assets, pass through to the asset
      return fetch(request);
    }
    
    // For all other requests, serve the index.html file to enable client-side routing
    return fetch(`${url.origin}/index.html`);
  } catch (error) {
    console.error('Error in handleRequest:', error);
    return new Response('Server Error', { status: 500 });
  }
}
