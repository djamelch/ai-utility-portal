
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
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";
import { LoadingIndicator } from "../ui/LoadingIndicator";

interface Tool {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: React.ElementType;
  count: number;
  color: string;
  tools: Tool[];
}

// Define available category colors
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
      console.log("Fetching categories and tools...");
      try {
        // First get all distinct primary tasks (categories)
        // We need to use raw SQL since the Supabase JS client has limitations with aggregation
        const { data: taskCounts, error: distinctError } = await supabase
          .from('tools')
          .select('primary_task, count')
          .not('primary_task', 'is', null)
          .select(`
            primary_task,
            count:id(count)
          `)
          .groupBy('primary_task')
          .order('count', { ascending: false });
        
        if (distinctError) {
          console.error("Error fetching distinct tasks:", distinctError);
          throw distinctError;
        }

        console.log("Task counts fetched:", taskCounts);
        
        // Handle special categories first
        const specialCategories = [
          {
            id: "latest",
            name: "Latest AI",
            count: 0,
            tools: [] as Tool[],
            color: categoryColors[10], // Assign a color
          },
          {
            id: "top-trends",
            name: "Top 50 Trends [24H]",
            count: 0,
            tools: [] as Tool[],
            color: categoryColors[11], // Assign a color
          }
        ];
        
        // Create a set to track unique category IDs
        const uniqueCategoryIds = new Set<string>();
        
        // Transform categories and count tools for each
        const regularCategories: Category[] = [];
        
        // Process each distinct primary task
        if (taskCounts && Array.isArray(taskCounts)) {
          console.log(`Processing ${taskCounts.length} distinct tasks...`);
          
          for (let i = 0; i < taskCounts.length; i++) {
            const task = taskCounts[i];
            const taskName = task.primary_task;
            if (!taskName) continue;
            
            const categoryId = taskName.toLowerCase().replace(/\s+/g, '-');
            
            // Check for duplicates
            if (uniqueCategoryIds.has(categoryId)) {
              console.log(`Skipping duplicate category: ${taskName}`);
              continue;
            }
            
            uniqueCategoryIds.add(categoryId);
            
            regularCategories.push({
              id: categoryId,
              name: taskName,
              count: typeof task.count === 'number' ? task.count : 0,
              tools: [] as Tool[],
              color: categoryColors[i % categoryColors.length],
            });
          }
        }
        
        console.log("Regular categories before fetching tools:", regularCategories);
        
        // Merge special and regular categories
        const allCategories = [...specialCategories, ...regularCategories];
        
        // Now fetch tools for each category
        const categoriesWithToolsPromises = allCategories.map(async (category) => {
          let query = supabase.from("tools").select("id, company_name, slug, logo_url").limit(15);
          
          if (category.id === "latest") {
            // For "Latest AI" category, get the most recently added tools
            query = query.order("created_at", { ascending: false });
          } else if (category.id === "top-trends") {
            // For "Top 50 Trends" category, get most viewed/rated tools
            query = query.order("click_count", { ascending: false });
          } else {
            // For regular categories, filter by primary_task
            query = query.eq("primary_task", category.name);
          }
          
          const { data: toolsData, error: toolsError } = await query;
          
          if (toolsError) {
            console.error(`Error fetching tools for ${category.name}:`, toolsError);
            return { ...category, tools: [] as Tool[], count: 0 };
          }
          
          console.log(`Category: ${category.name}, Tools fetched: ${toolsData?.length || 0}`);
          
          // Map the tools data to match our Tool interface
          const mappedTools: Tool[] = (toolsData || []).map(tool => ({
            id: String(tool.id),
            name: tool.company_name || "",
            slug: tool.slug || "",
            logo_url: tool.logo_url || ""
          }));
          
          return { 
            ...category, 
            tools: mappedTools, 
            count: category.count || mappedTools.length 
          };
        });
        
        // Wait for all tools to be fetched
        const categoriesWithTools = await Promise.all(categoriesWithToolsPromises);
        
        // Filter out categories with no tools
        const finalCategories = categoriesWithTools.filter(cat => cat.count > 0);
        
        // Sort by count (highest to lowest)
        finalCategories.sort((a, b) => b.count - a.count);
        
        console.log(`Final categories with tools: ${finalCategories.length}`);
        console.log("Sample category:", finalCategories[0]);
        
        return finalCategories;
      } catch (error) {
        console.error("Error fetching categories with tools:", error);
        toast.error("Failed to load categories");
        return [] as Category[];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3, // Retry three times if the query fails
  });

  // Update categories with data when available
  useEffect(() => {
    if (data) {
      console.log("Setting categories state with data:", data);
      setCategories(data);
    }
  }, [data]);

  // Log whenever categories change to help with debugging
  useEffect(() => {
    console.log("Categories state updated:", categories);
  }, [categories]);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-wide">
        <MotionWrapper>
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
          <div className="flex justify-center items-center py-16">
            <LoadingIndicator size={40} text="Loading categories..." />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-destructive">Error loading categories: {(error as Error).message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reload
            </Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No categories found</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reload
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, displayCount).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
        
        <MotionWrapper className="mt-10 text-center">
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

// Category card component
function CategoryCard({ category }: { category: Category }) {
  if (!category) {
    console.error("Received null or undefined category");
    return null;
  }

  return (
    <Link to={`/tools?category=${category.id}`} className="group">
      <Card className="h-full border hover:shadow-md transition-all duration-300 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {category.id === "latest" ? (
                <Star size={16} className="text-amber-500" />
              ) : category.id === "top-trends" ? (
                <TrendingUp size={16} className="text-primary" />
              ) : (
                <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
              )}
              {category.name}
            </h3>
            <Badge variant="outline" className="text-xs">
              {category.count}
            </Badge>
          </div>
          
          <div className="space-y-1.5 text-sm">
            {(category.tools || []).slice(0, 12).map((tool) => (
              <div key={tool.id} className="flex items-center gap-2 py-0.5">
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={tool.name} 
                    className="w-4 h-4 rounded-full object-cover"
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
                  {tool.name}
                </span>
              </div>
            ))}
            
            {/* Show indicator if there are more tools than shown */}
            {(category.tools || []).length > 12 && (
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
        </CardContent>
      </Card>
    </Link>
  );
}
