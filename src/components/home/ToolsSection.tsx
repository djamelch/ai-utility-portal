
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { useIsMobile } from "@/hooks/use-mobile";
import { EnhancedLoadingIndicator } from "@/components/ui/EnhancedLoadingIndicator";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Tool } from "@/components/tools/ToolGrid";
import { ToolCard } from "@/components/tools/ToolCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ToolsSectionProps {
  title: string;
  description: string;
  queryType: "featured" | "top-rated" | "recent" | "all";
  limit?: number;
}

export function ToolsSection({ 
  title, 
  description, 
  queryType,
  limit = 6 
}: ToolsSectionProps) {
  const isMobile = useIsMobile();
  
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools", queryType, limit],
    queryFn: async () => {
      let query = supabase.from("tools").select("*");
      
      switch (queryType) {
        case "top-rated":
          query = query.order("id", { ascending: false });
          break;
        case "recent":
          query = query.order("created_at", { ascending: false });
          break;
        case "featured":
          // Only filter by is_featured if we're specifically showing featured tools
          query = query.eq("is_featured", true).order("id");
          break;
        case "all":
        default:
          // No filtering, we'll sort in JS
          query = query.order("id");
          break;
      }
      
      // We'll apply limit after sorting for "all"
      if (limit && queryType !== "all") {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching tools:", error);
        return [];
      }
      
      // Convert database tools to Tool objects and apply proper sorting
      const mappedTools = (data || []).map(dbTool => ({
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
      
      // Sort tools based on priority: Featured > Verified > Rating > Popularity
      const sortedTools = [...mappedTools].sort((a, b) => {
        // First priority: Featured
        if (Boolean(a.is_featured) && !Boolean(b.is_featured)) return -1;
        if (!Boolean(a.is_featured) && Boolean(b.is_featured)) return 1;
        
        // Second priority: Verified
        if (Boolean(a.is_verified) && !Boolean(b.is_verified)) return -1;
        if (!Boolean(a.is_verified) && Boolean(b.is_verified)) return 1;
        
        // Third priority: Rating and then popularity
        if ((a.rating || 0) !== (b.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0);
        }
        
        return (b.click_count || 0) - (a.click_count || 0);
      });
      
      // Apply limit after sorting for "all" queryType
      const limitedTools = limit ? sortedTools.slice(0, limit) : sortedTools;
      
      return limitedTools;
    }
  });

  return (
    <section className="section-padding">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
              <p className="mt-2 text-muted-foreground">
                {description}
              </p>
            </div>
            <Link 
              to="/tools" 
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
        </MotionWrapper>
        
        {isMobile ? (
          <div className="mt-4">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {isLoading ? (
                  <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-full">
                    <div className="flex justify-center items-center h-64">
                      <EnhancedLoadingIndicator variant="pulse" text="Loading tools..." />
                    </div>
                  </CarouselItem>
                ) : tools.length === 0 ? (
                  <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-full">
                    <div className="text-center p-8">
                      <h3 className="text-xl font-medium">No tools found</h3>
                      <p className="text-muted-foreground mt-2">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </CarouselItem>
                ) : (
                  tools.map((tool, index) => (
                    <CarouselItem key={tool.id} className="pl-2 md:pl-4 basis-full sm:basis-full">
                      <MotionWrapper 
                        animation="fadeIn" 
                        delay={`delay-${Math.min(Math.floor(index * 100), 500)}` as "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500" | "none"}
                      >
                        <ToolCard tool={tool} />
                      </MotionWrapper>
                    </CarouselItem>
                  ))
                )}
              </CarouselContent>
              <div className="flex items-center justify-center gap-2 mt-4">
                <CarouselPrevious className="relative static transform-none h-8 w-8 rounded-full" />
                <CarouselNext className="relative static transform-none h-8 w-8 rounded-full" />
              </div>
            </Carousel>
          </div>
        ) : (
          isLoading ? (
            <div className="flex justify-center items-center py-12">
              <EnhancedLoadingIndicator variant="pulse" text="Loading tools..." />
            </div>
          ) : (
            <ToolGrid 
              tools={tools}
              columnsPerRow={3} 
            />
          )
        )}
        
        <div className="mt-6 text-center sm:hidden">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
          >
            View all tools
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
