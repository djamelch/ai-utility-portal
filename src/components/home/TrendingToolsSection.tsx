
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
      try {
        console.log("Starting category fetch...");
        // First get all distinct primary tasks (categories)
        const { data: distinctTasks, error: distinctError } = await supabase
          .from("tools")
          .select('primary_task')
          .not('primary_task', 'is', null)
          .order('primary_task');
        
        if (distinctError) {
          console.error("Error fetching distinct tasks:", distinctError);
          throw distinctError;
        }
        
        console.log("Distinct tasks fetched:", distinctTasks);
        
        // Handle special categories first
        const specialCategories = [
          {
            id: "latest",
            name: "Latest AI",
            count: 0,
            tools: [],
            color: categoryColors[10], // Assign a color
          },
          {
            id: "top-trends",
            name: "Top 50 Trends [24H]",
            count: 0,
            tools: [],
            color: categoryColors[11], // Assign a color
          }
        ];
        
        // Transform categories and count tools for each
        const regularCategories: Category[] = [];
        
        // Process each distinct primary task
        if (distinctTasks) {
          for (let i = 0; i < distinctTasks.length; i++) {
            const taskName = distinctTasks[i].primary_task;
            if (!taskName) continue; // Skip null or undefined task names
            
            // Count tools for this category
            const { count, error: countError } = await supabase
              .from("tools")
              .select('*', { count: 'exact', head: true })
              .eq('primary_task', taskName);
            
            if (countError) {
              console.error(`Error counting tools for ${taskName}:`, countError);
              continue; // Skip this category but continue with others
            }
            
            // Create category object
            regularCategories.push({
              id: taskName.toLowerCase().replace(/\s+/g, '-'),
              name: taskName,
              count: count || 0,
              tools: [],
              color: categoryColors[i % categoryColors.length], // Cycle through colors
            });
          }
        }
        
        // Sort regular categories by count (highest to lowest)
        const sortedRegularCategories = regularCategories.sort((a, b) => b.count - a.count);
        
        // Merge special and regular categories
        const allCategories = [...specialCategories, ...sortedRegularCategories];
        
        console.log("Categories before fetching tools:", allCategories);
        
        // Now fetch tools for each category
        for (let category of allCategories) {
          let query = supabase.from("tools").select("id, company_name as name, slug, logo_url").limit(15);
          
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
            continue;
          }
          
          console.log(`Tools for ${category.name}:`, toolsData);
          
          category.tools = toolsData || [];
          category.count = category.tools.length;
        }
        
        // Filter out categories with no tools
        const categoriesWithTools = allCategories.filter(cat => cat.count > 0);
        
        console.log("Final categories with tools:", categoriesWithTools);
        
        return categoriesWithTools;
      } catch (error) {
        console.error("Error fetching categories with tools:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Update categories with data when available
  useEffect(() => {
    if (data) {
      console.log("Setting categories:", data);
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

// Category card component
function CategoryCard({ category }: { category: Category }) {
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
              <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
            )}
            {category.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            {category.count}
          </Badge>
        </div>
        
        <div className="space-y-1.5 text-sm">
          {category.tools.slice(0, 12).map((tool) => (
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
          {category.tools.length > 12 && (
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
