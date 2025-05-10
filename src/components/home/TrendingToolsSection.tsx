
import { ArrowRight, Star, TrendingUp, FileText, Sparkles, Code, MessageSquare, Image, PenTool } from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
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

// Define available category colors (simplified)
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

// Map of common categories to icons
const categoryIcons: Record<string, React.ElementType> = {
  "latest": Star,
  "top-trends": TrendingUp,
  "images": Image,
  "image": Image,
  "code": Code,
  "chat": MessageSquare,
  "chatbot": MessageSquare,
  "ai": Sparkles,
  "writing": PenTool,
  "content": PenTool,
  "default": FileText,
};

// Helper function to get icon for a category
const getCategoryIcon = (categoryName: string): React.ElementType => {
  const normalizedName = categoryName.toLowerCase();
  
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (normalizedName.includes(key)) {
      return icon;
    }
  }
  
  return categoryIcons.default;
};

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
          .select('id, company_name, slug, logo_url, primary_task, short_description, created_at')
          .order('id', { ascending: false });
        
        if (toolsError) {
          console.error("Error fetching tools:", toolsError);
          throw toolsError;
        }

        console.log(`Fetched tools data: ${toolsData?.length || 0} tools`);
        
        if (!toolsData || toolsData.length === 0) {
          console.log("No tools found in the database");
          return [];
        }
        
        // Log a few tools to see what we're working with
        console.log("Sample tools:", toolsData.slice(0, 3));

        // Create a map to store categories and their tools
        const categoryMap = new Map<string, Category>();
        
        // Process each tool and organize by category
        toolsData.forEach(tool => {
          // Handle null values safely
          const taskName = tool.primary_task || "Uncategorized";
          const toolId = tool.id?.toString() || "";
          const toolName = tool.company_name || "Unnamed Tool";
          const toolSlug = tool.slug || "";
          const logoUrl = tool.logo_url || "";
          const description = tool.short_description || "";
          
          // Get or create category in our map
          if (!categoryMap.has(taskName)) {
            const categoryId = taskName.toLowerCase().replace(/\s+/g, '-');
            const categoryIndex = categoryMap.size % categoryColors.length;
            const icon = getCategoryIcon(taskName);
            
            categoryMap.set(taskName, {
              id: categoryId,
              name: taskName,
              icon: icon,
              count: 0,
              color: categoryColors[categoryIndex],
              tools: []
            });
          }
          
          // Add tool to its category
          const category = categoryMap.get(taskName)!;
          category.tools.push({
            id: toolId,
            name: toolName,
            slug: toolSlug,
            logo_url: logoUrl,
            description: description
          });
          category.count = category.tools.length;
        });
        
        console.log(`Created ${categoryMap.size} categories from tools`);
        
        // Create special categories
        const latestTools = [...toolsData]
          .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
          .slice(0, 15)
          .map(tool => ({
            id: tool.id?.toString() || "",
            name: tool.company_name || "Unnamed Tool",
            slug: tool.slug || "",
            logo_url: tool.logo_url || "",
            description: tool.short_description || ""
          }));
        
        // Add special categories
        const specialCategories = [
          {
            id: "latest",
            name: "Latest AI",
            icon: Star,
            count: latestTools.length,
            tools: latestTools,
            color: categoryColors[10],
          },
          {
            id: "top-trends",
            name: "Top 50 Trends [24H]",
            icon: TrendingUp,
            count: latestTools.slice(0, 10).length,
            tools: latestTools.slice(0, 10),
            color: categoryColors[11],
          }
        ];
        
        // Convert map to array and filter out empty categories
        const regularCategories = Array.from(categoryMap.values())
          .filter(category => category.count > 0)
          .sort((a, b) => b.count - a.count);
        
        // Combine and return all categories
        const allCategories = [...specialCategories, ...regularCategories];
        
        console.log(`Final categories with tools: ${allCategories.length}`);
        // Log the first category as a sample
        if (allCategories.length > 0) {
          console.log("Sample category:", {
            name: allCategories[0].name,
            count: allCategories[0].count,
            toolsCount: allCategories[0].tools.length,
            firstTool: allCategories[0].tools[0]
          });
        }
        
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
          <div className="p-8 text-center rounded-lg border border-destructive/50 bg-destructive/10">
            <p className="text-destructive">Error loading categories. Please try again later.</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-muted">
            <p className="text-muted-foreground">No categories found. Please check back later.</p>
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
    <div className="h-[320px] rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

// Category card component 
function CategoryCard({ category }: { category: Category }) {
  // Safely check for category data
  if (!category) {
    console.error("Category is undefined");
    return null;
  }

  if (!category.tools || !Array.isArray(category.tools)) {
    console.error(`Category ${category.name} has invalid tools:`, category.tools);
    return null;
  }

  // Choose an appropriate icon based on category
  const CategoryIcon = category.icon || FileText;

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
            <CategoryIcon size={16} className="text-primary" />
            {category.name}
          </h3>
          <Badge variant="outline" className="text-xs">
            {category.count || 0}
          </Badge>
        </div>
        
        <div className="space-y-1.5 text-sm">
          {category.tools && category.tools.length > 0 ? (
            category.tools.slice(0, 8).map((tool) => (
              <div key={tool.id} className="flex items-center gap-2 py-1 hover:bg-muted/30 px-1 rounded-sm transition-colors">
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={tool.name || "Tool logo"} 
                    className="w-5 h-5 rounded-full object-cover bg-white p-0.5 border border-muted/30"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText size={10} className="text-primary" />
                  </div>
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
          {category.tools && category.tools.length > 8 && (
            <div className="pt-2 text-right">
              <span className="text-xs text-muted-foreground">
                +{category.tools.length - 8} more
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
