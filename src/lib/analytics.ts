
// Google Analytics utility functions
type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Initialize Google Analytics
export const initGA = (id: string): void => {
  if (!isBrowser) {
    // Skip GA initialization in server environment
    return;
  }

  if (!window.location.href.includes('localhost')) {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script1);
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}', {
        page_path: window.location.pathname,
      });
    `;
    document.head.appendChild(script2);
  }
};

// Track page views
export const pageview = (url: string): void => {
  if (!isBrowser || !('gtag' in window)) {
    // Skip in server environment or if gtag isn't initialized
    return;
  }
  
  // @ts-ignore
  window.gtag('config', 'G-XXXXXXXXXX', {
    page_path: url,
  });
};

// Track events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (!isBrowser || !('gtag' in window)) {
    // Skip in server environment or if gtag isn't initialized
    return;
  }
  
  // @ts-ignore
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
