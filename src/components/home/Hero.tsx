import { useState } from "react";
import { ArrowRight, Search, Filter } from "lucide-react";
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

// Define the Category type
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
  
  // Fetch categories with their tool counts
  const { data: categories = [] } = useQuery({
    queryKey: ["categories-with-counts"],
    queryFn: async () => {
      // This is a simplified approach - in a real app, you might have a categories table
      // Here we're extracting unique categories from the tools table and counting them
      const { data, error } = await supabase
        .from("tools")
        .select("primary_task");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      
      // Count occurrences of each category
      const categoryCounts: Record<string, number> = {};
      data.forEach(tool => {
        if (tool.primary_task) {
          categoryCounts[tool.primary_task] = (categoryCounts[tool.primary_task] || 0) + 1;
        }
      });
      
      // Convert to array and sort by count (descending)
      const sortedCategories: Category[] = Object.entries(categoryCounts)
        .filter(([name]) => name) // Filter out null/empty categories
        .map(([name, count]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          count
        }))
        .sort((a, b) => b.count - a.count);
      
      return sortedCategories;
    }
  });
  
  // Fetch pricing options
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
      
      // Get unique pricing options
      const uniquePricing = Array.from(new Set(
        data.map(tool => tool.pricing).filter(Boolean)
      ));
      
      return uniquePricing;
    }
  });
  
  // Fetch statistics
  const { data: statistics } = useQuery({
    queryKey: ["home-statistics"],
    queryFn: async () => {
      // Get tool count
      const { count: toolCount, error: toolError } = await supabase
        .from("tools")
        .select("*", { count: "exact", head: true });
      
      if (toolError) {
        console.error("Error fetching tool count:", toolError);
      }
      
      // Get category count (unique primary_task values)
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
      
      // Get review count
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
  
  // Handle search submission
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
  
  // Handle feature toggle
  const handleFeatureToggle = (features: string[]) => {
    setSelectedFeatures(features);
  };
  
  // Popular categories limited to 5 for display
  const popularCategories = categories.slice(0, 5);
  
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      <div className="container-tight relative z-10">
        <MotionWrapper animation="fadeIn" className="text-center">
          <span className="inline-block rounded-full bg-secondary/80 px-4 py-1.5 text-sm font-medium text-foreground/80">
            Discover {statistics?.toolCount || "300+"}+ AI tools
          </span>
          
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Find the <span className="text-gradient">perfect AI tool</span> for your next project
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AI Any Tool helps you discover, compare, and choose the best AI-powered tools for your specific needs
          </p>
        </MotionWrapper>
        
        {/* Search bar with filters */}
        <MotionWrapper animation="fadeIn" delay="delay-200" className="mt-8 md:mt-12">
          <div className="flex flex-col md:flex-row gap-3 mx-auto max-w-xl">
            <div className="relative flex-1 flex rounded-md border border-input bg-background shadow-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search for AI tools..."
                className="flex-1 pl-10 rounded-l-md border-0 focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              
              <div className="border-l border-input min-w-[140px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-0 focus:ring-0 rounded-l-none">
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
            
            <Button className="px-6" onClick={handleSearch}>
              Search
            </Button>
          </div>
          
          {/* Advanced Filters */}
          <Collapsible 
            open={showAdvancedFilters} 
            onOpenChange={setShowAdvancedFilters}
            className="mt-4 max-w-xl mx-auto"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Filter size={16} className="mr-2" />
                {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 bg-background/60 backdrop-blur-sm p-4 rounded-lg border border-input">
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
                  <ToggleGroupItem value="api" className="text-xs">API Access</ToggleGroupItem>
                  <ToggleGroupItem value="free-trial" className="text-xs">Free Trial</ToggleGroupItem>
                  <ToggleGroupItem value="no-signup" className="text-xs">No Signup</ToggleGroupItem>
                  <ToggleGroupItem value="mobile-friendly" className="text-xs">Mobile Friendly</ToggleGroupItem>
                  <ToggleGroupItem value="browser-extension" className="text-xs">Browser Extension</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <Button size="sm" onClick={handleSearch} className="w-full">
                Apply Filters
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </MotionWrapper>
        
        {/* Popular Categories */}
        <MotionWrapper animation="fadeIn" delay="delay-300" className="mt-8">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularCategories.map((category) => (
              <Link
                key={category.id}
                to={`/tools?category=${category.id}`}
                className="rounded-full bg-secondary/50 px-3 py-1 text-sm text-foreground/70 hover:bg-secondary/80 hover:text-foreground transition-colors"
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </MotionWrapper>
        
        {/* Featured metrics */}
        <MotionWrapper animation="fadeIn" delay="delay-400" className="mt-16">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: statistics?.toolCount || "300+", label: "AI Tools" },
              { value: statistics?.categoryCount || "18", label: "Categories" },
              { value: statistics?.reviewCount || "1000+", label: "Reviews" },
              { value: "Weekly", label: "Updates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
