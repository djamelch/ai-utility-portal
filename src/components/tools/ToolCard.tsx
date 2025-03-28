
import { Star, ExternalLink, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Tool {
  id: string | number;
  name?: string;
  company_name?: string; // Added for database compatibility
  description?: string;
  short_description?: string; // Added for database compatibility
  logo?: string;
  logo_url?: string; // Added for database compatibility
  category?: string;
  primary_task?: string; // Added for database compatibility
  rating?: number;
  reviewCount?: number;
  pricing?: string;
  url?: string;
  visit_website_url?: string; // Added for database compatibility
  detail_url?: string; // Added for database compatibility
  slug?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  // Additional properties from database
  full_description?: string;
  featured_image_url?: string;
  click_count?: number;
  created_at?: string;
  updated_at?: string;
  applicable_tasks?: any[];
  cons?: any[];
  pros?: any[];
  faqs?: any;
}

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Get name from either name or company_name property
  const name = tool.name || tool.company_name || "";
  // Get description from either description or short_description property
  const description = tool.description || tool.short_description || "";
  // Get logo from either logo or logo_url property
  const logo = tool.logo || tool.logo_url || "";
  // Get category from either category or primary_task property
  const category = tool.category || tool.primary_task || "";
  // Get URL from visit_website_url, detail_url, or url property
  const url = tool.visit_website_url || tool.detail_url || tool.url || "#";
  // Use existing properties for the rest
  const { id, rating = 0, reviewCount = 0, pricing = "", isFeatured, isNew } = tool;

  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // Use the slug if available, otherwise create one from the company name
  const toolSlug = tool.slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
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

  const handleVisitClick = async (e: React.MouseEvent) => {
    try {
      await supabase.rpc('increment_tool_click_count', { tool_id: numericId });
      
      console.log(`Visit clicked for tool: ${name} (ID: ${numericId}), redirecting to: ${url}`);
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };

  const placeholderImage = 'https://via.placeholder.com/80?text=AI+Tool';

  return (
    <div 
      className={cn(
        "group relative flex flex-col rounded-xl border border-border/60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card dark:bg-gradient-to-br dark:from-card/70 dark:to-card/40 backdrop-blur-md p-5",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 rounded-xl pointer-events-none" />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {isFeatured && (
          <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-primary/20 shadow-sm">
            Featured
          </span>
        )}
        {isNew && (
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 shadow-sm">
            New
          </span>
        )}
      </div>

      <div className="flex items-start gap-4 relative">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/90 dark:bg-secondary/20 shadow-sm border border-border/20">
          {!imgError ? (
            <img 
              src={logo || placeholderImage} 
              alt={`${name} logo`} 
              className="h-full w-full object-cover"
              onError={() => {
                setImgError(true);
              }}
            />
          ) : (
            <img 
              src={placeholderImage} 
              alt={`${name} logo placeholder`} 
              className="h-full w-full object-cover"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg truncate">
              <Link to={`/tool/${toolSlug}`} className="hover:text-primary transition-colors">
                {name}
              </Link>
            </h3>
          </div>
          
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            {category && (
              <span className="rounded-full bg-secondary/90 px-2.5 py-0.5 text-xs font-medium text-foreground/80 dark:bg-secondary/30 dark:text-foreground/90 border border-border/20">
                {category}
              </span>
            )}
            {pricing && (
              <span className="rounded-full bg-secondary/90 px-2.5 py-0.5 text-xs font-medium text-foreground/80 dark:bg-secondary/30 dark:text-foreground/90 border border-border/20">
                {pricing}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-foreground/80 dark:text-foreground/90 line-clamp-2 relative">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 relative">
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

      <div className="mt-5 flex items-center gap-2 text-sm relative">
        <Link
          to={`/tool/${toolSlug}`}
          className="flex-1 rounded-lg border border-border/80 dark:border-border/30 bg-background/80 dark:bg-background/20 px-3 py-2 text-center font-medium hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-colors"
        >
          View Details
        </Link>
        
        <button 
          className={cn(
            "rounded-lg border border-border/80 dark:border-border/30 bg-background/80 dark:bg-background/20 p-2 transition-colors hover:bg-background/100 dark:hover:bg-background/30",
            isFavorite ? "text-red-500" : "text-muted-foreground"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          onClick={handleFavoriteClick}
        >
          <Heart size={18} className={isFavorite ? "fill-current" : ""} />
        </button>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-primary hover:bg-primary/90 px-3 py-2 font-medium text-primary-foreground transition-colors shadow-sm flex items-center gap-1.5"
          onClick={handleVisitClick}
        >
          Visit
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
