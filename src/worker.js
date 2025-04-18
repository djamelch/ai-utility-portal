
// Worker script for Cloudflare
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle the request, typically by fetching the appropriate asset
  // For a static site, we'll just pass through to the asset
  return fetch(request);
}
