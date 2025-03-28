
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "./ToolCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

// Define Tool interface to match the properties expected by ToolCard
export interface Tool {
  id: number | string;
  name: string;
  description: string;
  logo: string;
  category: string;
  rating: number;
  reviewCount: number;
  pricing: string;
  url: string;
  slug?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Additional properties from database
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
}

export function ToolGrid({ 
  limit, 
  queryType = "featured",
  searchTerm,
  categoryFilter,
  searchQuery = "",
  category = "",
  pricing = "",
  sortBy = "featured"
}: ToolGridProps) {
  // Use both searchTerm and searchQuery (preference to searchQuery if both exist)
  const effectiveSearchTerm = searchQuery || searchTerm || "";
  const effectiveCategoryFilter = category || categoryFilter || "";
  const effectiveSortBy = sortBy !== "featured" ? sortBy : queryType;
  
  // Fetch tools based on query type and filters
  const { data: dbTools = [], isLoading } = useQuery({
    queryKey: ["tools", queryType, limit, effectiveSearchTerm, effectiveCategoryFilter, pricing, effectiveSortBy],
    queryFn: async () => {
      let query = supabase.from("tools").select("*");
      
      // Apply search filter if provided
      if (effectiveSearchTerm) {
        query = query.or(`name.ilike.%${effectiveSearchTerm}%,short_description.ilike.%${effectiveSearchTerm}%,full_description.ilike.%${effectiveSearchTerm}%`);
      }
      
      // Apply category filter if provided
      if (effectiveCategoryFilter) {
        // Handle category filter both in formatted and slug form
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
      
      // Apply pricing filter if provided
      if (pricing) {
        query = query.eq("pricing", pricing);
      }
      
      // Apply specific ordering based on query type or sortBy
      switch (effectiveSortBy) {
        case "top-rated":
          // For top-rated, we'd ideally join with reviews and order by average rating
          // This is a simplified approach
          query = query.order("id", { ascending: false }); // Replace with actual rating logic when available
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
          // For featured, we're using a random selection
          query = query.order("id");
          break;
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching tools:", error);
        return [];
      }
      
      return data as any[];
    }
  });

  // Map database tools to the format expected by ToolCard
  const tools = dbTools.map(dbTool => ({
    id: dbTool.id,
    name: dbTool.name || "",
    description: dbTool.short_description || "",
    logo: dbTool.logo_url || "",
    category: dbTool.primary_task || "",
    rating: 4, // Default or placeholder value
    reviewCount: 0, // Default or placeholder value
    pricing: dbTool.pricing || "",
    url: dbTool.visit_website_url || "",
    slug: dbTool.slug || "",
    // Optionally add featured or new flags based on some criteria
    isFeatured: false,
    isNew: new Date(dbTool.created_at || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
    // Include original properties for reference
    ...dbTool
  }));
  
  if (isLoading) {
    return <ToolGridSkeleton count={limit || 8} />;
  }
  
  if (!tools.length) {
    return <EmptyToolsMessage />;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

// Separate components for better organization
function ToolGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <div 
          key={index} 
          className="h-[320px] rounded-xl bg-secondary/20 animate-pulse"
        />
      ))}
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
