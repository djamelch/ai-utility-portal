import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tool } from "./types";
import { ToolCardBadges } from "./ToolCardBadges";
import { ToolCardHeader } from "./ToolCardHeader";
import { ToolCardRating } from "./ToolCardRating";
import { ToolCardActions } from "./ToolCardActions";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export type { Tool };

export function ToolCard({ tool, className }: ToolCardProps) {
  const { id, name, description, logo, category, rating, reviewCount, pricing, isFeatured, isNew, slug, url } = tool;
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Convert id to number for database operations if it's a string
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // If authenticated, check if tool is in favorites
      if (session) {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('tool_id', numericId)
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        setIsFavorite(!!data);
      }
    };
    
    checkAuth();
  }, [numericId]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save favorites",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expired. Please log in again.");
      }
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('tool_id', numericId)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
        
        setIsFavorite(false);
        toast({
          title: "Removed from Favorites",
          description: `${name} has been removed from your favorites`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            tool_id: numericId,
            user_id: session.user.id,
          });
        
        if (error) throw error;
        
        setIsFavorite(true);
        toast({
          title: "Added to Favorites",
          description: `${name} has been added to your favorites`,
        });
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/40 bg-background p-5 transition-all duration-300 hover:shadow-card hover:-translate-y-1",
        className
      )}
    >
      {/* Badges */}
      <ToolCardBadges isFeatured={isFeatured} isNew={isNew} />

      {/* Logo and content */}
      <ToolCardHeader 
        name={name}
        logo={logo}
        category={category}
        pricing={pricing}
        slug={slug}
      />

      {/* Description */}
      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>

      {/* Rating */}
      <div className="mt-4">
        <ToolCardRating rating={rating} reviewCount={reviewCount} />
      </div>

      {/* Actions */}
      <ToolCardActions
        name={name}
        url={url}
        toolId={id}
        slug={slug}
        isFavorite={isFavorite}
        isAuthenticated={isAuthenticated}
        onFavoriteClick={handleFavoriteClick}
      />
    </div>
  );
}
