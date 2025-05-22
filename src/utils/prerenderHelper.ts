
/**
 * Helper functions for improving SPA prerendering for search engines
 */

// Detect if the current user agent is a bot/crawler
export function isCrawlerAgent() {
  if (typeof window === 'undefined' || !window.navigator) return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const botPatterns = [
    'googlebot', 'bingbot', 'yandex', 'baiduspider', 'slurp',
    'duckduckbot', 'bot', 'crawler', 'spider', 'facebookexternalhit',
    'prerender', 'puppet', 'lighthouse', 'chrome-lighthouse',
    'twitterbot', 'whatsapp', 'telegrambot'
  ];
  
  return botPatterns.some(pattern => userAgent.includes(pattern));
}

// Inject metadata for prerendering
export function injectPrerenderMetadata() {
  if (typeof document === 'undefined') return;
  
  // Create a meta tag for prerender
  const prerenderMeta = document.createElement('meta');
  prerenderMeta.name = 'prerender-status-code';
  prerenderMeta.content = '200';
  document.head.appendChild(prerenderMeta);
  
  // Create a meta tag for fragment
  const fragmentMeta = document.createElement('meta');
  fragmentMeta.name = 'fragment';
  fragmentMeta.content = '!';
  document.head.appendChild(fragmentMeta);
}

// Update site metadata for the current page
export function updateMetadataForPrerender(title: string, description: string) {
  if (typeof document === 'undefined') return;
  
  // Update title
  document.title = title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);
  
  // Update OG tags
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: window.location.href }
  ];
  
  ogTags.forEach(tag => {
    let element = document.querySelector(`meta[property="${tag.property}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('property', tag.property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', tag.content);
  });
}
