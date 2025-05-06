
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModernLoadingIndicator } from "@/components/ui/ModernLoadingIndicator";
import { GradientBackground } from "@/components/ui/GradientBackground";
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
  variant?: "primary" | "secondary" | "accent" | "subtle" | "none";
}

export function ToolsSection({ 
  title, 
  description, 
  queryType,
  limit = 8, // Increased default limit from 6 to 8
  variant = "none"
}: ToolsSectionProps) {
  const isMobile = useIsMobile();
  
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools", queryType, limit],
    queryFn: async () => {
      try {
        console.log(`Fetching ${queryType} tools with limit ${limit}`);
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
        
        // Apply limit for database query
        query = query.limit(limit || 100);
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching tools:", error);
          throw error;
        }
        
        console.log(`Successfully fetched ${data?.length || 0} ${queryType} tools`);
        
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
        
        return sortedTools;
      } catch (error) {
        console.error("Error in ToolsSection query:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  const sectionContent = (
    <>
      <MotionWrapper animation="fadeIn">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Link 
            to="/tools" 
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-input bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-secondary/50 hover:scale-105 transition-all"
          >
            View all
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </MotionWrapper>
      
      {isMobile ? (
        <div className="mt-3">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {isLoading ? (
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-full">
                  <div className="flex justify-center items-center h-44">
                    <ModernLoadingIndicator variant="pulse" size="md" text="Loading tools..." />
                  </div>
                </CarouselItem>
              ) : tools.length === 0 ? (
                <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-full">
                  <div className="text-center p-6">
                    <h3 className="text-lg font-medium">No tools found</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </CarouselItem>
              ) : (
                tools.map((tool, index) => (
                  <CarouselItem key={tool.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2">
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
            <div className="flex items-center justify-center gap-2 mt-3">
              <CarouselPrevious className="relative static transform-none h-7 w-7 rounded-full opacity-70 hover:opacity-100 transition-opacity" />
              <CarouselNext className="relative static transform-none h-7 w-7 rounded-full opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </Carousel>
        </div>
      ) : (
        isLoading ? (
          <div className="flex justify-center items-center py-8">
            <ModernLoadingIndicator variant="dots" size="lg" text="Loading tools..." />
          </div>
        ) : (
          <ToolGrid 
            tools={tools}
            columnsPerRow={4} // Increase from 3 to 4 columns
            limit={limit}
          />
        )
      )}
      
      <div className="mt-4 text-center sm:hidden">
        <Link 
          to="/tools" 
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background/80 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-secondary/50 transition-colors"
        >
          View all tools
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
  
  return variant !== "none" ? (
    <GradientBackground variant={variant} className="py-10 md:py-16">
      <div className="container-wide">
        {sectionContent}
      </div>
    </GradientBackground>
  ) : (
    <section className="py-10 md:py-16">
      <div className="container-wide">
        {sectionContent}
      </div>
    </section>
  );
}
