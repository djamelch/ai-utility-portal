
import { ArrowRight, Star, TrendingUp, Image, Feather, Sparkles, MessageSquare, Code, Database, PenTool, Video, Music, LineChart, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export function TrendingToolsSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Define the categories with their icons and colors
  const initialCategories: Category[] = [
    { 
      id: "chatbots", 
      name: "AI Chatbots", 
      icon: MessageSquare, 
      count: 0, 
      color: "from-blue-500 to-cyan-300",
      gradientFrom: "from-blue-500/10",
      gradientTo: "to-blue-300/5"
    },
    { 
      id: "image-generation", 
      name: "Image Generation", 
      icon: Image, 
      count: 0, 
      color: "from-pink-500 to-rose-300",
      gradientFrom: "from-pink-500/10", 
      gradientTo: "to-rose-300/5"
    },
    { 
      id: "code-assistants", 
      name: "Code Assistants", 
      icon: Code, 
      count: 0, 
      color: "from-indigo-500 to-purple-300",
      gradientFrom: "from-indigo-500/10", 
      gradientTo: "to-purple-300/5"
    },
    { 
      id: "data-analysis", 
      name: "Data Analysis", 
      icon: Database, 
      count: 0, 
      color: "from-amber-500 to-yellow-300",
      gradientFrom: "from-amber-500/10", 
      gradientTo: "to-yellow-300/5"
    },
    { 
      id: "writing", 
      name: "Writing & Content", 
      icon: PenTool, 
      count: 0, 
      color: "from-emerald-500 to-green-300",
      gradientFrom: "from-emerald-500/10", 
      gradientTo: "to-green-300/5"
    },
    { 
      id: "productivity", 
      name: "Productivity", 
      icon: Sparkles, 
      count: 0, 
      color: "from-violet-500 to-purple-300",
      gradientFrom: "from-violet-500/10", 
      gradientTo: "to-purple-300/5"
    },
    { 
      id: "video", 
      name: "Video Creation", 
      icon: Video, 
      count: 0, 
      color: "from-red-500 to-orange-300",
      gradientFrom: "from-red-500/10", 
      gradientTo: "to-orange-300/5"
    },
    { 
      id: "audio", 
      name: "Audio & Music", 
      icon: Music, 
      count: 0, 
      color: "from-sky-500 to-blue-300",
      gradientFrom: "from-sky-500/10", 
      gradientTo: "to-blue-300/5"
    },
    { 
      id: "research", 
      name: "Research Tools", 
      icon: Bookmark, 
      count: 0, 
      color: "from-teal-500 to-emerald-300",
      gradientFrom: "from-teal-500/10", 
      gradientTo: "to-emerald-300/5"
    },
    { 
      id: "marketing", 
      name: "Marketing & SEO", 
      icon: LineChart, 
      count: 0, 
      color: "from-fuchsia-500 to-pink-300",
      gradientFrom: "from-fuchsia-500/10", 
      gradientTo: "to-pink-300/5"
    },
    { 
      id: "top-trends", 
      name: "Top 50 Trends", 
      icon: TrendingUp, 
      count: 0, 
      color: "from-purple-500 to-indigo-300",
      gradientFrom: "from-purple-500/10", 
      gradientTo: "to-indigo-300/5"
    },
    { 
      id: "latest", 
      name: "Latest AI", 
      icon: Star, 
      count: 0, 
      color: "from-amber-500 to-yellow-300",
      gradientFrom: "from-amber-500/10", 
      gradientTo: "to-yellow-300/5"
    },
  ];

  // Fetch tool counts for each category
  const { data: categoryCounts, isLoading } = useQuery({
    queryKey: ["category-counts"],
    queryFn: async () => {
      try {
        // Get count for different primary tasks
        const tasks = [
          "Chatbot",
          "Image Generation",
          "Code Assistant",
          "Data Analysis",
          "Writing",
          "Productivity",
          "Video Creation",
          "Audio",
          "Research",
          "Marketing"
        ];
        
        const counts: Record<string, number> = {};
        
        // Map primary tasks to category IDs
        const taskToCategory: Record<string, string> = {
          "Chatbot": "chatbots",
          "Image Generation": "image-generation",
          "Code Assistant": "code-assistants",
          "Data Analysis": "data-analysis",
          "Writing": "writing",
          "Productivity": "productivity",
          "Video Creation": "video",
          "Audio": "audio",
          "Research": "research",
          "Marketing": "marketing"
        };
        
        // Get total count for latest
        const { count: totalCount, error: totalError } = await supabase
          .from("tools")
          .select("*", { count: "exact", head: true });
        
        if (totalError) console.error("Error fetching total tools count:", totalError);
        
        counts["latest"] = totalCount || 0;
        counts["top-trends"] = totalCount || 0; // Same as latest for now
        
        // Get count for each primary task
        for (const task of tasks) {
          const { count, error } = await supabase
            .from("tools")
            .select("*", { count: "exact", head: true })
            .eq("primary_task", task);
          
          if (error) console.error(`Error fetching ${task} count:`, error);
          
          const categoryId = taskToCategory[task];
          counts[categoryId] = count || 0;
        }
        
        return counts;
      } catch (error) {
        console.error("Error fetching category counts:", error);
        return {};
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Update categories with counts and sort them
  useEffect(() => {
    if (categoryCounts) {
      // Special categories to always show first (latest and top-trends)
      const specialCategories = ["latest", "top-trends"];
      
      // Update all categories with their counts
      const updatedCategories = initialCategories.map(category => ({
        ...category,
        count: categoryCounts[category.id] || 0
      }));
      
      // Split into special and regular categories
      const special = updatedCategories.filter(cat => 
        specialCategories.includes(cat.id)
      );
      
      const regular = updatedCategories.filter(cat => 
        !specialCategories.includes(cat.id)
      ).sort((a, b) => b.count - a.count); // Sort by count (high to low)
      
      // Combine with special categories first, then sorted regular categories
      setCategories([...special, ...regular]);
    } else {
      setCategories(initialCategories);
    }
  }, [categoryCounts]);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-wide">
        <MotionWrapper animation="fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Browse Categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover AI tools by popular categories
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <MotionWrapper key={category.id} animation="fadeIn">
                <Link
                  to={`/tools?category=${category.id}`}
                  className="group"
                >
                  <GlassCard 
                    className={`flex flex-col items-center p-6 relative overflow-hidden
                      after:absolute after:inset-0 after:bg-gradient-to-br
                      after:${category.color}
                      after:opacity-0 after:-z-10 after:transition-opacity after:duration-300
                      group-hover:after:opacity-5
                      before:absolute before:inset-0 before:bg-gradient-to-br
                      before:${category.gradientFrom} before:${category.gradientTo}
                      before:opacity-0 before:-z-10 before:blur-xl before:scale-150
                      before:transition-opacity before:duration-300 group-hover:before:opacity-100`}
                    animation="none"
                  >
                    <div className="rounded-full p-3 bg-white/80 dark:bg-black/40 text-primary shadow-sm
                        group-hover:scale-110 transition-all duration-500 relative">
                      <category.icon size={24} className="transition-all duration-500 group-hover:rotate-6" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-ping opacity-0 group-hover:opacity-70"></span>
                    </div>
                    <h3 className="mt-4 font-medium text-center group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <span className="mt-1 text-sm text-muted-foreground">
                      {category.count} tools
                    </span>
                    <div className="absolute bottom-2 right-2 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight size={14} className="text-primary" />
                    </div>
                  </GlassCard>
                </Link>
              </MotionWrapper>
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
