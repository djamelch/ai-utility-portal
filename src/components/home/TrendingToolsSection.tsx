import { ArrowRight, Star, TrendingUp, Image, Feather } from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ModernLoadingIndicator } from "../ui/ModernLoadingIndicator";
import { Badge } from "../ui/badge";
import { 
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";

interface ToolCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  tools: Tool[];
  count?: number; // Add count property to track number of tools
}

interface Tool {
  id: number;
  name: string;
  company_name?: string;
  logo_url?: string;
  trending_number?: number;
  trend_stats?: string;
}

export function TrendingToolsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("latest");
  const [sortedCategories, setSortedCategories] = useState<ToolCategory[]>([]);
  
  // Define initial categories with their IDs and titles
  const initialCategories: ToolCategory[] = [
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

  // Fetch tool counts for each category
  const { data: categoryCounts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ["category-counts"],
    queryFn: async () => {
      try {
        // Get count for image generators
        const { count: imageCount, error: imageError } = await supabase
          .from("tools")
          .select("*", { count: "exact", head: true })
          .eq("primary_task", "Image Generation");
        
        if (imageError) console.error("Error fetching image tools count:", imageError);
        
        // Get count for writing tools
        const { count: writingCount, error: writingError } = await supabase
          .from("tools")
          .select("*", { count: "exact", head: true })
          .eq("primary_task", "Writing");
        
        if (writingError) console.error("Error fetching writing tools count:", writingError);
        
        // Get total count for latest
        const { count: totalCount, error: totalError } = await supabase
          .from("tools")
          .select("*", { count: "exact", head: true });
        
        if (totalError) console.error("Error fetching total tools count:", totalError);
        
        return {
          "image-generators": imageCount || 0,
          "writing": writingCount || 0,
          "latest": totalCount || 0,
          "top-trends": totalCount || 0, // Same as latest for now, could be different metric
        };
      } catch (error) {
        console.error("Error fetching category counts:", error);
        return {};
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Sort categories based on tool counts (except keep "latest" and "top-trends" at the top)
  useEffect(() => {
    if (categoryCounts) {
      const topCategories = initialCategories.filter(cat => 
        cat.id === "latest" || cat.id === "top-trends"
      );
      
      const otherCategories = initialCategories.filter(cat => 
        cat.id !== "latest" && cat.id !== "top-trends"
      ).map(cat => ({
        ...cat,
        count: categoryCounts[cat.id] || 0
      })).sort((a, b) => (b.count || 0) - (a.count || 0));
      
      setSortedCategories([...topCategories, ...otherCategories]);
    } else {
      setSortedCategories(initialCategories);
    }
  }, [categoryCounts]);

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
        
        // Transform data to add trending numbers and fake stats for visualization
        const toolsWithNumbers = data.map((tool, index) => {
          // Fake trend stats based on category
          let trendStats;
          if (activeCategory === "top-trends") {
            trendStats = `+${Math.floor(Math.random() * 900) + 100}`;
          }
          
          return {
            ...tool,
            trending_number: index + 1,
            trend_stats: trendStats
          };
        });
        
        return toolsWithNumbers;
      } catch (error) {
        console.error("Error in trending tools query:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Update the tools array in the categories
  const categoriesWithTools = sortedCategories.map(category => {
    if (category.id === activeCategory && toolsData) {
      return { ...category, tools: toolsData };
    }
    return category;
  });

  // Get the current active category object
  const currentCategory = categoriesWithTools.find(c => c.id === activeCategory) || categoriesWithTools[0];

  // Get category-specific button text
  const getCategoryButtonText = (categoryId: string) => {
    const count = categoryCounts ? categoryCounts[categoryId] || 0 : 0;
    
    switch (categoryId) {
      case "latest":
        return `More new AI (${count})`;
      case "top-trends":
        return "See Top 100";
      case "image-generators":
        return `See all category (${count})`;
      case "writing":
        return `See all category (${count})`;
      default:
        return `View all (${count})`;
    }
  };

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
          {categoriesWithTools.map((category) => (
            <MotionWrapper key={category.id} animation="fadeIn">
              <GlassCard 
                className={`p-0 overflow-hidden h-[470px] ${
                  category.id === activeCategory 
                    ? 'ring-1 ring-primary/50' 
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
                    {category.count !== undefined && category.id !== "latest" && category.id !== "top-trends" && (
                      <span className="text-xs text-muted-foreground">({category.count})</span>
                    )}
                  </div>
                  <ArrowRight size={16} className={`${category.id === activeCategory ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                
                {/* Card Content */}
                <div className="h-[380px] overflow-y-auto scrollbar-thin">
                  {isLoading && category.id === activeCategory ? (
                    <div className="flex justify-center items-center h-full">
                      <ModernLoadingIndicator variant="dots" size="md" />
                    </div>
                  ) : (
                    category.id === activeCategory && (
                      <Table>
                        <TableBody>
                          {currentCategory.tools.map((tool, index) => (
                            <TableRow key={tool.id} className="group border-none hover:bg-secondary/20">
                              <TableCell className="p-0">
                                <Link 
                                  to={`/tools/${tool.id}`}
                                  className="flex items-center gap-2 py-3 px-4 w-full"
                                >
                                  {/* Tool number */}
                                  <span className="text-sm text-muted-foreground w-4 flex-shrink-0">
                                    {index + 1}.
                                  </span>
                                  
                                  {/* Tool logo */}
                                  {tool.logo_url ? (
                                    <img 
                                      src={tool.logo_url} 
                                      alt={tool.company_name || tool.name} 
                                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                      <Star className="h-3 w-3 text-primary/70" />
                                    </div>
                                  )}
                                  
                                  {/* Tool name */}
                                  <span className="line-clamp-1 text-sm flex-grow">
                                    {tool.company_name || tool.name}
                                  </span>
                                  
                                  {/* Trend stats for top-trends category */}
                                  {category.id === "top-trends" && tool.trend_stats && (
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
                                      {tool.trend_stats}
                                    </Badge>
                                  )}
                                  
                                  {/* Hot badge for top 3 */}
                                  {index < 3 && category.id !== "top-trends" && (
                                    <Badge 
                                      variant="outline" 
                                      className="bg-primary/5 border-primary/20 text-primary text-xs"
                                    >
                                      <TrendingUp size={10} className="mr-1" />
                                      Hot
                                    </Badge>
                                  )}
                                  
                                  {/* External link arrow */}
                                  <ArrowRight size={14} className="text-muted-foreground ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                          
                          {currentCategory.tools.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5}>
                                <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                                  <div className="bg-secondary/50 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                                    {currentCategory.icon}
                                  </div>
                                  <h4 className="font-medium">No tools found</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    No tools are currently available in this category
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )
                  )}
                </div>
                
                {/* Card Footer */}
                <div className="p-3 border-t border-border bg-secondary/5">
                  <Link 
                    to="/tools" 
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-center py-2 rounded-md bg-background hover:bg-secondary/50 transition-colors"
                  >
                    {getCategoryButtonText(category.id)} <ArrowRight size={12} />
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
