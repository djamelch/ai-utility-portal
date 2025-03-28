
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Star } from 'lucide-react';
import { ReviewItem } from './ReviewItem';

interface UserReview {
  id: string;
  tool_id: number;
  rating: number;
  comment: string | null;
  tool_name: string;
  created_at: string;
}

export function UserReviewsTab() {
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) return;
      
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Safely transform the data with proper error checking
      const formattedReviews = data.map(item => ({
        id: item.id,
        tool_id: item.tool_id,
        rating: item.rating,
        comment: item.comment,
        tool_name: item.tools?.company_name || 'Unknown Tool',
        created_at: new Date(item.created_at || Date.now()).toLocaleDateString()
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
      setIsLoading(false);
    }
  };

  const handleEditReview = (reviewId: string, toolId: number) => {
    router.push(`/tool/${toolId}?editReviewId=${reviewId}`);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setUserReviews(prev => prev.filter(review => review.id !== reviewId));
      
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
    <Card>
      <CardHeader>
        <CardTitle>Your Reviews</CardTitle>
        <CardDescription>
          Manage the reviews you've left for AI tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : userReviews.length > 0 ? (
          <div className="divide-y">
            {userReviews.map(review => (
              <ReviewItem
                key={review.id}
                id={review.id}
                tool_id={review.tool_id}
                tool_name={review.tool_name}
                rating={review.rating}
                comment={review.comment}
                created_at={review.created_at}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't reviewed any AI tools yet
            </p>
            <Button onClick={() => router.push('/tools')}>
              Browse Tools to Review
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
