
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ToolsSection } from "@/components/home/ToolsSection";
import { CategorySection } from "@/components/home/CategorySection";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Search, Star } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

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
        
        {/* Organic wave divider - Creates natural flowing transition */}
        <div className="relative h-32 -mt-16">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" className="text-background" fillOpacity="1" d="M0,192L48,186.7C96,181,192,171,288,160C384,149,480,139,576,149.3C672,160,768,192,864,181.3C960,171,1056,117,1152,96C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Featured Tools Section with organic shape background */}
        <div className="relative pt-0 md:pt-4 rounded-t-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/0 opacity-80"></div>
          {/* Decorative blob */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[80px] opacity-70 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-accent/5 rounded-full filter blur-[60px] opacity-50"></div>
          
          <ToolsSection 
            title="أدوات مميزة" 
            description="اكتشف مجموعة مختارة من أفضل أدوات الذكاء الاصطناعي"
            queryType="featured"
            limit={sectionLimits.featured}
            variant="none"
          />
        </div>
        
        {/* Curved organic divider */}
        <div className="relative py-8">
          <div className="curved-section-divider w-full h-24 overflow-hidden">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                className="fill-secondary/30"></path>
            </svg>
          </div>
        </div>
        
        {/* Categories Section with organic styling */}
        <div className="relative overflow-hidden">
          <CategorySection />
        </div>
        
        {/* Fluid bubble divider */}
        <div className="relative py-12">
          <div className="bubble-divider">
            <div className="bubble bubble-1"></div>
            <div className="bubble bubble-2"></div>
            <div className="bubble bubble-3"></div>
            <div className="bubble bubble-4"></div>
          </div>
        </div>
        
        {/* Top Rated Tools Section with soft edges and flow */}
        <div className="relative bg-secondary/10 backdrop-blur-sm py-12 rounded-[2.5rem] mx-4 sm:mx-8 lg:mx-12 my-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-primary/5 opacity-60"></div>
          
          {/* Decorative flowing elements */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <div className="absolute top-4 left-4 w-32 h-32 bg-accent/5 rounded-full filter blur-xl opacity-40 animate-breathe"></div>
          <div className="absolute bottom-8 right-8 w-48 h-48 bg-primary/5 rounded-full filter blur-xl opacity-30 animate-breathe"></div>
          
          <ToolsSection 
            title="الأدوات الأعلى تقييماً" 
            description="استكشف أدوات الذكاء الاصطناعي الأعلى تقييماً من قبل مجتمعنا"
            queryType="top-rated"
            limit={sectionLimits.topRated}
            variant="none"
          />
        </div>
        
        {/* Organic flowing divider */}
        <div className="relative py-12">
          <div className="flow-divider w-full h-24 overflow-hidden">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                className="fill-accent/20"></path>
            </svg>
          </div>
        </div>
        
        {/* Recently Added Tools Section with organic patterns */}
        <div className="relative py-12 mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/5"></div>
          
          {/* Organic patterns */}
          <div className="absolute inset-0 bg-organic-pattern opacity-10"></div>
          <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-primary/5 rounded-full filter blur-[100px] opacity-30 animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-[120px] opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          
          <ToolsSection 
            title="أدوات أضيفت مؤخراً" 
            description="تحقق من أحدث أدوات الذكاء الاصطناعي المضافة إلى مجموعتنا"
            queryType="recent"
            limit={sectionLimits.recent}
            variant="none"
          />
        </div>
        
        {/* Natural flowing divider */}
        <div className="relative h-24 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" 
              className="fill-primary/10"
            ></path>
          </svg>
        </div>
        
        {/* CTA Section with enhanced organic design */}
        <GradientBackground variant="primary" className="py-16 rounded-t-[3rem] relative overflow-hidden" intensity="medium">
          {/* Organic decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full filter blur-[100px] opacity-30 animate-breathe"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full filter blur-[80px] opacity-20 animate-float"></div>
          <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-white/10 rounded-full filter blur-[60px] opacity-10"></div>
          
          <div className="container-tight relative">
            <MotionWrapper animation="fadeIn">
              <GlassCard 
                className="bg-background/50 backdrop-blur-lg border border-white/10 dark:border-white/5 p-8 md:p-12 text-center relative overflow-hidden rounded-[2rem]"
                glowEffect
                hoverEffect
              >
                {/* Organic decorative shapes */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/5 rounded-full"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/10 rounded-full filter blur-md opacity-70 animate-float"></div>
                <div className="absolute bottom-1/3 right-1/5 w-12 h-12 bg-accent/10 rounded-full filter blur-sm opacity-60" style={{animationDelay: '1.5s'}}></div>
                
                <div className="relative mb-8">
                  <div className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-br from-primary via-accent to-primary rounded-full"></div>
                  <Sparkles size={40} className="mx-auto text-primary" />
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  مستعد للعثور على <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">أداة الذكاء الاصطناعي المثالية؟</span>
                </h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
                  تصفح مجموعتنا المنتقاة من أفضل أدوات الذكاء الاصطناعي لتعزيز إنتاجيتك وإبداعك وكفاءتك.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="rounded-xl px-6 py-6 font-medium relative overflow-hidden group text-lg"
                    variant="gradient"
                    asChild
                  >
                    <Link to="/tools">
                      <span className="relative z-10 flex items-center">
                        <Search size={18} className="mr-2" />
                        استكشف الأدوات
                        <ArrowRight size={18} className="mr-2 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    className="rounded-xl border bg-background/50 backdrop-blur-sm px-6 py-6 font-medium text-lg"
                    asChild
                  >
                    <Link to="/blog" className="flex items-center">
                      <Star size={18} className="mr-2" />
                      اقرأ مدونتنا
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
