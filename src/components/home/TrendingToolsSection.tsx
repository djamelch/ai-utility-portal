
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  icon?: React.ElementType;
  count: number;
  color: string;
  tools: Tool[];
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

// Define available category colors with stronger contrast
const categoryColors = [
  "bg-blue-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-red-500",
  "bg-sky-500", 
  "bg-teal-500",
  "bg-fuchsia-500",
  "bg-indigo-500",
  "bg-rose-500",
];

export function TrendingToolsSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [displayCount, setDisplayCount] = useState(12); // Show 12 categories initially

  // Fetch categories and their tools
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories-with-tools"],
    queryFn: async () => {
      try {
        console.log("Fetching tools for categories...");
        
        // First, get all tools to work with
        const { data: toolsData, error: toolsError } = await supabase
          .from("tools")
          .select('id, company_name, slug, logo_url, primary_task, created_at');
        
        if (toolsError) {
          console.error("Error fetching tools:", toolsError);
          throw toolsError;
        }

        if (!toolsData || toolsData.length === 0) {
          console.log("No tools found in the database");
          return [];
        }

        console.log(`Successfully fetched ${toolsData.length} tools`);
        
        // Get unique primary tasks for categories
        const uniqueTasks = Array.from(new Set(
          toolsData
            .filter(tool => tool.primary_task) // Filter out null/undefined primary_tasks
            .map(tool => tool.primary_task)
        ));
        
        console.log("Unique primary tasks:", uniqueTasks);
        
        // Create special categories
        const specialCategories = [
          {
            id: "latest",
            name: "Latest AI",
            count: 0,
            tools: [],
            color: categoryColors[10],
          },
          {
            id: "top-trends",
            name: "Top 50 Trends [24H]",
            count: 0,
            tools: [],
            color: categoryColors[11],
          }
        ];
        
        // Create categories from unique tasks
        const regularCategories = uniqueTasks.map((taskName, index) => {
          // Filter tools for this category
          const toolsInCategory = toolsData
            .filter(tool => tool.primary_task === taskName)
            .map(tool => ({
              id: tool.id.toString(),
              name: tool.company_name || "Unnamed Tool",
              slug: tool.slug || "",
              logo_url: tool.logo_url || ""
            }));
          
          return {
            id: typeof taskName === 'string' ? taskName.toLowerCase().replace(/\s+/g, '-') : `category-${index}`,
            name: taskName || `Category ${index + 1}`,
            count: toolsInCategory.length,
            tools: toolsInCategory,
            color: categoryColors[index % categoryColors.length]
          };
        });
        
        console.log("Regular categories created:", regularCategories.length);
        
        // Sort regular categories by tool count (highest to lowest)
        regularCategories.sort((a, b) => b.count - a.count);
        
        // Handle special categories
        // Latest AI tools - sort by created_at
        const latestTools = [...toolsData]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 15)
          .map(tool => ({
            id: tool.id.toString(),
            name: tool.company_name || "Unnamed Tool",
            slug: tool.slug || "",
            logo_url: tool.logo_url || ""
          }));
        
        specialCategories[0].tools = latestTools;
        specialCategories[0].count = latestTools.length;
        
        // Top trends - using the same as latest for now
        specialCategories[1].tools = [...latestTools].slice(0, 10);
        specialCategories[1].count = specialCategories[1].tools.length;
        
        // Combine all categories and filter out empty ones
        const allCategories = [...specialCategories, ...regularCategories]
          .filter(category => category.count > 0);
        
        console.log("Final categories with tools:", allCategories.length);
        
        return allCategories;
      } catch (error) {
        console.error("Error fetching categories with tools:", error);
        toast.error("Failed to load categories. Please try again later.");
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Update categories with data when available
  useEffect(() => {
    if (data) {
      console.log("Setting categories:", data.length);
      setCategories(data);
    }
  }, [data]);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Browse Categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore AI tools by popular categories
              </p>
            </div>
            
            <Link 
              to="/tools" 
              className="mt-2 sm:mt-0 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
            >
              View all categories
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </MotionWrapper>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCategoryCard key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Error loading categories</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, displayCount).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
        
        <MotionWrapper animation="fadeIn" delay="delay-300" className="mt-10 text-center">
          <Link 
            to="/tools" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 transition-colors"
          >
            View all categories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </MotionWrapper>
      </div>
    </section>
  );
}

// Skeleton loader for category cards
function SkeletonCategoryCard() {
  return (
    <div className="h-[420px] rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

// Category card component with improved styling
function CategoryCard({ category }: { category: Category }) {
  // Safety check for category data
  if (!category || !category.tools) {
    return null;
  }

  return (
    <Link to={`/tools?category=${category.id}`} className="group">
      <GlassCard 
        className="h-full backdrop-blur-sm border hover:shadow-md transition-all duration-300"
        animation="none"
        hoverEffect
        variant="elevated"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {category.id === "latest" ? (
              <Star size={16} className="text-amber-500" />
            ) : category.id === "top-trends" ? (
              <TrendingUp size={16} className="text-primary" />
            ) : (
              <span className={`w-3 h-3 rounded-full ${category.color || 'bg-primary'}`}></span>
            )}
            {category.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            {category.count || 0}
          </Badge>
        </div>
        
        <div className="space-y-1.5 text-sm">
          {category.tools && category.tools.length > 0 ? (
            category.tools.slice(0, 12).map((tool) => (
              <div key={tool.id} className="flex items-center gap-2 py-0.5">
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={tool.name || "Tool logo"} 
                    className="w-4 h-4 rounded-full object-cover bg-white"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-primary/10"></div>
                )}
                <span className="text-muted-foreground hover:text-foreground truncate transition-colors">
                  {tool.name || "Unnamed Tool"}
                </span>
              </div>
            ))
          ) : (
            <div className="py-2 text-center text-muted-foreground">No tools available</div>
          )}
          
          {/* Show indicator if there are more tools than shown */}
          {category.tools && category.tools.length > 12 && (
            <div className="pt-2 text-right">
              <span className="text-xs text-muted-foreground">
                +{category.tools.length - 12} more
              </span>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-2 right-2 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <ArrowRight size={14} className="text-primary" />
        </div>
      </GlassCard>
    </Link>
  );
}
