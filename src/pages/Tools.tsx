
import { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
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

const Tools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const pricing = searchParams.get("pricing") || "";
  const sortBy = searchParams.get("sortBy") || "featured";
  const features = searchParams.get("features")?.split(",") || [];
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [loadMoreCount, setLoadMoreCount] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const initialLimit = 12;
  const loadMoreIncrement = 12;

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

  const isLoading = isCategoriesLoading || isPricingLoading;
  const hasError = categoriesError || pricingError;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }
    
    setSearchParams(params);
    setLoadMoreCount(1);
  };

  const loadMore = async () => {
    try {
      console.log("Load more clicked. Current count:", loadMoreCount);
      setIsLoadingMore(true);
      
      // Simulate delay to ensure state updates correctly
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLoadMoreCount(prevCount => {
        const newCount = prevCount + 1;
        console.log("New load more count:", newCount);
        
        // Show toast for feedback
        toast({
          title: "Loading more tools",
          description: `Loading ${loadMoreIncrement} more tools...`
        });
        
        return newCount;
      });
    } catch (error) {
      console.error("Error loading more tools:", error);
      toast({
        title: "Error",
        description: "Failed to load more tools. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
    setLoadMoreCount(1);
  };

  // Reset load more count when filters change
  useEffect(() => {
    setLoadMoreCount(1);
    console.log("Filters changed, resetting load more count to 1");
  }, [searchQuery, category, pricing, sortBy, features]);

  const hasActiveFilters = searchQuery || category || pricing || sortBy !== "featured" || features.length > 0;

  const retryFetching = () => {
    refetchCategories();
    refetchPricing();
  };

  const currentLimit = initialLimit * loadMoreCount;
  console.log("Current calculated limit:", currentLimit);

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
                <h1 className="text-3xl md:text-4xl font-bold">
                  AI Tools Directory
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Discover the best AI tools for all your needs
                </p>
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
                    className="ml-2 mt-2"
                  >
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <MotionWrapper animation="fadeIn" delay="delay-200">
                <div className="mb-8">
                  <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <Input
                        type="text"
                        placeholder="Search for tools..."
                        className="w-full pl-10 pr-4"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "md:hidden inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2",
                        showFilters && "bg-accent"
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
                    
                    <Button type="submit">
                      Search
                    </Button>
                  </form>
                  
                  <div className={cn("mb-6", !showFilters && "hidden md:block")}>
                    <div className="bg-secondary/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <SlidersHorizontal size={18} />
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
                  </div>
                  
                  {hasActiveFilters && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
                      <div className="flex flex-wrap gap-2">
                        {/* Active filters will be shown here */}
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

              <div className="mt-10 flex justify-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={loadMore}
                  className="px-8 flex items-center gap-2"
                  disabled={isLoading || isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    `Load More Tools`
                  )}
                </Button>
              </div>
            </MotionWrapper>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageLoadingWrapper>
  );
};

export default Tools;
