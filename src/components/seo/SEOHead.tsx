
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  customLogo?: string;
  customFavicon?: string;
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOProps> = ({
  title = "AI Tools Directory - Find the Best AI Tools",
  description = "Discover and compare the best AI tools for all your needs. Our comprehensive directory helps you find the perfect AI solutions for productivity, creativity, and business.",
  keywords = "AI tools, artificial intelligence, machine learning tools, productivity tools, AI directory",
  ogImage = "https://your-domain.com/og-image.jpg",
  ogType = "website",
  canonicalUrl,
  customLogo,
  customFavicon,
  children
}) => {
  const siteUrl = "https://your-domain.com";
  const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;
  
  const [storedLogo, setStoredLogo] = useState<string | null>(null);
  const [storedFavicon, setStoredFavicon] = useState<string | null>(null);
  
  useEffect(() => {
    // Load logo and favicon from localStorage
    const savedLogo = localStorage.getItem('site-logo');
    const savedFavicon = localStorage.getItem('site-favicon');
    
    if (savedLogo) {
      setStoredLogo(savedLogo);
    }
    
    if (savedFavicon) {
      setStoredFavicon(savedFavicon);
    }
  }, []);
  
  // Use custom props if provided, otherwise use stored values, then fall back to defaults
  const finalLogo = customLogo || storedLogo || ogImage;
  const finalFavicon = customFavicon || storedFavicon || null;
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      {finalFavicon && (
        <link rel="icon" href={finalFavicon} type="image/png" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalLogo} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalLogo} />
      
      {children}
    </Helmet>
  );
};
