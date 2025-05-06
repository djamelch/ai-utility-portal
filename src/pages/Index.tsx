
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";

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
        
        {/* Featured Tools Section - With primary gradient */}
        <ToolsSection 
          title="Featured Tools" 
          description="Discover our handpicked selection of the best AI tools"
          queryType="featured"
          limit={8} // Increased from 6 to 8
          variant="primary"
        />
        
        {/* Top Rated Tools Section - With accent gradient */}
        <ToolsSection 
          title="Top Rated Tools" 
          description="Explore the highest rated AI tools by our community"
          queryType="top-rated"
          limit={8} // Increased from 6 to 8
          variant="accent"
        />
        
        {/* Feature Section */}
        <FeatureSection />
        
        {/* Recently Added Tools Section - With secondary gradient */}
        <ToolsSection 
          title="Recently Added Tools" 
          description="Check out the latest AI tools added to our collection"
          queryType="recent"
          limit={8} // Increased from 6 to 8
          variant="secondary"
        />
        
        {/* Categories Section */}
        <CategorySection />
        
        {/* CTA Section - Enhanced with animation and modern styling */}
        <GradientBackground variant="primary" className="py-12 md:py-16" interactive intensity="medium">
          <div className="container-tight">
            <MotionWrapper animation="fadeIn">
              <GlassCard 
                className="bg-background/50 backdrop-blur-lg border border-white/10 dark:border-white/5 p-6 md:p-10 text-center"
                glowEffect
                hoverEffect
              >
                <div className="relative mb-5">
                  <div className="absolute inset-0 blur-xl opacity-20 bg-gradient-to-br from-primary via-accent to-primary rounded-full"></div>
                  <Sparkles size={36} className="mx-auto text-primary" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold">
                  Ready to find your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">perfect AI tool?</span>
                </h2>
                <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm">
                  Browse our curated collection of the best AI tools to enhance your productivity, creativity, and efficiency.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    className="rounded-lg px-5 py-2 font-medium relative overflow-hidden group"
                    variant="gradient"
                    asChild
                  >
                    <Link to="/tools">
                      <span className="relative z-10 flex items-center">
                        <Search size={16} className="mr-2" />
                        Explore Tools
                        <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-lg border bg-background/50 backdrop-blur-sm px-5 py-2 font-medium"
                    asChild
                  >
                    <Link to="/blog" className="flex items-center">
                      <Star size={16} className="mr-2" />
                      Read Our Blog
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </MotionWrapper>
          </div>
        </GradientBackground>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
