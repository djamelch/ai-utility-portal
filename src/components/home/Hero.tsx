import { useState, useEffect } from "react";
import { ArrowRight, Search, Filter, Sparkles, Zap, Target, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AnimatedStat } from "@/components/ui/AnimatedStat";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { TextCycler } from "@/components/ui/TextCycler";

interface Category {
  id: string;
  name: string;
  count: number;
}

export function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const navigate = useNavigate();
  
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
  
  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    if (searchTerm) {
      queryParams.append("search", searchTerm);
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      queryParams.append("category", selectedCategory);
    }
    
    if (selectedPricing && selectedPricing !== "all") {
      queryParams.append("pricing", selectedPricing);
    }
    
    if (sortOrder && sortOrder !== "newest") {
      queryParams.append("sortBy", sortOrder);
    }
    
    if (selectedFeatures.length > 0) {
      queryParams.append("features", selectedFeatures.join(','));
    }
    
    navigate(`/tools?${queryParams.toString()}`);
  };
  
  const handleFeatureToggle = (features: string[]) => {
    setSelectedFeatures(features);
  };
  
  const popularCategories = categories.slice(0, 5);
  
  // Project types for text cycling - making sure this array has values
  const projectTypes = [
    "business", 
    "content creation", 
    "marketing", 
    "research", 
    "design", 
    "coding", 
    "writing", 
    "analysis"
  ];
  
  // Log to verify projectTypes is correctly defined
  console.log("Project types for TextCycler:", projectTypes);
  
  return (
    <GradientBackground variant="primary" className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container-tight relative z-10">
        <MotionWrapper animation="fadeIn" className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles size={16} className="mr-1.5 inline-block animate-pulse" />
            Discover {statistics?.toolCount || "300+"}+ AI tools
          </span>
          
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Find the <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">perfect AI tool</span> for{" "}
            <span className="relative">
              <TextCycler 
                texts={projectTypes} 
                interval={2500}
                className="text-primary" 
              />
            </span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AI Any Tool helps you discover, compare, and choose the best AI-powered tools for your specific needs
          </p>
        </MotionWrapper>
        
        <MotionWrapper animation="fadeIn" delay="delay-200" className="mt-8 md:mt-12">
          <div className="flex flex-col md:flex-row gap-3 mx-auto max-w-xl">
            <div className="relative flex-1 flex rounded-md border border-input bg-background/80 backdrop-blur-sm shadow-sm overflow-hidden group transition-all duration-300 hover:border-primary/50 hover:shadow-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search for AI tools..."
                className="flex-1 pl-10 rounded-l-md border-0 focus-visible:ring-0 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              
              <div className="border-l border-input min-w-[140px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-0 focus:ring-0 rounded-l-none bg-transparent">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="px-6 relative overflow-hidden group" 
              onClick={handleSearch}
            >
              <span className="relative z-10 flex items-center">
                Search
                <Zap size={18} className="ml-2 transition-all group-hover:rotate-12" />
              </span>
              <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
            </Button>
          </div>
          
          <Collapsible 
            open={showAdvancedFilters} 
            onOpenChange={setShowAdvancedFilters}
            className="mt-4 max-w-xl mx-auto transition-all duration-300 ease-in-out"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group hover:border-primary/50 transition-all duration-300"
              >
                <Filter size={16} className="mr-2 transition-transform group-hover:rotate-45 duration-300" />
                {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 bg-background/60 backdrop-blur-sm p-4 rounded-lg border border-input animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Pricing</label>
                  <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select pricing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pricing</SelectItem>
                      {pricingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="top-rated">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Tool Features</label>
                <ToggleGroup type="multiple" value={selectedFeatures} onValueChange={handleFeatureToggle} className="flex flex-wrap gap-2">
                  <ToggleGroupItem value="api-access" className="text-xs group">
                    <Zap size={12} className="mr-1 group-data-[state=on]:text-primary" /> API Access
                  </ToggleGroupItem>
                  <ToggleGroupItem value="free-trial" className="text-xs group">
                    <CheckCircle size={12} className="mr-1 group-data-[state=on]:text-primary" /> Free Trial
                  </ToggleGroupItem>
                  <ToggleGroupItem value="no-signup" className="text-xs group">
                    <ArrowRight size={12} className="mr-1 group-data-[state=on]:text-primary" /> No Signup
                  </ToggleGroupItem>
                  <ToggleGroupItem value="mobile-friendly" className="text-xs group">
                    <Sparkles size={12} className="mr-1 group-data-[state=on]:text-primary" /> Mobile Friendly
                  </ToggleGroupItem>
                  <ToggleGroupItem value="browser-extension" className="text-xs group">
                    <Target size={12} className="mr-1 group-data-[state=on]:text-primary" /> Browser Extension
                  </ToggleGroupItem>
                  <ToggleGroupItem value="offline-mode" className="text-xs group">
                    <CheckCircle size={12} className="mr-1 group-data-[state=on]:text-primary" /> Offline Mode
                  </ToggleGroupItem>
                  <ToggleGroupItem value="team-collaboration" className="text-xs group">
                    <Sparkles size={12} className="mr-1 group-data-[state=on]:text-primary" /> Team Collaboration
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <Button size="sm" onClick={handleSearch} className="w-full group">
                <span className="relative z-10 flex items-center">
                  Apply Filters
                  <Filter size={14} className="ml-2 transition-all group-hover:scale-110" />
                </span>
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </MotionWrapper>
        
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
