
import { Star, ExternalLink, Heart, Award, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect, memo } from "react";
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

export const ToolCard = memo(({ tool, className }: ToolCardProps) => {
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
  
  const isFeatured = Boolean(tool.isFeatured || tool.is_featured);
  const isVerified = Boolean(tool.isVerified || tool.is_verified);
  const isNew = tool.isNew;

  console.log("Tool data:", { name, isFeatured, isVerified, is_featured: tool.is_featured, is_verified: tool.is_verified });

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
    <div className="tool-card p-4 h-full flex flex-col">
      {/* Top decoration line with gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />
      
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        {isFeatured && (
          <Badge variant="featured" className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-sm">
            <Award className="h-3 w-3 text-white" />
            <span>Featured</span>
          </Badge>
        )}
        {isVerified && (
          <Badge variant="verified" className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm">
            <ShieldCheck className="h-3 w-3" />
            <span>Verified</span>
          </Badge>
        )}
        {isNew && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400 shadow-sm">
            New
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 relative">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-secondary/30 dark:bg-secondary/10 shadow-sm border border-border/30">
          {!imgError ? (
            <img 
              src={logo || placeholderImage} 
              alt={`${name} logo`} 
              className="h-full w-full object-cover"
              onError={() => {
                setImgError(true);
              }}
              loading="lazy"
              width="64"
              height="64"
            />
          ) : (
            <img 
              src={placeholderImage} 
              alt={`${name} logo placeholder`} 
              className="h-full w-full object-cover"
              width="64"
              height="64"
              loading="lazy"
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
          
          <div className="mt-1 flex items-center gap-2 flex-wrap min-h-[1.75rem]">
            {category && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
                {category}
              </span>
            )}
            {pricing && (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent dark:bg-accent/20">
                {pricing}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-foreground/80 dark:text-foreground/90 line-clamp-3 min-h-[3.75rem] leading-relaxed">
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
                          ? "fill-primary text-primary" 
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
          className="flex-1 rounded-lg border border-border/50 dark:border-border/20 bg-secondary/30 dark:bg-background/20 px-3 py-2 text-center font-medium hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all"
        >
          View Details
        </Link>
        
        <button 
          className={cn(
            "rounded-lg border border-border/50 dark:border-border/20 bg-secondary/30 dark:bg-background/20 p-2 transition-all hover:bg-background/100 dark:hover:bg-background/30",
            isFavorite ? "text-red-500 border-red-200 bg-red-50 dark:bg-red-900/20" : "text-muted-foreground"
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
          className="rounded-lg bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-3 py-2 font-medium text-white transition-all shadow-sm flex items-center gap-1.5"
          onClick={handleVisitClick}
        >
          Visit
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
});

ToolCard.displayName = "ToolCard";
