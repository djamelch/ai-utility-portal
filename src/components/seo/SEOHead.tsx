
import { Helmet } from 'react-helmet-async';

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
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      {customFavicon && (
        <link rel="icon" href={customFavicon} type="image/png" />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={customLogo || ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={customLogo || ogImage} />
      
      {children}
    </Helmet>
  );
};
