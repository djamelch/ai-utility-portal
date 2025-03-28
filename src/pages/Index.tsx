
import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time or use for actual data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper isLoading={isLoading}>
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
    </PageWrapper>
  );
};

export default Index;
