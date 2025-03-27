
import { FC } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface ToolCardActionsProps {
  name: string;
  url: string;
  toolId: string | number;
  slug?: string;
  isFavorite: boolean;
  isAuthenticated: boolean;
  onFavoriteClick: (e: React.MouseEvent) => void;
}

export const ToolCardActions: FC<ToolCardActionsProps> = ({
  name,
  url,
  toolId,
  slug,
  isFavorite,
  isAuthenticated,
  onFavoriteClick
}) => {
  const toolSlug = slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  
  // Convert id to number for database operations if it's a string
  const numericId = typeof toolId === 'string' ? parseInt(toolId, 10) : toolId;

  const handleVisitClick = async (e: React.MouseEvent) => {
    try {
      // Track click count
      await supabase.rpc('increment_tool_click_count', { tool_id: numericId });
      
      // Log to console for debugging
      console.log(`Visit clicked for tool: ${name} (ID: ${numericId}), redirecting to: ${url}`);
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };

  return (
    <div className="mt-auto pt-4 flex items-center gap-2 text-sm">
      <Link
        to={`/tool/${toolSlug}`}
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-center font-medium hover:bg-secondary/50 transition-colors"
      >
        View Details
      </Link>
      
      <button 
        className={cn(
          "rounded-lg border border-input bg-background p-2 transition-colors hover:bg-secondary/50",
          isFavorite ? "text-red-500" : "text-muted-foreground"
        )}
        aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
        onClick={onFavoriteClick}
      >
        <Heart size={18} className={isFavorite ? "fill-current" : ""} />
      </button>
      
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5"
        onClick={handleVisitClick}
      >
        Visit
        <ExternalLink size={14} />
      </a>
    </div>
  );
};
