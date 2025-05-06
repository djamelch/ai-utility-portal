
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
import { useEffect, useState } from "react";

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
  limit = 8, // Default limit
  variant = "none"
}: ToolsSectionProps) {
  const isMobile = useIsMobile();
  const [deviceLimit, setDeviceLimit] = useState(limit);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Adjust tools shown based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) { // 2xl breakpoint
        setDeviceLimit(12); // Show 12 on extra large screens
      } else if (width >= 1280) { // xl breakpoint
        setDeviceLimit(8); // Show 8 on large screens
      } else if (width >= 768) { // md breakpoint
        setDeviceLimit(6); // Show 6 on medium screens
      } else {
        setDeviceLimit(4); // Show 4 on small screens
      }
    };
    
    handleResize(); // Run on initial render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools", queryType, deviceLimit],
    queryFn: async () => {
      try {
        console.log(`Fetching ${queryType} tools with limit ${deviceLimit}`);
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
        query = query.limit(deviceLimit || 100);
        
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
          {isLoading ? (
            <div className="col-span-2 flex justify-center items-center h-44">
              <ModernLoadingIndicator variant="pulse" size="md" text="Loading tools..." />
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center p-6">
              <h3 className="text-lg font-medium">No tools found</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <>
              <Carousel 
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
                onSelect={(index) => setCurrentSlide(index)}
              >
                <CarouselContent>
                  {tools.slice(0, deviceLimit).map((tool) => (
                    <CarouselItem key={tool.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <MotionWrapper animation="fadeIn">
                        <div className="p-1">
                          <ToolCard tool={tool} />
                        </div>
                      </MotionWrapper>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center mt-2">
                  <CarouselPrevious className="relative inset-0 translate-y-0 left-0 mr-2 h-8 w-8" />
                  <CarouselNext className="relative inset-0 translate-y-0 right-0 ml-2 h-8 w-8" />
                </div>
              </Carousel>
              
              {/* Pagination dots */}
              <div className="flex justify-center gap-1 mt-3">
                {tools.slice(0, deviceLimit).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentSlide ? "bg-primary w-5" : "bg-primary/30 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        isLoading ? (
          <div className="flex justify-center items-center py-8">
            <ModernLoadingIndicator variant="dots" size="lg" text="Loading tools..." />
          </div>
        ) : (
          <ToolGrid 
            tools={tools}
            columnsPerRow={4} // Use 4-column layout for desktop
            limit={deviceLimit}
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
