
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Tools Section */}
        <ToolsSection 
          title="Featured Tools" 
          description="Discover our handpicked selection of the best AI tools"
          queryType="featured"
          limit={8}
        />
        
        {/* Top Rated Tools Section */}
        <ToolsSection 
          title="Top Rated Tools" 
          description="Explore the highest rated AI tools by our community"
          queryType="top-rated"
          limit={4}
        />
        
        {/* Recently Added Tools Section */}
        <ToolsSection 
          title="Recently Added Tools" 
          description="Check out the latest AI tools added to our collection"
          queryType="recent"
          limit={4}
        />
        
        {/* Feature Section */}
        <FeatureSection />
        
        {/* Categories Section */}
        <CategorySection />
        
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
                    href="/tools" 
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Explore Tools
                  </Link>
                  <Link 
                    href="/blog" 
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
}
