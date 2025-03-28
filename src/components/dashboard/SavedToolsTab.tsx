
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import { SavedToolCard } from './SavedToolCard';

interface SavedTool {
  id: number;
  name: string;
  short_description: string;
  logo_url: string | null;
  primary_task: string | null;
  pricing: string | null;
  favorite_id: string;
}

export function SavedToolsTab() {
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedTools();
    }
  }, [user]);

  const fetchSavedTools = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          tool_id,
          tools (
            id,
            company_name,
            short_description,
            logo_url,
            primary_task,
            pricing
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Safely transform the data with proper error checking
      const formattedTools = (data || []).filter(item => item && item.tools).map(item => ({
        id: item.tools?.id,
        name: item.tools?.company_name,
        short_description: item.tools?.short_description || '',
        logo_url: item.tools?.logo_url,
        primary_task: item.tools?.primary_task,
        pricing: item.tools?.pricing,
        favorite_id: item.id
      }));

      setSavedTools(formattedTools);
    } catch (error) {
      console.error('Error fetching saved tools:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your saved tools',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSaved = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ id: favoriteId });

      if (error) throw error;

      setSavedTools(prev => prev.filter(tool => tool.favorite_id !== favoriteId));
      
      toast({
        title: 'Success',
        description: 'Tool removed from your saved list',
      });
    } catch (error) {
      console.error('Error removing saved tool:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove tool from saved list',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Saved AI Tools</CardTitle>
        <CardDescription>
          These are the AI tools you've bookmarked for later reference
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : savedTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTools.map(tool => (
              <SavedToolCard 
                key={tool.favorite_id}
                id={tool.id}
                name={tool.name}
                short_description={tool.short_description}
                logo_url={tool.logo_url}
                primary_task={tool.primary_task}
                pricing={tool.pricing}
                favorite_id={tool.favorite_id}
                onRemove={handleRemoveSaved}
              />
            ))}
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
}
