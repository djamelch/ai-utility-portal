
import { ArrowRight, Star, TrendingUp, Image, Feather } from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ModernLoadingIndicator } from "../ui/ModernLoadingIndicator";
import { Badge } from "../ui/badge";

interface ToolCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  tools: Tool[];
}

interface Tool {
  id: number;
  name: string;
  company_name?: string;
  logo_url?: string;
  trending_number?: number;
}

export function TrendingToolsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("latest");
  
  // Define categories with their IDs and titles
  const categories: ToolCategory[] = [
    {
      id: "latest",
      title: "Latest AI",
      icon: <Star className="h-4 w-4" />,
      tools: []
    },
    {
      id: "top-trends",
      title: "Top 50 Trends [24H]",
      icon: <TrendingUp className="h-4 w-4" />,
      tools: []
    },
    {
      id: "image-generators",
      title: "Image Generators",
      icon: <Image className="h-4 w-4" />,
      tools: []
    },
    {
      id: "writing",
      title: "Writing & Web SEO",
      icon: <Feather className="h-4 w-4" />,
      tools: []
    }
  ];

  // Fetch tools from Supabase
  const { data: toolsData, isLoading } = useQuery({
    queryKey: ["trending-tools", activeCategory],
    queryFn: async () => {
      try {
        let query = supabase.from("tools").select("*");
        
        // Apply different filters based on the active category
        switch (activeCategory) {
          case "latest":
            query = query.order("created_at", { ascending: false });
            break;
          case "top-trends":
            query = query.order("click_count", { ascending: false });
            break;
          case "image-generators":
            query = query.eq("primary_task", "Image Generation");
            break;
          case "writing":
            query = query.eq("primary_task", "Writing");
            break;
          default:
            break;
        }
        
        const { data, error } = await query.limit(10);
        
        if (error) {
          console.error("Error fetching tools:", error);
          throw error;
        }
        
        // Transform data to add trending numbers for visualization
        const toolsWithNumbers = data.map((tool, index) => ({
          ...tool,
          trending_number: index + 1
        }));
        
        return toolsWithNumbers;
      } catch (error) {
        console.error("Error in trending tools query:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Update the tools array in the categories
  const categoriesWithTools = categories.map(category => {
    if (category.id === activeCategory && toolsData) {
      return { ...category, tools: toolsData };
    }
    return category;
  });

  // Get the current active category object
  const currentCategory = categoriesWithTools.find(c => c.id === activeCategory) || categoriesWithTools[0];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Trending AI Tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover the most popular and trending AI tools
              </p>
            </div>
            
            <Link 
              to="/tools" 
              className="mt-2 sm:mt-0 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
            >
              View all tools
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </MotionWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Category cards */}
          {categories.map((category) => (
            <MotionWrapper key={category.id} animation="fadeIn">
              <GlassCard 
                className={`p-0 overflow-hidden h-[470px] ${
                  category.id === activeCategory 
                    ? 'ring-2 ring-primary ring-opacity-50' 
                    : 'hover:ring-1 hover:ring-primary/30'
                }`}
              >
                {/* Card Header */}
                <div 
                  className={`p-4 border-b border-border flex items-center justify-between cursor-pointer ${
                    category.id === activeCategory ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`${category.id === activeCategory ? 'text-primary' : 'text-muted-foreground'}`}>
                      {category.icon}
                    </span>
                    <h3 className="font-medium">{category.title}</h3>
                  </div>
                  <ArrowRight size={16} className={`${category.id === activeCategory ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                
                {/* Card Content */}
                <div className="p-2 h-[400px] overflow-y-auto">
                  {isLoading && category.id === activeCategory ? (
                    <div className="flex justify-center items-center h-full">
                      <ModernLoadingIndicator variant="dots" size="md" />
                    </div>
                  ) : (
                    category.id === activeCategory && (
                      <ul className="space-y-1">
                        {currentCategory.tools.map((tool, index) => (
                          <li key={tool.id} className="group">
                            <Link 
                              to={`/tools/${tool.id}`}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              <span className="w-7 h-7 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                {index + 1}
                              </span>
                              
                              {tool.logo_url ? (
                                <img 
                                  src={tool.logo_url} 
                                  alt={tool.company_name || tool.name} 
                                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                  <Star className="h-3.5 w-3.5 text-primary/70" />
                                </div>
                              )}
                              
                              <span className="line-clamp-1 text-sm font-medium flex-grow">
                                {tool.company_name || tool.name}
                              </span>
                              
                              {tool.trending_number && tool.trending_number <= 3 && (
                                <Badge 
                                  variant="outline" 
                                  className="bg-primary/5 border-primary/20 text-primary text-xs"
                                >
                                  <TrendingUp size={10} className="mr-1" />
                                  Hot
                                </Badge>
                              )}
                              
                              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </li>
                        ))}
                        
                        {currentCategory.tools.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                            <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                              {currentCategory.icon}
                            </div>
                            <h4 className="font-medium">No tools found</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              No tools are currently available in this category
                            </p>
                          </div>
                        )}
                      </ul>
                    )
                  )}
                </div>
                
                {/* Card Footer */}
                <div className="p-3 border-t border-border bg-secondary/10">
                  <Link 
                    to="/tools" 
                    className="w-full flex items-center justify-center gap-1.5 text-sm text-center py-1.5 rounded-md bg-background hover:bg-secondary/50 transition-colors"
                  >
                    {category.id === "latest" ? (
                      <>More new AI (3702) <ArrowRight size={14} /></>
                    ) : category.id === "top-trends" ? (
                      <>See Top 100 <ArrowRight size={14} /></>
                    ) : (
                      <>See all category (210) <ArrowRight size={14} /></>
                    )}
                  </Link>
                </div>
              </GlassCard>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
