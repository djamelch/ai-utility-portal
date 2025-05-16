import { useState, useEffect, useRef } from "react";
import { Search, Filter, SlidersHorizontal, Info, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { AdvancedFilters } from "@/components/tools/AdvancedFilters";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { supabase } from "@/integrations/supabase/client";
import { PageLoadingWrapper } from "@/components/ui/PageLoadingWrapper";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Tools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const pricing = searchParams.get("pricing") || "";
  const sortBy = searchParams.get("sortBy") || "featured";
  const features = searchParams.get("features")?.split(",").filter(Boolean) || [];
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Start with a higher number to display more tools initially
  const [loadMoreCount, setLoadMoreCount] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalTools, setTotalTools] = useState(0);
  const initialLimit = 12;
  const loadMoreIncrement = 12;

  // Generate search suggestions based on input
  useEffect(() => {
    if (searchInput.length > 1) {
      console.log("Tools page: Generating suggestions for:", searchInput);
      
      // Generate fake search suggestions (in a real app, you would fetch these from the database)
      const toolNames = [
        "ChatGPT", "Midjourney", "Jasper", "Dall-E", "GitHub Copilot", 
        "Notion AI", "Otter.ai", "Synthesia", "RunwayML", "Murf.ai",
        "AutoGPT", "Stable Diffusion", "DeepL", "Krisp", "Replicate"
      ];
      
      const categoryNames = [
        "Text Generation", "Image Generation", "Audio Processing", "Video Creation", 
        "Content Writing", "Code Generation", "Data Analysis", "Email Assistant",
        "Social Media", "Productivity", "Education", "Marketing", "Design"
      ];
      
      const pricingOptions = [
        "Free", "Freemium", "Paid", "Subscription", "One-time purchase"
      ];
      
      // Filter suggestions based on input
      const toolSuggestions = toolNames
        .filter(tool => tool.toLowerCase().includes(searchInput.toLowerCase()))
        .slice(0, 4);
      
      const categorySuggestions = categoryNames
        .filter(cat => cat.toLowerCase().includes(searchInput.toLowerCase()))
        .map(cat => `${cat} Tools`)
        .slice(0, 3);
      
      const pricingSuggestions = pricingOptions
        .filter(price => price.toLowerCase().includes(searchInput.toLowerCase()))
        .map(price => `${price} Tools`)
        .slice(0, 2);
      
      // Combine all suggestions
      const allSuggestions = [
        ...toolSuggestions,
        ...categorySuggestions,
        ...pricingSuggestions
      ];
      
      console.log("Tools page: All suggestions:", allSuggestions);
      setSearchSuggestions(allSuggestions);
      
      // Only show suggestions when we have something to show
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchInput]);

  // Handle clicks outside the suggestions dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const generateSEOTitle = () => {
    if (category && pricing) {
      return `${category} AI Tools with ${pricing} Pricing - AI Tools Directory`;
    } else if (category) {
      return `${category} AI Tools - Find the Best ${category} Tools`;
    } else if (pricing) {
      return `${pricing} AI Tools - Find ${pricing} AI Solutions`;
    } else if (searchQuery) {
      return `${searchQuery} - AI Tools Search Results`;
    } 
    return "AI Tools Directory - Find and Compare the Best AI Tools";
  };

  const generateSEODescription = () => {
    if (category && pricing) {
      return `Browse our selection of ${pricing} AI tools for ${category}. Compare features, pricing, and reviews to find the best ${category} AI solution for your needs.`;
    } else if (category) {
      return `Discover the best AI tools for ${category}. Our directory features top-rated ${category} solutions with reviews, features, and pricing information.`;
    } else if (pricing) {
      return `Find ${pricing} AI tools across various categories. Compare features and read reviews to find the right ${pricing} AI solution.`;
    } else if (searchQuery) {
      return `Search results for "${searchQuery}" in our AI tools directory. Browse, compare, and find the perfect AI tools that match your search.`;
    }
    return "Browse our comprehensive directory of AI tools. Compare features, pricing, and reviews to find the perfect AI solutions for your needs.";
  };

  const generateToolsSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": generateSEOTitle(),
      "description": generateSEODescription(),
      "url": `https://your-domain.com/tools${window.location.search}`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "AI Tools Directory",
        "url": "https://your-domain.com/"
      }
    };
  };

  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('primary_task')
          .not('primary_task', 'is', null);
        
        if (error) {
          console.error('Supabase error fetching categories:', error);
          throw error;
        }
        
        return Array.from(new Set(
          data.map(item => item.primary_task).filter(Boolean)
        ));
      } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 2000,
    staleTime: 1000 * 60 * 5
  });
  
  const { 
    data: pricingOptions = [], 
    isLoading: isPricingLoading,
    error: pricingError,
    refetch: refetchPricing
  } = useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('pricing')
          .not('pricing', 'is', null);
        
        if (error) {
          console.error('Supabase error fetching pricing options:', error);
          throw error;
        }
        
        return Array.from(new Set(
          data.map(item => item.pricing).filter(Boolean)
        ));
      } catch (error) {
        console.error('Error fetching pricing options:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 2000,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    const getToolsCount = async () => {
      try {
        let query = supabase.from('tools').select('id', { count: 'exact', head: true });
        
        if (searchQuery) {
          query = query.or(`company_name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,full_description.ilike.%${searchQuery}%`);
        }
        
        if (category) {
          const isSlug = category.includes('-');
          
          if (isSlug) {
            const formattedCategory = category
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            query = query.eq("primary_task", formattedCategory);
          } else {
            query = query.eq("primary_task", category);
          }
        }
        
        if (pricing) {
          query = query.eq("pricing", pricing);
        }
        
        const { count, error } = await query;
        
        if (error) {
          console.error('Error getting tools count:', error);
          return;
        }
        
        setTotalTools(count || 0);
        console.log(`Total tools count: ${count}`);
      } catch (error) {
        console.error('Error counting tools:', error);
      }
    };
    
    getToolsCount();
  }, [searchQuery, category, pricing, features]);

  const isLoading = isCategoriesLoading || isPricingLoading;
  const hasError = categoriesError || pricingError;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const params = new URLSearchParams(searchParams);
    
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }
    
    setSearchParams(params);
    // Reset to 1 to start with the first batch when search changes
    setLoadMoreCount(1);
    setShowSuggestions(false);
    console.log("Search submitted, loadMoreCount reset to 1");
  };

  const handleSelectSuggestion = (value: string) => {
    // If it's a category suggestion
    if (value.endsWith(" Tools")) {
      const categoryName = value.replace(" Tools", "");
      
      // Convert spaces to dashes and lowercase for URL
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
      
      const params = new URLSearchParams(searchParams);
      params.set("category", categorySlug);
      params.delete("search");
      setSearchParams(params);
    } 
    // If it's a pricing suggestion
    else if (value.startsWith("Free") || value.includes("pay") || value.includes("subscription") || value.includes("purchase")) {
      const pricingType = value.replace(" Tools", "");
      
      const params = new URLSearchParams(searchParams);
      params.set("pricing", pricingType);
      params.delete("search");
      setSearchParams(params);
    }
    // Otherwise it's a tool name
    else {
      setSearchInput(value);
      
      const params = new URLSearchParams(searchParams);
      params.set("search", value);
      setSearchParams(params);
    }
    
    setShowSuggestions(false);
    setLoadMoreCount(1);
  };

  const loadMore = () => {
    console.log("Load more button clicked");
    setIsLoadingMore(true);
    
    toast({
      title: "Loading More Tools",
      description: `Loading ${loadMoreIncrement} additional tools...`
    });
    
    setLoadMoreCount(prevCount => {
      const newCount = prevCount + 1;
      console.log(`Setting loadMoreCount from ${prevCount} to ${newCount}`);
      return newCount;
    });
    
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 500);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
    // Reset to 1 when filters are cleared
    setLoadMoreCount(1);
    console.log("Filters cleared, loadMoreCount reset to 1");
  };

  useEffect(() => {
    // Reset to 1 when filters change
    setLoadMoreCount(1);
    console.log("Filters changed, resetting load more count to 1");
  }, [searchQuery, category, pricing, sortBy, features]);

  const hasActiveFilters = searchQuery || category || pricing || sortBy !== "featured" || features.length > 0;

  const retryFetching = () => {
    refetchCategories();
    refetchPricing();
  };

  const currentLimit = initialLimit * loadMoreCount;
  console.log("Current calculated limit for tools:", currentLimit);
  
  const hasMoreTools = totalTools > currentLimit;
  console.log(`Has more tools: ${hasMoreTools} (Total: ${totalTools}, Current: ${currentLimit})`);

  return (
    <PageLoadingWrapper 
      isLoading={isLoading && !hasError} 
      loadingText="Loading AI tools directory..."
      variant="pulse"
    >
      <SEOHead
        title={generateSEOTitle()}
        description={generateSEODescription()}
        keywords={`AI tools, artificial intelligence, ${category || 'machine learning'}, ${pricing || 'software tools'}, AI directory`}
        canonicalUrl={`/tools${window.location.search}`}
        schemaData={generateToolsSchema()}
      />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container-wide">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                      AI Tools Directory
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      Discover the best AI tools for your needs
                    </p>
                  </div>
                  
                  {hasActiveFilters && (
                    <Button 
                      onClick={clearFilters}
                      variant="outline" 
                      size="sm"
                      className="mt-4 sm:mt-0 w-fit flex items-center gap-2"
                    >
                      <X size={16} />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </MotionWrapper>
            
            {hasError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Loading Error</AlertTitle>
                <AlertDescription>
                  An error occurred while loading filter data. Please try again later.
                  <Button 
                    onClick={retryFetching} 
                    variant="outline" 
                    size="sm" 
                    className="mr-2 mt-2"
                  >
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <MotionWrapper animation="fadeIn" delay="delay-200">
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                      <div className="relative flex-1 search-bar">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <Input
                          type="text"
                          placeholder="Search tools..."
                          className="w-full pl-10 pr-4 border-none bg-transparent"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onFocus={() => {
                            if (searchInput.length > 1 && searchSuggestions.length > 0) {
                              setShowSuggestions(true);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                            if (e.key === "Escape") setShowSuggestions(false);
                          }}
                          ref={searchInputRef}
                        />
                        
                        {/* Real-time suggestions dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                          <div 
                            ref={suggestionsRef}
                            className="absolute left-0 right-0 top-full z-10 mt-1 bg-background border border-input rounded-md shadow-md"
                          >
                            <ul className="py-1">
                              {searchSuggestions.map((suggestion, index) => (
                                <li 
                                  key={index} 
                                  className="px-3 py-2 hover:bg-accent cursor-pointer text-sm flex items-center"
                                  onClick={() => handleSelectSuggestion(suggestion)}
                                >
                                  <Search className="mr-2 h-4 w-4" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Search
                      </Button>
                    </form>
                    
                    {/* Mobile filters sheet */}
                    <div className="md:hidden">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full flex items-center justify-center gap-2",
                              hasActiveFilters && "border-primary text-primary"
                            )}
                          >
                            <Filter size={18} />
                            Filters
                            {hasActiveFilters && (
                              <span className="ml-1 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                !
                              </span>
                            )}
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-xl">
                          <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                              <SlidersHorizontal size={18} />
                              Filters
                              {hasActiveFilters && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={clearFilters}
                                  className="ml-auto"
                                >
                                  Reset All
                                </Button>
                              )}
                            </SheetTitle>
                          </SheetHeader>
                          <div className="py-4">
                            <AdvancedFilters 
                              categories={categories} 
                              pricingOptions={pricingOptions}
                            />
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                    
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "hidden md:inline-flex items-center gap-2",
                        showFilters ? "bg-accent text-white" : "bg-secondary"
                      )}
                      variant="outline"
                    >
                      <SlidersHorizontal size={18} />
                      {showFilters ? "Hide Filters" : "Show Filters"}
                      {hasActiveFilters && !showFilters && (
                        <span className="h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                          !
                        </span>
                      )}
                    </Button>
                  </div>
                  
                  <div className={cn("mb-6 filters-area", !showFilters && "hidden md:block")}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <SlidersHorizontal size={18} className="text-primary" />
                        Advanced Filters
                      </h3>
                      {hasActiveFilters && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={clearFilters}
                        >
                          Reset All
                        </Button>
                      )}
                    </div>
                    
                    <AdvancedFilters 
                      categories={categories} 
                      pricingOptions={pricingOptions}
                    />
                  </div>
                  
                  {hasActiveFilters && (
                    <div className="mb-6 p-4 rounded-xl bg-background/70 backdrop-blur-sm border border-border/60 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Info size={16} className="text-primary" />
                        <h3 className="text-sm font-medium">Active Filters:</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchQuery && (
                          <div className="filter-pill">
                            Search: {searchQuery}
                            <X size={14} className="ml-1" onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              params.delete("search");
                              setSearchParams(params);
                            }} />
                          </div>
                        )}
                        {category && (
                          <div className="filter-pill">
                            Category: {category.replace(/-/g, ' ')}
                            <X size={14} className="ml-1" onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              params.delete("category");
                              setSearchParams(params);
                            }} />
                          </div>
                        )}
                        {pricing && (
                          <div className="filter-pill">
                            Pricing: {pricing}
                            <X size={14} className="ml-1" onClick={() => {
                              const params = new URLSearchParams(searchParams);
                              params.delete("pricing");
                              setSearchParams(params);
                            }} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </MotionWrapper>
            )}
            
            <MotionWrapper animation="fadeIn" delay="delay-300">
              <ToolGrid 
                queryType="all"
                searchQuery={searchQuery}
                category={category}
                pricing={pricing}
                sortBy={sortBy}
                limit={currentLimit}
                features={features}
              />

              {hasMoreTools && (
                <div className="mt-10 flex justify-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={loadMore}
                    className="px-8 flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "Loading..." : `Load More Tools (${loadMoreIncrement})`}
                  </Button>
                </div>
              )}
            </MotionWrapper>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageLoadingWrapper>
  );
};

export default Tools;
