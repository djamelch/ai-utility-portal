
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { BookmarkX } from 'lucide-react';

interface SavedToolProps {
  id: number;
  name: string;
  short_description: string;
  logo_url: string | null;
  primary_task: string | null;
  pricing: string | null;
  favorite_id: string;
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
  onRemove
}: SavedToolProps) {
  const navigate = useNavigate();
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {logo_url ? (
              <img 
                src={logo_url} 
                alt={name} 
                className="w-10 h-10 object-contain rounded"
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
          >
            <BookmarkX className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {short_description}
        </p>
        <div className="mt-3 flex justify-between">
          {primary_task && (
            <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
              {primary_task}
            </span>
          )}
          {pricing && (
            <span className="text-xs text-muted-foreground">
              {pricing}
            </span>
          )}
        </div>
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate(`/tool/${id}`)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
