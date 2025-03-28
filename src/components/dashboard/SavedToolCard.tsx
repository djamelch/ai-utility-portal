
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
    <div className="border border-border/60 dark:border-border/30 rounded-lg overflow-hidden bg-background/80 backdrop-blur-sm dark:bg-card/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 dark:hover:border-border/50">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {logo_url ? (
              <img 
                src={logo_url} 
                alt={name} 
                className="w-10 h-10 object-contain rounded bg-secondary/80 dark:bg-secondary/30 p-1"
              />
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="font-semibold">{name}</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemove(favorite_id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <BookmarkX className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {short_description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {primary_task && (
            <span className="text-xs px-2 py-1 bg-secondary/80 dark:bg-secondary/30 text-foreground/70 dark:text-foreground/80 rounded-full">
              {primary_task}
            </span>
          )}
          {pricing && (
            <span className="text-xs px-2 py-1 bg-secondary/80 dark:bg-secondary/30 text-foreground/70 dark:text-foreground/80 rounded-full">
              {pricing}
            </span>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate(`/tool/${id}`)}
          >
            View Details
          </Button>
          
          {visit_website_url && (
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-1"
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
