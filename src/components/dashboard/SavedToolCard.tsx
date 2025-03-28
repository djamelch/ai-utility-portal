
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { BookmarkX, ExternalLink } from 'lucide-react';

interface SavedToolProps {
  id: number;
  name: string;
  short_description: string;
  logo_url: string | null;
  primary_task: string | null;
  pricing: string | null;
  favorite_id: string;
  visit_website_url?: string;
  onRemove: (favoriteId: string) => void;
}

export function SavedToolCard({
  id,
  name,
  short_description,
  logo_url,
  primary_task,
  pricing,
  favorite_id,
  visit_website_url,
  onRemove
}: SavedToolProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleVisit = async () => {
    if (!visit_website_url) return;
    
    try {
      await supabase.rpc('increment_tool_click_count', { tool_id: id });
      window.open(visit_website_url, '_blank');
    } catch (error) {
      console.error('Error incrementing click count:', error);
    }
  };
  
  return (
    <div className="relative h-full flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card dark:bg-gradient-to-br dark:from-card/70 dark:to-card/40 backdrop-blur-md border border-border/60 dark:border-accent/10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 pointer-events-none" />
      
      {/* Glass-like highlight effect on top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/20 dark:bg-white/10" />
      <div className="absolute top-0 left-0 bottom-0 w-px bg-white/20 dark:bg-white/10 opacity-50" />
      
      <div className="p-5 relative flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {logo_url ? (
              <img 
                src={logo_url} 
                alt={name} 
                className="w-14 h-14 object-contain rounded-md bg-secondary/90 dark:bg-secondary/20 p-1.5 border border-border/50 dark:border-border/20 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 bg-primary/15 dark:bg-primary/20 rounded-md flex items-center justify-center shadow-sm border border-border/50 dark:border-border/20">
                <span className="text-lg font-bold text-primary">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="font-semibold text-lg">{name}</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemove(favorite_id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <BookmarkX className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-3 text-sm text-foreground/80 dark:text-foreground/90 line-clamp-2 min-h-[2.5rem]">
          {short_description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 min-h-[2rem]">
          {primary_task && (
            <span className="text-xs px-2.5 py-1 bg-secondary/90 dark:bg-secondary/30 text-foreground/80 dark:text-foreground/90 rounded-full font-medium border border-border/20">
              {primary_task}
            </span>
          )}
          {pricing && (
            <span className="text-xs px-2.5 py-1 bg-secondary/90 dark:bg-secondary/30 text-foreground/80 dark:text-foreground/90 rounded-full font-medium border border-border/20">
              {pricing}
            </span>
          )}
        </div>
        <div className="mt-auto pt-5 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-border/80 dark:border-border/30 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:text-foreground"
            onClick={() => navigate(`/tool/${id}`)}
          >
            View Details
          </Button>
          
          {visit_website_url && (
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              onClick={handleVisit}
            >
              Visit
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
