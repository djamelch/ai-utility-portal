
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkX, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Tool type definition
interface SavedTool {
  id: number;
  name: string;
  short_description: string;
  logo_url: string | null;
  primary_task: string | null;
  pricing: string | null;
  favorite_id: string;
  slug?: string;
}

interface SavedToolsListProps {
  savedTools: SavedTool[];
  isLoading: boolean;
  onRemove: (favoriteId: string) => Promise<void>;
  refetchTools: () => void;
}

export const SavedToolsList = ({ 
  savedTools, 
  isLoading, 
  onRemove, 
  refetchTools 
}: SavedToolsListProps) => {
  const navigate = useNavigate();
  
  const navigateToToolDetail = (toolId: number, slug?: string) => {
    if (slug) {
      navigate(`/tool/${slug}`);
    } else {
      navigate(`/tool/${toolId}`);
    }
  };

  const handleRemoveSaved = async (favoriteId: string) => {
    await onRemove(favoriteId);
    refetchTools();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (savedTools.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium mb-2">No saved tools yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't saved any AI tools to your dashboard
        </p>
        <Button onClick={() => navigate('/tools')}>
          Explore AI Tools
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedTools.map(tool => (
        <div key={tool.favorite_id} className="border rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={tool.name} 
                    className="w-10 h-10 object-contain rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveSaved(tool.favorite_id)}
              >
                <BookmarkX className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {tool.short_description}
            </p>
            <div className="mt-3 flex justify-between">
              {tool.primary_task && (
                <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                  {tool.primary_task}
                </span>
              )}
              {tool.pricing && (
                <span className="text-xs text-muted-foreground">
                  {tool.pricing}
                </span>
              )}
            </div>
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigateToToolDetail(tool.id, tool.slug)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
