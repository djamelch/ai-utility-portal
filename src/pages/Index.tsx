import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";

const Index = () => {
  const generateHomeSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AI Tools Directory",
      "url": "https://your-domain.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://your-domain.com/tools?search={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "Discover and compare the best AI tools for all your needs. Our comprehensive directory helps you find the perfect AI solutions for productivity, creativity, and business."
    };
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title="AI Tools Directory - Find and Compare the Best AI Tools"
        description="Discover the best AI tools for productivity, creativity, and business. Our comprehensive directory helps you find and compare the perfect AI solutions for your needs."
        keywords="AI tools, artificial intelligence, machine learning tools, productivity tools, AI directory, top AI tools"
        canonicalUrl="/"
        schemaData={generateHomeSchema()}
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Tools Section - Moved up after statistics */}
        <ToolsSection 
          title="Featured Tools" 
          description="Discover our handpicked selection of the best AI tools"
          queryType="featured"
          limit={6}
        />
        
        {/* Top Rated Tools Section - Updated limit to 6 */}
        <ToolsSection 
          title="Top Rated Tools" 
          description="Explore the highest rated AI tools by our community"
          queryType="top-rated"
          limit={6}
        />
        
        {/* Recently Added Tools Section - Updated limit to 6 */}
        <ToolsSection 
          title="Recently Added Tools" 
          description="Check out the latest AI tools added to our collection"
          queryType="recent"
          limit={6}
        />
        
        {/* Feature Section - Kept as is */}
        <FeatureSection />
        
        {/* Categories Section - Kept as is */}
        <CategorySection />
        
        {/* CTA Section - Kept as is */}
        <section className="section-padding bg-secondary/30 dark:bg-transparent">
          <div className="container-tight">
            <MotionWrapper animation="fadeIn">
              <div className="rounded-xl bg-background border border-border/40 p-8 md:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Ready to find your perfect AI tool?
                </h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Browse our curated collection of the best AI tools to enhance your productivity, creativity, and efficiency.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/tools" 
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Explore Tools
                  </Link>
                  <Link 
                    to="/blog" 
                    className="rounded-lg border border-input bg-background px-6 py-3 font-medium hover:bg-secondary/50 transition-colors"
                  >
                    Read Our Blog
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
