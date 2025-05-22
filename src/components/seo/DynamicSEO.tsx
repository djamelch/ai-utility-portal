
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface DynamicSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  schema?: any;
  noIndex?: boolean;
  children?: React.ReactNode;
}

export const DynamicSEO: React.FC<DynamicSEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  schema,
  noIndex = false,
  children
}) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const siteUrl = "https://your-domain.com";
  const canonicalUrl = `${siteUrl}${location.pathname}`;
  
  // Generate default values based on current path
  const getPageDefaults = () => {
    const path = location.pathname;
    const isHomepage = path === "/";
    const isToolsPage = path.startsWith("/tools");
    const isCategoriesPage = path.startsWith("/categories");
    const isBlogPage = path.startsWith("/blog");
    
    // Set defaults
    let defaultTitle = "AI Tools Directory - Find the Best AI Tools";
    let defaultDescription = "Discover and compare the best AI tools for all your needs. Our comprehensive directory helps you find the perfect AI solutions for productivity, creativity, and business.";
    let defaultKeywords = "AI tools, artificial intelligence, machine learning tools, productivity tools, AI directory";
    let defaultOgImage = "https://your-domain.com/og-image.jpg";
    let defaultOgType = "website";
    
    // Customize based on path
    if (isToolsPage) {
      defaultTitle = "All AI Tools - Comprehensive Directory | AI Any Tool";
      defaultDescription = "Browse our complete collection of AI tools across all categories. Filter by features, pricing, and more to find the perfect AI solution for your needs.";
      defaultKeywords = "AI tools list, all AI tools, AI software directory, AI solutions, artificial intelligence apps";
    } 
    else if (isCategoriesPage) {
      defaultTitle = "AI Tool Categories - Browse by Type | AI Any Tool";
      defaultDescription = "Explore AI tools by category - text generation, image creation, code assistance, and more. Find the perfect AI tool for your specific needs.";
      defaultKeywords = "AI categories, AI tool types, AI tool categories, text generation, image generation, code AI";
    }
    else if (isBlogPage) {
      defaultTitle = "AI Tools Blog - Latest News & Tips | AI Any Tool";
      defaultDescription = "Stay updated with the latest AI tool insights, trends, and tips. Learn how to maximize your productivity with cutting-edge artificial intelligence solutions.";
      defaultKeywords = "AI news, AI tool guides, artificial intelligence blog, AI tips, AI tool tutorials";
    }
    
    return {
      title: defaultTitle,
      description: defaultDescription,
      keywords: defaultKeywords,
      ogImage: defaultOgImage,
      ogType: defaultOgType
    };
  };
  
  const defaults = getPageDefaults();
  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalKeywords = keywords || defaults.keywords;
  const finalOgImage = ogImage || defaults.ogImage;
  const finalOgType = ogType || defaults.ogType;
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  const generateSchema = () => {
    // Default website schema
    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AI Any Tool",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/tools?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    
    return schema || defaultSchema;
  };
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Conditional no-index */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={finalOgType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content="AI Any Tool" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* Prerender.io specific tags (for better SEO with SPAs) */}
      <meta name="fragment" content="!" />
      <meta name="prerender-status-code" content="200" />
      
      {/* Schema.org JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
      
      {children}
    </Helmet>
  );
};
