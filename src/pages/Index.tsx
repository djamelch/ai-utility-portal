
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
        
        {/* Wave Divider - Creates organic transition to next section */}
        <div className="relative h-24 -mt-10 md:-mt-16">
          <svg className="absolute w-full h-24 md:h-32 text-background" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" fillOpacity="1" d="M0,128L48,133.3C96,139,192,149,288,138.7C384,128,480,96,576,106.7C672,117,768,171,864,186.7C960,203,1056,181,1152,165.3C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Featured Tools Section - With subtle gradient */}
        <div className="relative bg-background pt-0 md:pt-4">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/0 opacity-70"></div>
          <ToolsSection 
            title="Featured Tools" 
            description="Discover our handpicked selection of the best AI tools"
            queryType="featured"
            limit={sectionLimits.featured}
            variant="none"
          />
        </div>
        
        {/* Blob Divider - Creates organic transition */}
        <div className="relative h-20 md:h-24 overflow-hidden">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
              fill="rgba(226,232,240,0.2)"
            ></path>
          </svg>
        </div>
        
        {/* Top Rated Tools Section - With soft edges */}
        <div className="relative bg-secondary/10 backdrop-blur-sm py-8 md:py-12 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-primary/5 opacity-60"></div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <ToolsSection 
            title="Top Rated Tools" 
            description="Explore the highest rated AI tools by our community"
            queryType="top-rated"
            limit={sectionLimits.topRated}
            variant="none"
          />
        </div>
        
        {/* Curved Divider - Creates flowing transition */}
        <div className="relative h-24 md:h-32 overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="rgba(244,244,245,0.3)"
            ></path>
          </svg>
        </div>
        
        {/* Recently Added Tools Section - With soft gradient overlay */}
        <div className="relative bg-gradient-to-b from-background to-accent/5 py-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMjgyZjgiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0ycTAtLjQyNy0uMjg3LS43MTNUMzUgMzFoLTVxLS40MiAwLS43MS4yODdUMjkgMzJxMCAuNDIzLjI5LjcxVDMwIDMzaDVxLjQyNyAwIC43MTMtLjI4N1QzNiAzMnptLTktMnYxaC00di0xaDR6bTktNHYxaC00di0xaDR6bS05IDBoNHYxaC00di0xem05LTR2MWgtNHYtMWg0em0tOSAwaDF2MWgtMXYtMXptLTQgMGg0djFoLTR2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <ToolsSection 
            title="Recently Added Tools" 
            description="Check out the latest AI tools added to our collection"
            queryType="recent"
            limit={sectionLimits.recent}
            variant="none"
          />
        </div>
        
        {/* Diagonal Divider - Creates unique transition */}
        <div className="relative h-16 md:h-24 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M1200 120L0 16.48 0 0 1200 0 1200 120z" 
              fill="rgba(226,232,240,0.3)"
            ></path>
          </svg>
        </div>
        
        {/* CTA Section with enhanced organic design */}
        <GradientBackground variant="primary" className="py-12 md:py-16 rounded-t-3xl" intensity="medium">
          <div className="container-tight relative">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-accent/10 rounded-full filter blur-3xl opacity-40"></div>
            
            <MotionWrapper animation="fadeIn">
              <GlassCard 
                className="bg-background/50 backdrop-blur-lg border border-white/10 dark:border-white/5 p-6 md:p-10 text-center relative overflow-hidden rounded-xl"
                glowEffect
                hoverEffect
              >
                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-accent/5 rounded-full"></div>
                
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
