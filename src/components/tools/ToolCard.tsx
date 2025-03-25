
import { Star, ExternalLink, Heart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Tool {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  rating: number;
  reviewCount: number;
  pricing: string;
  url: string;
  isFeatured?: boolean;
  isNew?: boolean;
}

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const { id, name, description, logo, category, rating, reviewCount, pricing, isFeatured, isNew } = tool;
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          .eq('tool_id', id)
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        setIsFavorite(!!data);
      }
    };
    
    checkAuth();
  }, [id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
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
          .eq('tool_id', id)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
        
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: `${name} has been removed from your favorites`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            tool_id: id,
            user_id: session.user.id,
          });
        
        if (error) throw error;
        
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
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

  const handleVisitClick = async () => {
    try {
      // Track click count
      await supabase.rpc('increment_tool_click_count', { tool_id: parseInt(id) });
    } catch (error) {
      console.error('Error incrementing click count:', error);
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
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {isFeatured && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Featured
          </span>
        )}
        {isNew && (
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
            New
          </span>
        )}
      </div>

      {/* Favorite button */}
      <button 
        className={cn(
          "absolute top-4 left-4 rounded-full p-1.5 transition-colors",
          isFavorite 
            ? "text-red-500 hover:text-red-600" 
            : "text-muted-foreground hover:text-primary"
        )}
        aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
        onClick={handleFavoriteClick}
      >
        <Heart size={16} className={isFavorite ? "fill-current" : ""} />
      </button>

      {/* Logo and content */}
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
          <img 
            src={logo || 'https://via.placeholder.com/80'} 
            alt={`${name} logo`} 
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/80';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">
              <Link to={tool.url} className="hover:text-primary transition-colors">
                {name}
              </Link>
            </h3>
          </div>
          
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs text-foreground/70">
              {category}
            </span>
            <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs text-foreground/70">
              {pricing}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(rating) ? "fill-brand-400 text-brand-400" : "text-muted-foreground/30"}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-4 flex items-center gap-3 text-sm">
        <Link
          to={tool.url}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium hover:bg-secondary/50 transition-colors"
        >
          View Details
        </Link>
        <a
          href={`/tools/${id}?external=true`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          onClick={handleVisitClick}
        >
          Visit
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
