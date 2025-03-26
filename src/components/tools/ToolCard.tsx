import { Star, ExternalLink, Heart, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Tool {
  id: string | number;
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
  const [imgError, setImgError] = useState(false);

  // Convert id to number for database operations if it's a string
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // Create slug from name for the URL
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

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
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول لحفظ المفضلة",
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
          title: "إزالة من المفضلة",
          description: `${name} تم إزالة من المفضلة`,
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
          title: "حفظ في المفضلة",
          description: `${name} تم حفظ في المفضلة`,
        });
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة المفضلة",
        variant: "destructive",
      });
    }
  };

  const handleVisitClick = async (e: React.MouseEvent) => {
    try {
      // Track click count
      await supabase.rpc('increment_tool_click_count', { tool_id: numericId });
      
      // Log to console for debugging
      console.log(`Visit clicked for tool: ${name} (ID: ${numericId}), redirecting to: ${tool.url}`);
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };

  // Default placeholder image
  const placeholderImage = 'https://via.placeholder.com/80?text=AI+Tool';

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
            مميز
          </span>
        )}
        {isNew && (
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
            جديد
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
        aria-label={isFavorite ? "إزالة من المفضلة" : "حفظ في المفضلة"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          
          if (!isAuthenticated) {
            toast({
              title: "يجب تسجيل الدخول",
              description: "يرجى تسجيل الدخول لحفظ المفضلة",
              variant: "destructive",
            });
            return;
          }
          
          // ... keep existing favorite handling code
        }}
      >
        <Heart size={16} className={isFavorite ? "fill-current" : ""} />
      </button>

      {/* Logo and content */}
      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary/50">
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
            <h3 className="font-medium truncate">
              <Link to={`/tool/${slug}`} className="hover:text-primary transition-colors">
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
          ({reviewCount} تقييم)
        </span>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-4 flex items-center gap-3 text-sm">
        <Link
          to={`/tool/${slug}`}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium hover:bg-secondary/50 transition-colors"
        >
          عرض التفاصيل
        </Link>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          onClick={(e) => {
            try {
              // Track click count
              supabase.rpc('increment_tool_click_count', { tool_id: numericId });
            } catch (error) {
              console.error('Error incrementing click count:', error);
            }
          }}
        >
          زيارة
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

