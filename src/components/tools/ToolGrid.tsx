
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "./ToolCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { EnhancedLoadingIndicator } from "@/components/ui/EnhancedLoadingIndicator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Json } from "@/integrations/supabase/types";

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
  queryType?: "featured" | "top-rated" | "recent" | "popular";
  searchTerm?: string;
  categoryFilter?: string;
  searchQuery?: string;
  category?: string;
  pricing?: string;
  sortBy?: string;
  columnsPerRow?: number;
}

export function ToolGrid({ 
  limit = 12, 
  queryType = "featured",
  searchTerm,
  categoryFilter,
  searchQuery = "",
  category = "",
  pricing = "",
  sortBy = "featured",
  columnsPerRow = 4
}: ToolGridProps) {
  const effectiveSearchTerm = searchQuery || searchTerm || "";
  const effectiveCategoryFilter = category || categoryFilter || "";
  const effectiveSortBy = sortBy !== "featured" ? sortBy : queryType;
  
  const { data: dbTools = [], isLoading, error, refetch } = useQuery({
    queryKey: ["tools", queryType, limit, effectiveSearchTerm, effectiveCategoryFilter, pricing, effectiveSortBy],
    queryFn: async () => {
      try {
        let query = supabase.from("tools").select("*");
        
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
        
        switch (effectiveSortBy) {
          case "top-rated":
            query = query.order("id", { ascending: false });
            break;
          case "newest":
          case "recent":
            query = query.order("created_at", { ascending: false });
            break;
          case "popular":
            query = query.order("click_count", { ascending: false });
            break;
          case "featured":
          default:
            query = query.order("id");
            break;
        }
        
        if (limit) {
          query = query.limit(limit);
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
    refetchOnWindowFocus: false
  });

  const tools = (dbTools || []).map(dbTool => ({
    id: dbTool.id,
    name: dbTool.company_name || "",
    company_name: dbTool.company_name || "",
    description: dbTool.short_description || "",
    short_description: dbTool.short_description || "",
    logo: dbTool.logo_url || "",
    logo_url: dbTool.logo_url || "",
    category: dbTool.primary_task || "",
    primary_task: dbTool.primary_task || "",
    rating: 4,
    reviewCount: 0,
    pricing: dbTool.pricing || "",
    url: dbTool.visit_website_url || dbTool.detail_url || "#",
    visit_website_url: dbTool.visit_website_url || "",
    detail_url: dbTool.detail_url || "",
    slug: dbTool.slug || "",
    isFeatured: Boolean(dbTool.is_featured),
    isVerified: Boolean(dbTool.is_verified),
    is_featured: dbTool.is_featured,
    is_verified: dbTool.is_verified,
    isNew: new Date(dbTool.created_at || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
    ...dbTool
  }));
  
  if (isLoading) {
    return <ToolGridSkeleton count={limit || 8} columnsPerRow={columnsPerRow} />;
  }

  if (error) {
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
  
  if (!tools.length) {
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
      {tools.map((tool, index) => (
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

import { Button } from "@/components/ui/button";
