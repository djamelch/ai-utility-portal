
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ToolsSection } from "@/components/home/ToolsSection";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEffect, useState } from "react";
import { CategorySection } from "@/components/home/CategorySection";

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
        title="AI Tools Directory - Find and Compare the Best AI Tools"
        description="Discover the best AI tools for productivity, creativity, and business. Our comprehensive directory helps you find and compare the perfect AI solutions for your needs."
        keywords="AI tools, artificial intelligence, machine learning tools, productivity tools, AI directory, top AI tools"
        canonicalUrl="/"
        schemaData={generateHomeSchema()}
      />
      <Navbar />
      
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <Hero />
        
        {/* Modern Organic Divider */}
        <div className="relative h-24 -mt-12 md:-mt-16 overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path 
              fill="currentColor" 
              fillOpacity="1" 
              className="text-background"
              d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,170.7C672,181,768,171,864,144C960,117,1056,75,1152,69.3C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Discover Section with Curated Selection */}
        <section className="relative bg-background">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/0 opacity-70"></div>
          <ToolsSection 
            title="Discover AI Innovations" 
            description="Curated selection of groundbreaking AI tools transforming industries"
            queryType="featured"
            limit={sectionLimits.featured}
            variant="none"
          />
        </section>
        
        {/* Categories Section with Organic Shape */}
        <div className="relative py-12">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent"></div>
          <div className="absolute -top-16 inset-x-0 h-16">
            <svg className="absolute w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path 
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                fill="rgba(244,244,245,0.8)"
              ></path>
            </svg>
          </div>
          <CategorySection />
        </div>
        
        {/* Flowing Divider */}
        <div className="relative h-24 overflow-hidden">
          <svg className="absolute w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path 
              fill="currentColor" 
              fillOpacity="0.2" 
              className="text-secondary"
              d="M0,224L40,213.3C80,203,160,181,240,181.3C320,181,400,203,480,218.7C560,235,640,245,720,229.3C800,213,880,171,960,149.3C1040,128,1120,128,1200,149.3C1280,171,1360,213,1400,234.7L1440,256L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Trending Section with Soft Curves */}
        <div className="relative bg-secondary/10 backdrop-blur-sm mx-4 sm:mx-8 lg:mx-12 my-4 overflow-hidden rounded-[30px]">
          <div className="absolute inset-0 bg-noise opacity-20"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"></div>
          
          <div className="py-10 md:py-16">
            <ToolsSection 
              title="Trending AI Solutions" 
              description="The most popular tools gaining traction in the AI community"
              queryType="top-rated"
              limit={sectionLimits.topRated}
              variant="none"
            />
          </div>
        </div>
        
        {/* Elegant Wavy Divider */}
        <div className="relative h-32 overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="rgba(226,232,240,0.5)"
            ></path>
          </svg>
        </div>
        
        {/* Latest Additions Section with Pattern Overlay */}
        <div className="relative bg-gradient-to-b from-background to-accent/5 py-12">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <ToolsSection 
            title="Latest AI Innovations" 
            description="Fresh additions to our collection of cutting-edge AI tools"
            queryType="recent"
            limit={sectionLimits.recent}
            variant="none"
          />
        </div>
        
        {/* Modern Diagonal Divider */}
        <div className="relative h-24 overflow-hidden">
          <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path 
              fill="rgba(226,232,240,0.3)" 
              fillOpacity="1" 
              d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,165.3C672,181,768,235,864,234.7C960,235,1056,181,1152,144C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Call to Action with Enhanced Design */}
        <GradientBackground variant="primary" className="py-16 md:py-20 rounded-t-[40px]" intensity="medium">
          <div className="container-tight relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-accent/10 rounded-full filter blur-3xl opacity-40"></div>
            
            <MotionWrapper animation="fadeIn">
              <GlassCard 
                className="bg-background/50 backdrop-blur-lg border border-white/10 dark:border-white/5 p-8 md:p-12 text-center relative overflow-hidden rounded-2xl"
                glowEffect
                hoverEffect
              >
                {/* Decorative elements */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-accent/5 rounded-full"></div>
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 blur-xl opacity-20 bg-gradient-to-br from-primary via-accent to-primary rounded-full"></div>
                  <Sparkles size={40} className="mx-auto text-primary" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Ready to Elevate Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Digital Workflow?</span>
                </h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
                  Explore our comprehensive collection of AI tools to transform how you work, create, and innovate.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="rounded-xl px-6 py-2.5 font-medium relative overflow-hidden group"
                    variant="gradient"
                    asChild
                  >
                    <Link to="/tools">
                      <span className="relative z-10 flex items-center">
                        <Search size={18} className="mr-2" />
                        Discover Tools
                        <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-xl border bg-background/50 backdrop-blur-sm px-6 py-2.5 font-medium"
                    asChild
                  >
                    <Link to="/blog" className="flex items-center">
                      <Star size={18} className="mr-2" />
                      Expert Insights
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
