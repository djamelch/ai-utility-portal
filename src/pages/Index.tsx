
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Feature Section */}
        <FeatureSection />
        
        {/* Categories Section */}
        <CategorySection />
        
        {/* Featured Tools Section */}
        <section className="section-padding">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">Featured Tools</h2>
                  <p className="mt-2 text-muted-foreground">
                    Discover our handpicked selection of the best AI tools
                  </p>
                </div>
                <Link 
                  to="/tools" 
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
                >
                  View all
                  <ArrowRight size={16} />
                </Link>
              </div>
            </MotionWrapper>
            
            <ToolGrid limit={8} />
            
            <div className="mt-10 text-center sm:hidden">
              <Link 
                to="/tools" 
                className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                View all tools
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
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
