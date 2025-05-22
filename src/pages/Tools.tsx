import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tool } from "@/components/tools/ToolGrid";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";
import { FilterBar } from "@/components/tools/FilterBar";
import { ModernLoadingIndicator } from "@/components/ui/ModernLoadingIndicator";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { useToast } from "@/hooks/use-toast";

export default function Tools() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const pricingParam = searchParams.get("pricing");
  const featuresParam = searchParams.get("features");
  const sortByParam = searchParams.get("sortBy") || "newest";
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayedTools, setDisplayedTools] = useState<Tool[]>([]);
  const toolsPerPage = 12;
  const [totalTools, setTotalTools] = useState(0);
  const { toast } = useToast();

  // Fetch tools based on filters
  const { data: tools = [], isLoading, refetch } = useQuery({
    queryKey: ["tools", categoryParam, searchParam, pricingParam, featuresParam, sortByParam],
    queryFn: async () => {
      try {
        console.log("Fetching tools with filters:", { categoryParam, searchParam, pricingParam, featuresParam, sortByParam });
        
        let query = supabase.from("tools").select("*");
        
        // Apply filters
        if (categoryParam) {
          query = query.eq("primary_task", categoryParam);
        }
        
        if (searchParam) {
          query = query.or(`company_name.ilike.%${searchParam}%,short_description.ilike.%${searchParam}%`);
        }
        
        if (pricingParam && pricingParam !== "all") {
          query = query.eq("pricing", pricingParam);
        }
        
        // Apply sorting
        switch (sortByParam) {
          case "popular":
            query = query.order("click_count", { ascending: false });
            break;
          case "top-rated":
            query = query.order("rating", { ascending: false });
            break;
          case "newest":
          default:
            query = query.order("created_at", { ascending: false });
            break;
        }
        
        // Get the total count first (for pagination info)
        const countQuery = { ...query };
        const { count, error: countError } = await countQuery.count();
        
        if (countError) {
          console.error("Error getting count:", countError);
          setTotalTools(0);
        } else {
          setTotalTools(count || 0);
        }
        
        // Now get the actual data
        const { data, error } = await query.range(0, 100); // Get a reasonable max amount
        
        if (error) {
          console.error("Error fetching tools:", error);
          return [];
        }
        
        // Convert to Tool objects and apply feature filtering if needed
        let filteredTools = (data || []).map(dbTool => ({
          id: dbTool.id,
          name: dbTool.company_name || "",
          description: dbTool.short_description || "",
          logo: dbTool.logo_url || "",
          category: dbTool.primary_task || "",
          rating: dbTool.rating || 4,
          reviewCount: dbTool.review_count || 0,
          pricing: dbTool.pricing || "",
          url: dbTool.visit_website_url || dbTool.detail_url || "#",
          slug: dbTool.slug || "",
          isFeatured: Boolean(dbTool.is_featured),
          isVerified: Boolean(dbTool.is_verified),
          isNew: new Date(dbTool.created_at || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        }));
        
        // Apply feature filtering if needed
        if (featuresParam) {
          const features = featuresParam.split(',');
          
          // This is a simplified example - in a real app you'd check against actual feature data
          filteredTools = filteredTools.filter(tool => {
            // Simulate feature filtering - replace with actual logic based on your data structure
            const hasFeature = (feature: string) => Math.random() > 0.5; // Replace with actual feature check
            return features.some(feature => hasFeature(feature));
          });
        }
        
        return filteredTools;
      } catch (error) {
        console.error("Error in tools query:", error);
        return [];
      }
    }
  });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [categoryParam, searchParam, pricingParam, featuresParam, sortByParam]);

  // Update displayed tools when tools data or page changes
  useEffect(() => {
    if (tools.length > 0) {
      const endIndex = currentPage * toolsPerPage;
      const newDisplayedTools = tools.slice(0, endIndex);
      setDisplayedTools(newDisplayedTools);
      setHasMore(endIndex < tools.length);
    } else {
      setDisplayedTools([]);
      setHasMore(false);
    }
  }, [tools, currentPage]);

  // Function to load more tools
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Fetch categories for filters
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("count", { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    }
  });

  // Fetch pricing options for filters
  const { data: pricingOptions = [] } = useQuery({
    queryKey: ["pricing-options"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("pricing_options")
          .select("name");
        
        if (error) throw error;
        return (data || []).map(option => option.name);
      } catch (error) {
        console.error("Error fetching pricing options:", error);
        return ["Free", "Freemium", "Paid", "Contact for Pricing"];
      }
    }
  });

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === "all") {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    
    // Update URL with new filters
    window.history.pushState({}, '', `?${newParams.toString()}`);
    
    // Force a refetch with the new filters
    refetch();
    
    // Show toast notification
    toast({
      title: "Filters Updated",
      description: `Showing ${type === "category" ? value : type === "pricing" ? `${value} pricing` : "filtered"} tools`,
    });
  };

  return (
    <>
      <SEOHead 
        title="All AI Tools - Comprehensive Directory | AI Any Tool" 
        description="Browse our complete collection of AI tools across all categories. Filter by features, pricing, and more to find the perfect AI solution for your needs."
        keywords="AI tools list, all AI tools, AI software directory, AI solutions, artificial intelligence apps"
      />
      
      <GradientBackground variant="subtle" className="py-8 md:py-12" intensity="low">
        <div className="container-wide">
          <MotionWrapper animation="fadeIn">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {categoryParam ? `${categoryParam} Tools` : searchParam ? `Search: ${searchParam}` : "All Tools"}
              </h1>
              <p className="text-muted-foreground">
                {totalTools === 0 && !isLoading 
                  ? "No tools found. Try adjusting your filters."
                  : `Browse through our collection of ${totalTools} AI tools.`}
              </p>
            </div>
          </MotionWrapper>
          
          <FilterBar 
            categories={categories}
            pricingOptions={pricingOptions}
            selectedCategory={categoryParam || "all"}
            selectedPricing={pricingParam || "all"}
            selectedSortOrder={sortByParam}
            onCategoryChange={(value) => handleFilterChange("category", value)}
            onPricingChange={(value) => handleFilterChange("pricing", value)}
            onSortChange={(value) => handleFilterChange("sortBy", value)}
          />
        </div>
      </GradientBackground>
      
      <div className="container-wide py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <ModernLoadingIndicator variant="dots" size="lg" text="Loading tools..." />
          </div>
        ) : displayedTools.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-medium mb-2">No tools found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search criteria or filters</p>
            <Button 
              onClick={() => {
                window.history.pushState({}, '', '/tools');
                window.location.reload();
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            {/* Tools Grid */}
            <ToolGrid 
              tools={displayedTools} 
              isLoading={isLoading}
              columnsPerRow={4}  // Default to 4 columns for desktop
            />
            
            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handleLoadMore} 
                  variant="outline" 
                  size="lg"
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10">Load More Tools</span>
                  <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
