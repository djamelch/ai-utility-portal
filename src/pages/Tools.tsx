import { useState, useEffect } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tool } from "@/components/tools/ToolGrid";
import { CategoryFilter } from "@/components/tools/CategoryFilter";
import { PricingFilter } from "@/components/tools/PricingFilter";
import { SortFilter } from "@/components/tools/SortFilter";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Search } from "lucide-react";

export default function Tools() {
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
      <section className="section-padding">
        <div className="container-wide">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Explore AI Tools
              </h1>
              <p className="mt-2 text-muted-foreground">
                Discover the perfect AI tool for your needs
              </p>
            </div>
          </MotionWrapper>
          
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 lg:col-span-3">
              <MotionWrapper animation="fadeIn" delay="delay-100">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tools..." className="pl-8" />
                  </div>
                </div>
              </MotionWrapper>
              
              <MotionWrapper animation="fadeIn" delay="delay-200">
                <CategoryFilter />
              </MotionWrapper>
              
              <MotionWrapper animation="fadeIn" delay="delay-300">
                <PricingFilter />
              </MotionWrapper>
            </aside>
            
            <div className="col-span-12 lg:col-span-9">
              <MotionWrapper animation="fadeIn" delay="delay-100">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Displaying 1 - 20 of 142 tools
                  </p>
                  <SortFilter />
                </div>
              </MotionWrapper>
              
              <ToolGrid />
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
