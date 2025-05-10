
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolsSection } from "@/components/home/ToolsSection";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEffect, useState } from "react";

const Index = () => {
  const [sectionLimits, setSectionLimits] = useState({
    featured: 12,
    topRated: 12,
    recent: 12
  });
  
  // Adjust section limits based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) { // 2xl breakpoint
        setSectionLimits({
          featured: 20,
          topRated: 20,
          recent: 20
        });
      } else if (width >= 1280) { // xl breakpoint
        setSectionLimits({
          featured: 16,
          topRated: 16,
          recent: 16
        });
      } else if (width >= 768) { // md breakpoint
        setSectionLimits({
          featured: 12,
          topRated: 12,
          recent: 12
        });
      } else {
        setSectionLimits({
          featured: 9, // Increased from 6 to show more on mobile
          topRated: 9,
          recent: 9
        });
      }
    };
    
    handleResize(); // Run on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead 
        title="AI Tools Directory - Discover and Compare the Best AI Tools"
        description="Discover the best AI tools for productivity, creativity, and business. Our comprehensive directory helps you find and compare the perfect AI solutions for your needs."
        keywords="AI tools, artificial intelligence, machine learning tools, productivity tools, AI directory, best AI tools"
        canonicalUrl="/"
        schemaData={generateHomeSchema()}
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Featured Tools Section - With simplified background */}
        <div className="relative pt-24 md:pt-32">
          <div className="wave-divider-down bg-gradient-to-r from-hostinger-brand/20 to-hostinger-brand/5 absolute top-0 left-0 right-0 z-10 dark:from-hostinger-brand/30 dark:to-hostinger-brand/10"></div>
          <div className="pt-16">
            <ToolsSection 
              title="Featured Tools" 
              description="Discover our carefully curated selection of the best AI tools"
              queryType="featured"
              limit={sectionLimits.featured}
              variant="primary"
            />
          </div>
        </div>
        
        {/* Top Rated Tools Section */}
        <div className="relative">
          <div className="curved-divider bg-white dark:bg-background absolute top-0 left-0 right-0 z-10"></div>
          <div className="pt-12 bg-hostinger-brand/5 dark:bg-hostinger-brand/10">
            <ToolsSection 
              title="Top Rated Tools" 
              description="Explore the highest rated AI tools by our community"
              queryType="top-rated"
              limit={sectionLimits.topRated}
              variant="secondary"
            />
          </div>
        </div>
        
        {/* Recently Added Tools Section */}
        <div className="relative">
          <div className="wave-divider bg-white dark:bg-background absolute top-0 left-0 right-0 z-10"></div>
          <div className="pt-16">
            <ToolsSection 
              title="Recently Added Tools" 
              description="Check out the latest AI tools added to our collection"
              queryType="recent"
              limit={sectionLimits.recent}
              variant="accent"
            />
          </div>
        </div>
        
        {/* CTA Section - With consistent colors */}
        <div className="relative">
          <GradientBackground variant="primary" className="py-12 md:py-16" intensity="medium">
            <div className="container-tight">
              <MotionWrapper animation="fadeIn">
                <GlassCard 
                  className="bg-background/50 backdrop-blur-lg border border-white/10 dark:border-white/5 dark:bg-gray-900/40 p-6 md:p-10 text-center"
                  glowEffect
                  hoverEffect
                  glowColor="before:from-hostinger-brand/30 before:to-hostinger-brand/10"
                >
                  <div className="relative mb-5">
                    <div className="absolute inset-0 blur-xl opacity-20 bg-gradient-to-br from-hostinger-brand to-hostinger-brand/70 rounded-full dark:opacity-30"></div>
                    <Sparkles size={36} className="mx-auto text-hostinger-brand dark:text-hostinger-brand" />
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Ready to find your <span className="bg-gradient-to-r from-hostinger-brand to-hostinger-brand bg-clip-text text-transparent">perfect AI tool?</span>
                  </h2>
                  <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm">
                    Browse our curated collection of the best AI tools to boost your productivity, creativity, and efficiency.
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      className="rounded-lg px-5 py-2 font-medium relative overflow-hidden group"
                      variant="default"
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
                      className="rounded-lg border bg-background/50 backdrop-blur-sm px-5 py-2 font-medium dark:bg-background/10"
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
