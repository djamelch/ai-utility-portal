
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';

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

// Review type definition
interface UserReview {
  id: string;
  tool_id: number;
  rating: number;
  comment: string | null;
  tool_name: string;
  created_at: string;
}

export default function UserDashboard() {
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedTools();
      fetchUserReviews();
    }
  }, [user]);

  const fetchSavedTools = async () => {
    try {
      setIsLoadingSaved(true);
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
            pricing,
            slug
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Transform the data to flatten the structure
      const formattedTools = data
        .filter(item => item.tools)
        .map(item => ({
          id: item.tools.id,
          name: item.tools.company_name,
          short_description: item.tools.short_description,
          logo_url: item.tools.logo_url,
          primary_task: item.tools.primary_task,
          pricing: item.tools.pricing,
          favorite_id: item.id,
          slug: item.tools.slug
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
      setIsLoadingSaved(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          tool_id,
          rating,
          comment,
          created_at,
          tools (
            company_name
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data
      const formattedReviews = data.map(item => ({
        id: item.id,
        tool_id: item.tool_id,
        rating: item.rating,
        comment: item.comment,
        tool_name: item.tools.company_name,
        created_at: new Date(item.created_at).toLocaleDateString()
      }));

      setUserReviews(formattedReviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your reviews',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleRemoveSaved = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      
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

  const handleEditReview = (reviewId: string, toolId: number) => {
    navigate(`/tool/${toolId}`, { state: { editReviewId: reviewId } });
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive'
      });
    }
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-screen-xl mx-auto px-4">
            <MotionWrapper animation="fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Your Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your saved tools, reviews, and personal settings
                </p>
              </div>
            </MotionWrapper>
            
            <MotionWrapper animation="fadeIn" delay="delay-200">
              <DashboardTabs
                savedTools={savedTools}
                userReviews={userReviews}
                isLoadingSaved={isLoadingSaved}
                isLoadingReviews={isLoadingReviews}
                onRemoveSaved={handleRemoveSaved}
                onEditReview={handleEditReview}
                onDeleteReview={handleDeleteReview}
                refetchSavedTools={fetchSavedTools}
                refetchUserReviews={fetchUserReviews}
              />
            </MotionWrapper>
          </div>
        </main>
        
        <Footer />
      </div>
    </RequireAuth>
  );
}
