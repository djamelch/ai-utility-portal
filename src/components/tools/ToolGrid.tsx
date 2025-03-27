
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolCard } from "./ToolCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

interface ToolGridProps {
  limit?: number;
  queryType?: "featured" | "top-rated" | "recent";
  searchTerm?: string;
  categoryFilter?: string;
}

export function ToolGrid({ 
  limit, 
  queryType = "featured",
  searchTerm,
  categoryFilter 
}: ToolGridProps) {
  // Fetch tools based on query type and filters
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["tools", queryType, limit, searchTerm, categoryFilter],
    queryFn: async () => {
      let query = supabase.from("tools").select("*");
      
      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`short_description.ilike.%${searchTerm}%,full_description.ilike.%${searchTerm}%`);
      }
      
      // Apply category filter if provided
      if (categoryFilter) {
        const formattedCategory = categoryFilter
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        query = query.eq("primary_task", formattedCategory);
      }
      
      // Apply specific ordering based on query type
      switch (queryType) {
        case "top-rated":
          // For top-rated, we'd ideally join with reviews and order by average rating
          // This is a simplified approach
          query = query.order("id", { ascending: false }); // Replace with actual rating logic
          break;
        case "recent":
          query = query.order("created_at", { ascending: false });
          break;
        case "featured":
        default:
          // For featured, we're using a random selection
          query = query.order("id");
          break;
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching tools:", error);
        return [];
      }
      
      return data;
    }
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(limit || 8).fill(0).map((_, index) => (
          <div 
            key={index} 
            className="h-[320px] rounded-xl bg-secondary/20 animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  if (!tools.length) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-medium">No tools found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool, index) => (
        <MotionWrapper 
          key={tool.id} 
          animation="fadeIn" 
          delay={`delay-${Math.min(index * 100, 500)}`}
        >
          <ToolCard tool={tool} />
        </MotionWrapper>
      ))}
    </div>
  );
}
