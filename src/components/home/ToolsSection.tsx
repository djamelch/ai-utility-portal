
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { useIsMobile } from "@/hooks/use-mobile";
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
  queryType: "featured" | "top-rated" | "recent";
  limit?: number;
}

export function ToolsSection({ 
  title, 
  description, 
  queryType,
  limit = 6 
}: ToolsSectionProps) {
  const isMobile = useIsMobile();
  
  const { data: dbTools = [], isLoading } = useQuery({
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
        default:
          query = query.order("id");
          break;
      }
      
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

  const tools = dbTools.map(dbTool => ({
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
    isFeatured: false,
    isNew: new Date(dbTool.created_at || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
    ...dbTool
  }));
  
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
                  Array(4).fill(0).map((_, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-full">
                      <div className="h-[320px] rounded-xl bg-secondary/20 animate-pulse" />
                    </CarouselItem>
                  ))
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
          <ToolGrid queryType={queryType} limit={limit} columnsPerRow={3} />
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
