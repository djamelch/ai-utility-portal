
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "./ToolCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { EnhancedLoadingIndicator } from "@/components/ui/EnhancedLoadingIndicator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export interface Tool {
  id: number | string;
  name?: string;
  description?: string;
  logo?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  pricing?: string;
  url?: string;
  slug?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  
  short_description?: string;
  full_description?: string;
  logo_url?: string;
  primary_task?: string;
  visit_website_url?: string;
  featured_image_url?: string;
  click_count?: number;
  created_at?: string;
  updated_at?: string;
  applicable_tasks?: any[];
  company_name?: string;
  cons?: any[];
  pros?: any[];
  faqs?: any;
  detail_url?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  isVerified?: boolean;
}

interface ToolGridProps {
  limit?: number;
  queryType?: "featured" | "top-rated" | "recent" | "popular" | "all";
  searchTerm?: string;
  categoryFilter?: string;
  searchQuery?: string;
  category?: string;
  pricing?: string;
  sortBy?: string;
  columnsPerRow?: number;
  features?: string[];
  tools?: Tool[];
}

export function ToolGrid({ 
  limit = 12, 
  queryType = "all",
  searchTerm,
  categoryFilter,
  searchQuery = "",
  category = "",
  pricing = "",
  sortBy = "featured",
  columnsPerRow = 4,
  features = [],
  tools: providedTools
}: ToolGridProps) {
  const effectiveSearchTerm = searchQuery || searchTerm || "";
  const effectiveCategoryFilter = category || categoryFilter || "";
  const effectiveSortBy = sortBy !== "featured" ? sortBy : queryType;
  
  const { data: dbTools = [], isLoading, error, refetch } = useQuery({
    queryKey: ["tools", queryType, limit, effectiveSearchTerm, effectiveCategoryFilter, pricing, effectiveSortBy, features],
    queryFn: async () => {
      // If tools are provided directly, skip the database query
      if (providedTools) {
        return [];
      }
      
      try {
        let query = supabase.from("tools").select("*");
        
        // Only apply the featured filter if queryType is explicitly "featured"
        if (queryType === "featured") {
          query = query.eq("is_featured", true);
        }
        
        if (effectiveSearchTerm) {
          query = query.or(`company_name.ilike.%${effectiveSearchTerm}%,short_description.ilike.%${effectiveSearchTerm}%,full_description.ilike.%${effectiveSearchTerm}%`);
        }
        
        if (effectiveCategoryFilter) {
          const isSlug = effectiveCategoryFilter.includes('-');
          
          if (isSlug) {
            const formattedCategory = effectiveCategoryFilter
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            query = query.eq("primary_task", formattedCategory);
          } else {
            query = query.eq("primary_task", effectiveCategoryFilter);
          }
        }
        
        if (pricing) {
          query = query.eq("pricing", pricing);
        }
        
        if (features.length > 0) {
          features.forEach(feature => {
            const keyword = feature.replace(/-/g, ' ');
            query = query.or(`short_description.ilike.%${keyword}%,full_description.ilike.%${keyword}%`);
          });
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Supabase error fetching tools:", error);
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error("Error in tools query:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 2000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !providedTools // Only run the query if tools aren't provided directly
  });

  // Use provided tools or database tools
  const toolsToProcess = providedTools || dbTools;

  // Prepare and map tools to ensure consistent format
  const tools = toolsToProcess.map(tool => {
    return {
      id: tool.id,
      name: tool.company_name || tool.name || "",
      company_name: tool.company_name || tool.name || "",
      description: tool.short_description || tool.description || "",
      short_description: tool.short_description || tool.description || "",
      logo: tool.logo_url || tool.logo || "",
      logo_url: tool.logo_url || tool.logo || "",
      category: tool.primary_task || tool.category || "",
      primary_task: tool.primary_task || tool.category || "",
      rating: tool.rating || 4,
      reviewCount: tool.reviewCount || 0,
      pricing: tool.pricing || "",
      url: tool.visit_website_url || tool.detail_url || tool.url || "#",
      visit_website_url: tool.visit_website_url || "",
      detail_url: tool.detail_url || "",
      slug: tool.slug || "",
      isFeatured: Boolean(tool.is_featured || tool.isFeatured),
      isVerified: Boolean(tool.is_verified || tool.isVerified),
      is_featured: tool.is_featured || tool.isFeatured,
      is_verified: tool.is_verified || tool.isVerified,
      isNew: new Date(tool.created_at || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
      click_count: tool.click_count || 0,
      ...tool
    };
  });

  // Custom sort function that prioritizes Featured > Verified > Others
  const sortedTools = [...tools].sort((a, b) => {
    // First priority: Featured tools
    if (Boolean(a.is_featured || a.isFeatured) && !Boolean(b.is_featured || b.isFeatured)) return -1;
    if (!Boolean(a.is_featured || a.isFeatured) && Boolean(b.is_featured || b.isFeatured)) return 1;
    
    // Second priority: Verified tools
    if (Boolean(a.is_verified || a.isVerified) && !Boolean(b.is_verified || b.isVerified)) return -1;
    if (!Boolean(a.is_verified || a.isVerified) && Boolean(b.is_verified || b.isVerified)) return 1;
    
    // Third priority: Rating
    if ((a.rating || 0) > (b.rating || 0)) return -1;
    if ((a.rating || 0) < (b.rating || 0)) return 1;
    
    // Fourth priority: Category (if specified in filters)
    if (effectiveCategoryFilter && a.primary_task === effectiveCategoryFilter && b.primary_task !== effectiveCategoryFilter) return -1;
    if (effectiveCategoryFilter && a.primary_task !== effectiveCategoryFilter && b.primary_task === effectiveCategoryFilter) return 1;
    
    // Fifth priority: By click count (popularity)
    return (b.click_count || 0) - (a.click_count || 0);
  });

  // Apply limit after sorting
  const limitedTools = limit ? sortedTools.slice(0, limit) : sortedTools;
  
  if (isLoading && !providedTools) {
    return <ToolGridSkeleton count={limit || 8} columnsPerRow={columnsPerRow} />;
  }

  if (error && !providedTools) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Loading Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>An error occurred while loading tools. Please try again later.</p>
          <Button 
            onClick={() => refetch()} 
            className="w-fit"
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!limitedTools.length) {
    return <EmptyToolsMessage />;
  }
  
  let gridColsClasses = "";
  switch (columnsPerRow) {
    case 1:
      gridColsClasses = "grid-cols-1";
      break;
    case 2:
      gridColsClasses = "grid-cols-1 sm:grid-cols-2";
      break;
    case 3:
      gridColsClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      break;
    case 4:
    default:
      gridColsClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      break;
  }
  
  return (
    <div className={`grid ${gridColsClasses} gap-4`}>
      {limitedTools.map((tool, index) => (
        <MotionWrapper 
          key={tool.id} 
          animation="fadeIn" 
          delay={`delay-${Math.min(Math.floor(index * 100), 500)}` as "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500" | "none"}
        >
          <ToolCard tool={tool} />
        </MotionWrapper>
      ))}
    </div>
  );
}

function ToolGridSkeleton({ count, columnsPerRow = 4 }: { count: number; columnsPerRow?: number }) {
  let gridColsClasses = "";
  switch (columnsPerRow) {
    case 1:
      gridColsClasses = "grid-cols-1";
      break;
    case 2:
      gridColsClasses = "grid-cols-1 sm:grid-cols-2";
      break;
    case 3:
      gridColsClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      break;
    case 4:
    default:
      gridColsClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      break;
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <EnhancedLoadingIndicator 
        variant="dots" 
        text="Loading tools..." 
        size={30}
        className="text-primary"
      />
      
      <div className={`grid ${gridColsClasses} gap-4 mt-8 w-full opacity-60`}>
        {Array(count).fill(0).map((_, index) => (
          <div 
            key={index} 
            className="h-[320px] rounded-xl bg-secondary/20 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyToolsMessage() {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-medium">No tools found</h3>
      <p className="text-muted-foreground mt-2">
        Try adjusting your search criteria
      </p>
    </div>
  );
}
