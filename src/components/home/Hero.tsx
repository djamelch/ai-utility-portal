
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { TextCycler } from "@/components/ui/TextCycler";
import { HeroSearch } from "./HeroSearch";

interface Category {
  id: string;
  name: string;
  count: number;
}

export function Hero() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories-with-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("primary_task");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      
      const categoryCounts: Record<string, number> = {};
      data.forEach(tool => {
        if (tool.primary_task) {
          categoryCounts[tool.primary_task] = (categoryCounts[tool.primary_task] || 0) + 1;
        }
      });
      
      const sortedCategories: Category[] = Object.entries(categoryCounts)
        .filter(([name]) => name)
        .map(([name, count]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          count
        }))
        .sort((a, b) => b.count - a.count);
      
      return sortedCategories;
    }
  });
  
  const { data: pricingOptions = [] } = useQuery({
    queryKey: ["pricing-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("pricing");
      
      if (error) {
        console.error("Error fetching pricing options:", error);
        return [];
      }
      
      const uniquePricing = Array.from(new Set(
        data.map(tool => tool.pricing).filter(Boolean)
      ));
      
      return uniquePricing;
    }
  });
  
  const { data: statistics } = useQuery({
    queryKey: ["home-statistics"],
    queryFn: async () => {
      const { count: toolCount, error: toolError } = await supabase
        .from("tools")
        .select("*", { count: "exact", head: true });
      
      if (toolError) {
        console.error("Error fetching tool count:", toolError);
      }
      
      const { data: categoryData, error: categoryError } = await supabase
        .from("tools")
        .select("primary_task");
      
      if (categoryError) {
        console.error("Error fetching categories:", categoryError);
      }
      
      const uniqueCategories = new Set();
      categoryData?.forEach(tool => {
        if (tool.primary_task) uniqueCategories.add(tool.primary_task);
      });
      
      const { count: reviewCount, error: reviewError } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });
      
      if (reviewError) {
        console.error("Error fetching review count:", reviewError);
      }
      
      return {
        toolCount: toolCount || 0,
        categoryCount: uniqueCategories.size || 0,
        reviewCount: reviewCount || 0
      };
    }
  });
  
  const popularCategories = categories.slice(0, 5);
  
  // Project types for text cycling
  const projectTypes = [
    "business", 
    "content", 
    "marketing", 
    "design", 
    "coding", 
    "writing"
  ];
  
  return (
    <GradientBackground variant="primary" className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container-tight relative z-10">
        <MotionWrapper animation="fadeIn" className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles size={16} className="mr-1.5 inline-block animate-pulse" />
            {statistics?.toolCount || "300+"}+ AI tools
          </span>
          
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-gradient">AI tools</span> for{" "}
            <TextCycler 
              texts={projectTypes} 
              interval={2500}
              className="inline-block"
            />
            {" "}projects
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, compare, and choose the best AI-powered tools for your specific needs
          </p>
        </MotionWrapper>
        
        <HeroSearch categories={categories} pricingOptions={pricingOptions} />
        
        <MotionWrapper animation="fadeIn" delay="delay-300" className="mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularCategories.map((category) => (
              <Link
                key={category.id}
                to={`/tools?category=${category.id}`}
                className="rounded-full bg-secondary/50 backdrop-blur-sm px-3 py-1 text-sm text-foreground/70 hover:bg-secondary/80 hover:text-foreground transition-colors hover:shadow-sm group"
              >
                <span className="relative">
                  {category.name} ({category.count})
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            ))}
          </div>
        </MotionWrapper>
        
        <MotionWrapper animation="fadeIn" delay="delay-400" className="mt-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <AnimatedStat 
              value={statistics?.toolCount || 300} 
              label="AI Tools" 
              suffix="+" 
              valueClassName="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent"
              disableAnimation={false}
              duration={3000}
              icon="zap"
              iconColor="text-primary"
            />
            <AnimatedStat 
              value={statistics?.categoryCount || 18} 
              label="Categories" 
              valueClassName="bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent"
              disableAnimation={false}
              duration={2500}
              icon="activity"
              iconColor="text-accent"
            />
            <AnimatedStat 
              value={statistics?.reviewCount || 1000} 
              label="Reviews" 
              suffix="+" 
              valueClassName="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent"
              disableAnimation={false}
              duration={2800}
              icon="star"
              iconColor="text-primary"
            />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold flex items-center justify-center bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">
                <span className="animate-pulse inline-block h-3 w-3 rounded-full bg-primary mr-2"></span>
                Weekly
              </div>
              <div className="text-muted-foreground mt-1">Updates</div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </GradientBackground>
  );
}
