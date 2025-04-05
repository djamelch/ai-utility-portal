
import { Star, ExternalLink, Heart, Award, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export interface Tool {
  id: string | number;
  name?: string;
  company_name?: string;
  description?: string;
  short_description?: string;
  logo?: string;
  logo_url?: string;
  category?: string;
  primary_task?: string;
  rating?: number;
  reviewCount?: number;
  pricing?: string;
  url?: string;
  visit_website_url?: string;
  detail_url?: string;
  slug?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isVerified?: boolean;
  is_featured?: boolean;
  is_verified?: boolean;
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
  const { user, isLoading: authLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  const name = tool.name || tool.company_name || "";
  const description = tool.description || tool.short_description || "";
  const logo = tool.logo || tool.logo_url || "";
  const category = tool.category || tool.primary_task || "";
  const url = tool.visit_website_url || tool.detail_url || tool.url || "#";
  const { id, rating = 0, reviewCount = 0, pricing = "" } = tool;
  const isFeatured = tool.isFeatured || tool.is_featured;
  const isVerified = tool.isVerified || tool.is_verified;
  const isNew = tool.isNew;

  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  const toolSlug = tool.slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        if (session) {
          try {
            const { data: favData, error: favError } = await supabase
              .from('favorites')
              .select('id')
              .eq('tool_id', numericId)
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (favError) throw favError;
            setIsFavorite(!!favData);
            
            const { data: ratingData, error: ratingError } = await supabase
              .from('reviews')
              .select('rating')
              .eq('tool_id', numericId)
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            if (ratingError) throw ratingError;
            if (ratingData) {
              setUserRating(ratingData.rating);
            }
          } catch (error) {
            console.error('Error checking favorite/rating status:', error);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
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

  const handleRatingClick = async (star: number) => {
    if (!isAuthenticated || authLoading) {
      toast({
        title: "Authentication Required",
        description: "Please log in to rate tools",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsRatingSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Session expired. Please log in again.");
      }
      
      const { data: existingRating, error: checkError } = await supabase
        .from('reviews')
        .select('id, rating')
        .eq('tool_id', numericId)
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingRating) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update({
            rating: star,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRating.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Rating Updated",
          description: `You've updated your rating for ${name}`,
        });
      } else {
        const { error: insertError } = await supabase.from('reviews').insert({
          tool_id: numericId,
          user_id: session.user.id,
          rating: star,
          comment: null
        });
        
        if (insertError) throw insertError;
        
        toast({
          title: "Rating Submitted",
          description: `Thank you for rating ${name}!`,
        });
      }
      
      setUserRating(star);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: "Failed to submit your rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const placeholderImage = 'https://via.placeholder.com/80?text=AI+Tool';

  return (
    <div 
      className={cn(
        "group relative h-full flex flex-col rounded-xl border border-border/60 dark:border-accent/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card dark:bg-gradient-to-br dark:from-card/70 dark:to-card/40 backdrop-blur-md p-4",
        isFeatured ? "border-2 border-amber-400 dark:border-amber-500" : "",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 rounded-xl pointer-events-none" />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-white/20 dark:bg-white/10" />
      <div className="absolute top-0 left-0 bottom-0 w-px bg-white/20 dark:bg-white/10 opacity-50" />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {isFeatured && isVerified ? (
          <Badge variant="featured" className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white">
            <Award className="h-3 w-3 text-white" />
            <ShieldCheck className="h-3 w-3 text-white" />
            <span>Featured & Verified</span>
          </Badge>
        ) : (
          <>
            {isFeatured && (
              <Badge variant="featured" className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white">
                <Award className="h-3 w-3 text-white" />
                <span>Featured</span>
              </Badge>
            )}
            {isVerified && (
              <Badge variant="verified" className="flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified</span>
              </Badge>
            )}
          </>
        )}
        {isNew && (
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 shadow-sm">
            New
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 relative">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/90 dark:bg-secondary/20 shadow-sm border border-border/50 dark:border-border/20">
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
              {isFeatured && (
                <Award className="inline h-4 w-4 text-amber-500 mr-1 align-text-bottom" />
              )}
              <Link to={`/tool/${toolSlug}`} className="hover:text-primary transition-colors">
                {name}
              </Link>
            </h3>
          </div>
          
          <div className="mt-1 flex items-center gap-2 flex-wrap min-h-[1.75rem]">
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

      <p className="mt-3 text-sm text-foreground/80 dark:text-foreground/90 line-clamp-2 min-h-[2.5rem] relative">
        {description}
      </p>

      <div className="mt-3 flex items-center gap-1 relative min-h-[1.25rem]">
        {isRatingSubmitting ? (
          <div className="flex items-center text-xs text-muted-foreground">
            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </div>
        ) : (
          <>
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => handleRatingClick(i + 1)}
                onMouseEnter={() => isAuthenticated && setHoveredRating(i + 1)}
                onMouseLeave={() => setHoveredRating(null)}
                disabled={isRatingSubmitting || authLoading}
              >
                <Star
                  size={16}
                  className={cn(
                    hoveredRating !== null && i < hoveredRating 
                      ? "fill-yellow-400 text-yellow-400" 
                      : userRating && i < userRating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : i < Math.round(rating) 
                          ? "fill-brand-400 text-brand-400" 
                          : "text-muted-foreground/30",
                    "transition-colors"
                  )}
                />
              </button>
            ))}
            {isAuthenticated && userRating && (
              <span className="text-xs text-muted-foreground ml-1">
                (Your rating: {userRating})
              </span>
            )}
          </>
        )}
      </div>

      <div className="mt-auto pt-4 flex items-center gap-2 text-sm relative">
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
